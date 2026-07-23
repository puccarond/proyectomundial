var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, $ = WC.$, esc = WC.esc, pick = WC.pick,
      img = WC.img, skeletonFilas = WC.skeletonFilas, mensajeError = WC.mensajeError,
      montarFooter = WC.montarFooter, montarHeader = WC.montarHeader;

  /* =========================================================
     PÁGINA: BANDA SONORA
     Requisito 13 del alcance: banner alusivo, descripción y un
     enlace para ir a la página donde se escuchan las canciones.

     La API entrega: { title, resume, features[], url, image_url }
     ========================================================= */

  montarHeader(RUTAS.bandaSonora);
  montarFooter();

  function parrafos(valor, clase = 'text-muted-wc') {
    const lista = Array.isArray(valor) ? valor : [valor];
    return lista
      .filter(Boolean)
      .map((t) => `<p class="${clase}" style="line-height:1.75">${esc(t)}</p>`)
      .join('');
  }

  async function iniciar() {
    const cont = $('#contenidoBanda');
    cont.innerHTML = skeletonFilas(5);

    try {
      const banda = await API.bandaSonora();
      const datos = Array.isArray(banda) ? banda[0] : banda;

      if (!datos) {
        cont.innerHTML = mensajeError('No hay información de la banda sonora.');
        return;
      }

      const titulo = pick(datos, 'title', 'name') || 'Banda Sonora Oficial';
      const resumen = pick(datos, 'resume', 'description') || '';
      const banner = pick(datos, 'image_url', 'banner', 'image');
      const url = pick(datos, 'url', 'link');
      const caracteristicas = pick(datos, 'features') || [];

      document.title = `${titulo} | Mundial FIFA 2026`;

      cont.innerHTML = `
        <!-- Banner alusivo -->
        <div class="position-relative rounded overflow-hidden mb-4"
             style="aspect-ratio:21/9;background:var(--verde-800)">
          ${banner ? img(banner, titulo, 'w-100 h-100') : ''}
          <div class="position-absolute top-50 start-50 translate-middle text-center px-3">
            <i class="bi bi-music-note-beamed mb-3 d-block"
               style="font-size:2.5rem;color:var(--oro)"></i>
            <h1 class="h2 mb-0" style="color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.45)">
              ${esc(titulo)}
            </h1>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-7">
            <div class="card-wc p-4">
              <h2 class="h5 mb-3">Sobre el álbum</h2>
              ${resumen ? parrafos(resumen) : '<p class="text-muted-wc">Descripción no disponible.</p>'}

              ${url
                ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer"
                      class="btn btn-verde mt-3">
                     <i class="bi bi-play-circle me-1"></i>Escuchar el álbum completo
                   </a>`
                : `<p class="text-muted-wc small mt-3 mb-0">
                     El enlace al álbum aún no está disponible.</p>`}
            </div>
          </div>

          <div class="col-lg-5">
            ${Array.isArray(caracteristicas) && caracteristicas.length
              ? caracteristicas.map((c) => `
                  <div class="card-wc p-4 mb-3">
                    <h3 class="h6 mb-2">${esc(pick(c, 'title') || '')}</h3>
                    ${parrafos(pick(c, 'description'), 'text-muted-wc small mb-2')}
                  </div>`).join('')
              : ''}
          </div>
        </div>`;
    } catch {
      cont.innerHTML = mensajeError('No se pudo cargar la banda sonora.');
    }
  }

  iniciar();
})();
