var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var RUTAS = WC.RUTAS;

  /* =========================================================
     UTILIDADES DE INTERFAZ COMPARTIDAS
     Header, footer, skeletons, formateo y tarjetas reutilizables
     ========================================================= */

  /* ------------------ HELPERS GENERALES ------------------ */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /** Escapa texto para evitar inyección de HTML desde la API */
  function esc(valor) {
    if (valor === null || valor === undefined) return '';
    return String(valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /** Devuelve el primer valor no vacío entre varias claves posibles del objeto */
  function pick(obj, ...claves) {
    if (!obj) return undefined;
    for (const c of claves) {
      const v = c.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return undefined;
  }

  function paramURL(nombre) {
    return new URLSearchParams(location.search).get(nombre);
  }

  /* --------------------- FORMATEO ------------------------ */

  const FMT_FECHA = new Intl.DateTimeFormat('es', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  const FMT_HORA = new Intl.DateTimeFormat('es', {
    hour: '2-digit', minute: '2-digit'
  });

  function fecha(valor) {
    const d = new Date(valor);
    return isNaN(d) ? '—' : FMT_FECHA.format(d);
  }

  function hora(valor) {
    const d = new Date(valor);
    return isNaN(d) ? '—' : FMT_HORA.format(d);
  }

  function fechaHora(valor) {
    const d = new Date(valor);
    return isNaN(d) ? '—' : `${FMT_FECHA.format(d)} · ${FMT_HORA.format(d)}`;
  }

  /* ------------------ IMÁGENES SEGURAS ------------------- */

  const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250">
         <rect width="400" height="250" fill="#f1f5f9"/>
         <text x="200" y="132" font-family="sans-serif" font-size="17"
               fill="#9ca3af" text-anchor="middle">Sin imagen</text>
       </svg>`
    );

  /** Imagen con lazy-loading y respaldo si la URL falla (rendimiento + robustez) */
  function img(src, alt, clases = '') {
    const url = src || PLACEHOLDER;
    return `<img src="${esc(url)}" alt="${esc(alt)}" class="${clases}"
              loading="lazy" decoding="async"
              onerror="this.onerror=null;this.src='${PLACEHOLDER}'">`;
  }

  /* --------------------- SKELETONS ----------------------- */

  function skeletonTarjetas(cantidad = 4, columnas = 'col-6 col-md-4 col-lg-3') {
    return Array.from({ length: cantidad })
      .map(
        () => `<div class="${columnas}">
          <div class="card card-wc h-100">
            <div class="skeleton" style="height:150px"></div>
            <div class="card-body">
              <div class="skeleton skeleton-linea w-75 mb-2"></div>
              <div class="skeleton skeleton-linea w-50"></div>
            </div>
          </div>
        </div>`
      )
      .join('');
  }

  function skeletonFilas(cantidad = 5) {
    return Array.from({ length: cantidad })
      .map(() => `<div class="skeleton skeleton-linea mb-2" style="height:56px"></div>`)
      .join('');
  }

  function mensajeVacio(texto, icono = 'bi-inbox') {
    return `<div class="col-12">
      <div class="estado-vacio">
        <i class="bi ${icono}"></i>
        <p class="mb-0">${esc(texto)}</p>
      </div>
    </div>`;
  }

  function mensajeError(texto = 'No se pudo cargar la información.') {
    return `<div class="col-12">
      <div class="estado-vacio estado-error">
        <i class="bi bi-exclamation-triangle"></i>
        <p class="mb-1">${esc(texto)}</p>
        <button class="btn btn-sm btn-outline-light mt-2" onclick="location.reload()">
          Reintentar
        </button>
      </div>
    </div>`;
  }

  /* ------------- RENDER SEGURO DE SECCIONES -------------- */

  /**
   * Ejecuta una carga y pinta el resultado, manejando skeleton,
   * error y estado vacío de forma uniforme en todo el sitio.
   */
  async function render(contenedor, cargar, pintar, opciones = {}) {
    const el = typeof contenedor === 'string' ? $(contenedor) : contenedor;
    if (!el) return;

    el.innerHTML = opciones.skeleton ?? skeletonTarjetas();

    try {
      const datos = await cargar();
      const lista = Array.isArray(datos) ? datos : datos ? [datos] : [];
      if (lista.length === 0) {
        el.innerHTML = mensajeVacio(opciones.textoVacio ?? 'Sin información disponible.');
        return;
      }
      el.innerHTML = pintar(datos);
    } catch {
      el.innerHTML = mensajeError(opciones.textoError);
    }
  }

  /* ------------------- HEADER Y FOOTER ------------------- */

  /* Navegación principal: exactamente las 4 secciones del modelado.
     El resto de páginas exigidas por el enunciado se alcanzan desde
     la sección "Explora el Mundial 2026" de la home y desde el footer. */
  const NAV = [
    { texto: 'Inicio',        href: RUTAS.home,          icono: 'bi-globe-americas' },
    { texto: 'Partidos',      href: RUTAS.partidos,      icono: 'bi-calendar-event' },
    { texto: 'Clasificación', href: RUTAS.clasificacion, icono: 'bi-bar-chart-line' },
    { texto: 'Equipos',       href: RUTAS.equipos,       icono: 'bi-people' }
  ];

  /* Logo del navbar.
     Muestra el logo oficial si el archivo existe
     (assets/img/logo/logo-mundial-2026.png); si todavía no está,
     cae automáticamente al distintivo de texto "FIFA 2026 MUNDIAL"
     (trofeo dorado), que coincide con el modelado. No hay que tocar
     nada: basta con colocar la imagen con ese nombre. */
  function marca() {
    return `<a class="navbar-brand d-flex align-items-center gap-2" href="${RUTAS.home}">
      <img src="assets/img/logo/logo-mundial-2026.png"
           alt="Copa Mundial de la FIFA 2026" height="40"
           onerror="this.style.display='none';this.nextElementSibling.style.display='inline-flex';">
      <span class="align-items-center gap-2" style="display:none">
        <i class="bi bi-trophy-fill" style="color:var(--oro);font-size:1.45rem"></i>
        <span>FIFA 2026 <span class="marca-oro">MUNDIAL</span></span>
      </span>
    </a>`;
  }

  function montarHeader(activo = '') {
    const enlaces = NAV.map((item) => {
      const esActivo = item.href === activo ? ' active' : '';
      return `<li class="nav-item">
        <a class="nav-link${esActivo}" href="${item.href}">
          <i class="bi ${item.icono}"></i>${esc(item.texto)}
        </a>
      </li>`;
    }).join('');

    const host = $('#header');
    if (host) host.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-wc sticky-top">
      <div class="container">
        ${marca()}
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navPrincipal" aria-label="Menú">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navPrincipal">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">${enlaces}</ul>
        </div>
      </div>
    </nav>`;
  }

  function montarFooter() {
    const anio = new Date().getFullYear();
    const host = $('#footer');
    if (host) host.innerHTML = `
    <footer class="footer-wc">
      <div class="container py-5">
        <div class="row gy-4">
          <div class="col-lg-4">
            <div class="footer-marca mb-3">
              <i class="bi bi-trophy" style="font-size:1.3rem"></i> FIFA 2026
            </div>
            <p class="mb-0" style="font-size:.88rem;max-width:34ch">
              Portal informativo del Mundial de la FIFA 2026, celebrado por primera vez
              en tres países: Estados Unidos, México y Canadá.
            </p>
          </div>
          <div class="col-6 col-lg-2">
            <h6 class="footer-titulo">Torneo</h6>
            <ul class="footer-lista">
              <li><a href="${RUTAS.partidos}">Partidos</a></li>
              <li><a href="${RUTAS.clasificacion}">Clasificación</a></li>
              <li><a href="${RUTAS.equipos}">Equipos</a></li>
              <li><a href="${RUTAS.ranking}">Ranking FIFA</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h6 class="footer-titulo">Mundial 2026</h6>
            <ul class="footer-lista">
              <li><a href="${RUTAS.ciudades}">Ciudades</a></li>
              <li><a href="${RUTAS.balon}">Balón oficial</a></li>
              <li><a href="${RUTAS.mascotas}">Mascotas</a></li>
              <li><a href="${RUTAS.bandaSonora}">Banda sonora</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h6 class="footer-titulo">Más</h6>
            <ul class="footer-lista">
              <li><a href="${RUTAS.noticias}">Noticias</a></li>
              <li><a href="${RUTAS.eventos}">Eventos</a></li>
              <li><a href="${RUTAS.archivos}">Archivo</a></li>
              <li><a href="${RUTAS.ods}">ODS</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h6 class="footer-titulo">Proyecto</h6>
            <ul class="footer-lista">
              <li><a href="${RUTAS.nosotros}">Sobre nosotros</a></li>
              <li><a href="${RUTAS.contacto}">Contacto</a></li>
            </ul>
          </div>
        </div>
        <hr class="mt-4">
        <p class="text-center small mb-0" style="color:rgba(255,255,255,.5)">
          © ${anio} Copa Mundial de la FIFA · Proyecto académico de Programación
          Orientada a la Web, Universidad Católica Andrés Bello. Sitio sin fines comerciales.
        </p>
      </div>
    </footer>`;
  }

  /* --------------------- CUENTA REGRESIVA ---------------- */

  /**
   * Inicia una cuenta regresiva dentro de un contenedor.
   * Devuelve una función para detenerla.
   *
   * `alTerminar` solo se dispara si la cuenta llega a cero MIENTRAS el
   * usuario está en la página. Si la fecha ya había pasado al cargar,
   * se muestra un mensaje y no se ejecuta: de lo contrario un partido
   * vencido que siga marcado como "próximo" recargaría la página en bucle.
   */
  function cuentaRegresiva(contenedor, fechaObjetivo, alTerminar) {
    const el = typeof contenedor === 'string' ? $(contenedor) : contenedor;
    if (!el) return () => {};

    const objetivo = new Date(fechaObjetivo).getTime();
    if (isNaN(objetivo)) return () => {};

    // ¿La fecha ya había pasado antes de iniciar la cuenta?
    const yaVencida = objetivo - Date.now() <= 0;

    const pintar = () => {
      const restante = objetivo - Date.now();
      if (restante <= 0) {
        clearInterval(id);
        el.innerHTML = `<p class="etiqueta-estado mb-0">Por comenzar</p>`;
        if (!yaVencida && typeof alTerminar === 'function') alTerminar();
        return;
      }
      const dias = Math.floor(restante / 86400000);
      const horas = Math.floor((restante % 86400000) / 3600000);
      const min = Math.floor((restante % 3600000) / 60000);
      const seg = Math.floor((restante % 60000) / 1000);

      el.innerHTML = `
        <div class="countdown">
          ${[[dias, 'días'], [horas, 'horas'], [min, 'min'], [seg, 'seg.']]
            .map(
              ([v, l]) => `<div class="countdown-bloque">
                <span class="countdown-valor">${String(v).padStart(2, '0')}</span>
                <span class="countdown-label">${l}</span>
              </div>`
            )
            .join('')}
        </div>`;
    };

    pintar();
    const id = setInterval(pintar, 1000);
    return () => clearInterval(id);
  }

  /* Se publican para el resto del sitio */
  WC.$ = $;
  WC.$$ = $$;
  WC.cuentaRegresiva = cuentaRegresiva;
  WC.esc = esc;
  WC.fecha = fecha;
  WC.fechaHora = fechaHora;
  WC.hora = hora;
  WC.img = img;
  WC.mensajeError = mensajeError;
  WC.mensajeVacio = mensajeVacio;
  WC.montarFooter = montarFooter;
  WC.montarHeader = montarHeader;
  WC.paramURL = paramURL;
  WC.pick = pick;
  WC.render = render;
  WC.skeletonFilas = skeletonFilas;
  WC.skeletonTarjetas = skeletonTarjetas;
})();
