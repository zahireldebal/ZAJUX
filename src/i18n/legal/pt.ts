import type { LegalContent } from './types';

/**
 * Textos legais em português do Brasil.
 * [REVISAR] = validar com um profissional · [CONFIRMAR] = dado a confirmar pela ZAJUX.
 */
const legal: LegalContent = {
  privacy: {
    description: 'Quais dados o site da ZAJUX coleta, para que usamos, com quem compartilhamos e como exercer seus direitos.',
    intro:
      'Na ZAJUX levamos seus dados a sério. Esta política explica, de forma simples, quais informações coletamos quando você usa este site, para que as usamos e quais são os seus direitos. Resumo: só recebemos os dados que você mesmo escreve no formulário de contato, e apenas se decidir enviá-lo.',
    sections: [
      {
        id: 'controladores',
        title: 'Quem somos',
        blocks: [
          'Os controladores dos dados são os integrantes da ZAJUX, estúdio de design e desenvolvimento web: Juani Hermelo (Maldonado, Uruguai) e Zahir El Debal (Manaus, Brasil). [REVISAR: forma jurídica e dados de registro, se houver]',
          'Para qualquer assunto relacionado aos seus dados pessoais, escreva para {email}.',
        ],
      },
      {
        id: 'dados',
        title: 'Quais dados coletamos',
        blocks: [
          'Apenas os dados do formulário de contato, e somente se você enviá-lo:',
          [
            'Nome (obrigatório).',
            'Negócio ou empresa, prazo desejado, plano de interesse e se já tem site ou domínio (opcionais).',
            'País e serviço de que precisa (obrigatórios).',
            'Seu e-mail (opcional; só se quiser resposta por e-mail).',
            'A mensagem que você escrever.',
          ],
          'Se você enviar a consulta por e-mail, são incluídos automaticamente a data e a hora do envio, o idioma do site e a versão desta política que você aceitou. Essa informação é o registro do seu consentimento; não guardamos mais nada em nenhum outro lugar.',
          'Se você escolher o WhatsApp, o site apenas abre o seu aplicativo com a mensagem pronta: quem envia é você, da sua conta, e a mensagem chega para nós como qualquer outra conversa.',
          'Não usamos cookies de rastreamento nem de publicidade. Para medir visitas usamos uma análise sem cookies que não identifica você (veja "Com quem compartilhamos dados").',
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
          'Tratamos seus dados com o seu consentimento, dado ao marcar a caixa "Aceito a Política de Privacidade" e enviar o formulário, e para procedimentos preliminares a um contrato, a seu pedido (responder e orçar). [REVISAR]',
          'No Brasil, isso se baseia na Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018), art. 7º, incisos I e V. No Uruguai, na Lei nº 18.331 de Proteção de Dados Pessoais. [REVISAR]',
          'Você pode revogar o consentimento a qualquer momento, escrevendo para nós, sem afetar o que foi feito antes.',
        ],
      },
      {
        id: 'retencao',
        title: 'Por quanto tempo guardamos',
        blocks: [
          'Guardamos seus dados enquanto durar a conversa sobre a sua consulta. Se não seguirmos com um projeto, eles são eliminados em até 12 meses após o último contato. [CONFIRMAR prazo] Se trabalharmos juntos, guardamos pelo tempo exigido por lei para a relação comercial. [REVISAR]',
        ],
      },
      {
        id: 'terceiros',
        title: 'Com quem compartilhamos dados',
        blocks: [
          'Para o site funcionar usamos estes fornecedores, que processam apenas o necessário para prestar o serviço:',
          [
            'Web3Forms: recebe o formulário quando você escolhe "Enviar por e-mail" e o encaminha para nós. [REVISAR: localização dos servidores e condições]',
            'WhatsApp (Meta): só se você escolher esse canal; quem envia a mensagem é você, pelo seu aplicativo.',
            'Cloudflare: hospeda o site e fornece estatísticas agregadas de visitas, sem cookies (Cloudflare Web Analytics). [REVISAR]',
            'Nosso provedor de e-mail, onde recebemos e respondemos as consultas. [CONFIRMAR provedor]',
          ],
          'Alguns desses fornecedores podem processar dados fora do Brasil ou do Uruguai. Escolhemos fornecedores com boas garantias de segurança e privacidade. [REVISAR: transferência internacional]',
        ],
      },
      {
        id: 'direitos',
        title: 'Seus direitos',
        blocks: [
          'Você pode nos pedir a qualquer momento:',
          [
            'Confirmação e acesso: saber quais dados seus temos.',
            'Correção de dados incompletos, inexatos ou desatualizados.',
            'Eliminação dos seus dados.',
            'Portabilidade e informação sobre com quem compartilhamos seus dados (LGPD, art. 18).',
            'Revogação do consentimento.',
          ],
          'Para exercer esses direitos, escreva para {email} a partir do e-mail que nos informou ou indicando os dados da sua consulta. Respondemos dentro dos prazos legais. [REVISAR prazos]',
          'Se achar que não atendemos bem o seu pedido, você pode apresentar uma reclamação à Autoridade Nacional de Proteção de Dados (ANPD) no Brasil ou à Unidad Reguladora y de Control de Datos Personales (URCDP) no Uruguai.',
        ],
      },
      {
        id: 'seguranca',
        title: 'Segurança',
        blocks: ['O site funciona sempre com conexão criptografada (HTTPS) e o acesso às consultas é restrito às duas pessoas que formam a ZAJUX.'],
      },
      {
        id: 'menores',
        title: 'Menores de idade',
        blocks: ['Este site é voltado a negócios e profissionais. Não coletamos intencionalmente dados de menores de 18 anos.'],
      },
      {
        id: 'alteracoes',
        title: 'Alterações nesta política',
        blocks: ['Se alterarmos esta política, publicaremos a nova versão nesta página, com número e data. Versão vigente: {version} ({date}).'],
      },
    ],
  },

  cookies: {
    description: 'O site da ZAJUX não usa cookies de rastreamento nem de publicidade. O que fica salvo no seu dispositivo e por que não há banner de cookies.',
    intro:
      'Direto ao ponto: este site não usa cookies de rastreamento nem de publicidade. Ele só salva no seu navegador alguns dados essenciais para funcionar bem, e esses dados nunca saem do seu dispositivo.',
    sections: [
      {
        id: 'o-que-nao-usamos',
        title: 'O que não usamos',
        blocks: ['Não usamos Google Analytics, Google Tag Manager, pixels de redes sociais nem cookies de publicidade ou de perfil.'],
      },
      {
        id: 'armazenamento',
        title: 'O que fica salvo no seu dispositivo',
        blocks: [
          'Usamos o armazenamento local do navegador (não são cookies e não são enviados a nenhum servidor) apenas para:',
          [
            'zajux:locale (armazenamento local): o idioma que você escolheu, para mostrar o site nesse idioma da próxima vez.',
            'zajux:contact-draft (armazenamento local): o rascunho do formulário de contato, para você não perder o que escreveu. É apagado quando você envia a consulta.',
            'zajux:intro (armazenamento de sessão): indica que você já viu a animação do logo, para não repeti-la. É apagado ao fechar a aba.',
          ],
        ],
      },
      {
        id: 'analise',
        title: 'Análise sem cookies',
        blocks: [
          'Para saber quantas pessoas visitam o site usamos o Cloudflare Web Analytics, que funciona sem cookies e sem identificar você: mostra apenas números agregados, como quantidade de visitas ou páginas mais vistas. [REVISAR]',
        ],
      },
      {
        id: 'banner',
        title: 'Por que não há banner de cookies',
        blocks: [
          'Como não usamos cookies de rastreamento e o que salvamos é estritamente necessário para funções que você usa (idioma, rascunho, introdução), não é preciso pedir consentimento com um banner. [REVISAR]',
        ],
      },
      {
        id: 'apagar',
        title: 'Como apagar esses dados',
        blocks: [
          'Você pode apagá-los a qualquer momento nas configurações do navegador ("Limpar dados de navegação" ou "Dados de sites"). O site continua funcionando normalmente.',
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
    description: 'Condições de uso do site da ZAJUX: conteúdo, propriedade intelectual, orçamentos, responsabilidade e lei aplicável.',
    intro: 'Ao usar este site você aceita estas condições. São poucas e escritas para serem entendidas.',
    sections: [
      {
        id: 'uso',
        title: 'Uso do site',
        blocks: [
          'Este site apresenta os serviços da ZAJUX, estúdio de design e desenvolvimento web formado por Juani Hermelo e Zahir El Debal. Você pode navegar livremente e usar o formulário para enviar consultas. Pedimos que não o use para enviar conteúdo ilegal, ofensivo ou automatizado (spam).',
        ],
      },
      {
        id: 'propriedade',
        title: 'Propriedade intelectual',
        blocks: [
          'Os textos, o design, o logo e a marca ZAJUX, as ilustrações e o código deste site pertencem à ZAJUX, salvo indicação em contrário. Não é permitido copiá-los ou reutilizá-los sem nossa autorização por escrito.',
          'As demos são exemplos com dados fictícios: os nomes de negócios que aparecem nelas são inventados.',
        ],
      },
      {
        id: 'informacoes',
        title: 'Informações e orçamentos',
        blocks: [
          'As informações do site sobre serviços, planos e prazos são orientativas. Cada projeto é orçado sob medida: escopo, prazos, valor e condições de pagamento são combinados por escrito com cada cliente antes de começar. Nada do que está publicado neste site é uma oferta vinculante.',
        ],
      },
      {
        id: 'links',
        title: 'Serviços e links de terceiros',
        blocks: [
          'O site pode abrir serviços de terceiros, como o WhatsApp, ou levar a outros sites. Não somos responsáveis pelo conteúdo nem pelo funcionamento desses serviços, que têm suas próprias condições.',
        ],
      },
      {
        id: 'responsabilidade',
        title: 'Limitação de responsabilidade',
        blocks: [
          'Fazemos o possível para que o site funcione bem e suas informações estejam corretas, mas não podemos garantir que esteja sempre disponível ou livre de erros. Na medida permitida pela lei, a ZAJUX não responde por danos decorrentes do uso do site. [REVISAR]',
        ],
      },
      {
        id: 'lei',
        title: 'Lei aplicável',
        blocks: [
          'Estas condições são regidas pelas leis da República Oriental do Uruguai, sem prejuízo dos direitos que o Código de Defesa do Consumidor e as demais leis do Brasil garantem a você. [REVISAR]',
        ],
      },
      {
        id: 'alteracoes-termos',
        title: 'Alterações e contato',
        blocks: ['Podemos atualizar estas condições; a data da última versão aparece no topo. Para qualquer dúvida, escreva para {email}.'],
      },
    ],
  },
};

export default legal;
