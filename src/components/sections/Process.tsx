"use client";

import { useEffect, useRef, useState } from "react";
import {
  loadScrollPlugins,
} from "@/components/motion/gsap";
import type { Dictionary } from "@/i18n";

/**
 * Proceso en 5 pasos.
 * - Desktop (≥1024 px, con movimiento): la sección queda fijada y los pasos se suceden con el scroll.
 * - Mobile / sin JS: lista vertical con una línea que se completa al bajar.
 */
export function Process({
  t,
  level = 2,
}: {
  t: Dictionary["process"];
  level?: 1 | 2;
}) {
  const Title = level === 1 ? "h1" : "h2";
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const n = t.steps.length;

  useEffect(() => {
    if (
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
      aria-labelledby="process-title"
      className="process relative"
    >
      <div
        data-pin
        className={`${level === 1 ? "section-first lg:pt-24" : "section-y lg:py-0"} lg:flex lg:min-h-[100svh] lg:items-center lg:pb-0`}
      >
        <div className="container-x grid w-full gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow" data-reveal>
              {t.eyebrow}
            </p>
            <Title
              id="process-title"
              className={`mt-4 font-semibold ${level === 1 ? "text-h1" : "text-h2"}`}
              data-split
            >
              {t.title}
            </Title>
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
                  className={`flex items-center gap-4 py-1.5 transition-colors duration-500 ${i === active ? "text-paper" : "text-faint"}`}
                >
                  <span
                    className={`size-1.5 shrink-0 translate-y-[-0.15em] rounded-full transition-colors duration-500 ${i === active ? "bg-lime" : "bg-line-strong"}`}
                  />
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
                    className="absolute left-[0.8125rem] top-[0.45rem] flex size-[0.75rem] rounded-full border-2 border-lime bg-ink lg:hidden"
                  />
                  <div className="lg:rounded-[var(--radius-card)] lg:bg-surface lg:p-10 xl:p-14">
                    <span
                      aria-hidden="true"
                      className="hidden h-[3px] w-10 rounded-full bg-lime lg:block"
                    />
                    <h3 className="text-h3 font-semibold lg:mt-8 lg:text-h2">
                      {s.title}
                    </h3>
                    <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 lg:mt-8 lg:gap-8 lg:pt-8">
                      <div>
                        <dt className="caption text-faint">
                          {t.you}
                        </dt>
                        <dd className="mt-2 text-paper/90">{s.you}</dd>
                      </div>
                      <div>
                        <dt className="caption text-lime">
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
