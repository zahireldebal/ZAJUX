import type { Locale, PageKey } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { Services } from '@/components/sections/Services';
import { Why } from '@/components/sections/Why';
import { Process } from '@/components/sections/Process';
import { Plans } from '@/components/sections/Plans';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Faq } from '@/components/sections/Faq';
import { PageCta } from '@/components/sections/PageCta';

/** Contenido de cada página del menú. Todas terminan con una invitación a escribir. */
export function ContentPage({ locale, page }: { locale: Locale; page: PageKey }) {
  const t = getDictionary(locale);
  const body = {
    services: (
      <>
        <Services t={t} level={1} />
        <Why t={t} />
      </>
    ),
    process: <Process t={t.process} level={1} />,
    plans: <Plans locale={locale} t={t} level={1} />,
    about: <About locale={locale} t={t} level={1} />,
    projects: <Projects locale={locale} t={t} level={1} />,
    faq: <Faq t={t.faq} level={1} />,
  }[page];
  return (
    <>
      {body}
      <PageCta locale={locale} t={t} />
    </>
  );
}
