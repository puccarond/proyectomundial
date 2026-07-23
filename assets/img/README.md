# Carpeta de imágenes

Estructura preparada para todos los recursos gráficos del sitio. Cada carpeta tiene un `.gitkeep` para que se conserve aunque esté vacía.

> **Regla general:** la mayoría de las imágenes vienen del API. Estas carpetas son para lo que el API **no** entrega o para respaldos locales cuando la URL remota falla.

| Carpeta | Qué va aquí | Formato sugerido | Medidas |
|---|---|---|---|
| `logo/` | Logo oficial de la Copa Mundial FIFA 2026 (requisito 18), versiones clara y oscura | SVG o PNG con fondo transparente | alto ≥ 120 px |
| `banners/` | Imágenes del slider de la página de bienvenida | JPG / WebP | 1600 × 800 px (2:1) |
| `equipos/banderas/` | Banderas de las selecciones | SVG o PNG | 120 × 80 px |
| `equipos/escudos/` | Escudos de las federaciones | PNG transparente | 200 × 200 px |
| `jugadores/` | Fotos de jugadores para las alineaciones sobre la cancha | PNG / WebP | 160 × 160 px, recorte circular |
| `ciudades/` | Fotos y banners de las 16 ciudades anfitrionas | JPG / WebP | 1200 × 1600 px (3:4) |
| `ciudades/logos/` | Logo del Mundial por ciudad | SVG / PNG transparente | 400 × 400 px |
| `estadios/` | Fotos de los estadios | JPG / WebP | 1600 × 900 px (16:9) |
| `mascotas/` | Fotos de las mascotas oficiales | PNG transparente | 800 × 800 px |
| `balon/` | Fotos del balón oficial | PNG transparente | 1000 × 1000 px |
| `banda-sonora/` | Banner y portada del álbum oficial | JPG / WebP | banner 1600×600, portada 800×800 |
| `noticias/` | Imágenes de portada de noticias (respaldo) | JPG / WebP | 1200 × 675 px (16:9) |
| `archivos/` | Miniaturas de los videos de mundiales anteriores | JPG / WebP | 1280 × 720 px |
| `eventos/` | Logos o portadas de próximos torneos FIFA | PNG / JPG | 800 × 450 px |
| `ods/` | Iconos oficiales de los Objetivos de Desarrollo Sostenible | PNG / SVG | 512 × 512 px |
| `iconos/` | Iconos propios del sitio (los genéricos vienen de Bootstrap Icons) | SVG | 24 × 24 px |

## Convención de nombres

Minúsculas, sin acentos ni espacios, separadas por guiones:

```
equipos/banderas/argentina.svg        equipos/banderas/estados-unidos.svg
ciudades/ciudad-de-mexico.jpg         ciudades/nueva-york-nueva-jersey.jpg
estadios/estadio-azteca.jpg           estadios/metlife-stadium.jpg
mascotas/mascota-mexico.png           ods/ods-13-accion-por-el-clima.png
```

Para las banderas conviene usar el **código FIFA de 3 letras** en minúscula, así se pueden construir por código desde JavaScript:

```
equipos/banderas/arg.svg   equipos/banderas/mex.svg   equipos/banderas/can.svg
```

## Archivos actuales

- `logo/logo-mundial-2026.svg` — **placeholder**, reemplazar por el logo oficial.
- `banners/banner-1.svg`, `banner-2.svg`, `banner-3.svg` — **placeholders** del slider, reemplazar por fotos reales.

## Optimización (cuenta para el punto 22 del alcance)

- Preferir **WebP** sobre JPG/PNG cuando no se necesite transparencia (pesa 25–35 % menos).
- Mantener cada imagen por debajo de **200 KB**; los banners por debajo de **400 KB**.
- No subir imágenes más grandes de lo que se van a mostrar en pantalla.
- Todas las imágenes del sitio ya se cargan con `loading="lazy"` y tienen respaldo automático si la URL falla.
