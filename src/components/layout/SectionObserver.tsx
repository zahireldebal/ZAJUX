'use client';

import { useEffect } from 'react';
import { SECTION_IDS, SECTION_KEYS, type Locale } from '@/i18n/config';
import { setActiveSection } from '@/lib/activeSection';

/** Observa qué sección ocupa el centro de la pantalla. */
export function SectionObserver({ locale }: { locale: Locale }) {
  useEffect(() => {
    const els = SECTION_KEYS.map((k) => document.getElementById(SECTION_IDS[locale][k])).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const key = SECTION_KEYS.find((k) => SECTION_IDS[locale][k] === e.target.id) ?? null;
            setActiveSection(key);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    const top = () => {
      if (window.scrollY < window.innerHeight * 0.4) setActiveSection(null);
    };
    window.addEventListener('scroll', top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', top);
    };
  }, [locale]);
  return null;
}
