import type { LegalContent } from './types';

/**
 * Legal texts in English.
 * [REVISAR] = to be validated by a professional · [CONFIRMAR] = to be confirmed by ZAJUX.
 */
const legal: LegalContent = {
  privacy: {
    description: 'What data the ZAJUX website collects, what we use it for, who we share it with and how to exercise your rights.',
    intro:
      'At ZAJUX we take your data seriously. This policy explains, in plain language, what information we collect when you use this website, what we use it for and what your rights are. In short: we only receive the data you type into the contact form yourself, and only if you choose to send it.',
    sections: [
      {
        id: 'who-we-are',
        title: 'Who we are',
        blocks: [
          'The data controllers are the members of ZAJUX, a web design and development studio: Juani Hermelo (Maldonado, Uruguay) and Zahir El Debal (Manaus, Brazil). [REVISAR: legal form and registration details, if any]',
          'For anything related to your personal data, write to us at {email}.',
        ],
      },
      {
        id: 'data',
        title: 'What data we collect',
        blocks: [
          'Only the data in the contact form, and only if you send it:',
          [
            'Name (required).',
            'Business or company, ideal timeline, plan of interest and whether you already have a website or domain (optional).',
            'Country and the service you need (required).',
            'Your email (optional; only if you want us to reply by email).',
            'The message you write.',
          ],
          'If you send your enquiry by email, the date and time of sending, the site language and the version of this policy you accepted are added automatically. That information is the record of your consent; we do not store anything else anywhere else.',
          'If you choose WhatsApp, the website simply opens your app with the message ready: you send it yourself, from your own account, and it reaches us like any other chat.',
          'We do not use tracking or advertising cookies. To count visits we use cookie-free analytics that do not identify you (see "Who we share data with").',
        ],
      },
      {
        id: 'purpose',
        title: 'What we use it for',
        blocks: [
          'We only use your data to answer your enquiry and, if you ask, to prepare a proposal and quote. We do not use it to send you advertising, we do not sell it and we do not pass it on to third parties for commercial purposes.',
        ],
      },
      {
        id: 'legal-basis',
        title: 'Legal basis',
        blocks: [
          'We process your data based on your consent, which you give by ticking "I accept the Privacy Policy" and sending the form, and to take pre-contractual steps at your request (replying and quoting). [REVISAR]',
          'In Uruguay, this is covered by Law No. 18,331 on Personal Data Protection. In Brazil, by the General Data Protection Law (LGPD, Law No. 13,709/2018), article 7, items I and V. [REVISAR]',
          'You can withdraw your consent at any time by writing to us, without affecting anything done before.',
        ],
      },
      {
        id: 'retention',
        title: 'How long we keep it',
        blocks: [
          'We keep your data while the conversation about your enquiry lasts. If we do not go ahead with a project, we delete it within 12 months of our last contact. [CONFIRMAR period] If we work together, we keep it for as long as the law requires for the business relationship. [REVISAR]',
        ],
      },
      {
        id: 'third-parties',
        title: 'Who we share data with',
        blocks: [
          'To run the website we use these providers, which only process what they need to deliver their service:',
          [
            'Web3Forms: receives the form when you choose "Send by email" and forwards it to us by email. [REVISAR: server location and terms]',
            'WhatsApp (Meta): only if you choose that channel; you send the message yourself from your app.',
            'Cloudflare: hosts the website and gives us aggregated, cookie-free visit statistics (Cloudflare Web Analytics). [REVISAR]',
            'Our email provider, where we receive and answer enquiries. [CONFIRMAR provider]',
          ],
          'Some of these providers may process data outside Uruguay or Brazil. We chose them for their security and privacy safeguards. [REVISAR: international transfers]',
        ],
      },
      {
        id: 'rights',
        title: 'Your rights',
        blocks: [
          'You can ask us at any time for:',
          [
            'Access: to know what data of yours we hold.',
            'Correction of inaccurate or incomplete data.',
            'Deletion of your data.',
            'Objection and withdrawal of consent.',
            'In Brazil, also portability and information about who we share your data with (LGPD, art. 18).',
          ],
          'To exercise them, write to {email} from the email address you gave us, or include the details of your enquiry. We reply within the time limits set by law. [REVISAR time limits]',
          'If you feel we have not handled your request properly, you can file a complaint with the Unidad Reguladora y de Control de Datos Personales (URCDP) in Uruguay or the Autoridade Nacional de Proteção de Dados (ANPD) in Brazil.',
        ],
      },
      {
        id: 'security',
        title: 'Security',
        blocks: ['The website always runs over an encrypted connection (HTTPS), and access to enquiries is limited to the two people who make up ZAJUX.'],
      },
      {
        id: 'minors',
        title: 'Minors',
        blocks: ['This website is aimed at businesses and professionals. We do not knowingly collect data from anyone under 18.'],
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        blocks: ['If we change this policy, we will publish the new version on this page with its number and date. Current version: {version} ({date}).'],
      },
    ],
  },

  cookies: {
    description: 'The ZAJUX website uses no tracking or advertising cookies. What it stores on your device and why there is no cookie banner.',
    intro:
      'Short and simple: this website does not use tracking or advertising cookies. It only stores a few essential pieces of data in your browser so it works properly, and that data never leaves your device.',
    sections: [
      {
        id: 'what-we-dont-use',
        title: 'What we do not use',
        blocks: ['We do not use Google Analytics, Google Tag Manager, social media pixels or advertising and profiling cookies.'],
      },
      {
        id: 'storage',
        title: 'What we store on your device',
        blocks: [
          'We use your browser’s local storage (these are not cookies and are never sent to any server) only for:',
          [
            'zajux:locale (local storage): the language you chose, so we can show the site in that language next time.',
            'zajux:contact-draft (local storage): a draft of the contact form, so you don’t lose what you typed. It is deleted when you send your enquiry.',
            'zajux:intro (session storage): records that you have already seen the logo animation, so it doesn’t repeat. It is deleted when you close the tab.',
          ],
        ],
      },
      {
        id: 'analytics',
        title: 'Cookie-free analytics',
        blocks: [
          'To know how many people visit the site we use Cloudflare Web Analytics, which works without cookies and without identifying you: it only shows us aggregated figures, such as visit counts or most viewed pages. [REVISAR]',
        ],
      },
      {
        id: 'banner',
        title: 'Why there is no cookie banner',
        blocks: [
          'Because we do not use tracking cookies, and what we store is strictly necessary for features you use (language, draft, intro), there is no need to ask for consent with a banner. [REVISAR]',
        ],
      },
      {
        id: 'delete',
        title: 'How to delete this data',
        blocks: [
          'You can delete it at any time from your browser settings ("Clear browsing data" or "Site data"). The website will keep working the same.',
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
    description: 'Terms of use of the ZAJUX website: content, intellectual property, quotes, liability and governing law.',
    intro: 'By using this website you accept these terms. There are only a few, written to be understood.',
    sections: [
      {
        id: 'use',
        title: 'Use of the website',
        blocks: [
          'This website presents the services of ZAJUX, a web design and development studio formed by Juani Hermelo and Zahir El Debal. You are free to browse it and use the form to send us enquiries. Please do not use it to send illegal, offensive or automated content (spam).',
        ],
      },
      {
        id: 'ip',
        title: 'Intellectual property',
        blocks: [
          'The text, design, ZAJUX logo and brand, illustrations and code of this website belong to ZAJUX unless stated otherwise. You may not copy or reuse them without our written permission.',
          'The demos are examples with sample data: the business names that appear in them are made up.',
        ],
      },
      {
        id: 'information',
        title: 'Indicative information and quotes',
        blocks: [
          'The information on this website about services, plans and timelines is indicative. Every project is quoted individually: scope, timeline, price and payment terms are agreed in writing with each client before work starts. Nothing published on this website is a binding offer.',
        ],
      },
      {
        id: 'links',
        title: 'Third-party services and links',
        blocks: [
          'The website may open third-party services, such as WhatsApp, or link to other websites. We are not responsible for the content or operation of those services, which have their own terms.',
        ],
      },
      {
        id: 'liability',
        title: 'Limitation of liability',
        blocks: [
          'We do our best to keep the website working and its information accurate, but we cannot guarantee that it will always be available or error-free. To the extent permitted by law, ZAJUX is not liable for damages arising from use of the website. [REVISAR]',
        ],
      },
      {
        id: 'law',
        title: 'Governing law',
        blocks: [
          'These terms are governed by the laws of the Oriental Republic of Uruguay, without prejudice to any rights granted to you by the consumer protection laws of your country. [REVISAR]',
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
