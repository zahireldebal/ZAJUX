import type { LegalContent } from './types';

/**
 * Legal texts in English. They describe only what the site actually does.
 * Sources and points to validate with a professional: see PENDIENTES.md.
 */
const legal: LegalContent = {
  privacy: {
    description: 'What data the ZAJUX website collects, what we use it for, who it is shared with and how to exercise your rights.',
    intro:
      'This policy explains, in plain language, what information we receive when you use this website, what we use it for and what your rights are. In short: we only receive the data you type into the contact form, and only if you choose to send it.',
    sections: [
      {
        id: 'who-we-are',
        title: 'Who we are',
        blocks: [
          'ZAJUX is a project by Juani Hermelo (Maldonado, Uruguay) and Zahir El Debal (Manaus, Brazil), who work as independent professionals. ZAJUX is not a registered company.',
          'Juani and Zahir are responsible for the data received through this website. For anything related to your personal data, write to us at {email}.',
        ],
      },
      {
        id: 'data',
        title: 'What data we collect',
        blocks: [
          'Only the data in the contact form, and only if you send it:',
          [
            'Name (required).',
            'Country and the service you need (required).',
            'Business or company, desired timeline, plan of interest and whether you already have a website or domain (optional).',
            'Your email (optional; only if you want us to reply by email).',
            'The message you write.',
          ],
          'If you send your enquiry by email, the date and time it was sent, the site language and the version of this policy you accepted are added automatically. That information is the record of your consent.',
          'If you choose WhatsApp, the site only opens your app with the message ready: you send it yourself, from your own account, and it reaches us like any other chat.',
          'We do not use tracking or advertising cookies (see the Cookie Policy).',
        ],
      },
      {
        id: 'purpose',
        title: 'What we use it for',
        blocks: [
          'We use your data only to reply to your enquiry and, if you ask, to prepare a proposal and a quote. We do not use it to send you advertising, we do not sell it and we do not share it with third parties for commercial purposes.',
        ],
      },
      {
        id: 'legal-basis',
        title: 'Legal basis',
        blocks: [
          'We process your data for two reasons:',
          [
            'Your consent, which you give by ticking "I accept the Privacy Policy" and sending the form.',
            'Taking steps prior to a contract at your request: replying to your enquiry and preparing a quote.',
          ],
          'In Uruguay, this is based on Law No. 18,331 on Personal Data Protection, which requires free, prior, express and informed consent (article 9). In Brazil, on the General Data Protection Law (LGPD, Law No. 13,709/2018), article 7, items I (consent of the data subject) and V (performance of a contract or preliminary procedures related to a contract to which the data subject is a party, at the data subject’s request).',
          'You can withdraw your consent at any time by writing to us, without affecting anything done before.',
        ],
      },
      {
        id: 'retention',
        title: 'How long we keep it',
        blocks: [
          [
            'If your enquiry does not lead to a contract, we keep your data for up to 12 months after the last contact and then delete it.',
            'If we work together, we keep it for as long as the relationship lasts and for the periods required by applicable law.',
          ],
        ],
      },
      {
        id: 'third-parties',
        title: 'Who we share data with',
        blocks: [
          'To run the site we use these providers, which only process what they need to provide their service:',
          [
            'Web3Forms (Web3Creative, India): receives the form when you choose "Send by email" and forwards it to us by email. According to its documentation, it does not store form contents, its servers are in the United States and its technical logs, which may include data such as your IP address, are deleted periodically.',
            'Gmail (Google): our email provider. It receives and stores the messages you send us by email and our replies.',
            'WhatsApp (Meta): only if you choose that channel. You send the message yourself from your app, under WhatsApp’s terms.',
            'Vercel (Vercel Inc., United States): hosts the site. If we measure visits, we use Vercel Web Analytics, which does not use cookies and does not identify people (see the Cookie Policy).',
          ],
        ],
      },
      {
        id: 'transfers',
        title: 'Data outside Uruguay and Brazil',
        blocks: [
          'These providers may process data outside Uruguay and Brazil, for example in the United States. These transfers are necessary to receive and reply to your enquiry.',
          'We make them within what Law No. 18,331 (article 23) and the LGPD (article 33) allow, and only with providers that specialise in delivering these services securely.',
        ],
      },
      {
        id: 'rights',
        title: 'Your rights',
        blocks: [
          'You can ask us at any time for:',
          [
            'Access: to know what data we hold about you.',
            'Rectification and update: to correct inaccurate or incomplete data.',
            'Deletion: to have your data erased.',
            'Objection and withdrawal of consent.',
            'If you are in Brazil, also portability and information about who we share your data with (LGPD, article 18).',
          ],
          'To exercise them, write to {email} from the email address you gave us or including the details of your enquiry. We reply within the time limits set by applicable law.',
          'If you think we did not handle your request properly, you can file a complaint with the Unidad Reguladora y de Control de Datos Personales (URCDP) in Uruguay or the Autoridade Nacional de Proteção de Dados (ANPD) in Brazil.',
        ],
      },
      {
        id: 'security',
        title: 'Security',
        blocks: ['The site always runs over an encrypted connection (HTTPS) and access to enquiries is limited to Juani and Zahir.'],
      },
      {
        id: 'minors',
        title: 'Minors',
        blocks: ['This site is aimed at businesses and professionals. We do not knowingly collect data from anyone under 18.'],
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        blocks: ['If we change this policy, we will publish the new version on this page with its number and date. Current version: {version} ({date}).'],
      },
    ],
  },

  cookies: {
    description: 'The ZAJUX website does not use tracking or advertising cookies. What it stores on your device and why there is no cookie banner.',
    intro:
      'Short and simple: this site does not use tracking or advertising cookies. It only stores a few essential items in your browser so it works properly, and that data does not leave your device.',
    sections: [
      {
        id: 'what-we-dont-use',
        title: 'What we don’t use',
        blocks: ['We do not use Google Analytics, Google Tag Manager, social media pixels, or advertising or profiling cookies.'],
      },
      {
        id: 'storage',
        title: 'What we store on your device',
        blocks: [
          'We use your browser’s local storage (these are not cookies and are not sent to any server) only for this:',
          [
            'zajux:locale (local storage): the language you chose, so we can show the site in that language next time.',
            'zajux:contact-draft (local storage): your contact form draft, so you don’t lose what you wrote. It is deleted when you send your enquiry.',
            'zajux:intro (session storage): records that you have seen the logo animation, so it doesn’t repeat. It is deleted when you close the tab.',
          ],
        ],
      },
      {
        id: 'analytics',
        title: 'Cookie-free analytics',
        blocks: [
          'If we measure visits, we use Vercel Web Analytics. According to Vercel’s documentation, it does not use cookies: it counts visits with an anonymous identifier that resets every day, so it cannot follow a person from one day to the next or across websites. It only shows us aggregate figures, such as the number of visits, most viewed pages, where visitors come from, country or city, device type, operating system or browser.',
        ],
      },
      {
        id: 'banner',
        title: 'Why there is no cookie banner',
        blocks: [
          'What we store is essential for features you use (language, draft and intro) and the analytics do not use cookies. That is why we don’t need to ask for your consent with a cookie banner.',
        ],
      },
      {
        id: 'delete',
        title: 'How to delete this data',
        blocks: [
          'You can delete it at any time in your browser settings ("Clear browsing data" or "Site data"). The site will keep working the same way.',
        ],
      },
      {
        id: 'contact-cookies',
        title: 'Contact',
        blocks: ['If you have questions about this policy, write to us at {email}.'],
      },
    ],
  },

  terms: {
    description: 'Terms of use of the ZAJUX website: use, intellectual property, quotes, liability and governing law.',
    intro: 'By using this website you accept these terms. There are only a few, and they are written to be understood.',
    sections: [
      {
        id: 'use',
        title: 'Use of the site',
        blocks: [
          'This website presents the services of ZAJUX, a web design and development project by Juani Hermelo and Zahir El Debal. You may browse it freely and use the form to send us enquiries. Please do not use it to send illegal, offensive or automated content (spam).',
        ],
      },
      {
        id: 'ip',
        title: 'Intellectual property',
        blocks: [
          'The copy, design, ZAJUX logo and brand, illustrations and code of this website belong to ZAJUX unless stated otherwise. You may not copy or reuse them without our written permission.',
        ],
      },
      {
        id: 'information',
        title: 'Guidance information and quotes',
        blocks: [
          'The information on this site about services, plans and timelines is for guidance only. Each project is quoted individually: scope, timelines, price and payment terms are agreed in writing with each client before work starts. Nothing published on this site is a binding offer.',
        ],
      },
      {
        id: 'links',
        title: 'Third-party services and links',
        blocks: [
          'The site may open third-party services, such as WhatsApp, or link to other websites. Those services have their own terms, and we are not responsible for their content or operation.',
        ],
      },
      {
        id: 'liability',
        title: 'Limitation of liability',
        blocks: [
          'We do our best to keep the site working and its information accurate, but we cannot guarantee it will always be available or error-free.',
          'To the extent permitted by law, ZAJUX is not liable for damages arising from the use of, or inability to use, the site, except in cases of wilful misconduct or gross negligence. This does not limit any rights the law grants you as a consumer.',
        ],
      },
      {
        id: 'law',
        title: 'Governing law',
        blocks: [
          'These terms are governed by the laws of the Oriental Republic of Uruguay, without prejudice to the rights of consumers in Brazil under its Consumer Protection Code (Law No. 8,078/1990).',
        ],
      },
      {
        id: 'changes-terms',
        title: 'Changes and contact',
        blocks: ['We may update these terms; the date of the latest version is shown above. For any questions, write to us at {email}.'],
      },
    ],
  },
};

export default legal;
