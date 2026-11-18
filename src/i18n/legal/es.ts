import type { LegalContent } from './types';

/**
 * Textos legales en español. Basados en lo que el sitio hace de verdad.
 * [REVISAR] = validar con un profesional · [CONFIRMAR] = dato a confirmar por ZAJUX.
 */
const legal: LegalContent = {
  privacy: {
    description: 'Qué datos recoge el sitio de ZAJUX, para qué los usamos, con quién se comparten y cómo ejercer tus derechos.',
    intro:
      'En ZAJUX nos tomamos en serio tus datos. Esta política explica, en lenguaje claro, qué información recogemos cuando usás este sitio, para qué la usamos y qué derechos tenés. Resumen: solo recibimos los datos que vos mismo escribís en el formulario de contacto, y únicamente si decidís enviarlo.',
    sections: [
      {
        id: 'responsables',
        title: 'Quiénes somos',
        blocks: [
          'Los responsables del tratamiento de los datos son los integrantes de ZAJUX, estudio de diseño y desarrollo web: Juani Hermelo (Maldonado, Uruguay) y Zahir El Debal (Manaus, Brasil). [REVISAR: forma jurídica y datos de registro, si corresponde]',
          'Para cualquier tema relacionado con tus datos personales podés escribirnos a {email}.',
        ],
      },
      {
        id: 'datos',
        title: 'Qué datos recogemos',
        blocks: [
          'Solo los datos del formulario de contacto, y únicamente si lo enviás:',
          [
            'Nombre (obligatorio).',
            'Negocio o empresa, plazo deseado, plan de interés y si ya tenés web o dominio (opcionales).',
            'País y servicio que necesitás (obligatorios).',
            'Tu email (opcional; solo si querés que te respondamos por email).',
            'El mensaje que escribas.',
          ],
          'Si enviás la consulta por email, se agregan automáticamente la fecha y hora del envío, el idioma del sitio y la versión de esta política que aceptaste. Esa información es el registro de tu consentimiento; no guardamos nada más en ningún otro lado.',
          'Si elegís WhatsApp, el sitio solo abre tu aplicación con el mensaje armado: el envío lo hacés vos, desde tu cuenta, y el mensaje nos llega como cualquier otro chat.',
          'No usamos cookies de seguimiento ni publicidad. Para medir visitas usamos una analítica sin cookies que no te identifica (ver la sección "Con quién compartimos datos").',
        ],
      },
      {
        id: 'finalidad',
        title: 'Para qué los usamos',
        blocks: [
          'Usamos tus datos únicamente para responder tu consulta y, si lo pedís, preparar una propuesta y un presupuesto. No los usamos para enviarte publicidad, no los vendemos y no los cedemos a terceros con fines comerciales.',
        ],
      },
      {
        id: 'base-legal',
        title: 'Base legal',
        blocks: [
          'Tratamos tus datos con tu consentimiento, que nos das al marcar la casilla "Acepto la Política de Privacidad" y enviar el formulario, y para aplicar medidas precontractuales que vos nos pedís (responderte y presupuestar). [REVISAR]',
          'En Uruguay, esto se ampara en la Ley N.º 18.331 de Protección de Datos Personales. En Brasil, en la Ley General de Protección de Datos (LGPD, Ley N.º 13.709/2018), artículo 7, incisos I y V. [REVISAR]',
          'Podés retirar tu consentimiento en cualquier momento escribiéndonos, sin que eso afecte lo hecho antes.',
        ],
      },
      {
        id: 'conservacion',
        title: 'Cuánto tiempo los conservamos',
        blocks: [
          'Conservamos tus datos mientras dure la conversación sobre tu consulta. Si no avanzamos con un proyecto, los eliminamos dentro de los 12 meses siguientes al último contacto. [CONFIRMAR plazo] Si trabajamos juntos, los conservamos lo que exija la ley para la relación comercial. [REVISAR]',
        ],
      },
      {
        id: 'terceros',
        title: 'Con quién compartimos datos',
        blocks: [
          'Para que el sitio funcione usamos estos proveedores, que solo procesan lo necesario para prestar su servicio:',
          [
            'Web3Forms: recibe el formulario cuando elegís "Enviar por email" y nos lo reenvía por correo. [REVISAR: ubicación de los servidores y condiciones]',
            'WhatsApp (Meta): solo si elegís ese canal; el mensaje lo enviás vos desde tu aplicación.',
            'Cloudflare: aloja el sitio y nos da estadísticas de visitas agregadas sin cookies (Cloudflare Web Analytics). [REVISAR]',
            'Nuestro proveedor de correo electrónico, donde recibimos y respondemos las consultas. [CONFIRMAR proveedor]',
          ],
          'Algunos de estos proveedores pueden procesar datos fuera de Uruguay o de Brasil. Los elegimos por sus garantías de seguridad y privacidad. [REVISAR: transferencias internacionales]',
        ],
      },
      {
        id: 'derechos',
        title: 'Tus derechos',
        blocks: [
          'Podés pedirnos en cualquier momento:',
          [
            'Acceso: saber qué datos tuyos tenemos.',
            'Rectificación y actualización: corregir datos inexactos o incompletos.',
            'Eliminación: que borremos tus datos.',
            'Oposición y retiro del consentimiento.',
            'En Brasil, además, portabilidad e información sobre con quién compartimos tus datos (LGPD, art. 18).',
          ],
          'Para ejercerlos, escribinos a {email} desde el email que nos diste o indicando los datos de tu consulta. Te respondemos dentro de los plazos que fija la ley. [REVISAR plazos]',
          'Si considerás que no atendimos bien tu pedido, podés presentar un reclamo ante la Unidad Reguladora y de Control de Datos Personales (URCDP) en Uruguay o ante la Autoridad Nacional de Protección de Datos (ANPD) en Brasil.',
        ],
      },
      {
        id: 'seguridad',
        title: 'Seguridad',
        blocks: [
          'El sitio funciona siempre con conexión cifrada (HTTPS) y el acceso a las consultas está limitado a las dos personas que forman ZAJUX.',
        ],
      },
      {
        id: 'menores',
        title: 'Menores de edad',
        blocks: ['Este sitio está dirigido a negocios y profesionales. No recogemos a sabiendas datos de menores de 18 años.'],
      },
      {
        id: 'cambios',
        title: 'Cambios en esta política',
        blocks: [
          'Si cambiamos esta política, publicamos la nueva versión en esta página con su número y fecha. Versión vigente: {version} ({date}).',
        ],
      },
    ],
  },

  cookies: {
    description: 'El sitio de ZAJUX no usa cookies de seguimiento ni publicidad. Qué guarda en tu dispositivo y por qué no hay banner de cookies.',
    intro:
      'Corto y claro: este sitio no usa cookies de seguimiento ni de publicidad. Solo guarda en tu navegador unos pocos datos esenciales para que funcione bien, y esos datos nunca salen de tu dispositivo.',
    sections: [
      {
        id: 'que-no-usamos',
        title: 'Lo que no usamos',
        blocks: ['No usamos Google Analytics, Google Tag Manager, píxeles de redes sociales ni cookies publicitarias o de perfilado.'],
      },
      {
        id: 'almacenamiento',
        title: 'Lo que guardamos en tu dispositivo',
        blocks: [
          'Usamos el almacenamiento local del navegador (no son cookies y no se envían a ningún servidor) solo para esto:',
          [
            'zajux:locale (almacenamiento local): el idioma que elegiste, para mostrarte el sitio en ese idioma la próxima vez.',
            'zajux:contact-draft (almacenamiento local): el borrador del formulario de contacto, para que no pierdas lo que escribiste. Se borra al enviar la consulta.',
            'zajux:intro (almacenamiento de sesión): indica que ya viste la animación del logo, para no repetirla. Se borra al cerrar la pestaña.',
          ],
        ],
      },
      {
        id: 'analitica',
        title: 'Analítica sin cookies',
        blocks: [
          'Para saber cuántas personas visitan el sitio usamos Cloudflare Web Analytics, que funciona sin cookies y sin identificarte: solo nos muestra cifras agregadas, como cantidad de visitas o páginas más vistas. [REVISAR]',
        ],
      },
      {
        id: 'banner',
        title: 'Por qué no hay banner de cookies',
        blocks: [
          'Como no usamos cookies de seguimiento y lo que guardamos es estrictamente necesario para funciones que vos usás (idioma, borrador, intro), no hace falta pedirte consentimiento con un banner. [REVISAR]',
        ],
      },
      {
        id: 'borrar',
        title: 'Cómo borrar estos datos',
        blocks: [
          'Podés borrarlos en cualquier momento desde la configuración de tu navegador ("Borrar datos de navegación" o "Datos de sitios"). El sitio va a seguir funcionando igual.',
        ],
      },
      {
        id: 'contacto-cookies',
        title: 'Contacto',
        blocks: ['Si tenés dudas sobre esta política, escribinos a {email}.'],
      },
    ],
  },

  terms: {
    description: 'Condiciones de uso del sitio de ZAJUX: contenido, propiedad intelectual, presupuestos, responsabilidad y ley aplicable.',
    intro: 'Al usar este sitio aceptás estas condiciones. Son pocas y están escritas para que se entiendan.',
    sections: [
      {
        id: 'uso',
        title: 'Uso del sitio',
        blocks: [
          'Este sitio presenta los servicios de ZAJUX, estudio de diseño y desarrollo web formado por Juani Hermelo y Zahir El Debal. Podés navegarlo libremente y usar el formulario para hacernos consultas. Te pedimos no usarlo para enviar contenido ilegal, ofensivo o automatizado (spam).',
        ],
      },
      {
        id: 'propiedad',
        title: 'Propiedad intelectual',
        blocks: [
          'Los textos, el diseño, el logo y la marca ZAJUX, las ilustraciones y el código de este sitio son de ZAJUX, salvo que se indique otra cosa. No podés copiarlos ni reutilizarlos sin nuestro permiso por escrito.',
          'Las demos son ejemplos con datos ficticios: los nombres de negocios que aparecen en ellas son inventados.',
        ],
      },
      {
        id: 'informacion',
        title: 'Información orientativa y presupuestos',
        blocks: [
          'La información del sitio sobre servicios, planes y plazos es orientativa. Cada proyecto se presupuesta a medida: el alcance, los plazos, el precio y las condiciones de pago se acuerdan por escrito con cada cliente antes de empezar. Nada de lo publicado en este sitio es una oferta vinculante.',
        ],
      },
      {
        id: 'enlaces',
        title: 'Servicios y enlaces de terceros',
        blocks: [
          'El sitio puede abrir servicios de terceros, como WhatsApp, o enlazar a otros sitios. No somos responsables del contenido ni del funcionamiento de esos servicios, que tienen sus propias condiciones.',
        ],
      },
      {
        id: 'responsabilidad',
        title: 'Limitación de responsabilidad',
        blocks: [
          'Hacemos lo posible para que el sitio funcione bien y su información sea correcta, pero no podemos garantizar que esté siempre disponible o libre de errores. En la medida en que la ley lo permita, ZAJUX no responde por daños derivados del uso del sitio. [REVISAR]',
        ],
      },
      {
        id: 'ley',
        title: 'Ley aplicable',
        blocks: [
          'Estas condiciones se rigen por las leyes de la República Oriental del Uruguay, sin perjuicio de los derechos que las leyes de protección al consumidor de tu país te reconozcan. [REVISAR]',
        ],
      },
      {
        id: 'cambios-terminos',
        title: 'Cambios y contacto',
        blocks: ['Podemos actualizar estas condiciones; la fecha de la última versión figura arriba. Por cualquier consulta, escribinos a {email}.'],
      },
    ],
  },
};

export default legal;
