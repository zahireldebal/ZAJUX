"use client";

import { useEffect, useRef } from "react";
import { Wordmark, WORD_METRICS } from "@/components/brand/Wordmark";
import { loadGsap, type Gsap } from "@/components/motion/gsap";
import {
  createOrbitRenderer,
  measureGeometry,
  resetOrbit,
  type OrbitTargets,
} from "./animateOrbit";
import {
  HOVER_PATH,
  INTRO_PATH,
  hoverSettle,
  introSettle,
  orbitPolyline,
  type OrbitGeometry,
} from "./orbit";
import { writeStorage } from "@/lib/storage";

export const INTRO_KEY = "zajux:intro";

/** Tiempo máximo total de la intro desde la primera pintura (s). */
const BUDGET = 2.35;
/** Duración del encaje (rebote + destello + onda). */
const SNAP = 0.72;
const ORBIT_MAX = 1.45;
/** Con menos tiempo que esto, la X entra directo sin órbita. */
const ORBIT_MIN = 0.55;
/** La órbita nunca recorre menos que esta fracción de la vuelta completa. */
const SWEEP_MIN = 0.55;
/** Copias de la estela que siguen a la X. */
const GHOSTS = 4;
/** Vueltas en reposo: cada cuánto la X vuelve a orbitar (s) y cuánto dura cada vuelta. */
const LOOP_EVERY = 5.5;
const LOOP_FIRST = 3.2;
const LOOP_DURATION = 2.1;
/** Opacidad del anillo de la órbita en reposo. */
const RING_IDLE = 0.32;

/**
 * Logo grande del hero:
 * 1) "ZAJU" se revela con CSS desde la primera pintura (no espera al JavaScript).
 * 2) Intro: la X recorre una órbita elíptica dejando una estela de luz, pasa por detrás
 *    y por delante de las letras, se inclina en las curvas y encaja con rebote, destello
 *    y una onda expansiva. Un anillo fino dibuja la órbita (mitad detrás, mitad delante).
 * 3) Después, cada pocos segundos (y al pasar el mouse) la X vuelve a dar una vuelta.
 *
 * La intro corre una vez por sesión y se saltea con clic, toque o tecla. Las vueltas se
 * pausan cuando el logo no está a la vista o la pestaña está oculta.
 */
