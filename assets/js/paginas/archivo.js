var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, $ = WC.$, esc = WC.esc, pick = WC.pick,
      img = WC.img, paramURL = WC.paramURL, skeletonFilas = WC.skeletonFilas,
      mensajeError = WC.mensajeError, montarFooter = WC.montarFooter,
      montarHeader = WC.montarHeader;

  /* =========================================================
     PÁGINA: DETALLE DEL ARCHIVO
     Requisito 10 del alcance: video, descripción y logo del
     torneo relacionado.

     En la API son "records": highlights en video del torneo,
     con { id, title, subtitle, url, thumbnail_url }.
     ========================================================= */

  montarHeader(RUTAS.archivos);
  montarFooter();

  const ID = paramURL('id');

  /**
   * Devuelve el HTML del reproductor. Soporta YouTube (lo convierte a
   * formato embed), reproductores externos y archivos de video directos.
   */
  function reproductor(url, titulo, portada) {
    if (!url) {
      return `
        <div class="position-relative rounded overflow-hidden" style="aspect-ratio:16/9">
          ${img(portada, titulo, 'w-100 h-100')}
          <div class="position-absolute top-50 start-50 translate-middle text-center">
            <i class="bi bi-camera-video-off" style="font-size:2rem;color:var(--texto-suave)"></i>
            <p class="small text-muted-wc mt-2 mb-0">Video no disponible</p>
          </div>
        </div>`;
    }

    const yt = String(url).match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
    );

    if (yt) {
      return `
        <div class="ratio ratio-16x9 rounded overflow-hidden">
          <iframe src="https://www.youtube-nocookie.com/embed/${esc(yt[1])}"
                  title="${esc(titulo)}" loading="lazy" allowfullscreen
                  referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>`;
    }

    if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
      return `
        <video class="w-100 rounded" controls preload="metadata"
               ${portada ? `poster="${esc(portada)}"` : ''}>
          <source src="${esc(url)}">
          Tu navegador no puede reproducir este video.
        </video>`;
    }

    // Reproductores externos (por ejemplo Sofascore): enlazamos con su portada
    return `
      <a href="${esc(url)}" target="_blank" rel="noopener noreferrer"
         class="position-relative d-block rounded overflow-hidden" style="aspect-ratio:16/9">
        ${img(portada, titulo, 'w-100 h-100')}
        <span class="position-absolute top-50 start-50 translate-middle d-flex
                     align-items-center justify-content-center"
              style="width:64px;height:64px;background:rgba(251,191,36,.95);border-radius:50%">
          <i class="bi bi-play-fill" style="font-size:2rem;color:var(--oscuro-900)"></i>
        </span>
      </a>
      <p class="small text-muted-wc mt-2 mb-0">
        <i class="bi bi-info-circle me-1"></i>Este video se abre en el reproductor original.
      </p>`;
  }

  async function iniciar() {
    const cont = $('#detalleArchivo');

    if (!ID) {
      cont.innerHTML = mensajeError('No se indicó qué video mostrar.');
      return;
    }

    cont.innerHTML = skeletonFilas(5);

    try {
      const todos = await API.archivos();
      const archivo = (Array.isArray(todos) ? todos : []).find(
        (a) => String(pick(a, 'id')) === String(ID)
      );

      if (!archivo) {
        cont.innerHTML = mensajeError('No se encontró el video solicitado.');
        return;
      }

      const titulo = pick(archivo, 'title') || 'Video';
      const subtitulo = pick(archivo, 'subtitle') || '';
      const video = pick(archivo, 'url');
      const portada = pick(archivo, 'thumbnail_url');

      document.title = `${titulo} | Mundial FIFA 2026`;
      const miga = $('#migaActual');
      if (miga) miga.textContent = titulo;

      cont.innerHTML = `
        <div class="row g-4">
          <div class="col-lg-8">
            ${reproductor(video, titulo, portada)}
            <div class="card-wc p-4 mt-4">
              <h1 class="h3 mb-2">${esc(titulo)}</h1>
              ${subtitulo ? `<span class="badge-wc mb-3 d-inline-block">${esc(subtitulo)}</span>` : ''}
              <p class="text-muted-wc mb-0">
                Material audiovisual de la Copa Mundial de la FIFA 2026.
              </p>
            </div>
          </div>

          <div class="col-lg-4">
            <div class="card-wc p-4 text-center">
              <h2 class="h6 text-muted-wc text-uppercase mb-3"
                  style="font-size:.75rem;letter-spacing:.07em">Torneo relacionado</h2>
              <i class="bi bi-trophy" style="font-size:3rem;color:var(--oro)"></i>
              <p class="fw-semibold mt-3 mb-0">Copa Mundial de la FIFA 2026</p>
              <small class="text-muted-wc">Estados Unidos · México · Canadá</small>
            </div>

            <a href="${RUTAS.archivos}" class="btn btn-fantasma w-100 mt-3">
              <i class="bi bi-collection-play me-1"></i>Ver todo el archivo
            </a>
          </div>
        </div>`;
    } catch {
      cont.innerHTML = mensajeError('No se pudo cargar el video.');
    }
  }

  iniciar();
})();
