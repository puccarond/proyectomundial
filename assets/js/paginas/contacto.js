var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var $ = WC.$, RUTAS = WC.RUTAS, esc = WC.esc, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader;

  /* =========================================================
     PÁGINA: FORMULARIO DE CONTACTO
     Requisito 16 del alcance.

     Validación en el navegador. No hay backend al que enviar,
     así que se muestra la confirmación en pantalla; el punto de
     envío queda marcado para conectarlo cuando exista.
     ========================================================= */

  montarHeader(RUTAS.contacto);
  montarFooter();

  const form = $('#formContacto');
  const respuesta = $('#respuestaForm');

  /* Marca un campo como válido o inválido usando las clases de Bootstrap */
  function validarCampo(campo) {
    const ok = campo.checkValidity();
    campo.classList.toggle('is-invalid', !ok);
    campo.classList.toggle('is-valid', ok && campo.value.trim() !== '');
    return ok;
  }

  /* Validación en vivo: solo tras el primer intento de envío */
  let intentado = false;

  /* Al enviar limpiamos el formulario con form.reset(), lo que dispara el
     evento 'reset'. Esta bandera evita que ese manejador borre el mensaje
     de confirmación que acabamos de mostrar. */
  let limpiezaTrasEnvio = false;

  form?.addEventListener('input', (e) => {
    if (intentado && e.target.matches('input, select, textarea')) {
      validarCampo(e.target);
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    intentado = true;

    const campos = [...form.querySelectorAll('input, select, textarea')];
    const todosValidos = campos.map(validarCampo).every(Boolean);

    if (!todosValidos) {
      respuesta.innerHTML = `
        <div class="aviso-alineacion">
          <i class="bi bi-exclamation-triangle" style="color:var(--oro-fuerte);font-size:1.1rem"></i>
          <div>
            <strong>Revisa el formulario</strong>
            <p>Hay campos obligatorios sin completar o con datos inválidos.</p>
          </div>
        </div>`;
      form.querySelector('.is-invalid')?.focus();
      return;
    }

    const datos = Object.fromEntries(new FormData(form).entries());

    // TODO: cuando exista un backend, enviar aquí con fetch(...)
    console.info('[Contacto] Datos listos para enviar:', datos);

    respuesta.innerHTML = `
      <div class="card-wc p-4 text-center" style="border-color:var(--verde-600)">
        <i class="bi bi-check-circle-fill mb-2" style="font-size:2rem;color:var(--verde-600)"></i>
        <h3 class="h6 mb-2">¡Mensaje recibido, ${esc(datos.nombre)}!</h3>
        <p class="text-muted-wc small mb-0">
          Te responderemos a <strong>${esc(datos.correo)}</strong> lo antes posible.
        </p>
      </div>`;

    limpiezaTrasEnvio = true;
    form.reset();
    limpiezaTrasEnvio = false;

    intentado = false;
    campos.forEach((c) => c.classList.remove('is-valid', 'is-invalid'));
    respuesta.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  });

  form?.addEventListener('reset', () => {
    intentado = false;
    // Solo borramos el mensaje si el usuario pulsó "Limpiar" a propósito
    if (!limpiezaTrasEnvio) respuesta.innerHTML = '';
    form.querySelectorAll('.is-valid, .is-invalid')
      .forEach((c) => c.classList.remove('is-valid', 'is-invalid'));
  });

})();
