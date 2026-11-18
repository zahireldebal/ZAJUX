'use client';

import type { gsap as GsapType } from 'gsap';
import { geometryFor, orbitFrame, type OrbitGeometry } from './orbit';
import { WORD_METRICS } from '@/components/brand/Wordmark';

export interface OrbitTargets {
  root: HTMLElement;
  x: HTMLElement;
  xSharp: SVGSVGElement;
  xBlur: SVGSVGElement;
}

/** Calcula la geometría en píxeles de pantalla a partir del tamaño real del logotipo. */
export function measureGeometry(root: HTMLElement, compact = false): OrbitGeometry {
  const w = root.getBoundingClientRect().width;
  const k = w / WORD_METRICS.width;
  return geometryFor(w, WORD_METRICS.height * k, WORD_METRICS.xCenter * k, WORD_METRICS.zajuCenter * k, compact);
}

/**
 * Devuelve una función que pinta un cuadro de la órbita. Solo toca transform, opacity
 * y z-index (este último únicamente en los extremos laterales, fuera de las letras).
 */
export function createOrbitRenderer(gsap: typeof GsapType, t: OrbitTargets) {
  // quickSetter("css") acepta varias propiedades a la vez (el alias "scale" suelto no funciona)
  const setX = gsap.quickSetter(t.x, 'css') as (v: Record<string, number>) => void;
  const setSharp = gsap.quickSetter(t.xSharp, 'opacity');
  const setBlur = gsap.quickSetter(t.xBlur, 'opacity');
  let front: boolean | null = null;

  return (theta: number, geom: OrbitGeometry, settle: number, restScale = 1) => {
    const f = orbitFrame(theta, geom, settle, restScale);
    setX({ x: f.x, y: f.y, scaleX: f.scale, scaleY: f.scale, opacity: f.opacity });
    setBlur(f.blur);
    setSharp(1 - f.blur * 0.85);
    if (f.front !== front) {
      front = f.front;
      t.x.style.zIndex = front ? '3' : '1';
    }
  };
}

/** Deja la X en su lugar, sin estilos de animación. */
export function resetOrbit(gsap: typeof GsapType, t: OrbitTargets) {
  gsap.set(t.x, { clearProps: 'transform,opacity,zIndex,willChange' });
  gsap.set(t.xSharp, { opacity: 1 });
  gsap.set(t.xBlur, { opacity: 0 });
}
