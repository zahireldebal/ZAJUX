/**
 * Herramienta de desarrollo: graba la intro del logo cuadro por cuadro y prueba
 * saltear y reduced-motion. Requiere el sitio servido (npm run build && npm start).
 *
 *   node scripts/dev/intro-capture.mjs [url] [ancho] [alto]
 *
 * Deja los cuadros en .playwright-mcp/sc-*.jpg y una hoja de contacto en intro-sheet.jpg.
 */
import fs from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const url = process.argv[2] ?? 'http://localhost:4321/es/';
const W = Number(process.argv[3] ?? 1440);
const H = Number(process.argv[4] ?? 900);
const mobile = W < 600;
const dir = '.playwright-mcp';
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const out = {};

// 1) Screencast
{
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, locale: 'es-UY', isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  const c = await ctx.newCDPSession(p);
  const frames = [];
  c.on('Page.screencastFrame', async (e) => {
    frames.push({ t: e.metadata.timestamp, d: e.data });
    await c.send('Page.screencastFrameAck', { sessionId: e.sessionId }).catch(() => {});
  });
  await c.send('Page.startScreencast', { format: 'jpeg', quality: 75, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
  await p.goto(url);
  await p.waitForTimeout(3300);
  await c.send('Page.stopScreencast');
  const fp = await p.evaluate(
    () => performance.timeOrigin / 1000 + (performance.getEntriesByName('first-paint')[0]?.startTime ?? 0) / 1000,
  );
  frames.forEach((f, i) => fs.writeFileSync(`${dir}/sc-${String(i).padStart(3, '0')}.jpg`, Buffer.from(f.d, 'base64')));
  out.frames = frames.length;
  out.msFromPaint = frames.map((f) => Math.round((f.t - fp) * 1000));

  // Hoja de contacto: 16 cuadros repartidos entre 0 y 2,6 s desde la primera pintura
  const targets = Array.from({ length: 16 }, (_, i) => 80 + i * 165);
  const picks = targets.map((ms) => out.msFromPaint.reduce((best, v, i) => (Math.abs(v - ms) < Math.abs(out.msFromPaint[best] - ms) ? i : best), 0));
  const cw = 360;
  const ch = Math.round(cw * (mobile ? 0.9 : 0.42));
  const crop = mobile
    ? { left: 0, top: Math.round(H * 0.12), width: W, height: Math.round(W * 0.9) }
    : { left: Math.round(W * 0.2), top: Math.round(H * 0.14), width: Math.round(W * 0.6), height: Math.round(W * 0.6 * 0.42) };
  const tiles = [];
  for (const [k, i] of picks.entries()) {
    const buf = await sharp(`${dir}/sc-${String(i).padStart(3, '0')}.jpg`).extract(crop).resize(cw, ch).toBuffer();
    const label = Buffer.from(
      `<svg width="${cw}" height="18"><rect width="${cw}" height="18" fill="#000"/><text x="6" y="13" font-size="12" fill="#C6F432" font-family="monospace">${out.msFromPaint[i]} ms</text></svg>`,
    );
    tiles.push({ input: buf, left: (k % 4) * cw, top: Math.floor(k / 4) * (ch + 18) + 18 });
    tiles.push({ input: label, left: (k % 4) * cw, top: Math.floor(k / 4) * (ch + 18) });
  }
  await sharp({ create: { width: cw * 4, height: (ch + 18) * 4, channels: 3, background: '#000' } })
    .composite(tiles)
    .jpeg({ quality: 80 })
    .toFile(`${dir}/intro-sheet.jpg`);
  await ctx.close();
}

// 2) Saltear con una tecla
{
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, locale: 'es-UY' });
  const p = await ctx.newPage();
  await p.goto(url);
  await p.waitForFunction(() => document.documentElement.classList.contains('intro-running'));
  await p.keyboard.press('a');
  await p.waitForTimeout(60);
  out.afterSkip = await p.evaluate(() => ({
    cls: document.documentElement.className.replace(/\S+_variable/g, '').trim(),
    xStyle: document.querySelector('.hero-logo .wordmark-x')?.getAttribute('style'),
    wordAnim: getComputedStyle(document.querySelector('.hero-word')).animationName,
  }));
  await ctx.close();
}

// 3) Reduced motion
{
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, locale: 'es-UY', reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(url);
  await p.waitForTimeout(200);
  out.reduced = await p.evaluate(() => ({
    cls: document.documentElement.className.replace(/\S+_variable/g, '').trim(),
    xOpacity: getComputedStyle(document.querySelector('.hero-logo .wordmark-x')).opacity,
    letterAnim: getComputedStyle(document.querySelector('.hero-logo path')).animationName,
    wordAnim: getComputedStyle(document.querySelector('.hero-word')).animationName,
  }));
  await ctx.close();
}

await browser.close();
delete out.msFromPaint;
console.log(JSON.stringify(out, null, 2));
