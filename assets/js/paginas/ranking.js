var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var $ = WC.$, API = WC.API, RUTAS = WC.RUTAS, bandera = WC.bandera, esc = WC.esc, mensajeError = WC.mensajeError, mensajeVacio = WC.mensajeVacio, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader, pick = WC.pick, skeletonFilas = WC.skeletonFilas;

  /* =========================================================
     PÁGINA: RANKING FIFA
     Requisito 15 del alcance.
     ========================================================= */

  montarHeader(RUTAS.ranking);
  montarFooter();

  let RANKING = [];

  const equipoDe = (r) => pick(r, 'team', 'equipo') || r;
  const nombreDe = (r) => pick(equipoDe(r), 'name', 'teamName') || '';
  const confDe = (r) =>
    pick(r, 'confederation', 'confederationName') ||
    pick(equipoDe(r), 'confederation', 'confederationName') || '';

  function normalizar(t) {
    return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /** Flecha de variación respecto a la medición anterior */
  function variacion(r) {
    const actual = Number(pick(r, 'rank', 'position', 'pos'));
    const previa = Number(pick(r, 'previous_rank', 'previousRank', 'prev'));
    if (!Number.isFinite(actual) || !Number.isFinite(previa)) return '<span class="text-muted-wc">—</span>';

    const dif = previa - actual;
    if (dif === 0) return '<span class="text-muted-wc">—</span>';
    if (dif > 0)
      return `<span style="color:var(--verde-600)"><i class="bi bi-caret-up-fill"></i>${dif}</span>`;
    return `<span style="color:var(--rojo)"><i class="bi bi-caret-down-fill"></i>${Math.abs(dif)}</span>`;
  }

  function pintar() {
    const busqueda = normalizar($('#buscadorRanking')?.value ?? '').trim();
    const conf = $('#filtroConfRanking')?.value ?? '';

    const filas = RANKING.filter((r) => {
      if (conf && confDe(r) !== conf) return false;
      if (busqueda && !normalizar(nombreDe(r)).includes(busqueda)) return false;
      return true;
    });

    const cont = $('#tablaRanking');

    if (!filas.length) {
      cont.innerHTML = mensajeVacio('Ninguna selección coincide con la búsqueda.', 'bi-search');
      return;
    }

    cont.innerHTML = `
      <div class="table-responsive">
        <table class="table mb-0 tabla-grupo">
          <thead>
            <tr>
              <th style="width:4rem" class="text-center">Pos.</th>
              <th>Selección</th>
              <th>Confederación</th>
              <th class="text-center">Puntos</th>
              <th class="text-center" style="width:5rem">Var.</th>
            </tr>
          </thead>
          <tbody>
            ${filas
              .sort(
                (a, b) =>
                  (pick(a, 'rank', 'position', 'pos') ?? 999) -
                  (pick(b, 'rank', 'position', 'pos') ?? 999)
              )
              .map((r) => {
                const pos = pick(r, 'rank', 'position', 'pos') ?? '—';
                const equipo = equipoDe(r);
                const id = pick(equipo, 'id', '_id', 'teamId');
                const puntos = pick(r, 'points', 'puntos', 'score');
                const pts = typeof puntos === 'number' ? puntos.toFixed(2) : puntos;
                const destacado = Number(pos) <= 3 ? 'style="color:var(--oro-fuerte)"' : '';

                return `
                  <tr>
                    <td class="text-center fw-bold" ${destacado}>${esc(pos)}</td>
                    <td>
                      <a href="${RUTAS.equipo}?id=${encodeURIComponent(id)}"
                         class="d-flex align-items-center gap-2 text-decoration-none"
                         style="color:inherit">
                        ${bandera(equipo)}
                        <span class="fw-medium">${esc(nombreDe(r))}</span>
                      </a>
                    </td>
                    <td class="text-muted-wc" style="font-size:.85rem">${esc(confDe(r))}</td>
                    <td class="text-center fw-semibold">${esc(pts ?? '—')}</td>
                    <td class="text-center" style="font-size:.85rem">${variacion(r)}</td>
                  </tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </div>`;
  }

  async function iniciar() {
    $('#tablaRanking').innerHTML = skeletonFilas(10);

    try {
      const datos = await API.ranking();
      RANKING = Array.isArray(datos) ? datos : [];

      const select = $('#filtroConfRanking');
      if (select) {
        [...new Set(RANKING.map(confDe).filter(Boolean))].sort().forEach((c) => {
          const op = document.createElement('option');
          op.value = c;
          op.textContent = c;
          select.appendChild(op);
        });
      }

      pintar();
    } catch {
      $('#tablaRanking').innerHTML = mensajeError('No se pudo cargar el Ranking FIFA.');
    }
  }

  $('#buscadorRanking')?.addEventListener('input', pintar);
  $('#filtroConfRanking')?.addEventListener('change', pintar);

  iniciar();

})();
