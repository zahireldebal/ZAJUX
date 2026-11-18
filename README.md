# ZAJUX · Sitio web

Sitio del estudio ZAJUX (diseño y desarrollo web, Uruguay · Brasil), en español, portugués e inglés.
Next.js (App Router) con exportación estática, publicado en Vercel.

- **Stack:** Next.js 16, TypeScript, Tailwind CSS 4, GSAP (ScrollTrigger y SplitText), Lenis, React Hook Form + Zod.
- **Pruebas:** Vitest (lógica) y Playwright (flujos, idiomas y accesibilidad con axe).
- Lo que falta completar está en [PENDIENTES.md](PENDIENTES.md).

---

## Cómo correrlo

Requiere Node 20 o superior (probado con Node 24).

```bash
npm install
npm run dev          # desarrollo en http://localhost:3000
npm run build        # exportación estática en /out (cada página lleva su CSP)
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
  csp-hashes.mjs       post-build: agrega a cada página su Content-Security-Policy (meta)
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

Copiar `.env.example` a `.env.local` para desarrollo (`.env.local` está en `.gitignore` y no se sube). En Vercel, las variables van en **Project → Settings → Environment Variables**.

| Variable | Para qué | Si no está |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Envío del formulario por email ([web3forms.com](https://web3forms.com)). Es una clave pública. | Se usa `mailto:` |
| `NEXT_PUBLIC_VERCEL_ANALYTICS` | `1` para cargar Vercel Web Analytics (sin cookies) | No se carga analítica |
| `NEXT_PUBLIC_SITE_URL` | Opcional: fuerza la URL pública | En Vercel se usa el dominio de producción |

Las variables `NEXT_PUBLIC_*` se incorporan **en el build**: después de cambiarlas en Vercel, hay que volver a desplegar (**Deployments → ⋯ → Redeploy**).

## Publicar en Vercel

La configuración está en [vercel.json](vercel.json): Vercel corre `npm run build` y publica la carpeta `out/` como sitio estático, con los headers de seguridad.

1. Entrar a https://vercel.com con la cuenta de GitHub y elegir **Add New → Project**.
2. Importar el repositorio `zahireldebal/ZAJUX`. No hace falta tocar el preset ni los comandos: los toma de `vercel.json`.
3. En **Environment Variables**, cargar `NEXT_PUBLIC_WEB3FORMS_KEY` con la clave de Web3Forms.
4. **Deploy.** Cada `git push` a `main` vuelve a publicar; cada rama o pull request tiene su propia vista previa.

La URL pública (canonical, hreflang, sitemap, Open Graph) se toma sola del dominio de producción de Vercel (`VERCEL_PROJECT_PRODUCTION_URL`). No hay que editar `SITE_URL`.

### Conectar el dominio zajux.com

1. En el proyecto: **Settings → Domains → Add**, escribir `zajux.com` y aceptar la sugerencia de redirigir `www.zajux.com` a `zajux.com`.
2. Vercel muestra los registros DNS a crear donde se compró el dominio: un registro `A` para `zajux.com` y un `CNAME` para `www`. Los valores exactos aparecen en esa pantalla.
3. Volver a desplegar para que la URL pública pase a `https://zajux.com`.
4. Dar de alta el sitio en Google Search Console y enviar `https://zajux.com/sitemap.xml`.

### Analítica (Vercel Web Analytics)

1. En el proyecto: **Analytics → Enable**.
2. Cargar `NEXT_PUBLIC_VERCEL_ANALYTICS` = `1` en **Settings → Environment Variables** y volver a desplegar.

El script se sirve desde el mismo dominio (`/_vercel/insights/script.js`), sin cookies.

## Seguridad

- [vercel.json](vercel.json) define los headers comunes: `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `frame-ancestors 'none'`, HSTS y caché de los recursos estáticos.
- En cada build, `scripts/csp-hashes.mjs` agrega a cada página una **Content-Security-Policy** (etiqueta `<meta>`), con el hash SHA-256 de cada script inline. Así no hace falta `'unsafe-inline'` para scripts, y la política también se aplica al probar en local. Solo se permiten conexiones al mismo dominio y a `api.web3forms.com`.
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