export function HeroLogo() {
  const wrap = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLSpanElement>(null);
  const x = useRef<HTMLSpanElement>(null);
  const xSharp = useRef<SVGSVGElement>(null);
  const xBlur = useRef<SVGSVGElement>(null);
  const flash = useRef<HTMLSpanElement>(null);
  const shock = useRef<HTMLSpanElement>(null);
  const ghosts = useRef<HTMLSpanElement[]>([]);
  const ringBack = useRef<SVGSVGElement>(null);
  const ringFront = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("js-motion")) return;
    const els = [root.current, x.current, xSharp.current, xBlur.current, flash.current, shock.current, ringBack.current, ringFront.current, wrap.current];
    if (els.some((el) => !el)) return;

    let disposed = false;
    let stop: (() => void) | undefined;
    loadGsap()
      .then((gsap) => {
        if (!disposed) stop = run(gsap);
      })
      .catch(() => html.classList.remove("intro-pending"));
    return () => {
      disposed = true;
      stop?.();
    };

    function run(gsap: Gsap) {
      const targets: OrbitTargets = {
        root: root.current!,
        x: x.current!,
        xSharp: xSharp.current!,
        xBlur: xBlur.current!,
        ghosts: ghosts.current.filter(Boolean),
      };
      const flashEl = flash.current!;
      const shockEl = shock.current!;
      const rings = [ringBack.current!, ringFront.current!];
      const render = createOrbitRenderer(gsap, targets);
      let geom = measureGeometry(targets.root);
      drawRings(geom);

      const live: gsap.core.Animation[] = [];
      let loopCall: gsap.core.Tween | null = null;
      let busy = false;
      let visible = true;

      /* ---------- Anillo: dos mitades (detrás y delante de las letras) ---------- */
      function drawRings(g: OrbitGeometry) {
        const k = targets.root.getBoundingClientRect().width / WORD_METRICS.width;
        const t = `translate(${(WORD_METRICS.xCenter * k).toFixed(1)} ${(WORD_METRICS.xMiddle * k).toFixed(1)})`;
        const halves = [orbitPolyline(g, Math.PI, Math.PI * 2), orbitPolyline(g, 0, Math.PI)];
        rings.forEach((svg, i) => {
          svg.querySelector("g")?.setAttribute("transform", t);
          svg.querySelectorAll("polyline").forEach((pl) => pl.setAttribute("points", halves[i]!));
        });
      }

      /* ---------- Encaje: rebote, destello y onda expansiva ---------- */
      function snap(tl: gsap.core.Timeline, at: string | number, strength = 1) {
        tl.to(targets.x, { scale: 1, duration: SNAP, ease: "elastic.out(1, 0.5)" }, at);
        tl.fromTo(flashEl, { opacity: 0, scale: 0.35 }, { opacity: strength, scale: 1.25, duration: 0.18, ease: "power2.out" }, at);
        tl.to(flashEl, { opacity: 0, scale: 1.6, duration: SNAP - 0.18, ease: "power2.out" }, `${typeof at === "number" ? at : at}+=0.18`);
        tl.fromTo(shockEl, { opacity: 0.85 * strength, scale: 0.3 }, { opacity: 0, scale: 2.8, duration: 0.95, ease: "power3.out" }, at);
      }

      /* ---------- Vuelta en reposo ---------- */
      function scheduleLoop(delay = LOOP_EVERY) {
        loopCall?.kill();
        loopCall = gsap.delayedCall(delay, () => {
          if (visible && !document.hidden) loop();
          else scheduleLoop(1.5);
        });
      }

      function loop() {
        if (busy) return;
        busy = true;
        loopCall?.kill();
        const state = { t: 0 };
        gsap.set(targets.x, { willChange: "transform, opacity" });
        const tl = gsap.timeline({
          onComplete: () => {
            resetOrbit(gsap, targets);
            busy = false;
            scheduleLoop();
          },
        });
        tl.to(rings, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0);
        tl.to(
          state,
          {
            t: 1,
            duration: LOOP_DURATION,
            ease: "power1.inOut",
            onUpdate: () => {
              const theta = HOVER_PATH.from + (HOVER_PATH.to - HOVER_PATH.from) * state.t;
              render(theta, geom, hoverSettle(state.t), 1.12);
            },
          },
          0,
        );
        tl.addLabel("snap", LOOP_DURATION - 0.05);
        snap(tl, "snap", 0.6);
        tl.to(rings, { opacity: RING_IDLE, duration: 0.9, ease: "power2.out" }, "snap");
        live.push(tl);
      }

      /* ---------- Intro (una vez por sesión) ---------- */
      function intro() {
        // Tiempo transcurrido desde la primera pintura: si la carga fue lenta, la órbita
        // recorre menos (a la misma velocidad angular) para no pasarse del presupuesto.
        const paint = performance.getEntriesByType("paint").find((e) => e.name === "first-paint");
        const elapsed = (performance.now() - (paint?.startTime ?? 0)) / 1000;
        const orbitDur = Math.min(ORBIT_MAX, BUDGET - SNAP - elapsed);
        const fullOrbit = orbitDur >= ORBIT_MIN;
        const sweep = Math.max(SWEEP_MIN, Math.min(1, orbitDur / ORBIT_MAX));
        const from = INTRO_PATH.to - (INTRO_PATH.to - INTRO_PATH.from) * sweep;

        html.classList.add("intro-running");
        writeStorage(INTRO_KEY, "1", "session");
        busy = true;

        const state = { t: 0 };
        const restScale = 1.2;
        const tl = gsap.timeline({ onComplete: finish, defaults: { ease: "none" } });
        gsap.set(targets.x, { willChange: "transform, opacity" });

        if (fullOrbit) {
          render(from, geom, 0, restScale);
          tl.fromTo(targets.x, { opacity: 0 }, { opacity: 0.42, duration: 0.25, ease: "power1.out" }, 0);
          tl.fromTo(rings, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0);
          tl.to(
            state,
            {
              t: 1,
              duration: orbitDur,
              ease: "power2.inOut",
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
          tl.to(targets.x, { opacity: 1, scale: restScale, y: 0, duration: 0.3, ease: "power3.out" }, 0);
          tl.to(rings, { opacity: 1, duration: 0.3 }, 0);
        }

        tl.addLabel("snap");
        snap(tl, "snap");
        tl.to(rings, { opacity: RING_IDLE, duration: 1, ease: "power2.out" }, "snap");

        function finish() {
          resetOrbit(gsap, targets);
          gsap.set(flashEl, { clearProps: "all" });
          html.classList.remove("intro-pending", "intro-running");
          removeSkip();
          busy = false;
          scheduleLoop(LOOP_FIRST);
        }

        const skip = () => {
          if (tl.progress() >= 1) return;
          html.classList.add("intro-skip");
          tl.progress(1);
        };
        const onKey = (e: KeyboardEvent) => {
          if (e.metaKey || e.ctrlKey || e.altKey) return;
          skip();
        };
        window.addEventListener("pointerdown", skip, { passive: true });
        window.addEventListener("keydown", onKey);
        function removeSkip() {
          window.removeEventListener("pointerdown", skip);
          window.removeEventListener("keydown", onKey);
        }
        live.push(tl);
        return removeSkip;
      }

      const removeSkip = html.classList.contains("intro-pending") ? intro() : undefined;
      if (!removeSkip) {
        gsap.to(rings, { opacity: RING_IDLE, duration: 1.2, delay: 0.3, ease: "power2.out" });
        scheduleLoop(LOOP_FIRST - 1);
      }

      /* ---------- Pausas, hover y tamaño ---------- */
      const io = new IntersectionObserver(([e]) => {
        visible = !!e?.isIntersecting;
      });
      io.observe(targets.root);
      const onEnter = (e: PointerEvent) => {
        if (e.pointerType === "mouse" && !html.classList.contains("intro-running")) loop();
      };
      wrap.current!.addEventListener("pointerenter", onEnter);
      const onResize = () => {
        geom = measureGeometry(targets.root);
        drawRings(geom);
      };
      window.addEventListener("resize", onResize);

      return () => {
        removeSkip?.();
        io.disconnect();
        wrap.current?.removeEventListener("pointerenter", onEnter);
        window.removeEventListener("resize", onResize);
        loopCall?.kill();
        live.forEach((a) => a.kill());
        resetOrbit(gsap, targets);
        html.classList.remove("intro-running");
      };
    }
  }, []);

  return (
    <span ref={wrap} className="hero-logo relative inline-block">
      <span className="sr-only">ZAJUX</span>
      <Wordmark
        className="h-[clamp(3.25rem,12.5vw,8.25rem)]"
        idPrefix="hero"
        flash
        ghosts={GHOSTS}
        back={<OrbitRing ref={ringBack} className="z-[1]" dashed />}
        front={<OrbitRing ref={ringFront} className="z-[3]" />}
        refs={{
          root,
          x,
          xSharp,
          xBlur,
          flash,
          shock,
          ghost: (i, el) => {
            if (el) ghosts.current[i] = el;
          },
        }}
      />
    </span>
  );
}

/** Mitad del anillo de la órbita. Los puntos los dibuja el efecto según el tamaño real del logo. */
function OrbitRing({ ref, className, dashed = false }: { ref: React.Ref<SVGSVGElement>; className: string; dashed?: boolean }) {
  return (
    <svg ref={ref} aria-hidden="true" width="1" height="1" className={`orbit-ring pointer-events-none absolute left-0 top-0 overflow-visible opacity-0 ${className}`}>
      <g>
        <polyline fill="none" stroke="rgb(198 244 50 / 0.16)" strokeWidth="6" strokeLinecap="round" />
        <polyline
          fill="none"
          stroke={dashed ? 'rgb(198 244 50 / 0.45)' : 'rgb(198 244 50 / 0.8)'}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray={dashed ? '2 7' : undefined}
        />
      </g>
    </svg>
  );
}
