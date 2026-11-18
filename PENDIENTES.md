# PENDIENTES

Lo que sigue pendiente para dar el sitio por terminado. Marcá cada ítem cuando esté listo.

---

## 1. Contenido

- [ ] **Fotos de Juani y Zahir.** Por ahora la página "Nosotros" muestra un monograma. Para poner fotos reales, reemplazar el componente `Monogram` en [src/components/sections/About.tsx](src/components/sections/About.tsx) por un `<img>`. Recomendado: 1200×900 px, WebP, en `public/team/`.
- [ ] **Portafolio.** Está implementado pero oculto. Cuando tengan proyectos publicados **con permiso del cliente**, agregarlos en [src/data/projects.ts](src/data/projects.ts) y poner `SHOW_PROJECTS = true` (ver README).

## 2. Cloudflare

- [x] **Crear de nuevo el proyecto** (se había borrado): **Workers & Pages → Create → Import a repository**, repositorio `ZAJUX`, nombre `zajux` (pasos en el README, "Publicar en Cloudflare Workers").
- [x] **Cargar la clave de Web3Forms** en `NEXT_PUBLIC_WEB3FORMS_KEY` (**Settings → Build → Variables and secrets**) y `NODE_VERSION` = `24`. Sin la clave, "Enviar por email" abre el programa de correo de la persona.

- [ ] **Token de Cloudflare Web Analytics.** El código ya está listo. Falta crear el sitio en Web Analytics y cargar el token en `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` (**Settings → Build → Variables and secrets**). Los pasos están en el README, sección "Analítica".

## 3. Dominio zajux.com

Cuando conecten el dominio (pasos en el README):

- [ ] Cargar `NEXT_PUBLIC_SITE_URL` = `https://zajux.com` en Cloudflare y volver a desplegar (sin tocar código). Hoy la URL es `https://zajux.zahireldebal.workers.dev`. Afecta canonical, hreflang, sitemap, robots y Open Graph.
- [ ] Dar de alta el sitio en Google Search Console y enviar `https://zajux.com/sitemap.xml`. Se espera al dominio para no registrar la URL de `workers.dev`.
- [ ] Medir con PageSpeed Insights en `/es/`, `/pt/` y `/en/`, y revisar los headers con https://securityheaders.com.
  - **Traductor de Chrome:** se decidió **no** agregar `<meta name="google" content="notranslate">`. En las pruebas locales, Lighthouse en mobile daba 90-92 en `/es/` y 72-80 en `/pt/` y `/en/`, porque el Chrome de Lighthouse está en inglés y ejecuta la detección de idioma del traductor. Un visitante real con el navegador en su idioma no lo dispara. Confirmar con PageSpeed en producción.

## 4. Para revisar con un profesional

Los textos legales están en [src/i18n/legal/](src/i18n/legal/), en los 3 idiomas, y ya no tienen marcas visibles. Describen solo lo que el sitio hace de verdad, con la redacción más prudente posible. Igual conviene que los valide alguien del área. Versión vigente de la Política de Privacidad: **v1.1 (2026-11-18)**.

1. **Forma jurídica.**
   - Redactado: ZAJUX es un proyecto de Juani Hermelo (Maldonado, Uruguay) y Zahir El Debal (Manaus, Brasil), que trabajan como profesionales independientes. No es una empresa registrada. Los dos figuran como responsables de los datos.
   - Sin datos de registro.

2. **Base legal.**
   - Redactado: el consentimiento al enviar el formulario y los pasos previos a un contrato pedidos por la persona (responder y presupuestar).
   - Citas:
     - Ley 18.331, art. 9: consentimiento "libre, previo, expreso e informado".
     - Ley 18.331, art. 9, literal D: relación contractual o profesional; no se cita en el texto.
     - LGPD, art. 7, incisos I y V, con la redacción oficial (citada literal en la versión en portugués).
   - Fuentes: https://www.impo.com.uy/bases/leyes/18331-2008 · https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm

3. **Conservación.**
   - Redactado: sin contratación, hasta 12 meses desde el último contacto y después se eliminan. Con contratación, mientras dure la relación y los plazos que exija la ley aplicable.
   - Referencias:
     - Ley 18.331, art. 8: los datos se eliminan cuando dejan de ser necesarios para su finalidad.
     - LGPD, arts. 15 y 16: fin del tratamiento y eliminación, con conservación por obligación legal.
   - A revisar: qué plazos legales aplican a la documentación de un cliente (facturación, contratos) en Uruguay y en Brasil.

