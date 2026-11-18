# ZAJUX · Sitio web

Sitio del estudio ZAJUX (diseño y desarrollo web, Uruguay · Brasil), en español, portugués e inglés.
Next.js (App Router) con exportación estática, publicado en Cloudflare Workers (recursos estáticos).

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
    [locale]/          /es /pt /en: inicio (logo + contacto)
    [locale]/[slug]/   páginas del menú (servicios, proceso, planes…) y páginas legales
    global-not-found   404 en los tres idiomas
    sitemap.ts · robots.ts · manifest.ts
  components/
    intro/             logo del inicio: órbita de la X, estela, anillo y vueltas en reposo
    sections/          Hero, Servicios, Por qué, Proceso, Planes, Nosotros, Proyectos, FAQ, Contacto, cierre de página
    pages/             armado de cada página del menú y de las páginas legales
    contact/           formulario, modal, botón flotante, tarjetas de WhatsApp
    layout/            barra de navegación, menú mobile, selector de idioma, footer
  i18n/                es.ts, pt.ts, en.ts (todos los textos) y legal/ (políticas)
  data/                business.ts (datos del negocio) y projects.ts (portafolio)
  lib/                 contact.ts (mensajes, WhatsApp, email), nav.ts (páginas del menú), SEO, utilidades
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
- **Páginas y rutas por idioma** (todo en [src/i18n/config.ts](src/i18n/config.ts)):
  - El inicio (`/es/`) muestra solo el logo animado y el contacto (`/es/#contacto`, ancla en `CONTACT_ID`).
  - Cada opción del menú es una página: `/es/servicios/`, `/pt/servicos/`, `/en/services/`, etc. Los slugs están en `PAGE_SLUGS`, y qué páginas aparecen en el menú, en [src/lib/nav.ts](src/lib/nav.ts).
  - La página de Servicios incluye también "Por qué ZAJUX". Todas terminan con una invitación a escribir.
  - Las rutas legales (`/es/privacidad`, `/pt/privacidade`, `/en/privacy`) están en `LEGAL_SLUGS`.
  - El selector de idioma lleva a la misma página en el otro idioma.
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

La página `/es/proyectos/` (y sus versiones en pt y en), su link en el menú y su entrada en el sitemap aparecen solos.

## Diseño y animaciones

- **Estilo:** fondo negro, tarjetas de 28 px sin bordes, barra de navegación flotante de vidrio y botones tipo píldora. Lima (`#C6F432`) para las acciones. Los colores están en `@theme`, en [src/app/globals.css](src/app/globals.css).
- **Tipografía:** en equipos Apple se usa la fuente del sistema (SF Pro); en el resto, Inter (autoalojada).
- **Logo del inicio** ([src/components/intro/HeroLogo.tsx](src/components/intro/HeroLogo.tsx)):
  - Intro una vez por sesión: la X orbita alrededor de "ZAJU" con estela y anillo, y encaja con destello y onda.
  - Después, la X vuelve a orbitar cada 5,5 s y al pasar el mouse. Se pausa si el logo no está a la vista.
  - Los tiempos están en las constantes del principio del archivo.
- **"Reducir movimiento":** las animaciones corren aunque el sistema lo pida (por ejemplo, Windows con los efectos de animación desactivados), porque son cortas y suaves. En ese caso solo se desactiva el scroll suave.

## Variables de entorno

Copiar `.env.example` a `.env.local` para desarrollo (`.env.local` está en `.gitignore` y no se sube). En Cloudflare, las variables van en el Worker: **Settings → Build → Variables and secrets**.

| Variable | Para qué | Si no está |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Envío del formulario por email ([web3forms.com](https://web3forms.com)). Es una clave pública. | Se usa `mailto:` |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Cloudflare Web Analytics (sin cookies) | No se carga analítica |

Las variables `NEXT_PUBLIC_*` se incorporan **en el build**: después de cambiarlas en Cloudflare, hay que volver a desplegar.

## Publicar en Cloudflare Workers

El sitio se publica como **Worker con recursos estáticos**: Cloudflare corre `npm run build` y después `npx wrangler deploy`, que sube la carpeta `out/` según [wrangler.jsonc](wrangler.jsonc).

1. En Cloudflare: **Workers & Pages → Create → Import a repository**, y elegir el repositorio `zahireldebal/ZAJUX`, rama `main`.
2. Configuración del build:
   - **Project name:** `zajux` (tiene que coincidir con `"name"` en `wrangler.jsonc`).
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
3. Variables: en el Worker, **Settings → Build → Variables and secrets**. Cargar `NODE_VERSION` = `24`, `NEXT_PUBLIC_WEB3FORMS_KEY` y, cuando la tengan, `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`.
4. Cada `git push` a `main` vuelve a publicar en `https://zajux.zahireldebal.workers.dev`.

`wrangler.jsonc` define:

- `assets.directory: "./out"`: la exportación estática.
- `not_found_handling: "404-page"`: las rutas inexistentes muestran `out/404.html`.
- `out/_headers` (generado en el build) aplica los headers de seguridad y la CSP por página.

Para probar el deploy sin publicar: `npm run build && npx wrangler deploy --dry-run`.

### Conectar el dominio zajux.com

1. En el Worker: **Settings → Domains & Routes → Add → Custom domain → `zajux.com`**, y repetir con `www.zajux.com`.
   - Si el dominio ya está en Cloudflare, los registros DNS se crean solos.
   - Si no, primero hay que agregar el dominio a Cloudflare y cambiar los nameservers donde se compró.
2. Para que `www` redirija al dominio principal: **Rules → Redirect Rules**, de `www.zajux.com/*` a `https://zajux.com/$1` (301).
3. Cambiar `SITE_URL` a `https://zajux.com` en [src/data/business.ts](src/data/business.ts), hacer commit y push.
4. Dar de alta el sitio en Google Search Console y enviar `https://zajux.com/sitemap.xml`.

### Analítica (Cloudflare Web Analytics)

El código ya está listo: si existe `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`, cada página carga el script de Cloudflare y la CSP permite `cloudflareinsights.com`. Sin el token no se carga nada.

Cómo conseguir el token:

1. En el panel de Cloudflare, abrir **Web Analytics** y elegir **Add a site**.
2. En **Set up hostname**, escribir el dominio del sitio (hoy `zajux.zahireldebal.workers.dev`; después, `zajux.com`) y confirmar con **Done**.
3. En **Manage site**, copiar el fragmento de JavaScript. El token es el valor de `"token"` dentro de `data-cf-beacon='{"token": "…"}'`. Solo hace falta ese valor, no el fragmento entero.
4. Cargarlo como `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` en **Settings → Build → Variables and secrets** y volver a desplegar (las variables `NEXT_PUBLIC_*` se incorporan en el build).

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
