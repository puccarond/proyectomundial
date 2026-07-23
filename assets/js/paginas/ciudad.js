var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, $ = WC.$, esc = WC.esc, pick = WC.pick,
      img = WC.img, paramURL = WC.paramURL, skeletonFilas = WC.skeletonFilas,
      mensajeError = WC.mensajeError, montarFooter = WC.montarFooter,
      montarHeader = WC.montarHeader, tarjetaPartido = WC.tarjetaPartido,
      equiposIndexados = WC.equiposIndexados, ciudadesIndexadas = WC.ciudadesIndexadas;

  /* =========================================================
     PÁGINA: DETALLE DE LA CIUDAD ANFITRIONA
     Requisito 9 del alcance: banner/foto, descripción, logo del
     Mundial por ciudad, información del estadio (foto, descripción,
     capacidad, coordenadas) y los partidos que se jugarán allí.
     ========================================================= */

  montarHeader(RUTAS.ciudades);
  montarFooter();

  const ID = paramURL('id');

  function formatoNumero(n) {
    const num = Number(n);
    return Number.isFinite(num) ? num.toLocaleString('es') : '—';
  }

  /** La API entrega las descripciones como arreglo de párrafos */
  function parrafos(valor, clase = 'text-muted-wc') {
    const lista = Array.isArray(valor) ? valor : [valor];
    return lista
      .filter(Boolean)
      .map((t) => `<p class="${clase}" style="line-height:1.7">${esc(t)}</p>`)
      .join('');
  }

  function bloqueCoordenadas(coords) {
    const lat = pick(coords, 'latitude', 'lat');
    const lon = pick(coords, 'longitude', 'lon', 'lng');
    if (lat === undefined || lon === undefined || lat === null || lon === null) return '';

    const url = `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lon)}#map=15/${encodeURIComponent(lat)}/${encodeURIComponent(lon)}`;
    return `
      <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
        <span class="text-muted-wc small">Coordenadas</span>
        <span class="fw-semibold" style="font-size:.9rem">
          ${esc(Number(lat).toFixed(4))}, ${esc(Number(lon).toFixed(4))}
        </span>
      </div>
      <a href="${esc(url)}" target="_blank" rel="noopener noreferrer"
         class="btn btn-fantasma btn-sm w-100 mt-3">
        <i class="bi bi-map me-1"></i>Ver en el mapa
      </a>`;
  }

  async function iniciar() {
    const cont = $('#detalleCiudad');

    if (!ID) {
      cont.innerHTML = mensajeError('No se indicó qué ciudad mostrar.');
      return;
    }

    cont.innerHTML = skeletonFilas(6);

    try {
      const ciudad = await API.ciudad(ID);

      if (!ciudad || Array.isArray(ciudad)) {
        cont.innerHTML = mensajeError('No se encontró la ciudad solicitada.');
        return;
      }

      const nombre = pick(ciudad, 'name') || 'Ciudad';
      const pais = pick(ciudad, 'country') || '';
      const descripcion = pick(ciudad, 'description') || '';
      const foto = pick(ciudad, 'image_url', 'image');
      const logo = pick(ciudad, 'logo_url', 'logo');
      const enlace = pick(ciudad, 'url');
      const extra = pick(ciudad, 'extra_info') || {};

      const estadio = pick(ciudad, 'stadium') || {};
      const nombreEstadio = pick(estadio, 'name') || 'Estadio por confirmar';
      const capacidad = pick(estadio, 'capacity');
      const fotoEstadio = pick(estadio, 'image_url', 'image');
      const coords = pick(estadio, 'coordinates') || {};

      document.title = `${nombre} | Mundial FIFA 2026`;
      const miga = $('#migaActual');
      if (miga) miga.textContent = nombre;

      cont.innerHTML = `
        <!-- Banner de la ciudad -->
        <div class="position-relative rounded overflow-hidden mb-4"
             style="aspect-ratio:21/9;background:var(--fondo-alt)">
          ${img(foto, nombre, 'w-100 h-100')}
          <div class="position-absolute bottom-0 start-0 end-0 p-4"
               style="background:linear-gradient(transparent,rgba(0,0,0,.85))">
            <div class="d-flex align-items-center gap-3">
              ${logo ? `<img src="${esc(logo)}" alt="Logo de ${esc(nombre)}"
                          style="width:64px;height:64px;object-fit:contain" loading="lazy">` : ''}
              <div>
                <h1 class="h2 mb-0" style="color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.5)">
                  ${esc(nombre)}
                </h1>
                <span style="color:rgba(255,255,255,.85)">${esc(pais)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">

          <div class="col-lg-7">
            <div class="card-wc p-4 h-100">
              <h2 class="h5 mb-3">Sobre la ciudad</h2>
              ${descripcion ? parrafos(descripcion) : '<p class="text-muted-wc">Descripción no disponible.</p>'}

              ${pick(extra, 'title') ? `
                <hr>
                <h3 class="h6 mb-2">${esc(pick(extra, 'title'))}</h3>
                ${parrafos(pick(extra, 'description'), 'text-muted-wc small mb-2')}
                ${pick(extra, 'hashtag')
                  ? `<span class="badge-wc">${esc(pick(extra, 'hashtag'))}</span>`
                  : ''}` : ''}

              ${enlace ? `
                <a href="${esc(enlace)}" target="_blank" rel="noopener noreferrer"
                   class="btn btn-fantasma btn-sm mt-3">
                  <i class="bi bi-box-arrow-up-right me-1"></i>Ficha oficial en FIFA.com
                </a>` : ''}
            </div>
          </div>

          <div class="col-lg-5">
            <div class="card-wc overflow-hidden h-100">
              ${fotoEstadio ? img(fotoEstadio, nombreEstadio, 'card-img-wc') : ''}
              <div class="p-4">
                <h2 class="h5 mb-3">${esc(nombreEstadio)}</h2>
                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span class="text-muted-wc small">Capacidad</span>
                  <span class="fw-semibold">${formatoNumero(capacidad)} espectadores</span>
                </div>
                ${bloqueCoordenadas(coords)}
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="seccion-titulo mt-3">
              <h2 class="h4">Partidos en ${esc(nombre)}</h2>
            </div>
            <div class="row g-3" id="partidosCiudad"></div>
          </div>

        </div>`;

      pintarPartidos(String(pick(ciudad, 'id')));
    } catch {
      cont.innerHTML = mensajeError('No se pudo cargar la información de la ciudad.');
    }
  }

  async function pintarPartidos(idCiudad) {
    const cont = $('#partidosCiudad');
    if (!cont) return;

    try {
      await Promise.all([equiposIndexados(), ciudadesIndexadas()]);
      const todos = await API.partidos();

      const aqui = (Array.isArray(todos) ? todos : []).filter(
        (p) => String(pick(p, 'city_id')) === idCiudad
      );

      cont.innerHTML = aqui.length
        ? aqui.map((p) => tarjetaPartido(p, 'col-12 col-md-6 col-xl-4')).join('')
        : `<div class="col-12"><p class="text-muted-wc">
             Aún no hay partidos programados en esta sede.</p></div>`;
    } catch {
      cont.innerHTML = '';
    }
  }

  iniciar();
})();
