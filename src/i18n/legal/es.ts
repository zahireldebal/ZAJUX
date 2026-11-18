import type { LegalContent } from './types';

/**
 * Textos legales en español. Describen solo lo que el sitio hace de verdad.
 * Fuentes y puntos a validar con un profesional: ver PENDIENTES.md.
 */
const legal: LegalContent = {
  privacy: {
    description: 'Qué datos recoge el sitio de ZAJUX, para qué los usamos, con quién se comparten y cómo ejercer tus derechos.',
    intro:
      'Esta política explica, en lenguaje claro, qué información recibimos cuando usás este sitio, para qué la usamos y qué derechos tenés. En resumen: solo recibimos los datos que vos escribís en el formulario de contacto, y únicamente si decidís enviarlo.',
    sections: [
      {
        id: 'responsables',
        title: 'Quiénes somos',
        blocks: [
          'ZAJUX es un proyecto de Juani Hermelo (Maldonado, Uruguay) y Zahir El Debal (Manaus, Brasil), que trabajan como profesionales independientes. ZAJUX no es una empresa registrada.',
          'Juani y Zahir son los responsables de los datos que se reciben a través de este sitio. Para cualquier tema relacionado con tus datos personales, escribinos a {email}.',
        ],
      },
      {
        id: 'datos',
        title: 'Qué datos recogemos',
        blocks: [
          'Solo los datos del formulario de contacto, y únicamente si lo enviás:',
          [
            'Nombre (obligatorio).',
            'País y servicio que necesitás (obligatorios).',
            'Negocio o empresa, plazo deseado, plan de interés y si ya tenés web o dominio (opcionales).',
            'Tu email (opcional; solo si querés que te respondamos por email).',
            'El mensaje que escribas.',
          ],
          'Si enviás la consulta por email, se agregan automáticamente la fecha y hora del envío, el idioma del sitio y la versión de esta política que aceptaste. Esa información es el registro de tu consentimiento.',
          'Si elegís WhatsApp, el sitio solo abre tu aplicación con el mensaje armado: el envío lo hacés vos, desde tu cuenta, y el mensaje nos llega como cualquier otro chat.',
          'No usamos cookies de seguimiento ni de publicidad (ver la Política de Cookies).',
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
          'Tratamos tus datos por dos motivos:',
          [
            'Tu consentimiento, que nos das al marcar la casilla "Acepto la Política de Privacidad" y enviar el formulario.',
            'La realización de pasos previos a un contrato que vos nos pedís: responder tu consulta y preparar un presupuesto.',
          ],
          'En Uruguay, esto se ampara en la Ley N.º 18.331 de Protección de Datos Personales, que exige un consentimiento libre, previo, expreso e informado (artículo 9). En Brasil, en la Ley General de Protección de Datos (LGPD, Ley N.º 13.709/2018), artículo 7, incisos I (consentimiento del titular) y V (ejecución de un contrato o de procedimientos preliminares relacionados con un contrato del que el titular es parte, a pedido del titular).',
          'Podés retirar tu consentimiento en cualquier momento escribiéndonos, sin que eso afecte lo hecho antes.',
        ],
      },
      {
        id: 'conservacion',
        title: 'Cuánto tiempo los conservamos',
        blocks: [
          [
            'Si tu consulta no termina en una contratación, guardamos tus datos hasta 12 meses desde el último contacto y después los eliminamos.',
            'Si trabajamos juntos, los guardamos mientras dure la relación y durante los plazos que exija la ley aplicable.',
          ],
        ],
      },
      {
        id: 'terceros',
        title: 'Con quién compartimos datos',
        blocks: [
          'Para que el sitio funcione usamos estos proveedores, que procesan solo lo necesario para prestar su servicio:',
          [
            'Web3Forms (Web3Creative, India): recibe el formulario cuando elegís "Enviar por email" y nos lo reenvía por correo. Según su documentación, no guarda el contenido de los formularios, sus servidores están en Estados Unidos y sus registros técnicos, que pueden incluir datos como la dirección IP, se borran periódicamente.',
            'Gmail (Google): es nuestro proveedor de correo electrónico. Recibe y almacena los mensajes que nos enviás por email y nuestras respuestas.',
            'WhatsApp (Meta): solo si elegís ese canal. El mensaje lo enviás vos desde tu aplicación, con las condiciones de WhatsApp.',
            'Cloudflare: aloja el sitio. Si medimos visitas, lo hacemos con Cloudflare Web Analytics, que no usa cookies y no identifica a las personas (ver la Política de Cookies).',
          ],
        ],
      },
      {
        id: 'transferencias',
        title: 'Datos fuera de Uruguay y Brasil',
        blocks: [
          'Estos proveedores pueden procesar datos fuera de Uruguay y de Brasil, por ejemplo en Estados Unidos. Esas transferencias son necesarias para recibir y responder la consulta que nos hacés.',
          'Las hacemos dentro de lo que permiten la Ley N.º 18.331 (artículo 23) y la LGPD (artículo 33), y solo con proveedores que se dedican a prestar estos servicios de forma segura.',
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
            'Si estás en Brasil, además, portabilidad e información sobre con quién compartimos tus datos (LGPD, artículo 18).',
          ],
          'Para ejercerlos, escribinos a {email} desde el email que nos diste o indicando los datos de tu consulta. Respondemos dentro de los plazos que establece la ley aplicable.',
          'Si considerás que no atendimos bien tu pedido, podés presentar un reclamo ante la Unidad Reguladora y de Control de Datos Personales (URCDP) en Uruguay o ante la Autoridad Nacional de Protección de Datos (ANPD) en Brasil.',
        ],
      },
      {
        id: 'seguridad',
        title: 'Seguridad',
        blocks: [
          'El sitio funciona siempre con conexión cifrada (HTTPS) y el acceso a las consultas está limitado a Juani y Zahir.',
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
      'Corto y claro: este sitio no usa cookies de seguimiento ni de publicidad. Solo guarda en tu navegador unos pocos datos esenciales para que funcione bien, y esos datos no salen de tu dispositivo.',
    sections: [
      {
        id: 'que-no-usamos',
        title: 'Lo que no usamos',
        blocks: ['No usamos Google Analytics, Google Tag Manager, píxeles de redes sociales ni cookies de publicidad o de perfilado.'],
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
          'Si medimos visitas, usamos Cloudflare Web Analytics. Según la documentación de Cloudflare, no usa cookies ni almacenamiento local, y no identifica ni sigue a las personas. Solo nos muestra cifras agregadas, como la cantidad de visitas, las páginas más vistas, el país, el tipo de dispositivo o el navegador.',
        ],
      },
      {
        id: 'banner',
        title: 'Por qué no hay banner de cookies',
        blocks: [
          'Lo que guardamos es esencial para funciones que vos usás (idioma, borrador e intro) y la analítica no usa cookies. Por eso no hace falta pedirte consentimiento con un banner de cookies.',
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
    description: 'Condiciones de uso del sitio de ZAJUX: uso, propiedad intelectual, presupuestos, responsabilidad y ley aplicable.',
    intro: 'Al usar este sitio aceptás estas condiciones. Son pocas y están escritas para que se entiendan.',
    sections: [
      {
        id: 'uso',
        title: 'Uso del sitio',
        blocks: [
          'Este sitio presenta los servicios de ZAJUX, un proyecto de diseño y desarrollo web de Juani Hermelo y Zahir El Debal. Podés navegarlo libremente y usar el formulario para hacernos consultas. Te pedimos no usarlo para enviar contenido ilegal, ofensivo o automatizado (spam).',
        ],
      },
      {
        id: 'propiedad',
        title: 'Propiedad intelectual',
        blocks: [
          'Los textos, el diseño, el logo y la marca ZAJUX, las ilustraciones y el código de este sitio pertenecen a ZAJUX, salvo que se indique otra cosa. No podés copiarlos ni reutilizarlos sin nuestro permiso por escrito.',
        ],
      },
      {
        id: 'informacion',
        title: 'Información orientativa y presupuestos',
        blocks: [
          'La información del sitio sobre servicios, planes y plazos es orientativa. Cada proyecto se presupuesta a medida: el alcance, los plazos, el precio y las condiciones de pago se acuerdan por escrito con cada cliente antes de empezar. Lo publicado en este sitio no es una oferta vinculante.',
        ],
      },
      {
        id: 'enlaces',
        title: 'Servicios y enlaces de terceros',
        blocks: [
          'El sitio puede abrir servicios de terceros, como WhatsApp, o enlazar a otros sitios. Esos servicios tienen sus propias condiciones y no somos responsables de su contenido ni de su funcionamiento.',
        ],
      },
      {
        id: 'responsabilidad',
        title: 'Limitación de responsabilidad',
        blocks: [
          'Hacemos lo posible para que el sitio funcione bien y su información sea correcta, pero no podemos garantizar que esté siempre disponible o libre de errores.',
          'En la medida en que la ley lo permita, ZAJUX no responde por daños derivados del uso del sitio o de la imposibilidad de usarlo, salvo en casos de dolo o culpa grave. Esto no limita los derechos que la ley te reconozca como consumidor.',
        ],
      },
      {
        id: 'ley',
        title: 'Ley aplicable',
        blocks: [
          'Estas condiciones se rigen por las leyes de la República Oriental del Uruguay, sin perjuicio de los derechos que correspondan a los consumidores de Brasil según su Código de Defensa del Consumidor (Ley N.º 8.078/1990).',
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
