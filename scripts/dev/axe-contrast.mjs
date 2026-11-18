/** Herramienta de desarrollo: corre la regla de contraste de axe como Lighthouse (sin recorrer la página). */
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const url = process.argv[2] ?? 'http://localhost:4321/es/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1.75 });
const page = await ctx.newPage();
await page.goto(url);
await page.waitForTimeout(3000);
const r = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
for (const v of r.violations) for (const n of v.nodes) console.log(n.target.join(' '), '\n  ', n.failureSummary?.split('\n')[1], '\n  related:', n.any?.[0]?.relatedNodes?.map((x) => x.html.slice(0, 120)).join(' || '));
console.log('violations:', r.violations.length);
await browser.close();
