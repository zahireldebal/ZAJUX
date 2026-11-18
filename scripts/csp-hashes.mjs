/**
 * Después de `next build`: recorre out/**\/*.html, calcula el hash SHA-256 de cada
 * <script> inline ejecutable y agrega a out/_headers una Content-Security-Policy por
 * página. Así la CSP no necesita 'unsafe-inline' para scripts.
 *
 * (Cloudflare combina headers de reglas que coinciden; por eso la CSP va solo en
 * reglas por página y no en "/*".)
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const OUT = path.resolve('out');
const HEADERS = path.join(OUT, '_headers');

if (!fs.existsSync(OUT)) {
  console.error('csp-hashes: no existe /out. Corré `next build` primero.');
  process.exit(1);
}

const ANALYTICS = !!process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

function policy(hashes) {
  const scriptSrc = ["'self'", ...hashes.map((h) => `'sha256-${h}'`), 'https://static.cloudflareinsights.com'];
  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(' ')}`,
    // Atributos style="" del HTML (variables CSS de animación); sin riesgo de ejecución de código.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' https://api.web3forms.com${ANALYTICS ? ' https://cloudflareinsights.com' : ''}`,
    "form-action 'self' https://api.web3forms.com",
    "frame-ancestors 'none'",
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
const rules = [];
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
  total += hashes.size;

  const rel = '/' + path.relative(OUT, file).split(path.sep).join('/');
  // /es/index.html → /es/ ; /404.html → /404.html (Cloudflare la sirve para rutas inexistentes)
  const routes = rel.endsWith('/index.html') ? [rel.slice(0, -'index.html'.length)] : [rel, rel.replace(/\.html$/, '')];
  const csp = policy([...hashes]);
  for (const r of routes) rules.push(`${r}\n  Content-Security-Policy: ${csp}`);
}

const base = fs.existsSync(HEADERS) ? fs.readFileSync(HEADERS, 'utf8').trimEnd() : '';
fs.writeFileSync(HEADERS, `${base}\n\n# --- CSP por página (generado) ---\n${rules.join('\n\n')}\n`);

const longest = Math.max(...rules.map((r) => r.length));
console.log(`csp-hashes: ${rules.length} reglas, ${total} hashes; línea más larga ${longest} caracteres.`);
if (longest > 2000) console.warn('csp-hashes: ⚠ alguna línea supera 2000 caracteres (límite de Cloudflare Pages).');
