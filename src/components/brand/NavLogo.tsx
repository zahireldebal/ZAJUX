"use client";

import { useRef } from "react";
import { Isotype } from "./Isotype";
import { Wordmark } from "./Wordmark";
import { loadGsap, prefersReducedMotion } from "@/components/motion/gsap";
import {
  createOrbitRenderer,
  measureGeometry,
  resetOrbit,
} from "@/components/intro/animateOrbit";
import { HOVER_PATH, hoverSettle } from "@/components/intro/orbit";

/** Logo de la navbar. Al pasar el mouse, la X da una vuelta corta alrededor de "ZAJU". */
export function NavLogo({ href, label }: { href: string; label: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const x = useRef<HTMLSpanElement>(null);
  const xSharp = useRef<SVGSVGElement>(null);
  const xBlur = useRef<SVGSVGElement>(null);
  const running = useRef(false);

  const play = async () => {
    if (running.current || prefersReducedMotion()) return;
    if (!root.current || !x.current || !xSharp.current || !xBlur.current)
      return;
    running.current = true;
    const gsap = await loadGsap();
    const targets = {
      root: root.current,
      x: x.current,
      xSharp: xSharp.current,
      xBlur: xBlur.current,
    };
    const geom = measureGeometry(root.current, true);
    const render = createOrbitRenderer(gsap, targets);
    const state = { t: 0 };
    gsap.set(targets.x, { willChange: "transform, opacity" });
    gsap.to(state, {
      t: 1,
      duration: 1.05,
      ease: "power2.inOut",
      onUpdate: () => {
        const theta =
          HOVER_PATH.from + (HOVER_PATH.to - HOVER_PATH.from) * state.t;
        render(theta, geom, hoverSettle(state.t));
      },
      onComplete: () => {
        resetOrbit(gsap, targets);
        gsap.fromTo(
          targets.x,
          { scale: 1.12 },
          {
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.55)",
            clearProps: "transform",
          },
        );
        running.current = false;
      },
    });
  };

  return (
    <a
      href={href}
      aria-label={label}
      className="group flex min-h-11 items-center gap-2.5 rounded-lg"
      onPointerEnter={(e) => e.pointerType === "mouse" && void play()}
    >
      <Isotype className="size-8 shrink-0 sm:size-9" />
      <Wordmark
        className="h-[15px] sm:h-[17px]"
        idPrefix="nav"
        refs={{ root, x, xSharp, xBlur }}
      />
    </a>
  );
}
