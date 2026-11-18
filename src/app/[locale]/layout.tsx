import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { grotesk, mono } from '../fonts';
import { HREFLANG, LOCALES, isLocale } from '@/i18n/config';
import { buildMetadata } from '@/lib/seo';
import { getDictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';

const contactDict = (l: Locale) => {
  const d = getDictionary(l);
  return { contact: d.contact, services: d.services, plans: d.plans };
};
import { ContactProvider } from '@/components/contact/ContactProvider';
import { Analytics } from '@/components/layout/Analytics';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata(locale);
}

export const viewport: Viewport = { themeColor: '#0F1115', colorScheme: 'dark' };

/**
 * Corre antes de la primera pintura:
 * - "js": hay JavaScript.
 * - "js-motion": se permiten animaciones (sin prefers-reduced-motion).
 * - "intro-pending": la intro del logo todavía no se vio en esta sesión.
 * Red de seguridad: si las animaciones no arrancan en 3,5 s, se muestra todo sin animar.
 */
const INIT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion');var s=null;try{s=sessionStorage.getItem('zajux:intro')}catch(e){}if(!s)d.classList.add('intro-pending');setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.remove('js-motion','intro-pending')},3500)}}catch(e){}})();`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={HREFLANG[locale]} className={`${grotesk.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT }} />
      </head>
      <body id="top">
        <ContactProvider locale={locale} dict={contactDict(locale)}>
          {children}
        </ContactProvider>
        <Analytics />
      </body>
    </html>
  );
}
