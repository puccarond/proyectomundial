var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, $ = WC.$, esc = WC.esc, pick = WC.pick,
      img = WC.img, fecha = WC.fecha, paramURL = WC.paramURL,
      cuentaRegresiva = WC.cuentaRegresiva, mensajeError = WC.mensajeError,
      mensajeVacio = WC.mensajeVacio, montarFooter = WC.montarFooter,
      montarHeader = WC.montarHeader, estadoPartido = WC.estadoPartido,
      nombreRonda = WC.nombreRonda, golesDe = WC.golesDe,
      fechaHoraDe = WC.fechaHoraDe, nombreEquipo = WC.nombreEquipo;

  /* =========================================================
     PÁGINA: DETALLE DE UN PARTIDO
     Requisito 4 del alcance: resultado, equipos, fecha, hora,
     ciudad y estadio, árbitro, ronda, highlights, estadísticas,
     alineaciones sobre la cancha, cronología y cuenta regresiva
     si el partido aún no se ha jugado.

     Requisito 19: si un equipo no tiene 11 titulares, se muestra
     un aviso sobre el contenedor de la cancha.
     ========================================================= */

  montarHeader(RUTAS.partidos);
  montarFooter();

  const ID = paramURL('id');

  /* =========================================================
     1. MARCADOR PRINCIPAL
     ========================================================= */

  function pintarMarcador(p) {
    const local = pick(p, 'home_team', 'homeTeam') || {};
    const visita = pick(p, 'away_team', 'awayTeam') || {};
    const golesL = golesDe(p, 'home');
    const golesV = golesDe(p, 'away');
    const cuando = fechaHoraDe(p);
    const hora = (pick(p, 'time') || '').slice(0, 5);
    const arbitro = pick(p, 'referee') || '';
    const estado = estadoPartido(p);

    const ciudad = pick(p, 'city') || {};
    const estadio = pick(ciudad, 'stadium') || {};
    const sede = [pick(estadio, 'name'), pick(ciudad, 'name')].filter(Boolean).join(', ');

    const escudo = (equipo) => {
      const url = pick(equipo, 'flag_uri', 'flag_url');
      const codigo = pick(equipo, 'id') || '';
      return `<div class="equipo-escudo">
        ${url ? img(url, nombreEquipo(equipo), '') : `<strong class="text-verde">${esc(codigo)}</strong>`}
      </div>`;
    };

    // Si hubo penales, los mostramos junto al marcador
    const penales = () => {
      const pl = pick(p, 'home_score.penalty');
      const pv = pick(p, 'away_score.penalty');
      return pl || pv ? `<div class="small mt-2" style="color:var(--oro)">
        Penales: ${esc(pl || 0)} - ${esc(pv || 0)}</div>` : '';
    };

    const centro = estado.jugado
      ? `<div class="marcador-caja"><span>${esc(golesL ?? 0)} - ${esc(golesV ?? 0)}</span></div>${penales()}`
      : `<div id="countdownPartido"></div>`;

    $('#marcador').innerHTML = `
      <div class="marcador-hero">
        <p class="etiqueta-estado mb-4">${estado.texto}</p>

        <div class="row align-items-center g-3">
          <div class="col-4">
            ${escudo(local)}
            <div class="equipo-nombre">${esc(nombreEquipo(local))}</div>
          </div>
          <div class="col-4">${centro}</div>
          <div class="col-4">
            ${escudo(visita)}
            <div class="equipo-nombre">${esc(nombreEquipo(visita))}</div>
          </div>
        </div>

        <div class="marcador-info">
          <span><i class="bi bi-clock me-2"></i>${fecha(cuando)}${hora ? ` · ${esc(hora)}` : ''}</span>
          ${sede ? `<span><i class="bi bi-geo-alt me-2"></i>${esc(sede)}</span>` : ''}
          ${arbitro ? `<span><i class="bi bi-flag me-2"></i>Árbitro: ${esc(arbitro)}</span>` : ''}
        </div>
      </div>`;

    if (!estado.jugado && cuando) {
      cuentaRegresiva('#countdownPartido', cuando, () => location.reload());
    }
  }

  /* =========================================================
     2. ALINEACIONES SOBRE LA CANCHA
     Visitante en la mitad superior, local en la inferior.
     ========================================================= */

  function lineasDeFormacion(formacion, totalJugadores) {
    const partes = String(formacion || '')
      .split(/[-\s]+/)
      .map(Number)
      .filter((n) => Number.isInteger(n) && n > 0);

    if (partes.length && partes.reduce((a, b) => a + b, 0) === totalJugadores - 1) {
      return [1, ...partes];
    }
    const campo = Math.max(totalJugadores - 1, 0);
    const base = Math.floor(campo / 3);
    const resto = campo % 3;
    return [1, base + (resto > 0 ? 1 : 0), base + (resto > 1 ? 1 : 0), base];
  }

  function posiciones(jugadores, formacion, esLocal) {
    const lineas = lineasDeFormacion(formacion, jugadores.length);
    const salida = [];
    let indice = 0;

    lineas.forEach((cantidad, nLinea) => {
      const avance = lineas.length > 1 ? nLinea / (lineas.length - 1) : 0;
      const profundidad = 4 + avance * 40;
      const y = esLocal ? 100 - profundidad : profundidad;

      for (let i = 0; i < cantidad && indice < jugadores.length; i++, indice++) {
        const x = ((i + 1) / (cantidad + 1)) * 100;
        salida.push({ jugador: jugadores[indice], x, y });
      }
    });

    return salida;
  }

  /** Deja solo el apellido para que quepa bajo el dorsal */
  function nombreCorto(nombre) {
    const limpio = String(nombre || '').trim();
    const partes = limpio.split(/\s+/);
    return partes.length > 1 ? partes[partes.length - 1] : limpio;
  }

  function pintarJugador({ jugador, x, y }) {
    const dorsal = pick(jugador, 'number') ?? '';
    const nom = nombreCorto(pick(jugador, 'name'));
    return `
      <div class="jugador-cancha" style="left:${x}%;top:${y}%">
        <div class="dorsal">${esc(dorsal)}</div>
        <span class="apellido">${esc(nom)}</span>
      </div>`;
  }

  function pintarAlineaciones(p) {
    const cont = $('#alineaciones');
    const alineaciones = pick(p, 'line_ups', 'lineups') || {};

    const local = pick(p, 'home_team', 'homeTeam') || {};
    const visita = pick(p, 'away_team', 'awayTeam') || {};

    const alLocal = pick(alineaciones, 'home') || {};
    const alVisita = pick(alineaciones, 'away') || {};

    const titulares = (al) => {
      const l = pick(al, 'starting_players', 'starters', 'startingXI');
      return Array.isArray(l) ? l : [];
    };

    const titLocal = titulares(alLocal);
    const titVisita = titulares(alVisita);

    if (!titLocal.length && !titVisita.length) {
      cont.innerHTML = mensajeVacio(
        'Las alineaciones de este partido aún no están disponibles.',
        'bi-people'
      );
      return;
    }

    // Requisito 19: aviso cuando un equipo no tiene los 11 titulares
    const incompletos = [
      titLocal.length < 11 ? nombreEquipo(local) : null,
      titVisita.length < 11 ? nombreEquipo(visita) : null
    ].filter(Boolean);

    const aviso = incompletos.length
      ? `<div class="aviso-alineacion mb-3">
           <i class="bi bi-exclamation-triangle" style="color:var(--oro-fuerte);font-size:1.1rem"></i>
           <div>
             <strong>Alineación no disponible</strong>
             <p>La alineación oficial de ${esc(incompletos.join(' y '))}
                aún no ha sido confirmada (menos de 11 jugadores).</p>
           </div>
         </div>`
      : '';

    const marcasVisita = posiciones(titVisita, pick(alVisita, 'formation'), false)
      .map(pintarJugador).join('');
    const marcasLocal = posiciones(titLocal, pick(alLocal, 'formation'), true)
      .map(pintarJugador).join('');

    const dtLocal = pick(alLocal, 'coach') || '—';
    const dtVisita = pick(alVisita, 'coach') || '—';
    const formLocal = pick(alLocal, 'formation') || '';
    const formVisita = pick(alVisita, 'formation') || '';

    cont.innerHTML = `
      ${aviso}

      <div class="d-flex justify-content-between align-items-center mb-2 small text-muted-wc">
        <span>${esc(nombreEquipo(visita))}${formVisita ? ` · ${esc(formVisita)}` : ''}</span>
        <span>${esc(nombreEquipo(local))}${formLocal ? ` · ${esc(formLocal)}` : ''}</span>
      </div>

      <div class="cancha mb-3">
        <svg class="lineas" viewBox="0 0 300 400" preserveAspectRatio="none">
          <rect x="4" y="4" width="292" height="392"/>
          <line x1="4" y1="200" x2="296" y2="200"/>
          <circle cx="150" cy="200" r="42"/>
          <circle cx="150" cy="200" r="2.5" style="fill:rgba(255,255,255,.45)"/>
          <rect x="75" y="4" width="150" height="58"/>
          <rect x="112" y="4" width="76" height="26"/>
          <rect x="75" y="338" width="150" height="58"/>
          <rect x="112" y="370" width="76" height="26"/>
        </svg>

        <span class="cancha-nombre-equipo">${esc(nombreEquipo(visita))}</span>
        <span class="cancha-nombre-equipo" style="top:auto;bottom:.8rem;left:auto;right:1rem">
          ${esc(nombreEquipo(local))}
        </span>

        ${marcasVisita}
        ${marcasLocal}
      </div>

      <div class="d-flex justify-content-between align-items-center small mb-3">
        <span>
          <span class="d-inline-block rounded-circle me-1"
                style="width:9px;height:9px;background:var(--verde-600)"></span>
          ${esc(nombreEquipo(local))} (Local)
        </span>
        <span>
          ${esc(nombreEquipo(visita))} (Visitante)
          <span class="d-inline-block rounded-circle ms-1"
                style="width:9px;height:9px;background:var(--azul)"></span>
        </span>
      </div>

      <hr>

      <div class="d-flex justify-content-between">
        <div>
          <small class="text-muted-wc text-uppercase" style="font-size:.7rem;letter-spacing:.06em">DT Local</small>
          <div class="fw-semibold">${esc(dtLocal)}</div>
        </div>
        <div class="text-end">
          <small class="text-muted-wc text-uppercase" style="font-size:.7rem;letter-spacing:.06em">DT Visitante</small>
          <div class="fw-semibold">${esc(dtVisita)}</div>
        </div>
      </div>

      ${pintarSuplentes(alLocal, alVisita, local, visita)}`;
  }

  function pintarSuplentes(alLocal, alVisita, local, visita) {
    const lista = (al) => {
      const s = pick(al, 'substitutes', 'bench');
      return Array.isArray(s) ? s : [];
    };
    const supLocal = lista(alLocal);
    const supVisita = lista(alVisita);
    if (!supLocal.length && !supVisita.length) return '';

    const columna = (equipo, jugadores) => `
      <div class="col-6">
        <h3 class="h6 mb-2">${esc(nombreEquipo(equipo))}</h3>
        <ul class="list-unstyled small mb-0 text-muted-wc">
          ${jugadores
            .map((j) => {
              const d = pick(j, 'number') ?? '';
              const n = pick(j, 'name') || '';
              return `<li class="mb-1">
                <span class="text-muted-wc me-2" style="display:inline-block;min-width:1.6em">${esc(d)}</span>
                ${esc(n)}
              </li>`;
            })
            .join('')}
        </ul>
      </div>`;

    return `
      <hr class="my-4">
      <h3 class="h6 mb-3">Suplentes</h3>
      <div class="row g-3">
        ${columna(local, supLocal)}
        ${columna(visita, supVisita)}
      </div>`;
  }

  /* =========================================================
     3. ESTADÍSTICAS
     La API las entrega agrupadas por bloque temático.
     ========================================================= */

  const TRADUCCION_STATS = {
    'Ball possession': 'Posesión de balón',
    'Distance covered': 'Distancia recorrida',
    'Expected goals': 'Goles esperados',
    'Big chances': 'Ocasiones claras',
    'Total shots': 'Remates totales',
    'Shots on target': 'Remates a puerta',
    'Shots off target': 'Remates desviados',
    'Blocked shots': 'Remates bloqueados',
    'Shots inside box': 'Remates dentro del área',
    'Shots outside box': 'Remates fuera del área',
    'Hit woodwork': 'Al palo',
    'Goalkeeper saves': 'Atajadas',
    'Total saves': 'Atajadas totales',
    'Corner kicks': 'Tiros de esquina',
    'Fouls': 'Faltas',
    'Passes': 'Pases',
    'Accurate passes': 'Pases acertados',
    'Tackles': 'Entradas',
    'Total tackles': 'Entradas totales',
    'Tackles won': 'Entradas ganadas',
    'Free kicks': 'Tiros libres',
    'Yellow cards': 'Tarjetas amarillas',
    'Red cards': 'Tarjetas rojas',
    'Offsides': 'Fueras de juego',
    'Interceptions': 'Intercepciones',
    'Clearances': 'Despejes',
    'Recoveries': 'Recuperaciones',
    'Duels': 'Duelos',
    'Ground duels': 'Duelos por tierra',
    'Aerial duels': 'Duelos aéreos',
    'Dribbles': 'Regates',
    'Crosses': 'Centros',
    'Long balls': 'Balones largos',
    'Throw-ins': 'Saques de banda',
    'Number of sprints': 'Sprints',
    'Goal kicks': 'Saques de meta',
    'Big saves': 'Atajadas decisivas',
    'Goals prevented': 'Goles evitados'
  };

  const GRUPOS_STATS = {
    'Match overview': 'Resumen del partido',
    'Shots': 'Remates',
    'Attack': 'Ataque',
    'Passes': 'Pases',
    'Duels': 'Duelos',
    'Defending': 'Defensa',
    'Goalkeeping': 'Portería'
  };

  function pintarEstadisticas(p) {
    const cont = $('#estadisticas');
    const bloques = pick(p, 'statistics', 'stats');

    if (!Array.isArray(bloques) || !bloques.length) {
      cont.innerHTML = `<p class="text-muted-wc small mb-0">
        Las estadísticas de este partido aún no están disponibles.</p>`;
      return;
    }

    cont.innerHTML = bloques
      .map((bloque) => {
        const nombreGrupo = pick(bloque, 'group') || '';
        const filas = pick(bloque, 'statistics') || [];
        if (!Array.isArray(filas) || !filas.length) return '';

        return `
          <div class="stat-grupo-titulo">
            ${esc(GRUPOS_STATS[nombreGrupo] || nombreGrupo)}
          </div>
          ${filas.map((f) => {
            const etiqueta = pick(f, 'name') || '';
            const local = pick(f, 'home');
            const visita = pick(f, 'away');
            const nL = Number(pick(f, 'home_value')) || 0;
            const nV = Number(pick(f, 'away_value')) || 0;
            const total = nL + nV;
            const pct = total > 0 ? (nL / total) * 100 : 50;

            return `
              <div class="stat-fila">
                <span class="valor local">${esc(local ?? '—')}</span>
                <span class="etiqueta">${esc(TRADUCCION_STATS[etiqueta] || etiqueta)}</span>
                <span class="valor visita">${esc(visita ?? '—')}</span>
              </div>
              <div class="stat-barra"><div style="width:${pct}%"></div></div>`;
          }).join('')}`;
      })
      .join('');
  }

  /* =========================================================
     4. CRONOLOGÍA
     La API no indica a qué equipo pertenece cada evento, así que
     se presenta como una única línea de tiempo en orden.
     ========================================================= */

  function pintarCronologia(p) {
    const cont = $('#cronologia');
    const eventos = pick(p, 'chronology', 'timeline', 'events');

    if (!Array.isArray(eventos) || !eventos.length) {
      cont.innerHTML = `<p class="text-muted-wc small mb-0">
        Sin eventos registrados para este partido.</p>`;
      return;
    }

    const descripcion = (ev) => {
      const tipo = String(pick(ev, 'type') || '').toLowerCase();
      const jugador = pick(ev, 'player.name') || '';
      const entra = pick(ev, 'player_in.name') || '';
      const sale = pick(ev, 'player_out.name') || '';
      const tarjeta = String(pick(ev, 'card') || '').toLowerCase();

      if (tipo === 'goal') {
        return { icono: '⚽', titulo: jugador || 'Gol', detalle: 'Gol' };
      }
      if (tipo === 'card') {
        return {
          icono: tarjeta === 'red' ? '🟥' : '🟨',
          titulo: jugador || 'Tarjeta',
          detalle: tarjeta === 'red' ? 'Tarjeta roja' : 'Tarjeta amarilla'
        };
      }
      if (tipo === 'substitution') {
        return {
          icono: '🔄',
          titulo: entra || 'Cambio',
          detalle: sale ? `Entra por ${sale}` : 'Sustitución'
        };
      }
      return { icono: '•', titulo: jugador || tipo, detalle: '' };
    };

    cont.innerHTML = `<ul class="crono-lista">${eventos
      .slice()
      .sort((a, b) => (Number(pick(b, 'time')) || 0) - (Number(pick(a, 'time')) || 0))
      .map((ev) => {
        const { icono, titulo, detalle } = descripcion(ev);
        const minuto = pick(ev, 'time') ?? '';
        return `
          <li class="crono-item">
            <span class="minuto">${esc(minuto)}'</span>
            <span class="icono">${icono}</span>
            <span class="detalle">
              ${esc(titulo)}
              ${detalle ? `<br><small>${esc(detalle)}</small>` : ''}
            </span>
          </li>`;
      })
      .join('')}</ul>`;
  }

  /* =========================================================
     5. HIGHLIGHTS
     ========================================================= */

  function pintarHighlights(p) {
    const cont = $('#highlights');
    if (!cont) return;

    const videos = pick(p, 'highlight', 'highlights');
    if (!Array.isArray(videos) || !videos.length) {
      cont.closest('.card-wc')?.remove();
      return;
    }

    // Priorizamos los resúmenes completos y limitamos la lista
    const ordenados = [...videos].sort((a, b) => {
      const esResumen = (v) => /full highlights/i.test(pick(v, 'subtitle') || '') ? 0 : 1;
      return esResumen(a) - esResumen(b);
    }).slice(0, 8);

    cont.innerHTML = ordenados
      .map((v) => {
        const titulo = pick(v, 'title') || 'Video';
        const subtitulo = pick(v, 'subtitle') || '';
        const url = pick(v, 'url');
        const miniatura = pick(v, 'thumbnail_url');
        return `
          <a class="highlight-item text-decoration-none" href="${esc(url)}"
             target="_blank" rel="noopener noreferrer">
            ${miniatura ? `<img src="${esc(miniatura)}" alt="" loading="lazy">` : ''}
            <span class="flex-grow-1">
              <span class="d-block fw-medium" style="font-size:.88rem">${esc(titulo)}</span>
              <small class="text-muted-wc">${esc(subtitulo)}</small>
            </span>
            <i class="bi bi-play-circle" style="color:var(--verde-700);font-size:1.2rem"></i>
          </a>`;
      })
      .join('');
  }

  /* =========================================================
     6. CARGA
     ========================================================= */

  async function iniciar() {
    if (!ID) {
      $('#marcador').innerHTML = mensajeError('No se indicó qué partido mostrar.');
      return;
    }

    try {
      const partido = await API.partido(ID);

      if (!partido || Array.isArray(partido)) {
        $('#marcador').innerHTML = mensajeError('No se encontró el partido solicitado.');
        return;
      }

      const miga = $('#migaRonda');
      if (miga) miga.textContent = nombreRonda(partido);

      const local = pick(partido, 'home_team') || {};
      const visita = pick(partido, 'away_team') || {};
      document.title = `${nombreEquipo(local)} vs ${nombreEquipo(visita)} | Mundial FIFA 2026`;

      pintarMarcador(partido);
      pintarAlineaciones(partido);
      pintarEstadisticas(partido);
      pintarCronologia(partido);
      pintarHighlights(partido);
    } catch {
      $('#marcador').innerHTML = mensajeError('No se pudo cargar la información del partido.');
    }
  }

  iniciar();
})();
