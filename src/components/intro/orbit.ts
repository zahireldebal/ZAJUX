/**
 * Órbita elíptica de la X alrededor de "ZAJU".
 *
 * Todas las posiciones son relativas al lugar final de la X (0,0 = encajada).
 * θ = 0 es el extremo derecho de la elipse; θ crece en sentido horario en pantalla:
 *   0 → derecha · π/2 → abajo (DELANTE) · π → izquierda · 3π/2 → arriba (DETRÁS)
 * La profundidad es sin(θ): +1 delante, −1 detrás. El cambio de capa (z-index)
 * ocurre cuando la profundidad cambia de signo, es decir en los extremos laterales,
 * donde la X está fuera de la palabra y el cambio no se ve.
 */

export interface OrbitGeometry {
  /** Centro de la elipse relativo a la X encajada (px). */
  cx: number;
  cy: number;
  /** Semiejes (px). */
  rx: number;
  ry: number;
  /** Inclinación de la elipse (rad). */
  tilt: number;
}

export interface OrbitFrame {
  x: number;
  y: number;
  scale: number;
  /** Opacidad general de la X. */
  opacity: number;
  /** Opacidad de la copia desenfocada (0 = nítida). */
  blur: number;
  /** Inclinación en grados: la X se "inclina" en las curvas, como si tomara velocidad. */
  rot: number;
  front: boolean;
}

/**
 * Geometría a partir de las medidas reales de la palabra.
 * @param wordWidth  ancho del logotipo completo (px en pantalla)
 * @param wordHeight alto de las mayúsculas (px)
 * @param xCenter    centro horizontal de la X dentro del logotipo (px)
 * @param zajuCenter centro horizontal de "ZAJU" (px): la elipse rodea esas letras
 */
export function geometryFor(
  wordWidth: number,
  wordHeight: number,
  xCenter: number,
  zajuCenter: number,
  compact = false,
): OrbitGeometry {
  return {
    cx: zajuCenter - xCenter,
    cy: 0,
    rx: wordWidth * (compact ? 0.52 : 0.64),
    ry: wordHeight * (compact ? 0.42 : 0.5),
    tilt: compact ? -0.08 : -0.14,
  };
}

const SCALE_BACK = 0.62;
const SCALE_FRONT = 1.22;
const OPACITY_BACK = 0.42;
const BANK_DEG = 12;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Punto de la elipse para un ángulo dado. */
export function orbitPoint(theta: number, g: OrbitGeometry) {
  const ex = g.rx * Math.cos(theta);
  const ey = g.ry * Math.sin(theta);
  const c = Math.cos(g.tilt);
  const s = Math.sin(g.tilt);
  return { x: g.cx + ex * c - ey * s, y: g.cy + ex * s + ey * c, depth: Math.sin(theta) };
}

/**
 * Cuadro de la animación.
 * @param theta ángulo actual
 * @param settle 0 = en la órbita, 1 = encajada en su lugar (mezcla en espiral)
 */
export function orbitFrame(theta: number, g: OrbitGeometry, settle: number, restScale = 1): OrbitFrame {
  const p = orbitPoint(theta, g);
  const k = (p.depth + 1) / 2; // 0 detrás → 1 delante
  const orbitScale = lerp(SCALE_BACK, SCALE_FRONT, k);
  const orbitOpacity = lerp(OPACITY_BACK, 1, k);
  const orbitBlur = clamp01(-p.depth * 1.15);
  return {
    x: lerp(p.x, 0, settle),
    y: lerp(p.y, 0, settle),
    scale: lerp(orbitScale, restScale, settle),
    opacity: lerp(orbitOpacity, 1, settle),
    blur: lerp(orbitBlur, 0, settle),
    rot: (1 - settle) * Math.cos(theta) * BANK_DEG,
    front: settle > 0.5 || p.depth >= 0,
  };
}

/* ---------------- Recorridos ---------------- */

/** Intro: entra arriba/detrás, da ~1⅓ vueltas y se cierra en espiral hacia su lugar. */
export const INTRO_PATH = {
  from: -Math.PI / 2 - 0.35,
  to: Math.PI * 2 + Math.PI / 3,
  /** Fracción del recorrido donde empieza a cerrarse la espiral. */
  settleStart: 0.68,
};

/** Puntos de la elipse en píxeles relativos a la X encajada (para dibujar el anillo). */
export function orbitPolyline(g: OrbitGeometry, from: number, to: number, steps = 48) {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = orbitPoint(from + ((to - from) * i) / steps, g);
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return pts.join(' ');
}

/** Navbar (hover) y vueltas del hero: sale de su lugar, da una vuelta y vuelve. */
export const HOVER_PATH = {
  from: 0,
  to: Math.PI * 2,
  /** Sale en el primer 18 % y vuelve en el último 22 %. */
  leave: 0.18,
  arrive: 0.78,
};

export function introSettle(t: number) {
  return smoothstep(INTRO_PATH.settleStart, 1, t);
}

export function hoverSettle(t: number) {
  return 1 - smoothstep(0, HOVER_PATH.leave, t) * (1 - smoothstep(HOVER_PATH.arrive, 1, t));
}
