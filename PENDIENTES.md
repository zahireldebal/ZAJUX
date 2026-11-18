# PENDIENTES

Lo que falta completar o validar antes de dar el sitio por terminado. Marcá cada ítem cuando esté listo.

En el código, los textos a completar están marcados así:

- `[CONFIRMAR]`: un dato que tienen que confirmar ustedes (plazos, proveedores, etc.).
- `[REVISAR]`: un punto legal que tiene que validar un profesional.

Ojo: esas marcas **se ven en el sitio publicado** hasta que las reemplacen.

---

## 1. Datos de contacto y configuración

- [ ] **Email de contacto.** Reemplazar `[EMAIL_CONTACTO]` en [src/data/business.ts](src/data/business.ts). Se usa en las políticas legales, en el respaldo `mailto:` del formulario, en el footer y en el JSON-LD. Mientras siga el placeholder, el footer no muestra email y las políticas muestran `[EMAIL_CONTACTO]`.
- [ ] **Clave de Web3Forms.** Crear la cuenta en https://web3forms.com con ese mismo email y cargar la clave en `NEXT_PUBLIC_WEB3FORMS_KEY`, tanto en Cloudflare Pages como en `.env.local` (ver README). Sin la clave, "Enviar por email" abre el programa de correo de la persona (`mailto:`).
  - En el plan gratuito, el email de destino es el de la cuenta de Web3Forms, no el de `business.ts`.
- [ ] **Token de Cloudflare Web Analytics.** Cargarlo en `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` (opcional). Sin el token, no se carga ninguna analítica.
- [ ] **URL del sitio.** `SITE_URL` en [src/data/business.ts](src/data/business.ts) está en `https://zajux.pages.dev` `[CONFIRMAR]` el nombre real del proyecto en Cloudflare Pages, y cambiarla a `https://zajux.com` cuando conecten el dominio. Afecta canonical, hreflang, sitemap, robots y Open Graph.
- [ ] **Instagram.** El footer y el JSON-LD enlazan a `https://www.instagram.com/zajux.web` (sale de la hoja de variantes del logo). Confirmar que la cuenta existe.

## 2. Contenido

- [ ] **Fotos de Juani y Zahir.** Por ahora la sección "Nosotros" muestra un monograma. Para poner fotos reales, reemplazar el componente `Monogram` en [src/components/sections/About.tsx](src/components/sections/About.tsx) por un `<img>`. Recomendado: 1200×900 px, WebP, en `public/team/`.
- [ ] **Idiomas que habla cada uno.** Están cargados como español, portugués e inglés para los dos (`languages` en [src/data/business.ts](src/data/business.ts)). Confirmar.
- [ ] **FAQ, plazo de una web:** "2 a 4 semanas desde que tenemos los textos y las fotos" `[CONFIRMAR]` (en `es.ts`, `pt.ts`, `en.ts`).
- [ ] **FAQ, forma de pago:** "una parte al empezar y el resto al publicar" `[CONFIRMAR]` (en los 3 idiomas).
- [ ] **Portafolio.** Está implementado pero oculto. Cuando tengan proyectos publicados **con permiso del cliente**, agregarlos en [src/data/projects.ts](src/data/projects.ts) y poner `SHOW_PROJECTS = true` (ver README).

## 3. Textos legales (validar con un profesional)

Las tres políticas están en [src/i18n/legal/](src/i18n/legal/), en los 3 idiomas. Describen lo que el sitio hace de verdad, pero hace falta que las valide alguien del área.

Puntos `[REVISAR]`:

- [ ] Forma jurídica de ZAJUX y datos de registro, si corresponde (Política de Privacidad, "Quiénes somos").
- [ ] Base legal: consentimiento y medidas precontractuales; artículos de la Ley 18.331 (Uruguay) y de la LGPD art. 7 I y V (Brasil).
- [ ] Plazo de conservación de datos (12 meses sin contratación) `[CONFIRMAR]` y conservación cuando hay contrato `[REVISAR]`.
- [ ] Web3Forms: ubicación de los servidores, condiciones y transferencias internacionales.
- [ ] Cloudflare Web Analytics: confirmar que no usa cookies ni identifica a la persona.
- [ ] Proveedor de email que usan (Gmail, Zoho, etc.) `[CONFIRMAR]`.
- [ ] Plazos legales para responder pedidos de acceso o eliminación (Uruguay y Brasil).
- [ ] Política de Cookies: que no hace falta un banner porque solo se usa almacenamiento local esencial.
- [ ] Términos de uso: limitación de responsabilidad y ley aplicable (Uruguay, sin perjuicio del Código de Defensa del Consumidor de Brasil).

Si cambian la Política de Privacidad, actualizar `PRIVACY_POLICY` (versión y fecha) y `LEGAL_UPDATED` en [src/data/business.ts](src/data/business.ts). La versión aceptada viaja en cada email como registro del consentimiento.

## 4. Publicación

- [ ] Conectar el repositorio en Cloudflare Pages (pasos en el README).
- [ ] Cargar las variables de entorno en Cloudflare Pages.
- [ ] Conectar el dominio `zajux.com` y actualizar `SITE_URL`.
- [ ] Ya publicado, revisar los headers con https://securityheaders.com y medir con PageSpeed Insights.
- [ ] Dar de alta el sitio en Google Search Console y enviar `sitemap.xml`.

## 5. Decisión pendiente: traductor de Chrome y Lighthouse

En las pruebas locales, Lighthouse en mobile da **90-92** en `/es/`, pero **72-80** en `/pt/` y `/en/`. La causa es que el Chrome que usa Lighthouse está en inglés y, al abrir una página en portugués, ejecuta la detección de idioma del traductor: eso suma unos 700 ms de bloqueo. Un visitante real con el navegador en su idioma no lo dispara.

Si agregamos `<meta name="google" content="notranslate">`, pt y en también dan 90-91. La contra es que un visitante de otro idioma (por ejemplo, francés) ya no podría traducir el sitio con Chrome.

- [ ] Decidir si se agrega o no. Recomendación: no agregarlo, y medir en producción con PageSpeed Insights antes de decidir.
