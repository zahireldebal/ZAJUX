import type { PersonId } from '@/data/business';

export const LOCALES = ['es', 'pt', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (LOCALES as readonly string[]).includes(v);

/** Valor de hreflang / atributo lang de cada idioma. */
export const HREFLANG: Record<Locale, string> = { es: 'es', pt: 'pt-BR', en: 'en' };
export const OG_LOCALE: Record<Locale, string> = { es: 'es_UY', pt: 'pt_BR', en: 'en_US' };
export const LOCALE_LABEL: Record<Locale, string> = { es: 'Español', pt: 'Português', en: 'English' };

/** Ruteo de contacto según idioma: ES → Juani (Uruguay); PT y EN → Zahir (Brasil). */
export const CONTACT_PERSON: Record<Locale, PersonId> = { es: 'juani', pt: 'zahir', en: 'zahir' };

/** Clave en localStorage con el idioma elegido por la persona. */
export const LOCALE_STORAGE_KEY = 'zajux:locale';

/* ---------- Secciones de la one-page (ids localizados) ---------- */
export const SECTION_KEYS = [
  'services',
  'demos',
  'process',
  'why',
  'plans',
  'about',
  'projects',
  'faq',
  'contact',
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const SECTION_IDS: Record<Locale, Record<SectionKey, string>> = {
  es: {
    services: 'servicios',
    demos: 'demos',
    process: 'proceso',
    why: 'por-que-zajux',
    plans: 'planes',
    about: 'nosotros',
    projects: 'proyectos',
    faq: 'preguntas',
    contact: 'contacto',
  },
  pt: {
    services: 'servicos',
    demos: 'demos',
    process: 'processo',
    why: 'por-que-zajux',
    plans: 'planos',
    about: 'sobre-nos',
    projects: 'projetos',
    faq: 'perguntas',
    contact: 'contato',
  },
  en: {
    services: 'services',
    demos: 'demos',
    process: 'process',
    why: 'why-zajux',
    plans: 'plans',
    about: 'about',
    projects: 'projects',
    faq: 'faq',
    contact: 'contact',
  },
};

export const sectionKeyFromId = (locale: Locale, id: string): SectionKey | undefined =>
  SECTION_KEYS.find((k) => SECTION_IDS[locale][k] === id);

/* ---------- Páginas legales (slugs localizados) ---------- */
export const LEGAL_KEYS = ['privacy', 'cookies', 'terms'] as const;
export type LegalKey = (typeof LEGAL_KEYS)[number];

export const LEGAL_SLUGS: Record<Locale, Record<LegalKey, string>> = {
  es: { privacy: 'privacidad', cookies: 'cookies', terms: 'terminos' },
  pt: { privacy: 'privacidade', cookies: 'cookies', terms: 'termos' },
  en: { privacy: 'privacy', cookies: 'cookies', terms: 'terms' },
};

export const legalKeyFromSlug = (locale: Locale, slug: string): LegalKey | undefined =>
  LEGAL_KEYS.find((k) => LEGAL_SLUGS[locale][k] === slug);

/* ---------- Helpers de rutas ---------- */
export const homePath = (locale: Locale) => `/${locale}/`;
export const sectionHref = (locale: Locale, key: SectionKey) => `/${locale}/#${SECTION_IDS[locale][key]}`;
export const legalPath = (locale: Locale, key: LegalKey) => `/${locale}/${LEGAL_SLUGS[locale][key]}/`;
