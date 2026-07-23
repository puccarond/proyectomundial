var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader, pick = WC.pick, render = WC.render, skeletonTarjetas = WC.skeletonTarjetas, tarjetaArchivo = WC.tarjetaArchivo;

  /* =========================================================
     PÁGINA: ARCHIVO HISTÓRICO
     Requisito 10 del alcance: listado de videos de mundiales
     anteriores.
     ========================================================= */

  montarHeader(RUTAS.archivos);
  montarFooter();

  render(
    '#listaArchivos',
    API.archivos,
    (archivos) =>
      [...archivos]
        .sort((a, b) => (pick(b, 'id') ?? 0) - (pick(a, 'id') ?? 0))
        .map((a) => tarjetaArchivo(a, 'col-6 col-md-4 col-lg-3'))
        .join(''),
    {
      skeleton: skeletonTarjetas(8, 'col-6 col-md-4 col-lg-3'),
      textoVacio: 'El archivo del torneo aún no tiene material publicado.',
      textoError: 'No se pudo cargar el archivo histórico.'
    }
  );

})();
