var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var $ = WC.$, RUTAS = WC.RUTAS, esc = WC.esc, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader;

  /* =========================================================
     PÁGINA: OBJETIVOS DE DESARROLLO SOSTENIBLE
     Requisito 21 del alcance: presentar los ODS de forma
     atractiva. Los datos son propios del proyecto (no vienen
     del API), así que viven aquí.
     ========================================================= */

  montarHeader(RUTAS.ods);
  montarFooter();

  /* Colores oficiales de la ONU para cada objetivo */
  const ODS = [
    {
      numero: 3, color: '#4c9f38', titulo: 'Salud y Bienestar',
      texto: 'Programas de actividad física en las 16 ciudades sede y campañas de prevención dirigidas a los más de cinco millones de asistentes esperados.'
    },
    {
      numero: 5, color: '#ff3a21', titulo: 'Igualdad de Género',
      texto: 'Paridad en los equipos arbitrales y de organización, además de programas de desarrollo del fútbol femenino en los tres países anfitriones.'
    },
    {
      numero: 9, color: '#fd6925', titulo: 'Industria e Infraestructura',
      texto: 'Reutilización de estadios existentes en los tres países para minimizar el impacto ambiental de nuevas construcciones.'
    },
    {
      numero: 10, color: '#dd1367', titulo: 'Reducción de Desigualdades',
      texto: 'La ampliación a 48 selecciones abre las puertas a federaciones que nunca habían competido en una Copa del Mundo.'
    },
    {
      numero: 11, color: '#fd9d24', titulo: 'Ciudades Sostenibles',
      texto: 'Implementación de transporte público gratuito y ecológico para los aficionados en las 16 ciudades sede.'
    },
    {
      numero: 12, color: '#bf8b2e', titulo: 'Consumo Responsable',
      texto: 'Eliminación del 100% de plásticos de un solo uso en las Fan Zones y estadios de México, Estados Unidos y Canadá.'
    },
    {
      numero: 13, color: '#3f7e44', titulo: 'Acción por el Clima',
      texto: 'Compensación total de la huella de carbono de todos los vuelos de las 48 selecciones participantes.'
    },
    {
      numero: 17, color: '#19486a', titulo: 'Alianzas para los Objetivos',
      texto: 'Por primera vez tres federaciones nacionales coordinan una misma Copa del Mundo, un modelo de cooperación sin precedentes.'
    }
  ];

  const CIFRAS = [
    { valor: '16', etiqueta: 'ciudades con transporte ecológico', icono: 'bi-bus-front' },
    { valor: '100%', etiqueta: 'plásticos de un solo uso eliminados', icono: 'bi-recycle' },
    { valor: '48', etiqueta: 'selecciones con huella compensada', icono: 'bi-airplane' },
    { valor: '3', etiqueta: 'países cooperando en la organización', icono: 'bi-globe-americas' }
  ];

  /* ----------------------- RENDER ------------------------- */

  /* Cada objetivo muestra su icono oficial si el archivo existe
     (assets/img/ods/ods-03.png … ods-17.png); si aún no está, cae
     automáticamente al número de color. Basta con colocar la imagen
     con ese nombre, no hay que tocar código. */
  $('#listaOds').innerHTML = ODS.map(
    (o) => {
      const nn = String(o.numero).padStart(2, '0');
      return `
      <div class="col-sm-6 col-lg-3">
        <div class="ods-card h-100">
          <img src="assets/img/ods/ods-${nn}.png" alt="ODS ${o.numero}"
               class="ods-icono"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <div class="ods-numero" style="background:${o.color};display:none">${o.numero}</div>
          <h3>${esc(o.titulo)}</h3>
          <p>${esc(o.texto)}</p>
        </div>
      </div>`;
    }
  ).join('');

  $('#cifrasOds').innerHTML = CIFRAS.map(
    (c) => `
    <div class="col-6 col-lg-3">
      <div class="card-wc p-4 text-center h-100">
        <i class="bi ${c.icono} mb-2" style="font-size:1.8rem;color:var(--verde-600)"></i>
        <div style="font-size:2rem;font-weight:800;color:var(--verde-800);line-height:1">
          ${esc(c.valor)}
        </div>
        <p class="text-muted-wc small mb-0 mt-2">${esc(c.etiqueta)}</p>
      </div>
    </div>`
  ).join('');

})();
