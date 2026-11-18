import type { LegalContent } from './types';

/**
 * Textos legais em português do Brasil. Descrevem apenas o que o site faz de verdade.
 * Fontes e pontos a validar com um profissional: ver PENDIENTES.md.
 */
const legal: LegalContent = {
  privacy: {
    description: 'Quais dados o site da ZAJUX coleta, para que os usamos, com quem são compartilhados e como exercer seus direitos.',
    intro:
      'Esta política explica, em linguagem simples, quais informações recebemos quando você usa este site, para que as usamos e quais são os seus direitos. Em resumo: só recebemos os dados que você escreve no formulário de contato, e apenas se decidir enviá-lo.',
    sections: [
      {
        id: 'controladores',
        title: 'Quem somos',
        blocks: [
          'A ZAJUX é um projeto de Juani Hermelo (Maldonado, Uruguai) e Zahir El Debal (Manaus, Brasil), que trabalham como profissionais autônomos. A ZAJUX não é uma empresa registrada.',
          'Juani e Zahir são os controladores dos dados recebidos por este site. Para qualquer assunto relacionado aos seus dados pessoais, escreva para {email}.',
        ],
      },
      {
        id: 'dados',
        title: 'Quais dados coletamos',
        blocks: [
          'Apenas os dados do formulário de contato, e somente se você enviá-lo:',
          [
            'Nome (obrigatório).',
            'País e serviço de que você precisa (obrigatórios).',
            'Negócio ou empresa, prazo desejado, plano de interesse e se você já tem site ou domínio (opcionais).',
            'Seu e-mail (opcional; apenas se quiser resposta por e-mail).',
            'A mensagem que você escrever.',
          ],
          'Se você enviar a consulta por e-mail, são adicionados automaticamente a data e a hora do envio, o idioma do site e a versão desta política que você aceitou. Essas informações são o registro do seu consentimento.',
          'Se você escolher o WhatsApp, o site apenas abre o seu aplicativo com a mensagem pronta: o envio é feito por você, da sua conta, e a mensagem chega como qualquer outra conversa.',
          'Não usamos cookies de rastreamento nem de publicidade (veja a Política de Cookies).',
        ],
      },
      {
        id: 'finalidade',
        title: 'Para que usamos',
        blocks: [
          'Usamos seus dados apenas para responder à sua consulta e, se você pedir, preparar uma proposta e um orçamento. Não usamos para enviar publicidade, não vendemos e não repassamos a terceiros para fins comerciais.',
        ],
      },
      {
        id: 'base-legal',
        title: 'Base legal',
        blocks: [
          'Tratamos seus dados por dois motivos:',
          [
            'O seu consentimento, dado ao marcar a caixa "Aceito a Política de Privacidade" e enviar o formulário.',
            'A realização de procedimentos preliminares a um contrato, a seu pedido: responder à sua consulta e preparar um orçamento.',
          ],
          'No Brasil, isso se baseia na Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018), art. 7º, incisos I ("mediante o fornecimento de consentimento pelo titular") e V ("quando necessário para a execução de contrato ou de procedimentos preliminares relacionados a contrato do qual seja parte o titular, a pedido do titular dos dados"). No Uruguai, na Lei nº 18.331 de Proteção de Dados Pessoais, que exige consentimento livre, prévio, expresso e informado (artigo 9).',
          'Você pode revogar o seu consentimento a qualquer momento escrevendo para nós, sem afetar o que foi feito antes.',
        ],
      },
      {
        id: 'retencao',
        title: 'Por quanto tempo guardamos',
        blocks: [
          [
            'Se a sua consulta não resultar em contratação, guardamos seus dados por até 12 meses após o último contato e depois os eliminamos.',
            'Se trabalharmos juntos, guardamos enquanto durar a relação e pelos prazos exigidos pela lei aplicável.',
          ],
        ],
      },
      {
        id: 'terceiros',
        title: 'Com quem compartilhamos dados',
        blocks: [
          'Para o site funcionar, usamos estes fornecedores, que processam apenas o necessário para prestar o seu serviço:',
          [
            'Web3Forms (Web3Creative, Índia): recebe o formulário quando você escolhe "Enviar por e-mail" e o encaminha para nós por e-mail. Segundo a sua documentação, não armazena o conteúdo dos formulários, seus servidores ficam nos Estados Unidos e seus registros técnicos, que podem incluir dados como o endereço IP, são apagados periodicamente.',
            'Gmail (Google): é o nosso provedor de e-mail. Recebe e armazena as mensagens que você nos envia por e-mail e as nossas respostas.',
            'WhatsApp (Meta): apenas se você escolher esse canal. A mensagem é enviada por você, pelo seu aplicativo, conforme as condições do WhatsApp.',
            'Cloudflare: hospeda o site. Se medirmos visitas, usamos o Cloudflare Web Analytics, que não usa cookies e não identifica as pessoas (veja a Política de Cookies).',
          ],
        ],
      },
      {
        id: 'transferencias',
        title: 'Dados fora do Brasil e do Uruguai',
        blocks: [
          'Esses fornecedores podem processar dados fora do Brasil e do Uruguai, por exemplo nos Estados Unidos. Essas transferências são necessárias para receber e responder à consulta que você nos faz.',
          'Elas são feitas dentro do que permitem a LGPD (art. 33) e a Lei nº 18.331 (artigo 23), e apenas com fornecedores especializados em prestar esses serviços com segurança.',
        ],
      },
      {
        id: 'direitos',
        title: 'Seus direitos',
        blocks: [
          'Você pode nos pedir a qualquer momento:',
          [
            'Confirmação e acesso: saber se tratamos e quais dados seus temos.',
            'Correção de dados incompletos, inexatos ou desatualizados.',
            'Eliminação dos seus dados.',
            'Portabilidade e informação sobre com quem compartilhamos seus dados (LGPD, art. 18).',
            'Oposição e revogação do consentimento.',
          ],
          'Para exercer esses direitos, escreva para {email} a partir do e-mail que nos informou ou indicando os dados da sua consulta. Respondemos dentro dos prazos estabelecidos pela lei aplicável.',
          'Se achar que não atendemos bem o seu pedido, você pode apresentar uma reclamação à Autoridade Nacional de Proteção de Dados (ANPD) no Brasil ou à Unidad Reguladora y de Control de Datos Personales (URCDP) no Uruguai.',
        ],
      },
      {
        id: 'seguranca',
        title: 'Segurança',
        blocks: ['O site funciona sempre com conexão criptografada (HTTPS) e o acesso às consultas é restrito a Juani e Zahir.'],
      },
      {
        id: 'menores',
        title: 'Menores de idade',
        blocks: ['Este site é voltado a negócios e profissionais. Não coletamos intencionalmente dados de menores de 18 anos.'],
      },
      {
        id: 'alteracoes',
        title: 'Alterações nesta política',
        blocks: [
          'Se alterarmos esta política, publicaremos a nova versão nesta página com número e data. Versão vigente: {version} ({date}).',
        ],
      },
    ],
  },

  cookies: {
    description: 'O site da ZAJUX não usa cookies de rastreamento nem de publicidade. O que fica salvo no seu dispositivo e por que não há banner de cookies.',
    intro:
      'Curto e direto: este site não usa cookies de rastreamento nem de publicidade. Ele só salva no seu navegador alguns dados essenciais para funcionar bem, e esses dados não saem do seu dispositivo.',
    sections: [
      {
        id: 'o-que-nao-usamos',
        title: 'O que não usamos',
        blocks: ['Não usamos Google Analytics, Google Tag Manager, pixels de redes sociais nem cookies de publicidade ou de perfil.'],
      },
      {
        id: 'armazenamento',
        title: 'O que salvamos no seu dispositivo',
        blocks: [
          'Usamos o armazenamento local do navegador (não são cookies e não são enviados a nenhum servidor) apenas para isto:',
          [
            'zajux:locale (armazenamento local): o idioma que você escolheu, para mostrar o site nesse idioma na próxima visita.',
            'zajux:contact-draft (armazenamento local): o rascunho do formulário de contato, para você não perder o que escreveu. É apagado ao enviar a consulta.',
            'zajux:intro (armazenamento de sessão): indica que você já viu a animação do logo, para não repeti-la. É apagado ao fechar a aba.',
          ],
        ],
      },
      {
        id: 'analitica',
        title: 'Análise sem cookies',
        blocks: [
          'Se medirmos visitas, usamos o Cloudflare Web Analytics. Segundo a documentação da Cloudflare, ele não usa cookies nem armazenamento local, e não identifica nem acompanha as pessoas. Mostra apenas números agregados, como quantidade de visitas, páginas mais vistas, país, tipo de dispositivo ou navegador.',
        ],
      },
      {
        id: 'banner',
        title: 'Por que não há banner de cookies',
        blocks: [
          'O que salvamos é essencial para funções que você usa (idioma, rascunho e introdução) e a análise não usa cookies. Por isso não é necessário pedir seu consentimento com um banner de cookies.',
        ],
      },
      {
        id: 'apagar',
        title: 'Como apagar esses dados',
        blocks: [
          'Você pode apagá-los a qualquer momento nas configurações do navegador ("Limpar dados de navegação" ou "Dados de sites"). O site continuará funcionando normalmente.',
        ],
      },
      {
        id: 'contato-cookies',
        title: 'Contato',
        blocks: ['Se tiver dúvidas sobre esta política, escreva para {email}.'],
      },
    ],
  },

  terms: {
    description: 'Termos de uso do site da ZAJUX: uso, propriedade intelectual, orçamentos, responsabilidade e lei aplicável.',
    intro: 'Ao usar este site, você aceita estes termos. São poucos e escritos para serem entendidos.',
    sections: [
      {
        id: 'uso',
        title: 'Uso do site',
        blocks: [
          'Este site apresenta os serviços da ZAJUX, um projeto de design e desenvolvimento web de Juani Hermelo e Zahir El Debal. Você pode navegar livremente e usar o formulário para nos enviar consultas. Pedimos que não o use para enviar conteúdo ilegal, ofensivo ou automatizado (spam).',
        ],
      },
      {
        id: 'propriedade',
        title: 'Propriedade intelectual',
        blocks: [
          'Os textos, o design, o logo e a marca ZAJUX, as ilustrações e o código deste site pertencem à ZAJUX, salvo indicação em contrário. Não é permitido copiá-los ou reutilizá-los sem nossa autorização por escrito.',
        ],
      },
      {
        id: 'informacao',
        title: 'Informações orientativas e orçamentos',
        blocks: [
          'As informações do site sobre serviços, planos e prazos são orientativas. Cada projeto é orçado sob medida: escopo, prazos, preço e condições de pagamento são combinados por escrito com cada cliente antes de começar. O que está publicado neste site não é uma oferta vinculante.',
        ],
      },
      {
        id: 'links',
        title: 'Serviços e links de terceiros',
        blocks: [
          'O site pode abrir serviços de terceiros, como o WhatsApp, ou levar a outros sites. Esses serviços têm suas próprias condições e não somos responsáveis pelo seu conteúdo nem pelo seu funcionamento.',
        ],
      },
      {
        id: 'responsabilidade',
        title: 'Limitação de responsabilidade',
        blocks: [
          'Fazemos o possível para que o site funcione bem e suas informações estejam corretas, mas não podemos garantir que esteja sempre disponível ou livre de erros.',
          'Na medida permitida pela lei, a ZAJUX não responde por danos decorrentes do uso do site ou da impossibilidade de usá-lo, salvo em casos de dolo ou culpa grave. Isso não limita os direitos que a lei garante a você como consumidor.',
        ],
      },
      {
        id: 'lei',
        title: 'Lei aplicável',
        blocks: [
          'Estes termos são regidos pelas leis da República Oriental do Uruguai, sem prejuízo dos direitos garantidos aos consumidores no Brasil pelo Código de Defesa do Consumidor (Lei nº 8.078/1990).',
        ],
      },
      {
        id: 'alteracoes-termos',
        title: 'Alterações e contato',
        blocks: ['Podemos atualizar estes termos; a data da última versão aparece no topo. Para qualquer dúvida, escreva para {email}.'],
      },
    ],
  },
};

export default legal;
