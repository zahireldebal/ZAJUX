"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadScrollPlugins,
  prefersReducedMotion,
} from "@/components/motion/gsap";
import { SECTION_IDS, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

/**
 * Proceso en 5 pasos.
 * - Desktop (≥1024 px, con movimiento): la sección queda fijada y los pasos se suceden con el scroll.
 * - Mobile / reduced-motion / sin JS: lista vertical con una línea que se completa al bajar.
 */
export function Process({
  locale,
  t,
  index,
}: {
  locale: Locale;
  t: Dictionary["process"];
  index: number;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const n = t.steps.length;

  useEffect(() => {
    if (
      prefersReducedMotion() ||
      !document.documentElement.classList.contains("js-motion") ||
      !root.current
    )
      return;
    const el = root.current;
    let mm: gsap.MatchMedia | null = null;
    let disposed = false;
    loadScrollPlugins().then(({ gsap }) => {
      if (disposed) return;
      mm = gsap.matchMedia();

      mm.add("(min-width: 64rem)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
        const bar = el.querySelector<HTMLElement>("[data-progress]");
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: el.querySelector("[data-pin]"),
            start: "top top",
            end: () => `+=${window.innerHeight * 0.75 * (n - 1)}`,
            pin: true,
            scrub: 0.6,
            snap: {
              snapTo: "labels",
              duration: { min: 0.25, max: 0.7 },
              delay: 0.05,
              ease: "power2.inOut",
            },
            onUpdate: (self) =>
              setActive(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
          },
        });
        tl.addLabel("s0");
        steps.forEach((step, i) => {
          if (i === 0) return;
          tl.to(steps[i - 1]!, { opacity: 0, yPercent: -14 }, `s${i - 1}+=0.15`)
            .fromTo(
              step,
              { opacity: 0, yPercent: 14 },
              { opacity: 1, yPercent: 0 },
              "<+=0.2",
            )
            .addLabel(`s${i}`);
        });
        if (bar)
          tl.fromTo(
            bar,
            { scaleY: 1 / n },
            { scaleY: 1, ease: "none", duration: tl.duration() },
            0,
          );
        return () => setActive(0);
      });

      mm.add("(max-width: 63.99rem)", () => {
        const line = el.querySelector<HTMLElement>("[data-line]");
        if (!line) return;
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.querySelector("[data-steps]"),
              start: "top 70%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
      });
    });
    return () => {
      disposed = true;
      mm?.revert();
    };
  }, [n]);

  return (
    <section
      ref={root}
      id={SECTION_IDS[locale].process}
      aria-labelledby="process-title"
      className="process relative"
      tabIndex={-1}
    >
      <div
        data-pin
        className="section-y lg:flex lg:min-h-[100svh] lg:items-center lg:py-0"
      >
        <div className="container-x grid w-full gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p
              className="label-mono flex items-center gap-3 text-mute"
              data-reveal
            >
              <span className="text-lime">
                {String(index).padStart(2, "0")} /
              </span>
              {t.eyebrow}
              <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
            </p>
            <h2
              id="process-title"
              className="mt-5 text-h2 font-semibold"
              data-split
            >
              {t.title}
            </h2>
            <p className="mt-6 max-w-md text-lead text-mute" data-reveal>
              {t.intro}
            </p>

            {/* Índice de pasos (solo desktop con pin) */}
            <ol
              aria-hidden="true"
              className="process-index relative mt-12 hidden pl-6 lg:block"
            >
              <span className="absolute left-0 top-0 h-full w-px bg-line" />
              <span
                data-progress
                className="absolute left-0 top-0 h-full w-px origin-top bg-lime"
                style={{ transform: `scaleY(${1 / n})` }}
              />
              {t.steps.map((s, i) => (
                <li
                  key={s.title}
                  className={`flex items-baseline gap-4 py-1.5 transition-colors duration-500 ${i === active ? "text-paper" : "text-faint"}`}
                >
                  <span
                    className={`label-mono ${i === active ? "text-lime" : ""}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.95rem]">{s.title}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative lg:col-span-7">
            <span
              data-line
              aria-hidden="true"
              className="absolute left-[1.125rem] top-2 h-[calc(100%-1rem)] w-px origin-top bg-lime lg:hidden"
            />
            <span
              aria-hidden="true"
              className="absolute left-[1.125rem] top-2 h-[calc(100%-1rem)] w-px bg-line lg:hidden"
            />
            <ol
              data-steps
              className="process-stage relative flex flex-col gap-10 lg:gap-6"
            >
              {t.steps.map((s, i) => (
                <li
                  key={s.title}
                  data-step
                  className="process-step relative pl-12 lg:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-full border border-line-strong bg-ink font-mono text-xs text-lime lg:hidden"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="lg:rounded-[var(--radius-card)] lg:border lg:border-line lg:bg-ink-2 lg:p-10 xl:p-12">
                    <span
                      aria-hidden="true"
                      className="process-num hidden font-semibold leading-none tracking-tighter lg:block"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-h3 font-medium lg:mt-8 lg:text-h2">
                      {s.title}
                    </h3>
                    <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 lg:mt-8 lg:gap-8 lg:pt-8">
                      <div>
                        <dt className="label-mono text-[0.68rem] text-faint">
                          {t.you}
                        </dt>
                        <dd className="mt-2 text-paper/90">{s.you}</dd>
                      </div>
                      <div>
                        <dt className="label-mono text-[0.68rem] text-lime">
                          {t.us}
                        </dt>
                        <dd className="mt-2 text-paper/90">{s.us}</dd>
                      </div>
                    </dl>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
