import type { Metadata } from 'next';
import { Isotype } from '@/components/brand/Isotype';
import { Wordmark } from '@/components/brand/Wordmark';
import { HREFLANG, LOCALES, LOCALE_LABEL, LOCALE_STORAGE_KEY, homePath } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { pickLocale } from '@/lib/detectLocale';
import { SITE_URL } from '@/data/business';

const en = getDictionary('en');

export const metadata: Metadata = {
  title: 'ZAJUX · Web design & development · Uruguay · Brasil',
  description: `${getDictionary('es').meta.description} · ${getDictionary('pt').meta.description}`,
  alternates: {
    canonical: '/',
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [HREFLANG[l], `${SITE_URL}${homePath(l)}`])),
      'x-default': `${SITE_URL}/`,
    },
  },
  icons: { icon: [{ url: '/favicon.ico', sizes: '48x48' }, { url: '/icons/icon.svg', type: 'image/svg+xml' }] },
};

/** Redirección por idioma: corre antes de pintar. Sin JavaScript se ven los enlaces. */
const redirect = `(function(){var s=null;try{s=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}var n=navigator,ls=n.languages&&n.languages.length?n.languages:[n.language||''];var t=(${pickLocale.toString()})(s,ls);location.replace('/'+t+'/'+location.hash)})();`;

export default function RootPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-4 text-center">
      <script dangerouslySetInnerHTML={{ __html: redirect }} />
      <span className="flex items-center gap-3">
        <Isotype className="size-12" />
        <Wordmark className="h-6" idPrefix="root" />
      </span>
      <h1 className="label-mono text-mute">{en.root.choose}</h1>
      <ul className="flex flex-wrap justify-center gap-3">
        {LOCALES.map((l) => (
          <li key={l}>
            <a href={homePath(l)} hrefLang={HREFLANG[l]} lang={HREFLANG[l]} className="btn btn-ghost min-w-36">
              {LOCALE_LABEL[l]}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
