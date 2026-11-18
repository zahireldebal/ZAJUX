import type { Metadata } from 'next';
import './globals.css';
import { grotesk, mono } from './fonts';
import { Isotype } from '@/components/brand/Isotype';
import { Wordmark } from '@/components/brand/Wordmark';
import { LOCALES, HREFLANG, homePath } from '@/i18n/config';
import { getDictionary } from '@/i18n';

export const metadata: Metadata = { title: '404 · ZAJUX', robots: { index: false } };

/** 404 para cualquier ruta inexistente: no sabemos el idioma, así que se muestra en los tres. */
export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${grotesk.variable} ${mono.variable}`}>
      <body>
        <main className="container-x flex min-h-dvh flex-col justify-center py-24">
          {/* Navegación completa a propósito: la raíz corre la detección de idioma */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="inline-flex w-fit items-center gap-3" aria-label="ZAJUX">
            <Isotype className="size-10" />
            <Wordmark className="h-5" idPrefix="nf" />
          </a>
          <p className="label-mono mt-16 text-lime">&lt;/&gt; 404</p>
          <ul className="mt-6 grid gap-10 md:grid-cols-3">
            {LOCALES.map((l) => {
              const t = getDictionary(l).notFound;
              return (
                <li key={l} lang={HREFLANG[l]} className="border-t border-line pt-6">
                  <h1 className="text-h3 font-semibold">{t.title}</h1>
                  <p className="mt-3 text-mute">{t.text}</p>
                  <a href={homePath(l)} className="btn btn-ghost mt-6 !min-h-11 !text-sm">
                    {t.cta}
                  </a>
                </li>
              );
            })}
          </ul>
        </main>
      </body>
    </html>
  );
}
