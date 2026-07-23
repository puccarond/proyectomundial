var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, $ = WC.$, esc = WC.esc, pick = WC.pick,
      paramURL = WC.paramURL, skeletonFilas = WC.skeletonFilas,
      mensajeError = WC.mensajeError, montarFooter = WC.montarFooter,
      montarHeader = WC.montarHeader, banderaCirculo = WC.banderaCirculo,
      tarjetaPartido = WC.tarjetaPartido, nombreEquipo = WC.nombreEquipo,
      equiposIndexados = WC.equiposIndexados, ciudadesIndexadas = WC.ciudadesIndexadas;

  /* =========================================================
     PÁGINA: DETALLE DEL EQUIPO
     Requisito 7 del alcance: nombre, bandera, confederación,
     DT, jugadores convocados, grupo, ranking FIFA y número de
     participaciones en el Mundial.

     /v1/teams/{id} devuelve el equipo con su plantilla completa.
     ========================================================= */

  montarHeader(RUTAS.equipos);
  montarFooter();

  const ID = paramURL('id');

  /* ------------------ AGRUPAR PLANTILLA ------------------- */

  const ORDEN_POSICIONES = ['Arquero', 'Defensor', 'Mediocampista', 'Delantero'];

  function normalizaPosicion(pos) {
    const p = String(pos || '').toLowerCase();
    if (/arquero|portero|goalkeeper|gk/.test(p)) return 'Arquero';
    if (/defen|back|df/.test(p)) return 'Defensor';
    if (/medio|midfield|mf|volante/.test(p)) return 'Mediocampista';
    if (/delant|forward|fw|atacante/.test(p)) return 'Delantero';
    return 'Otros';
  }

  function plantillaHTML(jugadores) {
    if (!Array.isArray(jugadores) || !jugadores.length) {
      return `<p class="text-muted-wc mb-0">La lista de convocados aún no está disponible.</p>`;
    }

    const grupos = new Map();
    jugadores.forEach((j) => {
      const pos = normalizaPosicion(pick(j, 'position'));
      if (!grupos.has(pos)) grupos.set(pos, []);
      grupos.get(pos).push(j);
    });

    const ordenadas = [...grupos.entries()].sort(
      (a, b) =>
        (ORDEN_POSICIONES.indexOf(a[0]) + 1 || 99) -
        (ORDEN_POSICIONES.indexOf(b[0]) + 1 || 99)
    );

    return ordenadas
      .map(([posicion, lista]) => `
        <h3 class="h6 text-muted-wc text-uppercase mt-4 mb-2"
            style="letter-spacing:.07em;font-size:.75rem">${esc(posicion)}</h3>
        <div class="row g-2">
          ${lista
            .sort((a, b) => (pick(a, 'number') ?? 99) - (pick(b, 'number') ?? 99))
            .map((j) => {
              const dorsal = pick(j, 'number') ?? '';
              const nombre = pick(j, 'name') || '';
              const foto = pick(j, 'photo_url');
              return `
                <div class="col-6 col-md-4">
                  <div class="d-flex align-items-center gap-2 py-1">
                    ${foto
                      ? `<img src="${esc(foto)}" alt="" loading="lazy"
                             style="width:34px;height:34px;border-radius:50%;object-fit:cover;
                                    background:var(--fondo-alt);flex-shrink:0">`
                      : `<span class="badge-wc" style="min-width:2rem;text-align:center">${esc(dorsal)}</span>`}
                    <span style="font-size:.88rem;line-height:1.2">
                      ${esc(nombre)}
                      ${foto ? `<small class="text-muted-wc d-block">#${esc(dorsal)}</small>` : ''}
                    </span>
                  </div>
                </div>`;
            })
            .join('')}
        </div>`)
      .join('');
  }

  /* ------------------------ CARGA ------------------------- */

  async function iniciar() {
    const cont = $('#detalleEquipo');

    if (!ID) {
      cont.innerHTML = mensajeError('No se indicó qué equipo mostrar.');
      return;
    }

    cont.innerHTML = skeletonFilas(6);

    try {
      const equipo = await API.equipo(ID);

      if (!equipo || Array.isArray(equipo)) {
        cont.innerHTML = mensajeError('No se encontró el equipo solicitado.');
        return;
      }

      const nombre = nombreEquipo(equipo);
      const conf = pick(equipo, 'confederation') || '—';
      const grupo = pick(equipo, 'group') ?? '—';
      const ranking = pick(equipo, 'world_ranking', 'ranking') ?? '—';
      const parts = pick(equipo, 'appearances') ?? '—';
      const anfitrion = pick(equipo, 'host') === true;
      const jugadores = pick(equipo, 'players') || [];

      document.title = `${nombre} | Mundial FIFA 2026`;
      const miga = $('#migaActual');
      if (miga) miga.textContent = nombre;

      cont.innerHTML = `
        <div class="row g-4">

          <div class="col-lg-4">
            <div class="card-wc p-4 text-center">
              ${banderaCirculo(equipo)}
              <h1 class="h3 mt-2 mb-1">${esc(nombre)}</h1>
              <p class="text-muted-wc mb-2">${esc(conf)}</p>
              ${anfitrion
                ? '<span class="badge-anfitrion mb-2 d-inline-block">País anfitrión</span>'
                : ''}

              <div class="equipo-stats mt-3">
                <div>
                  <i class="bi bi-record-circle"></i>
                  <span class="et">Grupo</span><span class="vl">${esc(grupo)}</span>
                </div>
                <div>
                  <i class="bi bi-hash"></i>
                  <span class="et">Ranking</span><span class="vl">#${esc(ranking)}</span>
                </div>
                <div>
                  <i class="bi bi-award"></i>
                  <span class="et">Mundiales</span><span class="vl">${esc(parts)}</span>
                </div>
              </div>

              <hr class="my-4">
              <small class="text-muted-wc text-uppercase d-block"
                     style="font-size:.7rem;letter-spacing:.07em">Jugadores convocados</small>
              <div class="fw-semibold">${jugadores.length}</div>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="card-wc p-4">
              <h2 class="h5 mb-0">Jugadores convocados</h2>
              <hr>
              ${plantillaHTML(jugadores)}
            </div>
          </div>

          <div class="col-12">
            <div class="seccion-titulo mt-3">
              <h2 class="h4">Partidos de ${esc(nombre)}</h2>
            </div>
            <div class="row g-3" id="partidosEquipo"></div>
          </div>

        </div>`;

      pintarPartidos(String(pick(equipo, 'id')));
    } catch {
      cont.innerHTML = mensajeError('No se pudo cargar la información del equipo.');
    }
  }

  /* Partidos en los que participa el equipo */
  async function pintarPartidos(idEquipo) {
    const cont = $('#partidosEquipo');
    if (!cont) return;

    try {
      await Promise.all([equiposIndexados(), ciudadesIndexadas()]);
      const todos = await API.partidos();

      const suyos = (Array.isArray(todos) ? todos : []).filter(
        (p) =>
          String(pick(p, 'home_id')) === idEquipo ||
          String(pick(p, 'away_id')) === idEquipo
      );

      cont.innerHTML = suyos.length
        ? suyos.map((p) => tarjetaPartido(p, 'col-12 col-md-6 col-xl-4')).join('')
        : `<div class="col-12"><p class="text-muted-wc">
             Todavía no hay partidos registrados para esta selección.</p></div>`;
    } catch {
      cont.innerHTML = '';
    }
  }

  iniciar();
})();
