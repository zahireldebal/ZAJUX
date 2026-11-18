# ZAJUX · Sitio web

Sitio del estudio ZAJUX (diseño y desarrollo web, Uruguay · Brasil), en español, portugués e inglés.
Next.js (App Router) con exportación estática, publicado en Cloudflare Pages.

- **Stack:** Next.js 16, TypeScript, Tailwind CSS 4, GSAP (ScrollTrigger y SplitText), Lenis, React Hook Form + Zod.
- **Pruebas:** Vitest (lógica) y Playwright (flujos, idiomas y accesibilidad con axe).
- Lo que falta completar está en [PENDIENTES.md](PENDIENTES.md).

---

## Cómo correrlo

Requiere Node 20 o superior (probado con Node 24).

```bash
npm install
npm run dev          # desarrollo en http://localhost:3000
npm run build        # exportación estática en /out (incluye _headers con la CSP)
npm start            # sirve /out en http://localhost:3000
```

Pruebas:

```bash
npm test             # Vitest: mensajes de contacto, ruteo de WhatsApp, detección de idioma
npm run build && npx playwright install chromium   # la primera vez
npm run test:e2e     # Playwright sobre /out (levanta el servidor solo)
npm run lint
npm run typecheck
```

## Estructura

```
src/
  app/
    (root)/            raíz "/": detecta el idioma y redirige (con enlaces si no hay JavaScript)
    [locale]/          /es /pt /en: página de inicio y páginas legales ([slug])
    global-not-found   404 en los tres idiomas
    sitemap.ts · robots.ts · manifest.ts
  components/
    intro/             intro del logo (órbita de la X)
    sections/          Hero, Servicios, Demos, Proceso, Por qué, Planes, Nosotros, Proyectos, FAQ, Contacto
    contact/           formulario, modal, botón flotante, tarjetas de WhatsApp
    demos/             reserva de turno, formulario a WhatsApp, antes/después
    layout/            navbar, menú mobile, selector de idioma, footer
  i18n/                es.ts, pt.ts, en.ts (todos los textos) y legal/ (políticas)
  data/                business.ts (datos del negocio) y projects.ts (portafolio)
  lib/                 contact.ts (mensajes, WhatsApp, email), SEO, utilidades
scripts/
  build-logo.mjs       genera el logo SVG, favicons, íconos y las imágenes Open Graph
  defer-hydration.mjs  post-build: ejecuta los scripts después de la primera pintura
  csp-hashes.mjs       post-build: agrega la Content-Security-Policy por página a out/_headers
  dev/                 herramientas de prueba (capturas, Lighthouse, traces)
tests/e2e/             pruebas de Playwright
```

## Editar textos e idiomas

- **Todos los textos** del sitio están en [src/i18n/es.ts](src/i18n/es.ts), [src/i18n/pt.ts](src/i18n/pt.ts) y [src/i18n/en.ts](src/i18n/en.ts). No hay texto escrito directamente en los componentes.
- `es.ts` es la base: `pt.ts` y `en.ts` tienen que tener exactamente las mismas claves. Si falta o sobra una, el build falla.
- **Políticas legales:** en [src/i18n/legal/](src/i18n/legal/). Admiten `{email}`, `{version}` y `{date}`.
- **Rutas por idioma:**
  - Las anclas de las secciones (`/es/#servicios`, `/pt/#servicos`) están en `SECTION_IDS`, en [src/i18n/config.ts](src/i18n/config.ts).
  - Las rutas legales (`/es/privacidad`, `/pt/privacidade`, `/en/privacy`) están en `LEGAL_SLUGS`, en el mismo archivo.
- **Detección de idioma en `/`:**
  1. Si la persona ya eligió un idioma (guardado en `localStorage`), se respeta.
  2. Si no, se usa el primer idioma soportado de `navigator.languages`: `pt*` → `/pt`, `es*` → `/es`, `en*` → `/en`.
  3. Cualquier otro → `/en`.

## Números y email de contacto

En [src/data/business.ts](src/data/business.ts):

| Dato | Dónde |
|---|---|
| WhatsApp de Juani y de Zahir (solo dígitos, formato internacional) | `PEOPLE` |
| Email de contacto y de privacidad | `BUSINESS.email` |
| URL pública del sitio | `SITE_URL` |
| Versión y fecha de la Política de Privacidad | `PRIVACY_POLICY` |

**Ruteo del formulario según el idioma del sitio:**

