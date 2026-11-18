import { BUSINESS, PEOPLE, SITE_URL } from '@/data/business';
import { HREFLANG, homePath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { whatsappUrl } from './contact';

/** JSON-LD Organization + ProfessionalService para la página de inicio. */
export function organizationJsonLd(locale: Locale) {
  const d = getDictionary(locale);
  const url = `${SITE_URL}${homePath(locale)}`;
  const email = BUSINESS.email.startsWith('[') ? undefined : BUSINESS.email;
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    url,
    logo: `${SITE_URL}/logo/zajux-icon.png`,
    image: `${SITE_URL}/og/og-${locale}.png`,
    description: d.meta.serviceDescription,
    slogan: d.hero.title,
    email,
    inLanguage: HREFLANG[locale],
    availableLanguage: ['es', 'pt-BR', 'en'],
    areaServed: [
      { '@type': 'Country', name: 'Uruguay' },
      { '@type': 'Country', name: 'Brazil' },
    ],
    address: [
      { '@type': 'PostalAddress', addressLocality: PEOPLE.juani.city, addressCountry: 'UY' },
      { '@type': 'PostalAddress', addressLocality: PEOPLE.zahir.city, addressCountry: 'BR' },
    ],
    founder: [
      { '@type': 'Person', name: PEOPLE.juani.name, homeLocation: { '@type': 'Place', name: `${PEOPLE.juani.city}, Uruguay` } },
      { '@type': 'Person', name: PEOPLE.zahir.name, homeLocation: { '@type': 'Place', name: `${PEOPLE.zahir.city}, Brasil` } },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        areaServed: 'UY',
        availableLanguage: ['es', 'en'],
        url: whatsappUrl(PEOPLE.juani.whatsapp),
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        areaServed: 'BR',
        availableLanguage: ['pt-BR', 'es', 'en'],
        url: whatsappUrl(PEOPLE.zahir.whatsapp),
      },
    ],
    sameAs: [BUSINESS.instagram],
    knowsAbout: d.services.items.map((s) => s.title),
  };
}
