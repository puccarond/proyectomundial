var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var $ = WC.$, API = WC.API, RUTAS = WC.RUTAS, mensajeError = WC.mensajeError, mensajeVacio = WC.mensajeVacio, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader, pick = WC.pick, skeletonTarjetas = WC.skeletonTarjetas, tarjetaCiudad = WC.tarjetaCiudad;

  /* =========================================================
     PÁGINA: LISTADO DE CIUDADES ANFITRIONAS
     Requisito 8 del alcance: listado filtrable por país.
     ========================================================= */

  montarHeader(RUTAS.ciudades);
  montarFooter();

  let CIUDADES = [];

  const paisDe = (c) => pick(c, 'country', 'countryName', 'pais') || '';

  function aplicarFiltro() {
    const pais = $('#filtroPais')?.value ?? '';
    const filtradas = pais ? CIUDADES.filter((c) => paisDe(c) === pais) : CIUDADES;

    const contador = $('#contadorCiudades');
    if (contador) {
      contador.textContent =
        filtradas.length === CIUDADES.length
          ? `${CIUDADES.length} ciudades sede`
          : `${filtradas.length} de ${CIUDADES.length} ciudades`;
    }

    $('#listaCiudades').innerHTML = filtradas.length
      ? filtradas.map((c) => tarjetaCiudad(c, 'col-6 col-md-4 col-lg-3')).join('')
      : mensajeVacio('No hay ciudades registradas para ese país.', 'bi-geo-alt');
  }

  async function iniciar() {
    $('#listaCiudades').innerHTML = skeletonTarjetas(8, 'col-6 col-md-4 col-lg-3');

    try {
      const datos = await API.ciudades();
      CIUDADES = Array.isArray(datos) ? datos : [];

      const select = $('#filtroPais');
      if (select) {
        [...new Set(CIUDADES.map(paisDe).filter(Boolean))]
          .sort((a, b) => a.localeCompare(b, 'es'))
          .forEach((p) => {
            const op = document.createElement('option');
            op.value = p;
            op.textContent = p;
            select.appendChild(op);
          });
      }

      aplicarFiltro();
    } catch {
      $('#listaCiudades').innerHTML = mensajeError('No se pudo cargar el listado de ciudades.');
    }
  }

  $('#filtroPais')?.addEventListener('change', aplicarFiltro);

  iniciar();

})();
