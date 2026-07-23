var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var $ = WC.$, API = WC.API, RUTAS = WC.RUTAS, mensajeError = WC.mensajeError, mensajeVacio = WC.mensajeVacio, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader, pick = WC.pick, skeletonTarjetas = WC.skeletonTarjetas, tarjetaEquipo = WC.tarjetaEquipo;

  /* =========================================================
     PÁGINA: LISTADO DE EQUIPOS
     Requisito 6 del alcance: mostrar por cada equipo su grupo,
     posición en el ranking FIFA y número de participaciones en
     el Mundial, con filtro por confederaciones.
     ========================================================= */

  montarHeader(RUTAS.equipos);
  montarFooter();

  let EQUIPOS = [];

  const confDe = (e) =>
    pick(e, 'confederation', 'confederationName', 'confederation.name') || '';
  const nombreDe = (e) => pick(e, 'name', 'teamName', 'title') || '';

  /* --------------------- NORMALIZAR ----------------------- */

  /** Quita acentos para que "mexico" encuentre "México" */
  function normalizar(texto) {
    return String(texto)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  /* ----------------------- FILTRADO ----------------------- */

  function aplicarFiltros() {
    const busqueda = normalizar($('#buscador')?.value ?? '').trim();
    const conf = $('#filtroConfederacion')?.value ?? '';

    const filtrados = EQUIPOS.filter((e) => {
      if (conf && confDe(e) !== conf) return false;
      if (busqueda && !normalizar(nombreDe(e)).includes(busqueda)) return false;
      return true;
    });

    const contador = $('#contadorEquipos');
    if (contador) {
      contador.textContent =
        filtrados.length === EQUIPOS.length
          ? `${EQUIPOS.length} selecciones`
          : `${filtrados.length} de ${EQUIPOS.length} selecciones`;
    }

    $('#listaEquipos').innerHTML = filtrados.length
      ? filtrados
          .sort(
            (a, b) =>
              (pick(a, 'world_ranking', 'ranking') ?? 999) -
              (pick(b, 'world_ranking', 'ranking') ?? 999)
          )
          .map((e) => tarjetaEquipo(e))
          .join('')
      : mensajeVacio('Ninguna selección coincide con la búsqueda.', 'bi-search');
  }

  /* ------------------------ CARGA ------------------------- */

  async function iniciar() {
    $('#listaEquipos').innerHTML = skeletonTarjetas(8, 'col-6 col-md-4 col-lg-3');

    try {
      const datos = await API.equipos();
      EQUIPOS = Array.isArray(datos) ? datos : [];

      const sub = $('#subtituloEquipos');
      if (sub) {
        sub.textContent = `Conoce a las ${EQUIPOS.length} selecciones que buscarán la gloria en 2026.`;
      }

      // El filtro se arma con las confederaciones presentes en los datos
      const select = $('#filtroConfederacion');
      if (select) {
        [...new Set(EQUIPOS.map(confDe).filter(Boolean))]
          .sort()
          .forEach((c) => {
            const op = document.createElement('option');
            op.value = c;
            op.textContent = c;
            select.appendChild(op);
          });
      }

      aplicarFiltros();
    } catch {
      $('#listaEquipos').innerHTML = mensajeError('No se pudo cargar el listado de equipos.');
    }
  }

  $('#buscador')?.addEventListener('input', aplicarFiltros);
  $('#filtroConfederacion')?.addEventListener('change', aplicarFiltros);

  iniciar();

})();
