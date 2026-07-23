var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var $ = WC.$, RUTAS = WC.RUTAS, esc = WC.esc, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader;

  /* =========================================================
     PÁGINA: SOBRE EL PROYECTO
     Requisito 17 del alcance: información del proyecto, las
     tecnologías utilizadas y los miembros del grupo.

     >>> EDITAR AQUÍ los nombres y roles del equipo antes de
     >>> la entrega final.
     ========================================================= */

  montarHeader(RUTAS.nosotros);
  montarFooter();

  /* ---------------------------------------------------------
     MIEMBROS DEL GRUPO — reemplazar con los datos reales
     --------------------------------------------------------- */
  const MIEMBROS = [
    { nombre: 'Ricardo Coraspe',  cedula: '32.420.339', rol: 'Desarrollo frontend e integración con el API' },
    { nombre: 'Adjmir Peña',      cedula: '30.209.347', rol: 'Diseño de interfaz y modelado en Figma' },
    { nombre: 'Paulo Troncone',   cedula: '32.172.215', rol: 'Maquetado responsive y hoja de estilos' },
    { nombre: 'Andrés Ronderos',  cedula: '32.060.006', rol: 'Pruebas, documentación y despliegue' }
  ];

  const TECNOLOGIAS = [
    {
      nombre: 'HTML5 y CSS3',
      icono: 'bi-filetype-html',
      detalle: 'Estructura semántica y estilos propios con variables CSS.'
    },
    {
      nombre: 'JavaScript (ES6+)',
      icono: 'bi-filetype-js',
      detalle: 'JavaScript puro, sin framework ni paso de compilación. Funciona abriendo el archivo directamente.'
    },
    {
      nombre: 'Bootstrap 5',
      icono: 'bi-bootstrap',
      detalle: 'Sistema de rejilla y componentes base para el diseño responsive.'
    },
    {
      nombre: 'Bootstrap Icons',
      icono: 'bi-stars',
      detalle: 'Iconografía consistente en todo el sitio.'
    },
    {
      nombre: 'Fetch API',
      icono: 'bi-cloud-arrow-down',
      detalle: 'Consumo del API del torneo con caché, timeout y reintento.'
    }
  ];

  /* ----------------------- RENDER ------------------------- */

  $('#listaTecnologias').innerHTML = TECNOLOGIAS.map(
    (t) => `
    <div class="d-flex align-items-start gap-3 py-2">
      <i class="bi ${t.icono}" style="font-size:1.3rem;color:var(--verde-700)"></i>
      <div>
        <div class="fw-semibold" style="font-size:.95rem">${esc(t.nombre)}</div>
        <small class="text-muted-wc">${esc(t.detalle)}</small>
      </div>
    </div>`
  ).join('');

  $('#listaMiembros').innerHTML = MIEMBROS.map(
    (m) => {
      // Iniciales como avatar, para no depender de fotos
      const iniciales = m.nombre
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0] || '')
        .join('')
        .toUpperCase();

      return `
        <div class="col-sm-6 col-lg-3">
          <div class="card-wc p-4 text-center h-100">
            <div class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                 style="width:72px;height:72px;background:var(--verde-800);color:#fff;
                        font-weight:700;font-size:1.4rem">
              ${esc(iniciales)}
            </div>
            <h3 class="h6 mb-1">${esc(m.nombre)}</h3>
            ${m.cedula && m.cedula !== '—'
              ? `<small class="text-muted-wc d-block mb-2">C.I. ${esc(m.cedula)}</small>`
              : ''}
            <p class="text-muted-wc small mb-0">${esc(m.rol)}</p>
          </div>
        </div>`;
    }
  ).join('');

})();
