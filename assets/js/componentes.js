var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var RUTAS = WC.RUTAS, CONFIG = WC.CONFIG, esc = WC.esc, fecha = WC.fecha,
      img = WC.img, pick = WC.pick, equipoPorId = WC.equipoPorId,
      ciudadPorId = WC.ciudadPorId;

  /* =========================================================
     COMPONENTES REUTILIZABLES
     Adaptados al esquema real de la API del curso:
       - equipos: id (código), name, flag_url/flag_uri, world_ranking,
                  appearances, group, confederation, colors
       - partidos: home_id/away_id, city_id, home_score.total,
                   date + time separados, round numérico,
                   status "Ended" / "Not started"
     ========================================================= */

  /* --------------------- BANDERAS ------------------------ */

  /* Respaldo por emoji cuando la API no trae imagen de bandera. */
  const FIFA_A_ISO = {
    ARG:'AR', BRA:'BR', URU:'UY', COL:'CO', CHI:'CL', PER:'PE', ECU:'EC',
    PAR:'PY', BOL:'BO', VEN:'VE',
    ESP:'ES', FRA:'FR', GER:'DE', ITA:'IT', POR:'PT', NED:'NL', BEL:'BE',
    CRO:'HR', SUI:'CH', DEN:'DK', AUT:'AT', POL:'PL', NOR:'NO', SWE:'SE',
    SRB:'RS', UKR:'UA', CZE:'CZ', TUR:'TR', GRE:'GR', ROU:'RO', HUN:'HU',
    IRL:'IE', ISL:'IS', SVK:'SK', SVN:'SI', ALB:'AL', BIH:'BA', FIN:'FI',
    MEX:'MX', USA:'US', CAN:'CA', CRC:'CR', PAN:'PA', HON:'HN', JAM:'JM',
    HAI:'HT', SLV:'SV', GUA:'GT', TRI:'TT', CUB:'CU', CUW:'CW',
    MAR:'MA', EGY:'EG', NGA:'NG', SEN:'SN', ALG:'DZ', TUN:'TN', GHA:'GH',
    CMR:'CM', CIV:'CI', RSA:'ZA', MLI:'ML', BFA:'BF', COD:'CD', ANG:'AO',
    CPV:'CV', GAB:'GA', KEN:'KE', ZAM:'ZM', UGA:'UG',
    JPN:'JP', KOR:'KR', IRN:'IR', KSA:'SA', QAT:'QA', AUS:'AU', UZB:'UZ',
    CHN:'CN', THA:'TH', IRQ:'IQ', JOR:'JO', OMA:'OM', UAE:'AE', PRK:'KP',
    NZL:'NZ', FIJ:'FJ', SOL:'SB', TAH:'PF', NCL:'NC'
  };

  const BANDERAS_ESPECIALES = {
    ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', NIR: '🇬🇧'
  };

  function emojiBandera(codigo) {
    const c = String(codigo || '').toUpperCase();
    if (BANDERAS_ESPECIALES[c]) return BANDERAS_ESPECIALES[c];
    const iso = FIFA_A_ISO[c] || (c.length === 2 ? c : '');
    if (!iso) return '';
    return String.fromCodePoint(
      ...[...iso].map((l) => 0x1f1e6 + l.charCodeAt(0) - 65)
    );
  }

  /* La API usa `flag_url` en el listado y `flag_uri` en el detalle */
  const urlBandera = (equipo) =>
    pick(equipo, 'flag_url', 'flag_uri', 'flag', 'flagUrl');

  const codigoEquipo = (equipo) => pick(equipo, 'id', 'code', 'abbreviation') || '';
  const nombreEquipo = (equipo) => pick(equipo, 'name', 'teamName') || 'Por definir';

  /** Bandera pequeña, en línea con el nombre del equipo */
  function bandera(equipo, clase = 'bandera-mini') {
    const url = urlBandera(equipo);
    const codigo = codigoEquipo(equipo);

    if (url) {
      return `<img src="${esc(url)}" alt="" loading="lazy" class="${clase}">`;
    }
    const emoji = emojiBandera(codigo);
    if (emoji) return `<span class="bandera-emoji" title="${esc(codigo)}">${emoji}</span>`;
    return `<span class="badge-wc">${esc(codigo || '—')}</span>`;
  }

  /** Bandera dentro de un círculo, para tarjetas de equipo */
  function banderaCirculo(equipo) {
    const url = urlBandera(equipo);
    const codigo = codigoEquipo(equipo);

    let contenido;
    if (url) {
      contenido = `<img src="${esc(url)}" alt="" loading="lazy">`;
    } else {
      const emoji = emojiBandera(codigo);
      contenido = emoji
        ? `<span class="bandera-emoji-grande">${emoji}</span>`
        : `<span class="fw-bold text-muted-wc" style="font-size:.9rem">${esc(codigo)}</span>`;
    }
    return `<div class="bandera-circulo">${contenido}</div>`;
  }

  /* ------------------- DATOS DE UN PARTIDO ---------------- */

  /**
   * Resuelve los dos equipos de un partido.
   * En el listado vienen como `home_id`/`away_id` (solo el código) y hay
   * que cruzarlos con el índice de equipos; en el detalle vienen completos.
   */
  function equiposDelPartido(p) {
    const local =
      pick(p, 'home_team', 'homeTeam') ||
      equipoPorId(pick(p, 'home_id', 'homeId')) ||
      { id: pick(p, 'home_id', 'homeId'), name: pick(p, 'home_id', 'homeId') };

    const visita =
      pick(p, 'away_team', 'awayTeam') ||
      equipoPorId(pick(p, 'away_id', 'awayId')) ||
      { id: pick(p, 'away_id', 'awayId'), name: pick(p, 'away_id', 'awayId') };

    return [local, visita];
  }

  /** El marcador viene como objeto: { total, period1, period2, ... } */
  function golesDe(p, lado) {
    const marcador = pick(p, `${lado}_score`, `${lado}Score`);
    if (marcador && typeof marcador === 'object') return marcador.total;
    return marcador;
  }

  /** La API entrega `date` y `time` por separado */
  function fechaHoraDe(p) {
    const d = pick(p, 'date', 'matchDate');
    if (!d) return null;
    const t = pick(p, 'time') || '00:00:00';
    return `${d}T${t}`;
  }

  /** La ciudad llega como `city_id` en el listado y como objeto en el detalle */
  function ciudadDelPartido(p) {
    const obj = pick(p, 'city');
    if (obj && typeof obj === 'object') return obj;
    return ciudadPorId(pick(p, 'city_id', 'cityId'));
  }

  /* ------------------- ESTADO DEL PARTIDO ----------------- */

  function estadoPartido(partido) {
    const bruto = String(pick(partido, 'status', 'estado') || '').toLowerCase();

    if (['live', 'in progress', 'inprogress', 'playing', '1st half', '2nd half', 'half time']
        .some((s) => bruto.includes(s)))
      return { clase: 'estado-envivo', texto: 'En vivo', jugado: true };

    // La API devuelve "Ended" para los partidos ya disputados
    if (['ended', 'finished', 'ft', 'played', 'completed', 'finalizado', 'after et', 'after pen']
        .some((s) => bruto.includes(s)))
      return { clase: 'estado-final', texto: 'Finalizado', jugado: true };

    return { clase: 'estado-prox', texto: 'Próximo', jugado: false };
  }

  /** Traduce el número de ronda a un nombre legible */
  function nombreRonda(p) {
    const ronda = Number(pick(p, 'round', 'stage'));
    const grupo = pick(p, 'group');
    if (!Number.isFinite(ronda)) return pick(p, 'round', 'stage') || '';
    if (ronda <= CONFIG.ULTIMA_RONDA_GRUPOS) {
      return grupo ? `Fase de grupos · Jornada ${ronda}` : `Jornada ${ronda}`;
    }
    const eliminatorias = {
      4: 'Dieciseisavos de final',
      5: 'Octavos de final',
      6: 'Cuartos de final',
      7: 'Semifinales',
      8: 'Tercer lugar',
      9: 'Final'
    };
    return eliminatorias[ronda] || `Ronda ${ronda}`;
  }

  /* ------------------- TARJETA DE PARTIDO ----------------- */

  function tarjetaPartido(p, columnas = 'col-12 col-sm-6 col-lg-3') {
    const id = pick(p, 'id', '_id', 'matchId');
    const [local, visita] = equiposDelPartido(p);
    const golesL = golesDe(p, 'home');
    const golesV = golesDe(p, 'away');
    const cuando = fechaHoraDe(p);
    const hora = (pick(p, 'time') || '').slice(0, 5);
    const ciudad = ciudadDelPartido(p);
    const nombreCiudad = ciudad ? pick(ciudad, 'name') : '';
    const estado = estadoPartido(p);

    const marcador = (v) =>
      estado.jugado && v !== undefined && v !== null ? esc(v) : '';

    const fila = (equipo, goles) => `
      <div class="partido-equipo">
        <span class="nombre">${esc(nombreEquipo(equipo))}</span>
        ${bandera(equipo)}
        <span class="marcador">${marcador(goles)}</span>
      </div>`;

    return `
    <div class="${columnas}">
      <a class="partido-card" href="${RUTAS.partido}?id=${encodeURIComponent(id)}">
        <div class="partido-meta">
          <span><i class="bi bi-calendar3 me-1"></i>${fecha(cuando)}${hora ? ` · ${esc(hora)}` : ''}</span>
          ${nombreCiudad
            ? `<span class="text-truncate"><i class="bi bi-geo-alt me-1"></i>${esc(nombreCiudad)}</span>`
            : `<span class="estado-pill ${estado.clase}">${estado.texto}</span>`}
        </div>
        ${fila(local, golesL)}
        ${fila(visita, golesV)}
      </a>
    </div>`;
  }

  /* ------------------- TARJETA DE NOTICIA -----------------
     La API entrega: title, preview_text, image_url, published_date, url
     -------------------------------------------------------- */

  function tarjetaNoticia(n, columnas = 'col-12 col-md-6 col-lg-4') {
    const titulo = pick(n, 'title', 'titulo') || 'Sin título';
    const resumen = pick(n, 'preview_text', 'summary', 'description') || '';
    const imagen = pick(n, 'image_url', 'image', 'imageUrl');
    const cuando = pick(n, 'published_date', 'date', 'publishedAt');
    const enlace = pick(n, 'url', 'link');

    const cuerpo = `
      <div class="position-relative">
        ${img(imagen, titulo, 'card-img-wc')}
        <span class="badge-noticia">Noticia</span>
      </div>
      <div class="card-body p-3 d-flex flex-column">
        <small class="text-muted-wc mb-2" style="font-size:.8rem">${fecha(cuando)}</small>
        <h3 class="card-title mb-2">${esc(titulo)}</h3>
        <p class="mb-0" style="font-size:.86rem">
          ${esc(resumen).slice(0, 130)}${resumen.length > 130 ? '…' : ''}
        </p>
      </div>`;

    // Las noticias apuntan al artículo original en fifa.com
    return `
    <div class="${columnas}">
      ${enlace
        ? `<a class="card-wc h-100 d-flex flex-column text-decoration-none"
              style="color:inherit" href="${esc(enlace)}"
              target="_blank" rel="noopener noreferrer">${cuerpo}</a>`
        : `<article class="card-wc h-100 d-flex flex-column">${cuerpo}</article>`}
    </div>`;
  }

  /* -------------- TARJETA DE EQUIPO (compacta) ------------ */

  function tarjetaEquipoMini(e, columnas = 'col-4 col-md-3 col-lg-2') {
    const id = pick(e, 'id', 'teamId');
    const conf = pick(e, 'confederation', 'confederationName') || '';

    return `
    <div class="${columnas}">
      <a class="equipo-mini" href="${RUTAS.equipo}?id=${encodeURIComponent(id)}">
        <div class="bandera">${bandera(e, 'bandera-mini-grande')}</div>
        <div class="nombre">${esc(nombreEquipo(e))}</div>
        <div class="conf">${esc(conf)}</div>
      </a>
    </div>`;
  }

  /* ------------- TARJETA DE EQUIPO (completa) ------------- */

  function tarjetaEquipo(e, columnas = 'col-6 col-md-4 col-lg-3') {
    const id = pick(e, 'id', 'teamId');
    const grupo = pick(e, 'group', 'groupName') ?? '—';
    const ranking = pick(e, 'world_ranking', 'fifaRanking', 'ranking', 'rank') ?? '—';
    const conf = pick(e, 'confederation', 'confederationName') || '';
    const parts = pick(e, 'appearances', 'participations') ?? '—';
    const anfitrion = pick(e, 'host') === true;

    return `
    <div class="${columnas}">
      <a class="equipo-card" href="${RUTAS.equipo}?id=${encodeURIComponent(id)}">
        ${conf ? `<span class="conf-badge">${esc(conf)}</span>` : ''}
        ${banderaCirculo(e)}
        <h3>${esc(nombreEquipo(e))}
          ${anfitrion ? '<span class="badge-anfitrion">Anfitrión</span>' : ''}
        </h3>
        <div class="equipo-stats">
          <div>
            <i class="bi bi-record-circle"></i>
            <span class="et">Grupo</span>
            <span class="vl">${esc(grupo)}</span>
          </div>
          <div>
            <i class="bi bi-hash"></i>
            <span class="et">Ranking</span>
            <span class="vl">#${esc(ranking)}</span>
          </div>
          <div>
            <i class="bi bi-award"></i>
            <span class="et">Mundiales</span>
            <span class="vl">${esc(parts)}</span>
          </div>
        </div>
      </a>
    </div>`;
  }

  /* ------------------- TARJETA DE CIUDAD ------------------ */

  function tarjetaCiudad(c, columnas = 'col-6 col-lg-3') {
    const id = pick(c, 'id', 'cityId');
    const nombre = pick(c, 'name', 'city') || 'Ciudad';
    const pais = pick(c, 'country', 'countryName') || '';
    const imagen = pick(c, 'image_url', 'image', 'imageUrl');

    return `
    <div class="${columnas}">
      <a class="ciudad-card" href="${RUTAS.ciudad}?id=${encodeURIComponent(id)}">
        ${img(imagen, nombre, '')}
        <div class="ciudad-info">
          <h3>${esc(nombre)}</h3>
          <span>${esc(pais)}</span>
        </div>
      </a>
    </div>`;
  }

  /* ------------------- FILA DE EVENTO ---------------------
     La API entrega: id, title, description, url, image_url
     -------------------------------------------------------- */

  function filaEvento(ev) {
    const nombre = pick(ev, 'title', 'name') || 'Evento';
    const descripcion = pick(ev, 'description', 'descripcion') || '';
    const url = pick(ev, 'url', 'link');
    const imagen = pick(ev, 'image_url', 'image');

    return `
    <div class="card-wc mb-3">
      <div class="d-flex gap-3 p-3 align-items-center">
        ${imagen
          ? `<img src="${esc(imagen)}" alt="" loading="lazy"
                 style="width:88px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0">`
          : ''}
        <div class="flex-grow-1 overflow-hidden">
          <h4 class="h6 mb-1">${esc(nombre)}</h4>
          ${descripcion
            ? `<small class="text-muted-wc d-block">${esc(String(descripcion).slice(0, 120))}</small>`
            : ''}
        </div>
        ${url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer"
                   class="btn btn-fantasma btn-sm flex-shrink-0">
                   Ver más <i class="bi bi-box-arrow-up-right ms-1"></i></a>` : ''}
      </div>
    </div>`;
  }

  /* ------------------ TARJETA DE ARCHIVO ------------------
     En la API son "records": highlights en video del torneo.
     -------------------------------------------------------- */

  function tarjetaArchivo(a, columnas = 'col-6 col-lg-3') {
    const id = pick(a, 'id');
    const titulo = pick(a, 'title', 'name') || 'Video';
    const subtitulo = pick(a, 'subtitle') || '';
    const imagen = pick(a, 'thumbnail_url', 'image', 'thumbnail');

    return `
    <div class="${columnas}">
      <a class="card-wc h-100 d-block text-decoration-none" href="${RUTAS.archivo}?id=${encodeURIComponent(id)}">
        <div class="position-relative">
          ${img(imagen, titulo, 'card-img-wc')}
          <span class="position-absolute top-50 start-50 translate-middle
                       d-flex align-items-center justify-content-center"
                style="width:44px;height:44px;background:rgba(251,191,36,.95);border-radius:50%">
            <i class="bi bi-play-fill fs-4" style="color:var(--oscuro-900)"></i>
          </span>
        </div>
        <div class="p-3">
          <h3 class="card-title mb-0" style="font-size:.9rem">${esc(titulo)}</h3>
          ${subtitulo ? `<small class="text-muted-wc">${esc(subtitulo)}</small>` : ''}
        </div>
      </a>
    </div>`;
  }

  WC.bandera = bandera;
  WC.banderaCirculo = banderaCirculo;
  WC.emojiBandera = emojiBandera;
  WC.estadoPartido = estadoPartido;
  WC.nombreRonda = nombreRonda;
  WC.equiposDelPartido = equiposDelPartido;
  WC.golesDe = golesDe;
  WC.fechaHoraDe = fechaHoraDe;
  WC.ciudadDelPartido = ciudadDelPartido;
  WC.nombreEquipo = nombreEquipo;
  WC.filaEvento = filaEvento;
  WC.tarjetaArchivo = tarjetaArchivo;
  WC.tarjetaCiudad = tarjetaCiudad;
  WC.tarjetaEquipo = tarjetaEquipo;
  WC.tarjetaEquipoMini = tarjetaEquipoMini;
  WC.tarjetaNoticia = tarjetaNoticia;
  WC.tarjetaPartido = tarjetaPartido;
})();
