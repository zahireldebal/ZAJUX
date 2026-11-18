'use client';

import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import type { SplitText as SplitTextType } from 'gsap/SplitText';

export type Gsap = typeof GsapType;

let gsapPromise: Promise<Gsap> | null = null;

/**
 * GSAP se descarga aparte (no forma parte del JavaScript inicial). La intro lo pide
 * enseguida; el resto de las animaciones, cuando el navegador queda libre.
 */
export function loadGsap(): Promise<Gsap> {
  if (!gsapPromise) {
    gsapPromise = import('gsap').then(({ gsap }) => {
      gsap.defaults({ ease: 'expo.out', duration: 0.9 });
      return gsap;
    });
  }
  return gsapPromise;
}

export interface ScrollPlugins {
  gsap: Gsap;
  ScrollTrigger: typeof ScrollTriggerType;
  SplitText: typeof SplitTextType;
}

let pluginsPromise: Promise<ScrollPlugins> | null = null;

/** ScrollTrigger y SplitText (registrados una sola vez). */
export function loadScrollPlugins(): Promise<ScrollPlugins> {
  if (!pluginsPromise) {
    pluginsPromise = Promise.all([loadGsap(), import('gsap/ScrollTrigger'), import('gsap/SplitText')]).then(([gsap, st, sp]) => {
      gsap.registerPlugin(st.ScrollTrigger, sp.SplitText);
      return { gsap, ScrollTrigger: st.ScrollTrigger, SplitText: sp.SplitText };
    });
  }
  return pluginsPromise;
}

/** Ejecuta `fn` cuando el navegador está libre (con un máximo de espera). */
export function whenIdle(fn: () => void, timeout = 1200) {
  if (typeof window === 'undefined') return () => {};
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
