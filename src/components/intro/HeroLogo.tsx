'use client';

import { useEffect, useRef } from 'react';
import { Wordmark } from '@/components/brand/Wordmark';
import { getGsap } from '@/components/motion/gsap';
import { createOrbitRenderer, measureGeometry, resetOrbit } from './animateOrbit';
import { INTRO_PATH, introSettle } from './orbit';
import { writeStorage } from '@/lib/storage';

export const INTRO_KEY = 'zajux:intro';

/** Tiempo máximo total de la intro desde la primera pintura (s). */
const BUDGET = 2.35;
/** Duración del encaje (rebote + destello). */
const SNAP = 0.72;
const ORBIT_MAX = 1.45;
/** Con menos tiempo que esto, la X entra directo sin órbita. */
const ORBIT_MIN = 0.55;
/** La órbita nunca recorre menos que esta fracción de la vuelta completa. */
const SWEEP_MIN = 0.55;

/**
 * Logo grande del hero con la intro:
 * 1) "ZAJU" se revela con CSS desde la primera pintura (no espera al JavaScript).
 * 2) La X recorre una órbita elíptica (GSAP), pasando por detrás y por delante.
 * 3) Encaja con rebote elástico y un destello lima.
 *
 * Una vez por sesión; se saltea con clic, toque o tecla; con reduced-motion no corre.
 * El estado inicial lo decide un script en <head> (clase "intro-pending").
 */
export function HeroLogo() {
  const root = useRef<HTMLSpanElement>(null);
  const x = useRef<HTMLSpanElement>(null);
  const xSharp = useRef<SVGSVGElement>(null);
  const xBlur = useRef<SVGSVGElement>(null);
  const flash = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('intro-pending')) return;
    if (!root.current || !x.current || !xSharp.current || !xBlur.current || !flash.current) return;

    const { gsap } = getGsap();
    const targets = { root: root.current, x: x.current, xSharp: xSharp.current, xBlur: xBlur.current };
    const flashEl = flash.current;
    let geom = measureGeometry(targets.root);
    const render = createOrbitRenderer(gsap, targets);

    // Tiempo transcurrido desde la primera pintura: si la carga fue lenta, la órbita
    // recorre menos (a la misma velocidad angular) para no pasarse del presupuesto.
    const paint = performance.getEntriesByType('paint').find((e) => e.name === 'first-paint');
    const elapsed = (performance.now() - (paint?.startTime ?? 0)) / 1000;
    const orbitDur = Math.min(ORBIT_MAX, BUDGET - SNAP - elapsed);
    const fullOrbit = orbitDur >= ORBIT_MIN;
    const sweep = Math.max(SWEEP_MIN, Math.min(1, orbitDur / ORBIT_MAX));
    const from = INTRO_PATH.to - (INTRO_PATH.to - INTRO_PATH.from) * sweep;

    html.classList.add('intro-running');
    writeStorage(INTRO_KEY, '1', 'session');

    const state = { t: 0 };
    const restScale = 1.2;
    const tl = gsap.timeline({
      onComplete: finish,
      defaults: { ease: 'none' },
    });

    gsap.set(targets.x, { willChange: 'transform, opacity' });

    if (fullOrbit) {
      render(from, geom, 0, restScale);
      tl.fromTo(targets.x, { opacity: 0 }, { opacity: 0.42, duration: 0.25, ease: 'power1.out' }, 0);
      tl.to(
        state,
        {
          t: 1,
          duration: orbitDur,
          ease: 'power2.inOut',
          onUpdate: () => {
            const theta = from + (INTRO_PATH.to - from) * state.t;
            render(theta, geom, introSettle(state.t), restScale);
          },
        },
        0,
      );
    } else {
      // Carga lenta: la X entra directo desde adelante, sin vuelta completa.
      gsap.set(targets.x, { opacity: 0, scale: 1.6, y: 12, zIndex: 3 });
      tl.to(targets.x, { opacity: 1, scale: restScale, y: 0, duration: 0.3, ease: 'power3.out' }, 0);
    }

    // Encaje: rebote elástico + destello
    tl.addLabel('snap');
    tl.to(targets.x, { scale: 1, duration: SNAP, ease: 'elastic.out(1, 0.5)' }, 'snap');
    tl.fromTo(
      flashEl,
      { opacity: 0, scale: 0.35 },
      { opacity: 1, scale: 1.25, duration: 0.18, ease: 'power2.out' },
      'snap',
    );
    tl.to(flashEl, { opacity: 0, scale: 1.6, duration: SNAP - 0.18, ease: 'power2.out' }, 'snap+=0.18');

    function finish() {
      resetOrbit(gsap, targets);
      gsap.set(flashEl, { clearProps: 'all' });
      html.classList.remove('intro-pending', 'intro-running');
      cleanup();
    }

    const skip = () => {
      if (tl.progress() >= 1) return;
      html.classList.add('intro-skip');
      tl.progress(1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      skip();
    };
    const onResize = () => {
      geom = measureGeometry(targets.root);
    };

    window.addEventListener('pointerdown', skip, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    function cleanup() {
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    }

    return () => {
      cleanup();
      tl.kill();
      resetOrbit(gsap, targets);
      html.classList.remove('intro-running');
    };
  }, []);

  return (
    <span className="hero-logo relative inline-block">
      <span className="sr-only">ZAJUX</span>
      <Wordmark
        className="h-[clamp(2.75rem,10vw,6.75rem)]"
        idPrefix="hero"
        flash
        refs={{ root, x, xSharp, xBlur, flash }}
      />
    </span>
  );
}
