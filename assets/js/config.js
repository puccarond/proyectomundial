var WC = window.WC = window.WC || {};
(function () {
  "use strict";

  /* =========================================================
     CONFIGURACIÓN GLOBAL
     Proyecto Mundial FIFA 2026 - Programación Orientada a la Web
     ========================================================= */

  const CONFIG = {
    // URL base de la API del proyecto (documentación en la raíz)
    API_BASE: 'https://wc-api-u378.onrender.com/wc-api/api',

    /* ---------------------------------------------------------
       PROXY CORS
       La API del curso no envía la cabecera Access-Control-Allow-Origin,
       por lo que el navegador bloquea las peticiones desde cualquier
       origen distinto al suyo. No podemos modificar la API, así que
       las peticiones se redirigen por un proxy público que sí añade
       esa cabecera.

       USAR_PROXY: true  -> todas las peticiones pasan por el proxy.
       USAR_PROXY: false -> peticiones directas (si algún día la API
                            se corrige, basta con apagarlo aquí).

       Además, si una petición directa falla por CORS, el código
       reintenta automáticamente por el proxy (ver api.js).
       --------------------------------------------------------- */
    USAR_PROXY: true,
    PROXY_URL: 'https://corsproxy.io/?url=',

    // Si la API no responde, el sitio usa data/mock.js para no quedar en blanco.
    // Ese archivo es una copia real descargada de la API, no datos inventados.
    FALLBACK_A_MOCK: true,

    // Tiempo máximo de espera por petición (Render tarda en despertar)
    TIMEOUT_MS: 25000,

    // Vigencia del caché en sessionStorage (5 minutos)
    CACHE_TTL_MS: 5 * 60 * 1000,

    // Fecha y hora de la final
    FECHA_FINAL: '2026-07-19T15:00:00Z',

    // Rondas de la fase de grupos: 1, 2 y 3. A partir de la 4 es eliminación.
    ULTIMA_RONDA_GRUPOS: 3
  };

  /* ---------------------------------------------------------
     MAPA DE ENDPOINTS
     Verificados contra la documentación oficial de la API.
     Todos cuelgan de /v1/.
     --------------------------------------------------------- */
  const ENDPOINTS = {
    equipos: '/v1/teams',
    equipo: (id) => `/v1/teams/${id}`,
    partidos: '/v1/matches',
    partido: (id) => `/v1/matches/${id}`,
    clasificacion: '/v1/standings',
    clasificacionGrupo: (g) => `/v1/standings/${g}/group`,
    ranking: '/v1/ranking',
    noticias: '/v1/news',
    noticia: (id) => `/v1/news/${id}`,
    ciudades: '/v1/cities',
    ciudad: (id) => `/v1/cities/${id}`,
    mascotas: '/v1/mascots',
    mascota: (id) => `/v1/mascots/${id}`,
    eventos: '/v1/events',
    balon: '/v1/ball',
    bandaSonora: '/v1/sound',
    // La API llama "records" a los highlights en video del torneo.
    // Es lo que el sitio muestra como "Archivo".
    archivos: '/v1/records/'
  };

  // Rutas de páginas del sitio (centralizadas para evitar links rotos)
  const RUTAS = {
    home: 'index.html',
    noticias: 'noticias.html',
    partidos: 'partidos.html',
    partido: 'partido.html',
    clasificacion: 'clasificacion.html',
    equipos: 'equipos.html',
    equipo: 'equipo.html',
    ciudades: 'ciudades.html',
    ciudad: 'ciudad.html',
    archivos: 'archivos.html',
    archivo: 'archivo.html',
    balon: 'balon.html',
    mascotas: 'mascotas.html',
    bandaSonora: 'banda-sonora.html',
    eventos: 'eventos.html',
    ranking: 'ranking.html',
    ods: 'ods.html',
    contacto: 'contacto.html',
    nosotros: 'nosotros.html'
  };

  WC.CONFIG = CONFIG;
  WC.ENDPOINTS = ENDPOINTS;
  WC.RUTAS = RUTAS;
})();