| Idioma | Destino de WhatsApp |
|---|---|
| ES | Juani (Uruguay) |
| PT | Zahir (Brasil) |
| EN | Zahir (Brasil) |

El ruteo se define en `CONTACT_PERSON`, en [src/i18n/config.ts](src/i18n/config.ts). Los números nunca se muestran en texto, solo detrás de los botones.

## Formulario: WhatsApp y email

- **"Contactar por WhatsApp"** abre `wa.me` con el mensaje armado en el idioma del sitio. El mensaje incluye solo los campos completados.
- **"Enviar por email"** envía con Web3Forms si existe `NEXT_PUBLIC_WEB3FORMS_KEY`. Si no, abre el programa de correo de la persona (`mailto:`) con el mensaje listo.
- El email incluye automáticamente:
  - fecha y hora en UTC y en formato ISO;
  - idioma del sitio;
  - versión de la Política de Privacidad aceptada.

  **Ese es el registro del consentimiento**; no se guarda nada más.
- El borrador del formulario se guarda en el `localStorage` de la persona y se borra al enviar.
- Toda la lógica está en [src/lib/contact.ts](src/lib/contact.ts), con tests en `contact.test.ts`.

## Activar el portafolio

1. Agregar los proyectos (publicados **con permiso del cliente**) en [src/data/projects.ts](src/data/projects.ts), con su imagen en `public/projects/`.
2. Poner `SHOW_PROJECTS = true`.

La sección y su link en el menú aparecen solos.

## Variables de entorno

Copiar `.env.example` a `.env.local` para desarrollo, y cargar las mismas variables en Cloudflare Pages.

| Variable | Para qué | Si no está |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Envío del formulario por email ([web3forms.com](https://web3forms.com)). Es una clave pública. | Se usa `mailto:` |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Cloudflare Web Analytics (sin cookies) | No se carga analítica |

Las variables `NEXT_PUBLIC_*` se incorporan **en el build**: después de cambiarlas en Cloudflare, hay que volver a desplegar.

## Publicar en Cloudflare Pages

1. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, y elegir el repositorio `zahireldebal/ZAJUX`, rama `main`.
2. Configuración del build:
   - **Framework preset:** `Next.js (Static HTML Export)`
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Variables de entorno:** `NODE_VERSION` = `24`, más `NEXT_PUBLIC_WEB3FORMS_KEY` y `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` si las tienen.
3. **Save and Deploy.** Cada `git push` a `main` vuelve a publicar.
4. Actualizar `SITE_URL` en `business.ts` con la URL que asigne Cloudflare (`https://<proyecto>.pages.dev`).

### Conectar el dominio zajux.com

1. En el proyecto de Pages: **Custom domains → Set up a custom domain → `zajux.com`**, y repetir con `www.zajux.com`.
   - Si el dominio ya está en Cloudflare, los registros DNS se crean solos.
   - Si no, Cloudflare indica qué registros crear (o cómo cambiar los nameservers).
2. Para que `www` redirija al dominio principal: **Rules → Redirect Rules**, de `www.zajux.com/*` a `https://zajux.com/$1` (301).
3. Cambiar `SITE_URL` a `https://zajux.com` en [src/data/business.ts](src/data/business.ts), hacer commit y push.
4. Dar de alta el sitio en Google Search Console y enviar `https://zajux.com/sitemap.xml`.

### Analítica

En Cloudflare: **Analytics & Logs → Web Analytics → Add a site**. Copiar el token en `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`.

## Seguridad

- [public/_headers](public/_headers) define los headers comunes: `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, HSTS y caché de los recursos estáticos.
- En cada build, `scripts/csp-hashes.mjs` agrega una **Content-Security-Policy por página**, con el hash SHA-256 de cada script inline. Así no hace falta `'unsafe-inline'` para scripts. Solo se permiten conexiones a `api.web3forms.com` y a Cloudflare Insights.
- Si agregan un servicio externo (por ejemplo, un widget de reservas), hay que sumarlo a la política en `scripts/csp-hashes.mjs`.

## Logo e imágenes

El logo está recreado en SVG a partir de los originales de `Fotos/`, con los trazos de Space Mono Bold.

```bash
npm run logo
```

Ese comando regenera:

- `public/logo/` (SVG y PNG);
- favicon e íconos de la PWA;
- las imágenes Open Graph por idioma (`public/og/og-es|pt|en.png`);
- los trazos que usan la intro y la navbar (`src/components/brand/logo-data.ts`).

Los textos de las imágenes Open Graph están en `scripts/build-logo.mjs`.
