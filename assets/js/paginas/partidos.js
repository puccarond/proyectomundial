var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, $ = WC.$, esc = WC.esc, pick = WC.pick,
      estadoPartido = WC.estadoPartido, nombreRonda = WC.nombreRonda,
      equiposDelPartido = WC.equiposDelPartido, fechaHoraDe = WC.fechaHoraDe,
      ciudadDelPartido = WC.ciudadDelPartido, nombreEquipo = WC.nombreEquipo,
      montarFooter = WC.montarFooter, montarHeader = WC.montarHeader,
      skeletonTarjetas = WC.skeletonTarjetas, mensajeError = WC.mensajeError,
      mensajeVacio = WC.mensajeVacio, tarjetaPartido = WC.tarjetaPartido,
      equiposIndexados = WC.equiposIndexados, ciudadesIndexadas = WC.ciudadesIndexadas;

  /* =========================================================
     PÁGINA: LISTADO DE PARTIDOS
     Requisito 3 del alcance: filtrado por ciudad, ronda,
     estatus, grupo y equipo.

     Los partidos se descargan UNA sola vez y todo el filtrado
     ocurre en memoria (parte de la estrategia de rendimiento).
     ========================================================= */

  montarHeader(RUTAS.partidos);
  montarFooter();

  let PARTIDOS = [];

  const controles = {
    equipo: $('#filtroEquipo'),
    ciudad: $('#filtroCiudad'),
    ronda: $('#filtroRonda'),
    grupo: $('#filtroGrupo'),
    estatus: $('#filtroEstatus')
  };

  const ciudadDe = (p) => {
    const c = ciudadDelPartido(p);
    return c ? pick(c, 'name') || '' : '';
  };
  const grupoDe = (p) => pick(p, 'group', 'groupName') || '';

  /* ------------------ RELLENO DE FILTROS ------------------ */

  function opcionesUnicas(valores) {
    return [...new Set(valores.filter(Boolean))].sort((a, b) =>
      String(a).localeCompare(String(b), 'es', { numeric: true })
    );
  }

  function llenarSelect(select, valores) {
    if (!select) return;
    const primera = select.querySelector('option');
    select.innerHTML = '';
    select.appendChild(primera);
    valores.forEach((v) => {
      const op = document.createElement('option');
      op.value = v;
      op.textContent = v;
      select.appendChild(op);
    });
  }

  function construirFiltros() {
    llenarSelect(
      controles.equipo,
      opcionesUnicas(PARTIDOS.flatMap((p) => equiposDelPartido(p).map(nombreEquipo)))
    );
    llenarSelect(controles.ciudad, opcionesUnicas(PARTIDOS.map(ciudadDe)));
    llenarSelect(controles.grupo, opcionesUnicas(PARTIDOS.map(grupoDe)));

    // La ronda es numérica; la mostramos con su nombre legible
    const rondas = [...new Set(PARTIDOS.map((p) => Number(pick(p, 'round'))))]
      .filter((r) => Number.isFinite(r))
      .sort((a, b) => a - b);

    const select = controles.ronda;
    if (select) {
      const primera = select.querySelector('option');
      select.innerHTML = '';
      select.appendChild(primera);
      rondas.forEach((r) => {
        const ejemplo = PARTIDOS.find((p) => Number(pick(p, 'round')) === r);
        const op = document.createElement('option');
        op.value = String(r);
        op.textContent = nombreRonda(ejemplo);
        select.appendChild(op);
      });
    }
  }

  /* ---------------------- FILTRADO ------------------------ */

  function aplicarFiltros() {
    const f = {
      equipo: controles.equipo?.value ?? '',
      ciudad: controles.ciudad?.value ?? '',
      ronda: controles.ronda?.value ?? '',
      grupo: controles.grupo?.value ?? '',
      estatus: controles.estatus?.value ?? ''
    };

    const filtrados = PARTIDOS.filter((p) => {
      if (f.equipo && !equiposDelPartido(p).some((t) => nombreEquipo(t) === f.equipo)) return false;
      if (f.ciudad && ciudadDe(p) !== f.ciudad) return false;
      if (f.ronda && String(pick(p, 'round')) !== f.ronda) return false;
      if (f.grupo && grupoDe(p) !== f.grupo) return false;
      if (f.estatus) {
        const e = estadoPartido(p);
        if (f.estatus === 'finished' && e.texto !== 'Finalizado') return false;
        if (f.estatus === 'live' && e.texto !== 'En vivo') return false;
        if (f.estatus === 'scheduled' && e.texto !== 'Próximo') return false;
      }
      return true;
    });

    pintar(filtrados);
  }

  /* ----------------------- PINTADO ------------------------ */

  function pintar(lista) {
    const cont = $('#listaPartidos');
    const contador = $('#contadorResultados');

    if (contador) {
      contador.textContent =
        lista.length === PARTIDOS.length
          ? `${lista.length} partidos`
          : `${lista.length} de ${PARTIDOS.length} partidos`;
    }

    if (!lista.length) {
      cont.innerHTML = mensajeVacio(
        'Ningún partido coincide con los filtros seleccionados.',
        'bi-funnel'
      );
      return;
    }

    // Agrupamos por fecha para que el calendario se lea mejor
    const porFecha = new Map();
    [...lista]
      .sort((a, b) => new Date(fechaHoraDe(a)) - new Date(fechaHoraDe(b)))
      .forEach((p) => {
        const clave = pick(p, 'date') || 'Fecha por confirmar';
        if (!porFecha.has(clave)) porFecha.set(clave, []);
        porFecha.get(clave).push(p);
      });

    const fmt = new Intl.DateTimeFormat('es', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    cont.innerHTML = [...porFecha.entries()]
      .map(([clave, partidos]) => {
        const d = new Date(clave + 'T12:00:00');
        const titulo = isNaN(d) ? clave : fmt.format(d);
        return `
          <div class="col-12 mt-4">
            <h2 class="h6 text-muted-wc text-uppercase mb-0"
                style="letter-spacing:.08em">${esc(titulo)}</h2>
            <hr class="mt-2 mb-1">
          </div>
          ${partidos.map((p) => tarjetaPartido(p)).join('')}`;
      })
      .join('');
  }

  /* ------------------------ INICIO ------------------------ */

  async function iniciar() {
    const cont = $('#listaPartidos');
    cont.innerHTML = skeletonTarjetas(8, 'col-12 col-sm-6 col-lg-3');

    try {
      // Los partidos solo traen IDs: hay que resolver equipos y ciudades
      await Promise.all([equiposIndexados(), ciudadesIndexadas()]);

      const datos = await API.partidos();
      PARTIDOS = Array.isArray(datos) ? datos : [];

      const resumen = $('#resumenPartidos');
      if (resumen) {
        const sedes = opcionesUnicas(PARTIDOS.map(ciudadDe)).length;
        resumen.textContent = `${PARTIDOS.length} partidos · ${sedes} sedes · 3 países.`;
      }

      construirFiltros();
      aplicarFiltros();
    } catch {
      cont.innerHTML = mensajeError('No se pudo cargar el calendario de partidos.');
    }
  }

  Object.values(controles).forEach((sel) =>
    sel?.addEventListener('change', aplicarFiltros)
  );

  $('#btnLimpiar')?.addEventListener('click', () => {
    Object.values(controles).forEach((sel) => { if (sel) sel.value = ''; });
    aplicarFiltros();
  });

  iniciar();
})();
