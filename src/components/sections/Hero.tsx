import type { CSSProperties } from 'react';
import { HeroLogo } from '@/components/intro/HeroLogo';
import { ContactButton } from '@/components/contact/ContactButton';
import { Arrow } from '@/components/ui/Arrow';
import { contactHref, pagePath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/**
 * Pantalla de inicio: el logo es el protagonista. La X orbita alrededor de "ZAJU"
 * (intro) y después sigue dando vueltas cada tanto; debajo, la frase y dos acciones.
 */
export function Hero({ locale, t }: { locale: Locale; t: Dictionary }) {
  const words = t.hero.title.split(' ');
  return (
    <section aria-labelledby="hero-title" className="hero-stage relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Fondo: brillo lima, horizonte de cuadrícula y anillos de órbita (decorativo) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-glow absolute left-1/2 top-[38%] h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="hero-floor absolute inset-x-0 bottom-0 h-[46%]" />
        <div className="hero-ring absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" style={{ ...d(150), width: '110vmax', aspectRatio: '1044 / 600' }}>
          <div className="hero-ring-spin h-full w-full">
            <svg viewBox="-522 -300 1044 600" className="h-full w-full" fill="none">
              <ellipse rx="520" ry="200" transform="rotate(-8)" stroke="rgb(245 245 247 / 0.07)" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
        <div className="hero-ring absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" style={{ ...d(300), width: '80vmax', aspectRatio: '764 / 414' }}>
          <div className="hero-ring-spin hero-ring-spin--rev h-full w-full">
            <svg viewBox="-382 -207 764 414" className="h-full w-full" fill="none">
              <ellipse rx="380" ry="138" transform="rotate(-8)" stroke="rgb(198 244 50 / 0.18)" strokeDasharray="2 10" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </div>

      <div className="container-x flex flex-1 flex-col items-center justify-center pb-16 pt-28 text-center sm:pt-32">
        <HeroLogo />

        <p className="hero-rise caption mt-8 text-mute sm:mt-10" style={d(250)}>
          {t.hero.eyebrow}
        </p>

        <h1 id="hero-title" className="mt-4 max-w-[22ch] text-h2 font-semibold">
          {words.map((w, i) => (
            <span key={i}>
              <span className="hero-word-mask">
                <span className="hero-word" style={{ '--i': i } as CSSProperties}>
                  {w}
                </span>
              </span>
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>

        <div className="hero-rise mt-10 flex w-full flex-col items-stretch justify-center gap-3 xs:w-auto xs:flex-row" style={d(450)}>
          <ContactButton href={contactHref(locale)} className="btn btn-primary">
            {t.hero.ctaPrimary}
            <Arrow />
          </ContactButton>
          <a href={pagePath(locale, 'services')} className="btn btn-ghost">
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
