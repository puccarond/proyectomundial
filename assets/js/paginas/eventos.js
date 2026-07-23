var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, filaEvento = WC.filaEvento, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader, pick = WC.pick, render = WC.render, skeletonFilas = WC.skeletonFilas;

  /* =========================================================
     PÁGINA: PRÓXIMOS EVENTOS Y TORNEOS
     Requisito 14 del alcance: listado que permita acceder a la
     página oficial de cada evento.
     ========================================================= */

  montarHeader(RUTAS.eventos);
  montarFooter();

  render(
    '#listaEventos',
    API.eventos,
    (eventos) =>
      [...eventos]
        .sort(
          (a, b) =>
            new Date(pick(a, 'date', 'startDate')) - new Date(pick(b, 'date', 'startDate'))
        )
        .map(filaEvento)
        .join(''),
    {
      skeleton: skeletonFilas(5),
      textoVacio: 'No hay eventos anunciados por ahora.',
      textoError: 'No se pudo cargar la agenda de eventos.'
    }
  );

})();
