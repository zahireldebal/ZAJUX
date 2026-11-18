'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { getGsap, prefersReducedMotion } from './gsap';
import { setLenis } from '@/lib/lenisStore';

/**
 * Movimiento global de la página:
 * - Lenis (scroll suave) solo con mouse/trackpad; en pantallas táctiles queda el scroll nativo.
 * - [data-split]: títulos que se revelan por líneas desde una máscara (SplitText).
 * - [data-reveal]: elementos que suben y aparecen al entrar en pantalla.
 * - [data-reveal-group] > [data-reveal-item]: entradas escalonadas.
 *
 * Si no corre (sin JS o reduced-motion), el contenido se ve normal: el CSS solo oculta
 * esos elementos cuando <html> tiene la clase "js-motion".
 */
export function MotionProvider() {
  useEffect(() => {
    const html = document.documentElement;
    if (prefersReducedMotion() || !html.classList.contains('js-motion')) return;

    const { gsap, ScrollTrigger, SplitText } = getGsap();
    let lenis: Lenis | null = null;

    // ---------- Scroll suave ----------
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const tick = (time: number) => lenis?.raf(time * 1000);
    if (finePointer) {
      lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true, syncTouch: false });
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Anclas internas con el mismo easing
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || !lenis || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = url.hash === '#top' ? 0 : document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: target === 0 ? 0 : -80, duration: 1.3 });
      history.pushState(null, '', url.hash);
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);

    const ctx = gsap.context(() => {
      // ---------- Títulos por líneas ----------
      document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
        gsap.set(el, { opacity: 1 });
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.15,
              ease: 'expo.out',
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        });
      });

      // ---------- Elementos sueltos ----------
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0);
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay,
            ease: 'expo.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        );
      });

      // ---------- Grupos escalonados ----------
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
        gsap.fromTo(
          items,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.07,
            clearProps: 'transform',
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          },
        );
      });
    });

    // Si se entró con un enlace a una sección (#planes), volver a ubicarla: el pin del
    // Proceso agrega altura después de que el navegador ya saltó al ancla.
    let userScrolled = false;
    const markUser = () => (userScrolled = true);
    window.addEventListener('wheel', markUser, { passive: true, once: true });
    window.addEventListener('touchstart', markUser, { passive: true, once: true });
    const fixHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = id ? document.getElementById(id) : null;
      if (!el || userScrolled) return;
      const y = el.getBoundingClientRect().top + window.scrollY - 88;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(y, { immediate: true, force: true });
      }
      else window.scrollTo({ top: y, behavior: 'instant' });
    };

    // Recalcular cuando terminan de cargar las fuentes (cambian alturas)
    const settle = () => {
      ScrollTrigger.refresh();
      fixHash();
    };
    const raf = requestAnimationFrame(() => requestAnimationFrame(settle));
    document.fonts?.ready.then(settle).catch(() => {});
    html.classList.add('motion-ready');

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', markUser);
      window.removeEventListener('touchstart', markUser);
      document.removeEventListener('click', onClick);
      ctx.revert();
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      }
    };
  }, []);

  return null;
}
