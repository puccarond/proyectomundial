var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, esc = WC.esc, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader, pick = WC.pick, render = WC.render, skeletonTarjetas = WC.skeletonTarjetas, tarjetaNoticia = WC.tarjetaNoticia;

  /* =========================================================
     PÁGINA: LISTADO DE NOTICIAS
     Requisito 2 del alcance.
     ========================================================= */

  montarHeader(RUTAS.noticias);
  montarFooter();

  render(
    '#listaNoticias',
    API.noticias,
    (noticias) =>
      [...noticias]
        .sort(
          (a, b) =>
            new Date(pick(b, 'published_date', 'date')) -
            new Date(pick(a, 'published_date', 'date'))
        )
        .map((n) => tarjetaNoticia(n))
        .join(''),
    {
      skeleton: skeletonTarjetas(6, 'col-12 col-md-6 col-lg-4'),
      textoVacio: 'Aún no hay noticias publicadas.',
      textoError: 'No se pudieron cargar las noticias.'
    }
  );

  /* Si se llega con un ancla (#noticia-3), la resaltamos brevemente */
  window.addEventListener('load', () => {
    const objetivo = location.hash && document.querySelector(location.hash);
    if (!objetivo) return;
    objetivo.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    objetivo.style.outline = '3px solid var(--oro)';
    setTimeout(() => { objetivo.style.outline = ''; }, 2500);
  });

})();
