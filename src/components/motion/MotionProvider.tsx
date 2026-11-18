"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import {
  loadScrollPlugins,
  prefersReducedMotion,
  whenIdle,
  type ScrollPlugins,
} from "./gsap";
import { setLenis } from "@/lib/lenisStore";

/**
 * Movimiento global de la página:
 * - Lenis (scroll suave) solo con mouse/trackpad; en pantallas táctiles queda el scroll nativo.
 * - [data-split]: títulos que se revelan por líneas desde una máscara (SplitText).
 * - [data-reveal]: elementos que suben y aparecen al entrar en pantalla.
 * - [data-reveal-group] > [data-reveal-item]: entradas escalonadas.
 *
 * Rendimiento: los revelados usan IntersectionObserver y cada título se divide en
 * líneas recién cuando está por entrar (y se restaura al terminar), así el arranque
 * no fuerza cálculos de layout de toda la página.
 *
 * Si no corre (sin JS o reduced-motion), el contenido se ve normal: el CSS solo oculta
 * esos elementos cuando <html> tiene la clase "js-motion".
 */
export function MotionProvider() {
  useEffect(() => {
    const html = document.documentElement;
    if (prefersReducedMotion() || !html.classList.contains("js-motion")) return;

    // Se arma cuando el navegador queda libre: no compite con la primera pintura ni con la intro.
    let disposed = false;
    let cleanup = () => {};
    const cancelIdle = whenIdle(() => {
      Promise.all([loadScrollPlugins(), import("lenis")])
        .then(([plugins, mod]) => {
          if (!disposed && html.classList.contains("js-motion"))
            cleanup = setup(plugins, mod.default);
        })
        .catch(() => html.classList.remove("js-motion"));
    });
    return () => {
      disposed = true;
      cancelIdle();
      cleanup();
    };
  }, []);

  return null;
}

function setup(
  { gsap, ScrollTrigger, SplitText }: ScrollPlugins,
  LenisCtor: typeof Lenis,
): () => void {
  const html = document.documentElement;
  let lenis: Lenis | null = null;

  // ---------- Scroll suave ----------
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const tick = (time: number) => lenis?.raf(time * 1000);
  if (finePointer) {
    lenis = new LenisCtor({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: false,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
  }

  // Anclas internas con el mismo easing
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest(
      'a[href*="#"]',
    ) as HTMLAnchorElement | null;
    if (!a || !lenis || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const url = new URL(a.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;
    const target =
      url.hash === "#top"
        ? 0
        : document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: target === 0 ? 0 : -80, duration: 1.3 });
    history.pushState(null, "", url.hash);
    if (target instanceof HTMLElement) target.focus({ preventScroll: true });
  };
  document.addEventListener("click", onClick);

  // ---------- Revelados al entrar en pantalla ----------
  const tweens: gsap.core.Animation[] = [];
  const reveal = (el: HTMLElement) => {
    if (el.hasAttribute("data-split")) {
      gsap.set(el, { opacity: 1 });
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
      });
      tweens.push(
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.09,
          onComplete: () => split.revert(),
        }),
      );
    } else if (el.hasAttribute("data-reveal-group")) {
      const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
      tweens.push(
        gsap.fromTo(
          items,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.07,
            clearProps: "transform",
          },
        ),
      );
    } else {
      tweens.push(
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: Number(el.dataset.revealDelay ?? 0),
            ease: "expo.out",
            clearProps: "transform",
          },
        ),
      );
    }
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        reveal(entry.target as HTMLElement);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  document
    .querySelectorAll<HTMLElement>(
      "[data-split], [data-reveal], [data-reveal-group]",
    )
    .forEach((el) => io.observe(el));

  // ---------- Anclas al cargar ----------
  // Si se entró con un enlace a una sección (#planes), volver a ubicarla: el pin del
  // Proceso agrega altura después de que el navegador ya saltó al ancla.
  let userScrolled = false;
  const markUser = () => (userScrolled = true);
  window.addEventListener("wheel", markUser, { passive: true, once: true });
  window.addEventListener("touchstart", markUser, {
    passive: true,
    once: true,
  });
  const fixHash = () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (!el || userScrolled) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 88;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(y, { immediate: true, force: true });
    } else window.scrollTo({ top: y, behavior: "instant" });
  };
  const settle = () => {
    ScrollTrigger.refresh();
    fixHash();
  };
  const raf = requestAnimationFrame(() => requestAnimationFrame(settle));
  document.fonts?.ready.then(settle).catch(() => {});
  html.classList.add("motion-ready");

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    tweens.forEach((t) => t.kill());
    window.removeEventListener("wheel", markUser);
    window.removeEventListener("touchstart", markUser);
    document.removeEventListener("click", onClick);
    if (lenis) {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    }
  };
}
