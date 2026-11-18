'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { Dictionary } from '@/i18n';

type T = Dictionary['demos']['beforeAfter'];

/** Ilustración "antes": una web vieja genérica (propia, no es captura de ningún sitio real). */
function OldSite({ t }: { t: T }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#efe9d2] font-serif text-[#1d1d8f]">
      <div className="bg-gradient-to-b from-[#3b5bdb] to-[#1c2f8f] px-3 pb-2 pt-8 text-center text-[0.68rem] font-bold leading-tight text-[#ffef5c]">
        ★ ★ ★ {t.oldTitle} ★ ★ ★
      </div>
      <div className="flex flex-1 gap-2 p-2">
        <div className="flex w-1/4 flex-col gap-1">
          {t.oldMenu.map((x) => (
            <span key={x} className="border border-[#7a7a7a] bg-gradient-to-b from-white to-[#c9c9c9] px-1 py-0.5 text-center text-[0.55rem] text-black">
              {x}
            </span>
          ))}
          <span className="mt-auto border border-black bg-black px-1 text-center font-mono text-[0.55rem] text-[#39ff14]">000123</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-2 border-2 border-dashed border-[#b03030] p-2 text-center">
          <div className="flex h-12 w-20 items-center justify-center rounded-sm bg-[#c0c0c0] text-[0.5rem] text-[#555]">[ img ]</div>
          <p className="text-[0.62rem] italic leading-tight text-[#b03030] underline">{t.oldText}</p>
          <span className="rounded-full bg-gradient-to-b from-[#ff9c3b] to-[#e0400a] px-3 py-1 text-[0.55rem] font-bold text-white shadow-[2px_2px_0_#000]">
            {t.oldCta}
          </span>
          <p className="mt-auto text-[0.45rem] text-[#555]">{t.oldFooter}</p>
        </div>
      </div>
    </div>
  );
}

/** Ilustración "después": diseño moderno, oscuro y claro de leer. */
function NewSite({ t }: { t: T }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-ink p-4 text-paper sm:p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em]">{t.newBrand}</span>
        <span className="flex gap-1">
          <span className="h-1 w-4 rounded-full bg-paper/40" />
          <span className="h-1 w-4 rounded-full bg-paper/40" />
        </span>
      </div>
      <div className="mt-auto">
        <span className="label-mono text-[0.5rem] text-lime">{t.newPlace}</span>
        <p className="mt-1 text-[1.05rem] font-semibold leading-[1.05] tracking-tight sm:text-xl">{t.newTitle}</p>
        <p className="mt-1.5 text-[0.62rem] text-mute">{t.newText}</p>
        <span className="mt-3 inline-flex rounded-full bg-lime px-3 py-1.5 text-[0.6rem] font-medium text-ink">{t.newCta} →</span>
      </div>
      <div aria-hidden="true" className="absolute right-4 top-10 size-20 rounded-full border border-lime/30 sm:size-24">
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-lime/25 to-transparent" />
      </div>
    </div>
  );
}

export function BeforeAfterDemo({ t }: { t: T }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromEvent = (e: PointerEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setPos((p) => Math.max(0, p - step));
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setPos((p) => Math.min(100, p + step));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div className="flex h-full flex-col">
      <div
        ref={box}
        className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-xl border border-line lg:aspect-auto lg:min-h-[20rem] lg:flex-1"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          fromEvent(e);
        }}
        onPointerMove={(e) => dragging.current && fromEvent(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <NewSite t={t} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <OldSite t={t} />
        </div>

        <span className="label-mono pointer-events-none absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[0.6rem] text-white">
          {t.before}
        </span>
        <span className="label-mono pointer-events-none absolute right-2 top-2 rounded-full bg-lime px-2 py-0.5 text-[0.6rem] text-ink">
          {t.after}
        </span>

        <div className="pointer-events-none absolute inset-y-0 w-px bg-lime" style={{ left: `${pos}%` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-label={t.handle}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}%`}
          onKeyDown={onKey}
          className="absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-lime bg-ink text-lime shadow-lg"
          style={{ left: `${pos}%` }}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
