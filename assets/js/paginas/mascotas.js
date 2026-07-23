var WC = window.WC = window.WC || {};
(function () {
  "use strict";
  var API = WC.API, RUTAS = WC.RUTAS, esc = WC.esc, img = WC.img, montarFooter = WC.montarFooter, montarHeader = WC.montarHeader, pick = WC.pick, render = WC.render, skeletonTarjetas = WC.skeletonTarjetas;

  /* =========================================================
     PÁGINA: MASCOTAS OFICIALES
     Requisito 12 del alcance: fotos y descripción de cada una.
     ========================================================= */

  montarHeader(RUTAS.mascotas);
  montarFooter();

  function tarjetaMascota(m) {
    const nombre = pick(m, 'name', 'nombre', 'title') || 'Mascota';
    const pais = pick(m, 'country', 'pais') || '';
    // La API entrega la descripción como arreglo de párrafos
    const bruto = pick(m, 'description', 'descripcion') || '';
    const descripcion = Array.isArray(bruto) ? bruto.join(' ') : bruto;
    const foto = pick(m, 'image_url', 'image', 'imageUrl', 'photo');

    return `
      <div class="col-md-6 col-lg-4">
        <article class="card-wc h-100 text-center">
          <div class="d-flex align-items-center justify-content-center p-4"
               style="aspect-ratio:1;background:var(--fondo-alt)">
            ${foto
              ? img(foto, nombre, 'w-100 h-100').replace('class="', 'style="object-fit:contain" class="')
              : `<i class="bi bi-emoji-smile" style="font-size:4rem;color:var(--texto-suave)"></i>`}
          </div>
          <div class="p-4">
            ${pais ? `<span class="badge-wc mb-2 d-inline-block">${esc(pais)}</span>` : ''}
            <h2 class="h5 mb-2">${esc(nombre)}</h2>
            <p class="text-muted-wc small mb-0">${esc(descripcion)}</p>
          </div>
        </article>
      </div>`;
  }

  render(
    '#listaMascotas',
    API.mascotas,
    (mascotas) => mascotas.map(tarjetaMascota).join(''),
    {
      skeleton: skeletonTarjetas(3, 'col-md-6 col-lg-4'),
      textoVacio: 'Las mascotas oficiales aún no se han anunciado.',
      textoError: 'No se pudo cargar la información de las mascotas.'
    }
  );

})();
