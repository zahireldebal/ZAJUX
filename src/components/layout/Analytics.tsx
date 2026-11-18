/**
 * Vercel Web Analytics (sin cookies). Solo se carga si NEXT_PUBLIC_VERCEL_ANALYTICS = "1"
 * y la analítica está activada en el proyecto de Vercel. El script se sirve desde el mismo
 * dominio (/_vercel/insights/*). Nada de Google Analytics, Tag Manager ni píxeles.
 */
const QUEUE = 'window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};';

export function Analytics() {
  if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS !== '1') return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: QUEUE }} />
      <script defer src="/_vercel/insights/script.js" />
    </>
  );
}
