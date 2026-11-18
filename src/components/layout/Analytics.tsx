/**
 * Cloudflare Web Analytics (sin cookies). Solo se carga si hay token configurado
 * en NEXT_PUBLIC_CF_ANALYTICS_TOKEN. Nada de Google Analytics, Tag Manager ni píxeles.
 */
export function Analytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token, spa: false })}
    />
  );
}
