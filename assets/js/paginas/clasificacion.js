var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, CONFIG = WC.CONFIG, $ = WC.$,
      esc = WC.esc, pick = WC.pick, bandera = WC.bandera,
      montarFooter = WC.montarFooter, montarHeader = WC.montarHeader,
      skeletonFilas = WC.skeletonFilas, mensajeError = WC.mensajeError,
      mensajeVacio = WC.mensajeVacio, nombreEquipo = WC.nombreEquipo,
      golesDe = WC.golesDe, equiposDelPartido = WC.equiposDelPartido,
      equiposIndexados = WC.equiposIndexados;

  /* =========================================================
     PÁGINA: CLASIFICACIÓN Y LLAVES
     Requisito 5 del alcance.

     La API entrega la clasificación como un objeto con una clave
     por grupo ({ "A": [...], "B": [...] }), no como un arreglo.

     No existe endpoint de llaves de eliminación directa, así que
     se derivan del listado de partidos usando el número de ronda.
     ========================================================= */

  montarHeader(RUTAS.clasificacion);
  montarFooter();

  let GRUPOS = [];   // [{ grupo: 'A', tabla: [...] }, ...]

  /* ==================== FASE DE GRUPOS ===================== */

  function filaTabla(fila, indice) {
    const equipo = pick(fila, 'team') || {};
    const pos = pick(fila, 'position') ?? indice + 1;
    const v = (...claves) => pick(fila, ...claves) ?? 0;
    const dg = Number(v('goal_difference')) || 0;

    return `
      <tr>
        <td class="pos">${esc(pos)}</td>
        <td>
          <a href="${RUTAS.equipo}?id=${encodeURIComponent(pick(equipo, 'id') || '')}"
             class="d-flex align-items-center gap-2 text-decoration-none" style="color:inherit">
            ${bandera(equipo)}
            <span class="fw-medium">${esc(nombreEquipo(equipo))}</span>
          </a>
        </td>
        <td class="text-center pts">${esc(v('points'))}</td>
        <td class="text-center">${esc(v('matches', 'played'))}</td>
        <td class="text-center">${esc(v('wins', 'won'))}</td>
        <td class="text-center">${esc(v('draws', 'drawn'))}</td>
        <td class="text-center">${esc(v('loss', 'lost'))}</td>
        <td class="text-center">${esc(v('goals_scored', 'goalsFor'))}</td>
        <td class="text-center">${esc(v('goals_against', 'goalsAgainst'))}</td>
        <td class="text-center">${dg > 0 ? '+' : ''}${esc(dg)}</td>
      </tr>`;
  }

  function tarjetaGrupo(g) {
    return `
      <div class="col-12 col-xl-6">
        <div class="tabla-grupo">
          <div class="grupo-header">Grupo ${esc(g.grupo)}</div>
          <div class="table-responsive">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th style="width:2.5rem"></th>
                  <th>Selección</th>
                  <th class="text-center">PTS</th>
                  <th class="text-center">PJ</th>
                  <th class="text-center">G</th>
                  <th class="text-center">E</th>
                  <th class="text-center">P</th>
                  <th class="text-center">GF</th>
                  <th class="text-center">GC</th>
                  <th class="text-center">DG</th>
                </tr>
              </thead>
              <tbody>${g.tabla.map(filaTabla).join('')}</tbody>
            </table>
          </div>
          <div class="pie"><span class="punto"></span>Clasifican los dos primeros y los mejores terceros</div>
        </div>
      </div>`;
  }

  function pintarGrupos() {
    const seleccion = $('#filtroGrupo')?.value ?? '';
    const visibles = seleccion ? GRUPOS.filter((g) => g.grupo === seleccion) : GRUPOS;

    $('#listaGrupos').innerHTML = visibles.length
      ? visibles.map(tarjetaGrupo).join('')
      : mensajeVacio('No hay tablas disponibles para ese grupo.');
  }

  /* =========== TABLAS CALCULADAS DESDE LOS PARTIDOS ========
     La API expone /v1/standings, pero mientras el torneo está en
     curso puede devolver los grupos vacíos. En ese caso calculamos
     la tabla con los partidos ya disputados, aplicando el criterio
     habitual de la FIFA: puntos, diferencia de goles y goles a favor.
     ========================================================= */

  function calcularDesdePartidos(partidos, equipos) {
    const porGrupo = new Map();

    // Inicializamos una fila por equipo, dentro de su grupo
    equipos.forEach((e) => {
      const g = pick(e, 'group');
      if (!g) return;
      if (!porGrupo.has(g)) porGrupo.set(g, new Map());
      porGrupo.get(g).set(String(pick(e, 'id')), {
        team: e, matches: 0, wins: 0, draws: 0, loss: 0,
        goals_scored: 0, goals_against: 0, goal_difference: 0, points: 0
      });
    });

    partidos.forEach((p) => {
      const grupo = pick(p, 'group');
      if (!grupo || !porGrupo.has(grupo)) return;
      if (!String(pick(p, 'status') || '').toLowerCase().includes('ended')) return;

      const tabla = porGrupo.get(grupo);
      const filaL = tabla.get(String(pick(p, 'home_id')));
      const filaV = tabla.get(String(pick(p, 'away_id')));
      if (!filaL || !filaV) return;

      const gl = Number(golesDe(p, 'home')) || 0;
      const gv = Number(golesDe(p, 'away')) || 0;

      filaL.matches++; filaV.matches++;
      filaL.goals_scored += gl; filaL.goals_against += gv;
      filaV.goals_scored += gv; filaV.goals_against += gl;

      if (gl > gv) { filaL.wins++; filaL.points += 3; filaV.loss++; }
      else if (gv > gl) { filaV.wins++; filaV.points += 3; filaL.loss++; }
      else { filaL.draws++; filaV.draws++; filaL.points++; filaV.points++; }
    });

    return [...porGrupo.entries()]
      .map(([grupo, tabla]) => {
        const filas = [...tabla.values()];
        filas.forEach((f) => { f.goal_difference = f.goals_scored - f.goals_against; });
        filas.sort(
          (a, b) =>
            b.points - a.points ||
            b.goal_difference - a.goal_difference ||
            b.goals_scored - a.goals_scored ||
            String(pick(a.team, 'name')).localeCompare(String(pick(b.team, 'name')), 'es')
        );
        filas.forEach((f, i) => { f.position = i + 1; });
        return { grupo, tabla: filas, calculada: true };
      })
      .sort((a, b) => a.grupo.localeCompare(b.grupo));
  }

  /* ================ ELIMINACIÓN DIRECTA ===================
     Se construye a partir de los partidos cuya ronda es mayor
     que la última de la fase de grupos.
     ======================================================== */

  const NOMBRES_RONDA = {
    4: 'Dieciseisavos',
    5: 'Octavos',
    6: 'Cuartos',
    7: 'Semifinales',
    8: 'Tercer lugar',
    9: 'Final'
  };

  function llaveHTML(m, esFinal) {
    const [local, visita] = equiposDelPartido(m);
    const gl = golesDe(m, 'home');
    const gv = golesDe(m, 'away');
    const penL = pick(m, 'home_score.penalty');
    const penV = pick(m, 'away_score.penalty');
    const hayPenales = Number(penL) > 0 || Number(penV) > 0;

    const jugado = String(pick(m, 'status') || '').toLowerCase().includes('ended');
    const val = (g) => (jugado && g !== null && g !== undefined ? esc(g) : '');

    const ganaLocal = jugado && (Number(gl) > Number(gv) ||
      (Number(gl) === Number(gv) && Number(penL) > Number(penV)));
    const ganaVisita = jugado && (Number(gv) > Number(gl) ||
      (Number(gl) === Number(gv) && Number(penV) > Number(penL)));

    const fila = (equipo, goles, pen, gana) => `
      <div class="${gana ? 'ganador' : ''}">
        <span class="d-flex align-items-center gap-2">
          ${bandera(equipo)}${esc(nombreEquipo(equipo))}
        </span>
        <span>${val(goles)}${hayPenales && jugado ? ` (${esc(pen || 0)})` : ''}</span>
      </div>`;

    return `
      <a class="bracket-llave d-block text-decoration-none${esFinal ? ' bracket-final' : ''}"
         style="color:inherit" href="${RUTAS.partido}?id=${encodeURIComponent(pick(m, 'id'))}">
        ${fila(local, gl, penL, ganaLocal)}
        ${fila(visita, gv, penV, ganaVisita)}
      </a>`;
  }

  function pintarLlaves(partidos) {
    const cont = $('#bracket');

    const eliminatorias = partidos.filter(
      (p) => Number(pick(p, 'round')) > CONFIG.ULTIMA_RONDA_GRUPOS
    );

    if (!eliminatorias.length) {
      cont.innerHTML = mensajeVacio(
        'Las llaves de la fase de eliminación aún no están definidas. ' +
        'Se generarán automáticamente cuando finalice la fase de grupos.',
        'bi-diagram-3'
      );
      return;
    }

    const porRonda = new Map();
    eliminatorias.forEach((p) => {
      const r = Number(pick(p, 'round'));
      if (!porRonda.has(r)) porRonda.set(r, []);
      porRonda.get(r).push(p);
    });

    cont.innerHTML = [...porRonda.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([ronda, lista]) => {
        const esFinal = ronda === 9;
        return `
          <div class="bracket-ronda">
            <h4>${esc(NOMBRES_RONDA[ronda] || `Ronda ${ronda}`)}</h4>
            ${lista.map((m) => llaveHTML(m, esFinal)).join('')}
          </div>`;
      })
      .join('');
  }

  /* ======================= PESTAÑAS ======================== */

  function activarPestana(cual) {
    const esGrupos = cual === 'grupos';
    $('#tabGrupos')?.classList.toggle('activo', esGrupos);
    $('#tabLlaves')?.classList.toggle('activo', !esGrupos);
    $('#vistaGrupos').hidden = !esGrupos;
    $('#vistaLlaves').hidden = esGrupos;
  }

  $('#tabGrupos')?.addEventListener('click', () => activarPestana('grupos'));
  $('#tabLlaves')?.addEventListener('click', () => activarPestana('llaves'));
  $('#filtroGrupo')?.addEventListener('change', pintarGrupos);

  /* ========================= CARGA ========================= */

  async function iniciar() {
    $('#listaGrupos').innerHTML = skeletonFilas(4);

    await equiposIndexados();

    const [clasif, partidos] = await Promise.allSettled([
      API.clasificacion(),
      API.partidos()
    ]);

    if (clasif.status === 'fulfilled' && clasif.value && typeof clasif.value === 'object') {
      // La API devuelve { "A": [...], "B": [...] }
      GRUPOS = Object.entries(clasif.value)
        .filter(([, tabla]) => Array.isArray(tabla))
        .map(([grupo, tabla]) => ({ grupo, tabla }))
        .sort((a, b) => a.grupo.localeCompare(b.grupo));

      // Si la API aún no ha poblado las tablas, las calculamos nosotros
      const vacias = GRUPOS.every((g) => !g.tabla.length);
      if (vacias && partidos.status === 'fulfilled' && Array.isArray(partidos.value)) {
        try {
          const equipos = await API.equipos();
          GRUPOS = calcularDesdePartidos(partidos.value, Array.isArray(equipos) ? equipos : []);
          const aviso = $('#avisoCalculada');
          if (aviso) aviso.hidden = false;
        } catch { /* nos quedamos con las tablas vacías */ }
      }

      const select = $('#filtroGrupo');
      if (select) {
        GRUPOS.forEach((g) => {
          const op = document.createElement('option');
          op.value = g.grupo;
          op.textContent = `Grupo ${g.grupo}`;
          select.appendChild(op);
        });
      }
      pintarGrupos();
    } else {
      $('#listaGrupos').innerHTML = mensajeError('No se pudieron cargar las tablas de posiciones.');
    }

    if (partidos.status === 'fulfilled' && Array.isArray(partidos.value)) {
      pintarLlaves(partidos.value);
    } else {
      $('#bracket').innerHTML = mensajeError('No se pudieron cargar las llaves.');
    }
  }

  iniciar();
})();
