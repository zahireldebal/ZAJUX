/**
 * Herramienta de desarrollo: corre Lighthouse (mobile por defecto) y resume resultados.
 *   node scripts/dev/lh.mjs [url] [desktop]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:4321/es/';
const desktop = process.argv[3] === 'desktop';
const out = `.playwright-mcp/lh/${desktop ? 'desk' : 'mob'}-${url.replace(/\W+/g, '_')}.json`;
fs.mkdirSync('.playwright-mcp/lh', { recursive: true });
const args = ['-y', 'lighthouse@12', url, '--quiet', '--chrome-flags=--headless=new', '--output=json', `--output-path=${out}`,
  '--only-categories=performance,accessibility,best-practices,seo'];
if (desktop) args.push('--preset=desktop');
execFileSync('npx', args, { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, stdio: 'ignore', shell: true });
const r = JSON.parse(fs.readFileSync(out, 'utf8'));
const A = r.audits;
const s = Object.entries(r.categories).map(([k, v]) => `${k} ${Math.round(v.score * 100)}`).join(' · ');
console.log(`${desktop ? 'DESKTOP' : 'MOBILE'} ${url}\n  ${s}`);
console.log('  ' + ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map((i) => `${i.split('-').map((w) => w[0]).join('').toUpperCase()} ${A[i].displayValue}`).join(' · '));
for (const c of Object.values(r.categories))
  for (const a of c.auditRefs) {
    const au = A[a.id];
    if (au.score !== null && au.score < 0.9 && a.weight > 0) console.log(`  - ${c.id}: ${a.id} (${au.displayValue ?? au.score})`);
  }
