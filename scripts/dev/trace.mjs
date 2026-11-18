/** Herramienta de desarrollo: graba un trace con CPU 4x y lista los eventos largos del hilo principal. */
import { chromium } from '@playwright/test';
const url = process.argv[2] ?? 'http://localhost:4321/es/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1.75 });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink.user_timing', 'v8.execute'] });
await page.goto(url);
await page.waitForTimeout(5000);
const buf = await browser.stopTracing();
await browser.close();
const ev = JSON.parse(buf.toString()).traceEvents;
const main = ev.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain');
const nav = ev.find((e) => e.name === 'navigationStart')?.ts ?? ev[0].ts;
const tasks = ev.filter((e) => e.tid === main?.tid && e.pid === main?.pid && e.ph === 'X' && e.dur > 50000 && e.name === 'RunTask');
for (const t of tasks.slice(0, 12)) {
  const kids = ev.filter((e) => e.tid === t.tid && e.pid === t.pid && e.ph === 'X' && e.ts >= t.ts && e.ts + e.dur <= t.ts + t.dur && e.dur > 8000 && e.name !== 'RunTask');
  const top = kids.sort((a, b) => b.dur - a.dur).slice(0, 5).map((k) => `${k.name}${k.args?.data?.url ? '(' + k.args.data.url.slice(-30) + ')' : ''}${k.args?.data?.functionName ? '[' + k.args.data.functionName + ']' : ''} ${Math.round(k.dur / 1000)}`);
  console.log(`${Math.round((t.ts - nav) / 1000)}ms dur=${Math.round(t.dur / 1000)} :: ${top.join(' | ')}`);
}
