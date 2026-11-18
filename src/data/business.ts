/**
 * Datos del negocio. Todo lo que cambie (URL, email, números) se edita acá.
 * Los números de WhatsApp van en formato internacional, solo dígitos (wa.me).
 */

/**
 * URL pública del sitio, sin barra final. Por defecto, la de Cloudflare Workers.
 * Al conectar zajux.com no hace falta tocar código: cargar NEXT_PUBLIC_SITE_URL=https://zajux.com
 * en Cloudflare (Settings → Build → Variables and secrets) y volver a desplegar.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://zajux.zahireldebal.workers.dev').replace(/\/+$/, '');

export const BUSINESS = {
  name: 'ZAJUX',
  legalName: 'ZAJUX — Juani Hermelo y Zahir El Debal',
  /** Email de contacto y de privacidad. */
  email: 'xzajux@gmail.com',
  instagram: 'https://www.instagram.com/_zajux_/',
  instagramHandle: '@_zajux_',
  foundingYear: 2026,
} as const;

export type PersonId = 'juani' | 'zahir';

export const PEOPLE = {
  juani: {
    id: 'juani',
    name: 'Juani Hermelo',
    initials: 'JH',
    city: 'Maldonado',
    countryCode: 'UY',
    whatsapp: '59892754708',
    languages: ['es', 'en'],
  },
  zahir: {
    id: 'zahir',
    name: 'Zahir El Debal',
    initials: 'ZE',
    city: 'Manaus',
    countryCode: 'BR',
    whatsapp: '5592984823591',
    languages: ['es', 'pt', 'en'],
  },
} as const satisfies Record<
  PersonId,
  {
    id: PersonId;
    name: string;
    initials: string;
    city: string;
    countryCode: 'UY' | 'BR';
    whatsapp: string;
    languages: readonly ('es' | 'pt' | 'en')[];
  }
>;

/** Versión vigente de la Política de Privacidad (se registra en cada envío de email). */
export const PRIVACY_POLICY = { version: '1.1', date: '2026-11-18' } as const;

/** Fecha de última actualización de los textos legales. */
export const LEGAL_UPDATED = '2026-11-18';

/** Indica si el email de contacto ya fue configurado. */
export const hasContactEmail = () => !BUSINESS.email.startsWith('[');
