# Sugar Tienda Digital · Sugar Doggy Pops

Prototipo de web interactiva para **@sugardoggypops.ec**: la clienta arma el collar de su peludito "capa por capa" (hilos → placa → charms → llavero a juego) y envía el pedido ya escrito por DM.

Inspirado en la mecánica de las webs virales de "arma tu producto" (arrastrar ingredientes a una caja).

- `studio/index.html`: versión completa para abrir en el navegador o publicar en GitHub Pages / Netlify.
- `studio/sugar-town-studio.html`: misma página en formato Artifact de Claude.

La paleta de hilos es de ejemplo: reemplázala por la paleta real en el array `THREADS`.

## Versión con fotos (`studio/foto/`)

- `studio/foto/index.html`: configurador fotorrealista. Usa las imágenes de `studio/foto/img/` (fotos de prueba generadas con IA en Canva).
- La trenza se dibuja a partir de una foto del hilo (`textura-hilo.png`) que la web tiñe con cada color, así cualquier combinación se ve real.
- Publicada como Artifact, la dueña ve una sección **"Tus fotos"** para reemplazar cada imagen por la suya; quedan guardadas para todos los que abran la página.
