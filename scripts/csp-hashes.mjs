/**
 * Después de `next build`: recorre out/**\/*.html, calcula el hash SHA-256 de cada
 * <script> inline ejecutable e inserta en cada página una Content-Security-Policy como
 * <meta http-equiv>, justo después de <meta charset>. Así la CSP no necesita
 * 'unsafe-inline' para scripts y no depende del hosting (los hashes cambian en cada build).
 *
 * Lo que una CSP en <meta> no admite (frame-ancestors) va como header en vercel.json,
 * junto con X-Frame-Options.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const OUT = path.resolve('out');

if (!fs.existsSync(OUT)) {
  console.error('csp-hashes: no existe /out. Corré `next build` primero.');
  process.exit(1);
}

const ANALYTICS = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === '1';

function policy(hashes) {
  const scriptSrc = ["'self'", ...hashes.map((h) => `'sha256-${h}'`)];
  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    // Atributos style="" del HTML (variables CSS de animación); sin riesgo de ejecución de código.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    // Vercel Web Analytics usa rutas del mismo dominio (/_vercel/insights/*): alcanza con 'self'
    "connect-src 'self' https://api.web3forms.com",
    "form-action 'self' https://api.web3forms.com",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
  });
}

const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const CHARSET_RE = /<meta charSet="utf-8"\/>/i;
let pages = 0;
let total = 0;

for (const file of walk(OUT)) {
  const html = fs.readFileSync(file, 'utf8');
  const hashes = new Set();
  for (const m of html.matchAll(SCRIPT_RE)) {
    const attrs = m[1] ?? '';
    const body = m[2] ?? '';
    if (/\bsrc\s*=/.test(attrs) || body.length === 0) continue;
    // Bloques de datos (JSON-LD) no se ejecutan: la CSP no los afecta
    if (/type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs)) continue;
    hashes.add(crypto.createHash('sha256').update(body, 'utf8').digest('base64'));
  }
  const charset = html.match(CHARSET_RE);
  if (!charset || html.indexOf('<script') < (charset.index ?? 0)) {
    console.error(`csp-hashes: ${path.relative(OUT, file)} no tiene <meta charset> antes de los scripts.`);
    process.exit(1);
  }
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy([...hashes])}"/>`;
  fs.writeFileSync(file, html.replace(CHARSET_RE, (m) => m + meta));
  pages++;
  total += hashes.size;
}

console.log(`csp-hashes: ${pages} páginas, ${total} hashes${ANALYTICS ? ' (con analítica)' : ''}.`);
