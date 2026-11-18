/**
 * Genera todas las versiones del logo de ZAJUX a partir de la geometría medida
 * en los originales de ./Fotos y de los contornos de Space Mono Bold.
 *
 *   node scripts/build-logo.mjs
 *
 * Salidas:
 *   src/components/brand/logo-data.ts   trazos para los componentes React (intro, navbar)
 *   public/logo/*.svg|png               versiones del logo
 *   public/icons/*, public/favicon.ico  favicon, apple-touch, íconos PWA
 *   public/og/og-{es,pt,en}.png         imágenes Open Graph por idioma
 */
import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const font = (f) => {
  const buf = readFileSync(path.join(root, 'scripts/fonts', f));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const monoBold = font('SpaceMono-Bold.ttf');
const monoReg = font('Space-Mono-wght-400.ttf');
const grotesk = font('Space-Grotesk-wght-600.ttf');

const C = {
  bg: '#000000',
  surface: '#161617',
  white: '#F5F5F7',
  gray: '#A1A1A6',
  chevron: '#6B7280',
  lime: '#C6F432',
};

const r2 = (n) => Math.round(n * 100) / 100;
/** Serializa un comando de opentype (toPathData de la librería genera NaN en algunos casos). */
const cmdToD = (c) =>
  c.type === "Z" ? "Z" : c.type + [c.x1, c.y1, c.x2, c.y2, c.x, c.y].filter((v) => v !== undefined).map(r2).join(" ") + " ";

/* ------------------------------------------------------------------ */
/* Isotipo: Z con diagonal lima entre chevrons. Unidades = px medidos */
/* en el avatar original, centrado en (0,0).                          */
/* ------------------------------------------------------------------ */
const MARK = {
  bars: [
    { x: -44, y: -41, w: 88, h: 15 },
    { x: -44, y: 26, w: 88, h: 15 },
  ],
  diagonal: { x1: -41, y1: 39, x2: 41, y2: -39, w: 14 },
  chevL: '-53,-21.5 -71.5,0 -53,21.5',
  chevR: '53,-21.5 71.5,0 53,21.5',
  chevW: 7.5,
};

function markInner({ chevrons = true, white = C.white, chev = C.chevron } = {}) {
  const b = MARK.bars
    .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${white}"/>`)
    .join('');
  const d = MARK.diagonal;
  const diag = `<line x1="${d.x1}" y1="${d.y1}" x2="${d.x2}" y2="${d.y2}" stroke="${C.lime}" stroke-width="${d.w}"/>`;
  const ch = chevrons
    ? `<g fill="none" stroke="${chev}" stroke-width="${MARK.chevW}" stroke-linecap="round" stroke-linejoin="round"><polyline points="${MARK.chevL}"/><polyline points="${MARK.chevR}"/></g>`
    : '';
  return ch + b + diag;
}

/** Ícono cuadrado redondeado (como en el logo principal). */
function appIcon({ size = 512, pad = 0.28, chevrons = true, radius = 0.22, bg = C.surface, transparentOuter = true } = {}) {
  // ancho del isotipo con chevrons ≈ 150 u; sin chevrons ≈ 98 u
  const markW = chevrons ? 150 : 100;
  const s = (size * (1 - pad * 2 + (chevrons ? 0.14 : 0))) / markW;
  const rect = transparentOuter
    ? `<rect width="${size}" height="${size}" rx="${size * radius}" fill="${bg}"/>`
    : `<rect width="${size}" height="${size}" fill="${bg}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${rect}<g transform="translate(${size / 2} ${size / 2}) scale(${r2(s)})">${markInner({ chevrons })}</g></svg>`;
}

/* ------------------------------------------------------------------ */
/* Logotipo: "ZAJUX" en Space Mono Bold, altura de mayúscula = 68,    */
/* con el paso entre letras medido en el original (≈ 65,25 px).       */
/* ------------------------------------------------------------------ */
const CAP = 68;
const capUnits = monoBold.tables.os2.sCapHeight;
const fontSize = (CAP * monoBold.unitsPerEm) / capUnits;
const measuredStarts = [519, 578, 646, 713, 780];
const chars = ['Z', 'A', 'J', 'U', 'X'];

// paso entre cajas de avance: ajustado por mínimos cuadrados con el bearing de cada glifo
const lsb = chars.map((c) => {
  const p = monoBold.getPath(c, 0, CAP, fontSize);
  return p.getBoundingBox().x1;
});
const n = chars.length;
const xs = chars.map((_, i) => i);
const ys = measuredStarts.map((s, i) => s - measuredStarts[0] - (lsb[i] - lsb[0]));
const mx = xs.reduce((a, b) => a + b) / n;
const my = ys.reduce((a, b) => a + b) / n;
const pitch = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / xs.reduce((a, x) => a + (x - mx) ** 2, 0);

const letters = chars.map((c, i) => {
  const p = monoBold.getPath(c, i * pitch - lsb[0], CAP, fontSize);
  const bb = p.getBoundingBox();
  return { char: c, d: p.commands.map(cmdToD).join(""), box: { x: r2(bb.x1), y: r2(bb.y1), w: r2(bb.x2 - bb.x1), h: r2(bb.y2 - bb.y1) } };
});
const WORD_W = r2(Math.max(...letters.map((l) => l.box.x + l.box.w)));
const WORD_H = CAP;

function wordmarkSvg({ white = C.white, x = C.lime } = {}) {
  const paths = letters
    .map((l) => `<path fill="${l.char === 'X' ? x : white}" d="${l.d}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORD_W} ${WORD_H}" width="${WORD_W}" height="${WORD_H}">${paths}</svg>`;
}

/** Texto convertido a trazos (para SVG/PNG sin depender de fuentes del sistema). */
function textPath(f, text, x, y, size, { fill, tracking = 0, anchor = 'start' } = {}) {
  let w = 0;
  const glyphs = [...text].map((ch) => f.charToGlyph(ch));
  glyphs.forEach((g) => (w += (g.advanceWidth * size) / f.unitsPerEm + tracking));
  w -= tracking;
  let cx = anchor === 'middle' ? x - w / 2 : x;
  let d = '';
  for (const g of glyphs) {
    d += g.getPath(cx, y, size).commands.map(cmdToD).join("");
    cx += (g.advanceWidth * size) / f.unitsPerEm + tracking;
  }
  return { svg: `<path fill="${fill}" d="${d}"/>`, width: w };
}

/** Logo horizontal completo: ícono + ZAJUX + lema (como el principal). */
function fullLogoSvg({ tagline = 'DISEÑO Y DESARROLLO WEB', light = false } = {}) {
  const ICON = 126;
  const gap = 37;
  const H = 126;
  const wx = ICON + gap;
  const wy = 12;
  const tag = textPath(monoReg, tagline, wx, 122, 14.5, { fill: light ? "#5B606B" : C.gray, tracking: 3.75 });
  const W = Math.ceil(Math.max(wx + WORD_W, wx + tag.width) + 2);
  const iconBg = light ? C.bg : C.surface;
  const s = 0.73;
  const word = letters
    .map((l) => `<path fill="${l.char === 'X' ? C.lime : light ? C.bg : C.white}" d="${l.d}"/>`)
    .join('');
  const underline = light ? `<rect x="${letters[4].box.x - 2}" y="${WORD_H + 6}" width="${letters[4].box.w + 4}" height="7" fill="${C.lime}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${ICON}" height="${ICON}" rx="28" fill="${iconBg}"/><g transform="translate(${ICON / 2} ${ICON / 2}) scale(${s})">${markInner()}</g><g transform="translate(${wx} ${wy})">${word}${underline}</g>${tag.svg}</svg>`;
}

/* ------------------------------------------------------------------ */
/* Open Graph por idioma                                              */
/* ------------------------------------------------------------------ */
const OG = {
  es: { title: ['Webs que hacen crecer', 'tu negocio.'], sub: 'DISEÑO Y DESARROLLO WEB · URUGUAY · BRASIL' },
  pt: { title: ['Sites que fazem o seu', 'negócio crescer.'], sub: 'DESIGN E DESENVOLVIMENTO WEB · URUGUAI · BRASIL' },
  en: { title: ['Websites that grow', 'your business.'], sub: 'WEB DESIGN & DEVELOPMENT · URUGUAY · BRAZIL' },
};

function ogSvg(locale) {
  const W = 1200;
  const H = 630;
  const { title, sub } = OG[locale];
  const grid = [];
  for (let x = 0; x <= W; x += 60) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`);
  for (let y = 0; y <= H; y += 60) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);
  const wordScale = 0.62;
  const word = letters
    .map((l) => `<path fill="${l.char === 'X' ? C.lime : C.white}" d="${l.d}"/>`)
    .join('');
  const t1 = textPath(grotesk, title[0], 80, 330, 76, { fill: C.white, tracking: -1.5 });
  const t2 = textPath(grotesk, title[1], 80, 420, 76, { fill: C.white, tracking: -1.5 });
  const s = textPath(monoReg, sub, 80, 530, 20, { fill: C.gray, tracking: 3 });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs><radialGradient id="g" cx="0.85" cy="0.1" r="0.7"><stop offset="0" stop-color="${C.lime}" stop-opacity="0.16"/><stop offset="1" stop-color="${C.lime}" stop-opacity="0"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <g stroke="#FFFFFF" stroke-opacity="0.04" stroke-width="1">${grid.join('')}</g>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="80" y="80" width="96" height="96" rx="22" fill="${C.surface}"/>
  <g transform="translate(128 128) scale(0.56)">${markInner()}</g>
  <g transform="translate(204 107) scale(${wordScale})">${word}</g>
  ${t1.svg}${t2.svg}
  <rect x="80" y="476" width="64" height="4" fill="${C.lime}"/>
  ${s.svg}
</svg>`;
}

/* ------------------------------------------------------------------ */
async function write(rel, content) {
  const file = path.join(root, rel);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content);
}
const png = (svg, size) => sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer();

async function main() {
  // Datos para React
  const xl = letters[4];
  const ts = `// Archivo generado por scripts/build-logo.mjs — no editar a mano.
export const WORDMARK = {
  width: ${WORD_W},
  height: ${WORD_H},
  letters: ${JSON.stringify(letters.map((l) => ({ char: l.char, d: l.d, box: l.box })), null, 2)},
} as const;

/** Caja de la X dentro del logotipo (para animarla de forma independiente). */
export const X_BOX = ${JSON.stringify(xl.box)} as const;

export const MARK = ${JSON.stringify(MARK, null, 2)} as const;
`;
  await write('src/components/brand/logo-data.ts', ts);

  // SVG del logo
  await write('public/logo/zajux-logo.svg', fullLogoSvg());
  await write('public/logo/zajux-logo-light.svg', fullLogoSvg({ light: true }));
  await write('public/logo/zajux-wordmark.svg', wordmarkSvg());
  await write('public/logo/zajux-wordmark-dark.svg', wordmarkSvg({ white: C.bg }));
  await write('public/logo/zajux-icon.svg', appIcon({ size: 512 }));
  await write(
    'public/logo/zajux-mark.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-76 -46 152 92" width="152" height="92">${markInner()}</svg>`,
  );

  // PNG del logo
  const logo = fullLogoSvg();
  await sharp(Buffer.from(logo), { density: 288 }).png().toFile(path.join(root, 'public/logo/zajux-logo.png'));
  await sharp(Buffer.from(appIcon({ size: 512 }))).png().toFile(path.join(root, 'public/logo/zajux-icon.png'));

  // Favicons: en tamaños chicos sin chevrons (como en "Tamaños chicos" del original)
  const small = appIcon({ size: 64, chevrons: false, pad: 0.2, radius: 0.2 });
  await write('public/icons/icon.svg', appIcon({ size: 64, chevrons: true, pad: 0.24, radius: 0.22 }));
  const f16 = await png(small, 16);
  const f32 = await png(small, 32);
  const f48 = await png(appIcon({ size: 96, chevrons: false, pad: 0.2 }), 48);
  await fs.writeFile(path.join(root, 'public/favicon.ico'), await pngToIco([f16, f32, f48]));
  await fs.writeFile(path.join(root, 'public/icons/apple-touch-icon.png'), await png(appIcon({ size: 180, transparentOuter: false }), 180));
  await fs.writeFile(path.join(root, 'public/icons/icon-192.png'), await png(appIcon({ size: 192 }), 192));
  await fs.writeFile(path.join(root, 'public/icons/icon-512.png'), await png(appIcon({ size: 512 }), 512));
  await fs.writeFile(
    path.join(root, 'public/icons/icon-maskable-512.png'),
    await png(appIcon({ size: 512, pad: 0.34, transparentOuter: false }), 512),
  );

  // Open Graph
  await fs.mkdir(path.join(root, 'public/og'), { recursive: true });
  for (const l of Object.keys(OG)) {
    await sharp(Buffer.from(ogSvg(l))).png({ compressionLevel: 9 }).toFile(path.join(root, `public/og/og-${l}.png`));
  }

  console.log(`Logo generado. Paso entre letras: ${r2(pitch)} · logotipo ${WORD_W}×${WORD_H}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