4. **Web3Forms.**
   - Redactado, según su documentación:
     - Web3Creative, India.
     - No guarda el contenido de los formularios; los reenvía por email.
     - Servidores en Estados Unidos (región US-East).
     - Los registros técnicos, que pueden incluir datos como la IP, se borran periódicamente. Su FAQ dice "cada 2 meses"; en el texto se dejó "periódicamente".
   - **No está claro en sus fuentes:**
     - No se pudo leer su política de privacidad ni sus términos: web3forms.com bloquea la lectura automática.
     - Tampoco informan el proveedor de hosting, los subencargados, un DPA ni el mecanismo de transferencia internacional.
     - Su propio FAQ aclara que "no puede hacer declaraciones legales" sobre GDPR.
     - Conviene leer a mano https://web3forms.com/privacy y https://web3forms.com/terms.
   - Fuentes: https://docs.web3forms.com/getting-started/faq · https://docs.web3forms.com/

5. **Cloudflare Web Analytics.**
   - Redactado: según la documentación de Cloudflare, no usa cookies ni almacenamiento local y no identifica ni sigue a las personas. Muestra cifras agregadas: visitas, páginas, país, dispositivo y navegador.
   - Detalles de la documentación:
     - No registra los parámetros de la URL (query strings).
     - Guarda datos sin muestrear 7 días.
     - No dice si guarda direcciones IP; solo que no las usa para identificar ni seguir a nadie.
   - Fuentes: https://www.cloudflare.com/web-analytics/ · https://developers.cloudflare.com/web-analytics/about/ · https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/ · https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/ · https://developers.cloudflare.com/web-analytics/faq/ · https://blog.cloudflare.com/privacy-first-web-analytics/

6. **Proveedor de email.**
   - Redactado: Gmail (Google), que recibe y almacena los mensajes y las respuestas.
   - Referencia: https://policies.google.com/privacy

7. **Plazos para responder pedidos de acceso, rectificación o eliminación.**
   - En el texto: "respondemos dentro de los plazos que establece la ley aplicable", con el canal xzajux@gmail.com.
   - Lo que dicen las leyes (para tenerlo a mano, no figura en el sitio):
     - **Uruguay:** acceso en 5 días hábiles (Ley 18.331, art. 14; Decreto 414/009, art. 9). Rectificación, actualización, inclusión o supresión en un máximo de 5 días hábiles (art. 15).
     - **Brasil:** confirmación y acceso "imediatamente" en formato simplificado, o hasta 15 días para la declaración completa (LGPD, art. 19). Los demás plazos los fijará la ANPD por reglamento (art. 18, §5). No se encontró una resolución de la ANPD que ya los fije; falta revisar la Resolución CD/ANPD nº 2/2022 (agentes de pequeño porte).
   - Fuentes: https://www.impo.com.uy/bases/leyes/18331-2008 · https://www.impo.com.uy/bases/decretos/414-2009 · https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares · https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd

8. **Política de Cookies.**
   - Redactado: no hay cookies de seguimiento ni de publicidad. Solo hay almacenamiento local esencial (idioma, borrador del formulario e intro vista) y analítica sin cookies, y por eso no hay banner.
   - A revisar: que ese criterio (almacenamiento esencial sin consentimiento) se sostiene en Uruguay y en Brasil.

9. **Términos de uso.**
   - Redactado:
     - Uso del sitio.
     - Propiedad intelectual.
     - Información orientativa: presupuestos y condiciones por escrito con cada cliente.
     - Limitación de responsabilidad "en la medida en que la ley lo permita", salvo dolo o culpa grave y sin limitar los derechos del consumidor.
     - Ley de Uruguay, sin perjuicio de los derechos de los consumidores de Brasil según el Código de Defensa del Consumidor (Ley 8.078/1990).
   - Fuente: https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm

**Transferencias internacionales (relacionado con los puntos 4 a 6).**

- Redactado: los proveedores pueden procesar datos fuera de Uruguay y de Brasil (por ejemplo, en Estados Unidos) porque es necesario para responder la consulta. Se citan la Ley 18.331, art. 23, y la LGPD, art. 33.
- A revisar con un profesional:
  - Si alcanza con la excepción de "medidas precontractuales a petición del interesado" (Ley 18.331, art. 23, literal B; LGPD, art. 33, inciso IX en relación con el art. 7, V).
  - O si conviene sumar al formulario una casilla de consentimiento específico y destacado para la transferencia (LGPD, art. 33, inciso VIII).

Si cambian la Política de Privacidad, actualizar `PRIVACY_POLICY` (versión y fecha) y `LEGAL_UPDATED` en [src/data/business.ts](src/data/business.ts). La versión aceptada viaja en cada email como registro del consentimiento.
