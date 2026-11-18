import { Flag } from '@/components/brand/Flag';
import { PEOPLE, type PersonId } from '@/data/business';
import { whatsappUrl } from '@/lib/contact';
import { fmt } from '@/lib/format';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

/** Tarjetas "Uruguay · Juani" y "Brasil · Zahir" con WhatsApp directo (el número no se muestra). */
export function PersonCards({ locale, t, common }: { locale: Locale; t: Dictionary['contact']; common: Dictionary['common'] }) {
  const order: PersonId[] = locale === 'es' ? ['juani', 'zahir'] : ['zahir', 'juani'];
  return (
    <div>
      <p className="label-mono text-[0.68rem] text-chevron">{t.direct}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {order.map((id) => {
          const p = PEOPLE[id];
          const first = p.name.split(' ')[0]!;
          return (
            <li key={id} className="card card-hover flex items-center justify-between gap-4 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <Flag code={p.countryCode} label={common.flags[p.countryCode]} className="h-5 w-7" />
                <div>
                  <p className="font-medium">{t.cards[id]}</p>
                  <p className="text-sm text-mute">
                    {p.city}, {common.countries[p.countryCode]}
                  </p>
                </div>
              </div>
              <a
                href={whatsappUrl(p.whatsapp, fmt(t.directGreeting, { name: first }))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={fmt(t.whatsappTo, { name: first })}
                className="btn btn-ghost !min-h-11 !px-4"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
                </svg>
                <span aria-hidden="true">WhatsApp</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
