var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, ENDPOINTS = WC.ENDPOINTS, RUTAS = WC.RUTAS, $ = WC.$,
      estadoPartido = WC.estadoPartido, fechaHoraDe = WC.fechaHoraDe,
      montarFooter = WC.montarFooter, montarHeader = WC.montarHeader,
      pick = WC.pick, precargar = WC.precargar, render = WC.render,
      skeletonTarjetas = WC.skeletonTarjetas, tarjetaCiudad = WC.tarjetaCiudad,
      tarjetaEquipoMini = WC.tarjetaEquipoMini, tarjetaNoticia = WC.tarjetaNoticia,
      tarjetaPartido = WC.tarjetaPartido, mensajeError = WC.mensajeError,
      equiposIndexados = WC.equiposIndexados, ciudadesIndexadas = WC.ciudadesIndexadas;

  /* =========================================================
     PÁGINA DE BIENVENIDA
     Cada sección se carga por separado: si una falla, el resto
     del sitio sigue funcionando.
     ========================================================= */

  montarHeader(RUTAS.home);
  montarFooter();

  /* -------------------- Últimas noticias ----------------- */
  render(
    '#listaNoticias',
    API.noticias,
    (noticias) =>
      [...noticias]
        .sort(
          (a, b) =>
            new Date(pick(b, 'published_date', 'date')) -
            new Date(pick(a, 'published_date', 'date'))
        )
        .slice(0, 3)
        .map((n) => tarjetaNoticia(n))
        .join(''),
    { skeleton: skeletonTarjetas(3, 'col-12 col-md-6 col-lg-4') }
  );

  /* ------------------- Próximos partidos -----------------
     Requisito del enunciado: mínimo 8, máximo 12.
     Los partidos traen solo el ID del equipo y de la ciudad,
     así que primero cargamos ambos índices.
     -------------------------------------------------------- */
  async function pintarPartidos() {
    const cont = $('#listaPartidos');
    cont.innerHTML = skeletonTarjetas(8, 'col-12 col-sm-6 col-lg-3');

    try {
      await Promise.all([equiposIndexados(), ciudadesIndexadas()]);
      const partidos = await API.partidos();
      const lista = Array.isArray(partidos) ? partidos : [];

      const proximos = lista
        .filter((p) => !estadoPartido(p).jugado)
        .sort((a, b) => new Date(fechaHoraDe(a)) - new Date(fechaHoraDe(b)));

      // Si ya no quedan partidos por jugar, mostramos los últimos disputados
      const aMostrar = (proximos.length >= 8
        ? proximos
        : [...proximos, ...lista
            .filter((p) => estadoPartido(p).jugado)
            .sort((a, b) => new Date(fechaHoraDe(b)) - new Date(fechaHoraDe(a)))]
      ).slice(0, 8);

      cont.innerHTML = aMostrar.length
        ? aMostrar.map((p) => tarjetaPartido(p)).join('')
        : '<div class="col-12"><p class="text-muted-wc">Sin partidos disponibles.</p></div>';
    } catch {
      cont.innerHTML = mensajeError('No se pudo cargar el calendario de partidos.');
    }
  }
  pintarPartidos();

  /* ------------------ Equipos destacados -----------------
     Requisito del enunciado: mínimo 8, máximo 12.
     Modelado: 5 por fila, dos filas.
     -------------------------------------------------------- */
  render(
    '#listaEquipos',
    API.equipos,
    (equipos) =>
      [...equipos]
        .sort(
          (a, b) =>
            (pick(a, 'world_ranking', 'ranking') ?? 999) -
            (pick(b, 'world_ranking', 'ranking') ?? 999)
        )
        .slice(0, 10)
        .map((e) => tarjetaEquipoMini(e, 'col'))
        .join(''),
    { skeleton: skeletonTarjetas(10, 'col') }
  );

  /* ------------------ Ciudades anfitrionas ---------------- */
  render(
    '#listaCiudades',
    API.ciudades,
    (ciudades) => ciudades.slice(0, 8).map((c) => tarjetaCiudad(c, 'col-6 col-lg-3')).join(''),
    { skeleton: skeletonTarjetas(8, 'col-6 col-lg-3') }
  );

  /* ---------------------------------------------------------
     ESTRATEGIA DE RENDIMIENTO (punto 22 del alcance)
     Tras pintar la home, precargamos en tiempo ocioso los
     recursos que el usuario visitará con mayor probabilidad.
     --------------------------------------------------------- */
  precargar([ENDPOINTS.clasificacion, ENDPOINTS.ranking]);
})();
