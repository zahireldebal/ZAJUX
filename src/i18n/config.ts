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

/* ---------- Páginas de contenido (slugs localizados) ---------- */
export const PAGE_KEYS = ['services', 'process', 'plans', 'about', 'projects', 'faq'] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGE_SLUGS: Record<Locale, Record<PageKey, string>> = {
  es: { services: 'servicios', process: 'proceso', plans: 'planes', about: 'nosotros', projects: 'proyectos', faq: 'preguntas' },
  pt: { services: 'servicos', process: 'processo', plans: 'planos', about: 'sobre-nos', projects: 'projetos', faq: 'perguntas' },
  en: { services: 'services', process: 'process', plans: 'plans', about: 'about', projects: 'projects', faq: 'faq' },
};

export const pageKeyFromSlug = (locale: Locale, slug: string): PageKey | undefined =>
  PAGE_KEYS.find((k) => PAGE_SLUGS[locale][k] === slug);

/** Ancla de la sección de contacto en la página de inicio. */
export const CONTACT_ID: Record<Locale, string> = { es: 'contacto', pt: 'contato', en: 'contact' };

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
/** Cualquier página del sitio: inicio, página de contenido o página legal. */
export type RouteKey = 'home' | PageKey | LegalKey;

export const isLegalKey = (r: RouteKey): r is LegalKey => (LEGAL_KEYS as readonly string[]).includes(r);
export const isPageKey = (r: RouteKey): r is PageKey => (PAGE_KEYS as readonly string[]).includes(r);

export const homePath = (locale: Locale) => `/${locale}/`;
export const pagePath = (locale: Locale, key: PageKey) => `/${locale}/${PAGE_SLUGS[locale][key]}/`;
export const legalPath = (locale: Locale, key: LegalKey) => `/${locale}/${LEGAL_SLUGS[locale][key]}/`;
export const contactHref = (locale: Locale) => `/${locale}/#${CONTACT_ID[locale]}`;

export const routePath = (locale: Locale, r: RouteKey) =>
  r === 'home' ? homePath(locale) : isLegalKey(r) ? legalPath(locale, r) : pagePath(locale, r);
