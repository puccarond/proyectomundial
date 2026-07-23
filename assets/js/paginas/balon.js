var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, $ = WC.$, esc = WC.esc, pick = WC.pick,
      img = WC.img, skeletonFilas = WC.skeletonFilas, mensajeError = WC.mensajeError,
      montarFooter = WC.montarFooter, montarHeader = WC.montarHeader;

  /* =========================================================
     PÁGINA: BALÓN OFICIAL
     Requisito 11 del alcance: fotos y descripción.

     La API entrega: { name, features: [{title, description[]}], images_url[] }
     ========================================================= */

  montarHeader(RUTAS.balon);
  montarFooter();

  /** Convierte una descripción (texto o arreglo de párrafos) en HTML */
  function parrafos(valor, clase = 'text-muted-wc') {
    const lista = Array.isArray(valor) ? valor : [valor];
    return lista
      .filter(Boolean)
      .map((t) => `<p class="${clase}" style="line-height:1.75">${esc(t)}</p>`)
      .join('');
  }

  function galeria(imagenes, alt) {
    const fotos = (Array.isArray(imagenes) ? imagenes : []).filter(Boolean);

    if (!fotos.length) {
      return `<div class="card-wc d-flex align-items-center justify-content-center"
                   style="aspect-ratio:1;background:var(--fondo-alt)">
                <div class="text-center text-muted-wc">
                  <i class="bi bi-dribbble" style="font-size:3.5rem"></i>
                  <p class="small mt-2 mb-0">Fotos no disponibles</p>
                </div>
              </div>`;
    }

    return `
      <div class="card-wc overflow-hidden mb-3">
        ${img(fotos[0], alt, 'w-100')}
      </div>
      ${fotos.length > 1
        ? `<div class="row g-2">
            ${fotos.slice(1, 7).map((f) => `
              <div class="col-4">
                <div class="card-wc overflow-hidden">${img(f, alt, 'w-100')}</div>
              </div>`).join('')}
           </div>`
        : ''}`;
  }

  async function iniciar() {
    const cont = $('#contenidoBalon');
    cont.innerHTML = skeletonFilas(5);

    try {
      const balon = await API.balon();
      const datos = Array.isArray(balon) ? balon[0] : balon;

      if (!datos) {
        cont.innerHTML = mensajeError('No hay información del balón oficial.');
        return;
      }

      const nombre = pick(datos, 'name', 'title') || 'Balón Oficial';
      const imagenes = pick(datos, 'images_url', 'images') || [];
      const caracteristicas = pick(datos, 'features') || [];

      document.title = `${nombre} | Mundial FIFA 2026`;

      cont.innerHTML = `
        <h1 class="titulo-pagina">${esc(nombre)}</h1>

        <div class="row g-5 align-items-start">
          <div class="col-lg-6">${galeria(imagenes, nombre)}</div>

          <div class="col-lg-6">
            ${Array.isArray(caracteristicas) && caracteristicas.length
              ? caracteristicas.map((c) => `
                  <div class="card-wc p-4 mb-3">
                    <h2 class="h6 mb-2 d-flex align-items-center gap-2">
                      <i class="bi bi-check-circle-fill" style="color:var(--verde-600)"></i>
                      ${esc(pick(c, 'title') || '')}
                    </h2>
                    ${parrafos(pick(c, 'description'), 'text-muted-wc small mb-2')}
                  </div>`).join('')
              : `<p class="text-muted-wc">Sin información adicional disponible.</p>`}

            <div class="d-flex gap-2 mt-4">
              <a href="${RUTAS.mascotas}" class="btn btn-fantasma">Mascotas oficiales</a>
              <a href="${RUTAS.bandaSonora}" class="btn btn-fantasma">Banda sonora</a>
            </div>
          </div>
        </div>`;
    } catch {
      cont.innerHTML = mensajeError('No se pudo cargar la información del balón.');
    }
  }

  iniciar();
})();
