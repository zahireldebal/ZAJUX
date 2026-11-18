import type { CSSProperties } from 'react';
import { HeroLogo } from '@/components/intro/HeroLogo';
import { ContactButton } from '@/components/contact/ContactButton';
import { Arrow } from '@/components/ui/Arrow';
import { sectionHref, SECTION_IDS, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

export function Hero({ locale, t }: { locale: Locale; t: Dictionary }) {
  const words = t.hero.title.split(' ');
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Fondo: cuadrícula, brillo lima y anillos de órbita (decorativo) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-grid absolute inset-0" />
        <div className="hero-glow absolute left-1/2 top-[18%] h-[60vmax] w-[60vmax] -translate-x-1/2 rounded-full" />
        {/* Anillos de órbita: cada uno es su propia capa (se animan sin repintar) */}
          <div className="hero-ring absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 lg:top-[33%]" style={{ ...d(150), width: '104.0vmax', aspectRatio: '1044 / 600' }}>
            <div className="hero-ring-spin h-full w-full"><svg viewBox="-522 -300 1044 600" className="h-full w-full" fill="none"><ellipse rx="520" ry="200" transform="rotate(-8)" stroke="rgb(245 244 240 / 0.07)" vectorEffect="non-scaling-stroke" /></svg></div>
          </div>
          <div className="hero-ring absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 lg:top-[33%]" style={{ ...d(300), width: '76.0vmax', aspectRatio: '764 / 414' }}>
            <svg viewBox="-382 -207 764 414" className="h-full w-full" fill="none"><ellipse rx="380" ry="138" transform="rotate(-8)" stroke="rgb(198 244 50 / 0.16)" strokeDasharray="2 10" vectorEffect="non-scaling-stroke" /></svg>
          </div>
          <div className="hero-ring absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 lg:top-[33%]" style={{ ...d(450), width: '50.0vmax', aspectRatio: '504 / 264' }}>
            <svg viewBox="-252 -132 504 264" className="h-full w-full" fill="none"><ellipse rx="250" ry="88" transform="rotate(-8)" stroke="rgb(245 244 240 / 0.06)" vectorEffect="non-scaling-stroke" /></svg>
          </div>
      </div>

      <div className="container-x flex flex-1 flex-col items-center justify-center pb-16 pt-28 text-center sm:pt-32">
        <HeroLogo />
        <p className="hero-rise label-mono mt-5 text-mute sm:mt-6" style={d(200)}>
          <span className="text-lime">&lt;/&gt;</span> {t.hero.eyebrow}
        </p>

        <h1 id="hero-title" className="mt-10 max-w-[18ch] text-h1 font-semibold sm:mt-14 lg:max-w-[20ch]">
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

        <p className="hero-rise mt-6 max-w-[40rem] text-lead text-mute" style={d(300)}>
          {t.hero.subtitle}
        </p>

        <div className="hero-rise mt-9 flex w-full flex-col items-stretch justify-center gap-3 xs:w-auto xs:flex-row" style={d(500)}>
          <ContactButton href={sectionHref(locale, 'contact')} className="btn btn-primary">
            {t.hero.ctaPrimary}
            <Arrow />
          </ContactButton>
          <a href={`#${SECTION_IDS[locale].services}`} className="btn btn-ghost">
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>

      <div className="hero-rise container-x pb-6" style={d(700)}>
        <ul className="label-mono flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line pt-5 text-[0.7rem] text-mute sm:justify-between">
          {t.hero.badges.map((b, i) => (
            <li key={b} className="flex items-center gap-2">
              <span className="text-faint">{String(i + 1).padStart(2, '0')} /</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
