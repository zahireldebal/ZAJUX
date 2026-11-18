/**
 * Herramienta de desarrollo: recorre la página con scroll real y saca una captura por
 * sección, en desktop y en mobile. También reporta errores de consola y scroll horizontal.
 *
 *   node scripts/dev/shots.mjs [url] [secciones separadas por coma]
 */
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:4321/es/';
const only = process.argv[3]?.split(',');
const dir = '.playwright-mcp/shots';
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const report = {};

for (const [name, vp, mobile] of [
  ['desk', { width: 1440, height: 900 }, false],
  ['mob', { width: 375, height: 760 }, true],
]) {
  const ctx = await browser.newContext({ viewport: vp, locale: 'es-UY', isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => sessionStorage.setItem('zajux:intro', '1'));
  const p = await ctx.newPage();
  const errors = [];
  p.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errors.push(m.text()));
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(url);
  await p.waitForTimeout(600);

  // Bajar despacio hasta el final para disparar todos los revelados
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += vp.height * 0.6) {
    await p.mouse.wheel(0, vp.height * 0.6);
    await p.waitForTimeout(120);
  }
  await p.waitForTimeout(800);

  const ids = await p.evaluate(() => Array.from(document.querySelectorAll('main section[id]')).map((s) => s.id));
  for (const id of ids) {
    if (only && !only.includes(id)) continue;
    await p.evaluate((id) => {
      const el = document.getElementById(id);
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
    }, id);
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${dir}/${name}-${id}.png` });
  }
  report[name] = {
    errors,
    scrollWidth: await p.evaluate(() => document.documentElement.scrollWidth),
    clientWidth: await p.evaluate(() => document.documentElement.clientWidth),
    hidden: await p.evaluate(
      () => Array.from(document.querySelectorAll('[data-reveal],[data-reveal-item],[data-split]')).filter((e) => getComputedStyle(e).opacity === '0').length,
    ),
  };
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 2));
