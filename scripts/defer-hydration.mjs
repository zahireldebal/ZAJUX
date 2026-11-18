/**
 * Después de `next build`: hace que los scripts de Next se ejecuten DESPUÉS de la primera
 * pintura, sin retrasar su descarga.
 *
 * Por qué: con una conexión rápida, los scripts async llegan antes de que el navegador pinte
 * y la hidratación de React retrasa el primer cuadro. Así, el contenido (HTML estático) se ve
 * primero y la interactividad llega unos milisegundos después.
 *
 * Cómo: cada <script src async> pasa a <script data-src async> (inerte), se agrega un
 * <link rel="preload" as="script"> para que la descarga empiece igual de temprano, y un
 * cargador inline les asigna el src en el cuadro siguiente a la primera pintura.
 * Corre antes de csp-hashes.mjs, que incluye el hash del cargador en la CSP.
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('out');
const LOADER =
  '(function(){function go(){document.querySelectorAll("script[data-src]").forEach(function(s){var e=document.createElement("script");e.src=s.getAttribute("data-src");e.async=true;s.replaceWith(e)})}' +
  'if(document.visibilityState==="hidden"){go();return}requestAnimationFrame(function(){setTimeout(go,0)})})();';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
  });
}

let files = 0;
for (const file of walk(OUT)) {
  let html = fs.readFileSync(file, 'utf8');
  const srcs = [];
  html = html.replace(/<script src="(\/_next\/static\/[^"]+\.js)" async=""><\/script>/g, (_, src) => {
    srcs.push(src);
    return `<script data-src="${src}" async=""></script>`;
  });
  if (!srcs.length) continue;
  const preloads = srcs
    .filter((s) => !html.includes(`rel="preload" as="script" fetchPriority="low" href="${s}"`))
    .map((s) => `<link rel="preload" as="script" fetchpriority="low" href="${s}"/>`)
    .join('');
  html = html.replace('</head>', `${preloads}</head>`);
  html = html.replace(/<\/body>/, `<script>${LOADER}</script></body>`);
  fs.writeFileSync(file, html);
  files++;
}
console.log(`defer-hydration: ${files} páginas.`);
