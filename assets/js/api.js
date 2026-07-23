var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var CONFIG = WC.CONFIG, ENDPOINTS = WC.ENDPOINTS;

  /* =========================================================
     CAPA DE ACCESO A DATOS (API)
     Incluye la estrategia de rendimiento exigida en el punto 22
     del alcance del proyecto:
       1. Caché en sessionStorage con TTL  -> evita repetir peticiones
       2. Deduplicación de peticiones en vuelo -> una sola request por recurso
       3. Timeout con AbortController -> la UI nunca se queda colgada
       4. Precarga (prefetch) de recursos usados en varias páginas
       5. Índice de equipos en memoria -> los partidos traen solo el ID
       6. Fallback a una copia local si la API no responde
     ========================================================= */

  const PREFIJO_CACHE = 'wc2026:';
  const enVuelo = new Map(); // deduplicación de peticiones simultáneas
  let mockCargado = null;

  /* ----------------------- CACHÉ ------------------------- */

  function leerCache(clave) {
    try {
      const crudo = sessionStorage.getItem(PREFIJO_CACHE + clave);
      if (!crudo) return null;
      const { t, data } = JSON.parse(crudo);
      if (Date.now() - t > CONFIG.CACHE_TTL_MS) {
        sessionStorage.removeItem(PREFIJO_CACHE + clave);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  function escribirCache(clave, data) {
    try {
      sessionStorage.setItem(
        PREFIJO_CACHE + clave,
        JSON.stringify({ t: Date.now(), data })
      );
    } catch {
      // sessionStorage lleno: limpiamos lo viejo y seguimos sin romper la app
      limpiarCache();
    }
  }

  function limpiarCache() {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(PREFIJO_CACHE))
      .forEach((k) => sessionStorage.removeItem(k));
  }

  /* --------------------- COPIA LOCAL ---------------------- */

  /* Los datos de respaldo llegan desde data/mock.js, que se carga como
     script antes que este archivo. No usamos fetch porque al abrir el
     sitio con doble clic (file://) el navegador bloquea la lectura de
     archivos locales. Su contenido es una copia real de la API. */
  async function cargarMock() {
    if (mockCargado) return mockCargado;
    mockCargado = (window.WC && window.WC.MOCK) || {};
    return mockCargado;
  }

  /* La copia local está indexada por la misma ruta del endpoint */
  async function desdeMock(ruta) {
    const mock = await cargarMock();
    const limpia = ruta.split('?')[0];

    if (mock[limpia] !== undefined) return mock[limpia];

    // Para rutas con ID (/v1/teams/ARG) buscamos dentro de la colección
    const partes = limpia.replace(/\/$/, '').split('/');
    const id = partes.pop();
    const coleccion = partes.join('/');
    const lista = mock[coleccion];

    if (Array.isArray(lista)) {
      const encontrado = lista.find((x) => String(x.id) === String(id));
      if (encontrado) return encontrado;
    }
    return null;
  }

  /* ------------------- URL / PROXY ----------------------- */

  /**
   * Construye la URL final de una petición.
   * La API no envía cabeceras CORS, así que cuando se usa el proxy
   * la URL completa se codifica y se pasa como parámetro.
   * @param {string} ruta      ruta relativa, ej. '/v1/teams'
   * @param {boolean} porProxy si true, fuerza el paso por el proxy
   */
  function armarUrl(ruta, porProxy) {
    const directa = CONFIG.API_BASE + ruta;
    if (!porProxy) return directa;
    return CONFIG.PROXY_URL + encodeURIComponent(directa);
  }

  /* Una petición individual, con timeout propio. */
  async function pedir(ruta, porProxy) {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), CONFIG.TIMEOUT_MS);
    try {
      const res = await fetch(armarUrl(ruta, porProxy), {
        signal: controlador.signal,
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(temporizador);
    }
  }

  /* --------------------- PETICIONES ---------------------- */

  /**
   * Obtiene un recurso de la API con caché, deduplicación y timeout.
   * @param {string} ruta  ruta relativa, ej. '/v1/teams'
   */
  async function obtener(ruta, opciones = {}) {
    const clave = ruta;

    if (!opciones.forzar) {
      const cacheado = leerCache(clave);
      if (cacheado !== null) return cacheado;
      if (enVuelo.has(clave)) return enVuelo.get(clave);
    }

    const promesa = (async () => {
      try {
        let json;
        try {
          // Intento principal: proxy o directo, según config.js
          json = await pedir(ruta, CONFIG.USAR_PROXY);
        } catch (fallo) {
          // Si el intento directo falla y el proxy está disponible,
          // se reintenta por el proxy antes de darse por vencido.
          if (!CONFIG.USAR_PROXY && CONFIG.PROXY_URL) {
            console.info(`[API] Reintentando ${ruta} por el proxy...`);
            json = await pedir(ruta, true);
          } else {
            throw fallo;
          }
        }
        const data = normalizar(json);
        escribirCache(clave, data);
        return data;
      } catch (error) {
        console.warn(`[API] Falló ${ruta}:`, error.message);
        if (CONFIG.FALLBACK_A_MOCK) {
          const respaldo = await desdeMock(ruta);
          if (respaldo !== null) {
            console.info(`[API] Usando la copia local para ${ruta}`);
            return respaldo;
          }
        }
        throw error;
      } finally {
        enVuelo.delete(clave);
      }
    })();

    enVuelo.set(clave, promesa);
    return promesa;
  }

  /**
   * Algunas APIs envuelven la respuesta en { data: [...] }.
   * Esta función devuelve siempre el contenido útil, respetando los
   * objetos legítimos (como la clasificación, que viene por grupo).
   */
  function normalizar(json) {
    if (Array.isArray(json)) return json;
    if (json && typeof json === 'object') {
      for (const llave of ['data', 'results', 'items', 'content', 'response']) {
        if (llave in json) return json[llave];
      }

      /* Algunos endpoints (por ejemplo /v1/cities) devuelven un objeto
         indexado por id — {"1": {...}, "2": {...}} — en lugar del arreglo
         que indica la documentación. Lo convertimos a arreglo.
         Ojo: la clasificación también es un objeto, pero sus valores son
         arreglos (uno por grupo), y ese debe conservarse tal cual. */
      const valores = Object.values(json);
      const esColeccionIndexada =
        valores.length > 0 &&
        valores.every((v) => v && typeof v === 'object' && !Array.isArray(v) && 'id' in v);

      if (esColeccionIndexada) return valores;
    }
    return json;
  }

  /* --------------- ÍNDICE DE EQUIPOS ---------------------
     El listado de partidos trae solo `home_id` y `away_id`.
     Para pintar nombre y bandera hace falta cruzar con /v1/teams,
     así que lo cacheamos una única vez por sesión.
     -------------------------------------------------------- */

  let indiceEquipos = null;

  async function equiposIndexados() {
    if (indiceEquipos) return indiceEquipos;
    try {
      const equipos = await obtener(ENDPOINTS.equipos);
      indiceEquipos = new Map(
        (Array.isArray(equipos) ? equipos : []).map((e) => [String(e.id), e])
      );
    } catch {
      indiceEquipos = new Map();
    }
    return indiceEquipos;
  }

  /** Devuelve el equipo completo a partir de su código (ARG, MEX…) */
  function equipoPorId(id) {
    if (!indiceEquipos) return null;
    return indiceEquipos.get(String(id)) || null;
  }

  /* --------------- ÍNDICE DE CIUDADES --------------------- */

  let indiceCiudades = null;

  async function ciudadesIndexadas() {
    if (indiceCiudades) return indiceCiudades;
    try {
      const ciudades = await obtener(ENDPOINTS.ciudades);
      indiceCiudades = new Map(
        (Array.isArray(ciudades) ? ciudades : []).map((c) => [String(c.id), c])
      );
    } catch {
      indiceCiudades = new Map();
    }
    return indiceCiudades;
  }

  function ciudadPorId(id) {
    if (!indiceCiudades) return null;
    return indiceCiudades.get(String(id)) || null;
  }

  /* ------------- ATAJOS POR RECURSO (API pública) --------- */

  const API = {
    equipos: () => obtener(ENDPOINTS.equipos),
    equipo: (id) => obtener(ENDPOINTS.equipo(id)),
    partidos: () => obtener(ENDPOINTS.partidos),
    partido: (id) => obtener(ENDPOINTS.partido(id)),
    clasificacion: () => obtener(ENDPOINTS.clasificacion),
    ranking: () => obtener(ENDPOINTS.ranking),
    noticias: () => obtener(ENDPOINTS.noticias),
    noticia: (id) => obtener(ENDPOINTS.noticia(id)),
    ciudades: () => obtener(ENDPOINTS.ciudades),
    ciudad: (id) => obtener(ENDPOINTS.ciudad(id)),
    mascotas: () => obtener(ENDPOINTS.mascotas),
    eventos: () => obtener(ENDPOINTS.eventos),
    balon: () => obtener(ENDPOINTS.balon),
    bandaSonora: () => obtener(ENDPOINTS.bandaSonora),
    archivos: () => obtener(ENDPOINTS.archivos)
  };

  /**
   * Precarga recursos en segundo plano tras el primer render.
   * Se llama con requestIdleCallback para no competir con el contenido visible.
   */
  function precargar(rutas = []) {
    const ejecutar = () => rutas.forEach((r) => obtener(r).catch(() => {}));
    if ('requestIdleCallback' in window) {
      requestIdleCallback(ejecutar, { timeout: 3000 });
    } else {
      setTimeout(ejecutar, 1200);
    }
  }

  WC.API = API;
  WC.obtener = obtener;
  WC.precargar = precargar;
  WC.limpiarCache = limpiarCache;
  WC.equiposIndexados = equiposIndexados;
  WC.equipoPorId = equipoPorId;
  WC.ciudadesIndexadas = ciudadesIndexadas;
  WC.ciudadPorId = ciudadPorId;
})();
