// src/(default)/legal/i18n/locales/pt-PT/privacy.ts

import type { LegalDocumentFactory } from '@/src/(default)/legal/i18n/legal-locale.types.ts'

export const privacy: LegalDocumentFactory = (context) => {
    const { brand, controller, contact, supervisoryAuthority, sessions, minimumAge } = context

    const privacyEmailLink = {
        type: 'link',
        text: contact.privacyEmail,
        target: { kind: 'email', address: contact.privacyEmail },
    } as const

    const authorityLink = {
        type: 'link',
        text: `Comissão Nacional de Proteção de Dados (${supervisoryAuthority.acronym})`,
        target: { kind: 'external', href: supervisoryAuthority.url },
    } as const

    const controllerIdentity = [
        controller.legalName,
        controller.address,
        controller.taxId ? `NIF ${controller.taxId}` : undefined,
    ]
        .filter(Boolean)
        .join(', ')

    return {
        id: 'privacy',
        title: 'Política de privacidade',
        summary: `Explicamos que dados pessoais o ${brand.name} trata, porquê, durante quanto tempo e que direitos tem, em linguagem simples e em conformidade com o RGPD.`,
        sections: [
            {
                id: 'controller',
                title: 'Quem é o responsável pelo tratamento',
                blocks: [
                    {
                        type: 'paragraph',
                        content: [
                            `O responsável pelo tratamento dos dados da sua conta e da sua utilização da Plataforma é ${controllerIdentity}. Para qualquer questão sobre privacidade, contacte-nos através de `,
                            privacyEmailLink,
                            '.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: `Esta política aplica-se ao ${brand.name} e cumpre o Regulamento Geral sobre a Proteção de Dados (RGPD, Regulamento (UE) 2016/679) e a Lei n.º 58/2019.`,
                    },
                ],
            },
            {
                id: 'roles',
                title: 'Papéis no tratamento de dados',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'A Plataforma é usada por clientes e por negócios, e o nosso papel depende dos dados em causa.',
                    },
                    {
                        type: 'definitions',
                        items: [
                            {
                                term: 'Dados da conta e da Plataforma',
                                description: `O ${brand.name} é o responsável pelo tratamento: criação e segurança da conta, funcionamento da Plataforma e notificações de serviço.`,
                            },
                            {
                                term: 'Dados dos clientes de um negócio',
                                description: `Quando faz uma marcação, o Negócio recebe os dados necessários para a prestar e responde pela utilização que deles faz, como responsável pelo tratamento. O ${brand.name} trata esses dados por conta do Negócio, como subcontratante, para disponibilizar as ferramentas de gestão.`,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'data',
                title: 'Dados que tratamos',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Fornece-nos diretamente a maior parte destes dados ao registar-se e ao utilizar a Plataforma. Outros, como datas, estados e registos técnicos, são gerados automaticamente.',
                    },
                    {
                        type: 'table',
                        caption: 'Categorias de dados pessoais, dados tratados e finalidade',
                        columns: [
                            { key: 'category', label: 'Categoria' },
                            { key: 'data', label: 'Dados tratados' },
                            { key: 'purpose', label: 'Para quê' },
                        ],
                        rows: [
                            {
                                category: 'Conta',
                                data: 'Nome de utilizador, endereço de email, palavra-passe (guardada apenas sob a forma de hash), perfil, estado da conta e datas de criação e de atualização.',
                                purpose: 'Criar e gerir a conta, autenticar e proteger o acesso.',
                            },
                            {
                                category: 'Sessão',
                                data: 'Tokens de sessão. Os tokens de renovação são guardados na base de dados apenas sob a forma de hash, com as datas de expiração e de revogação.',
                                purpose:
                                    'Manter a sessão iniciada em segurança e permitir terminá-la.',
                            },
                            {
                                category: 'Negócios',
                                data: 'Nome e descrição do negócio, estabelecimentos (nome, morada e fuso horário), recursos e serviços.',
                                purpose: 'Apresentar e gerir a oferta de serviços.',
                            },
                            {
                                category: 'Marcações',
                                data: 'Cliente, negócio, estabelecimento, serviço e recurso, data e hora de início e de fim, estado, nota facultativa e histórico de alterações de estado (quem, quando e motivo).',
                                purpose: 'Criar, gerir e acompanhar marcações.',
                            },
                            {
                                category: 'Notificações',
                                data: 'Endereço de email do destinatário, conteúdo e tipo da mensagem, estado de entrega, tentativas de envio e data de leitura.',
                                purpose:
                                    'Informar sobre a conta e as marcações, por email e na aplicação.',
                            },
                            {
                                category: 'Dados técnicos',
                                data: 'Endereço IP, data e hora, pedidos efetuados, identificadores de correlação e registos de erro.',
                                purpose: 'Segurança, deteção de abusos, diagnóstico e fiabilidade.',
                            },
                        ],
                    },
                    {
                        type: 'callout',
                        tone: 'info',
                        content:
                            'Não recolhemos dados de pagamento e não utilizamos cookies de publicidade nem de análise. Os dados da conta e da marcação são necessários para prestar o serviço: sem eles não é possível criar conta nem fazer marcações.',
                    },
                    {
                        type: 'callout',
                        tone: 'warning',
                        title: 'Notas das marcações',
                        content:
                            'As notas são texto livre e visíveis para o Negócio. Evite incluir dados de saúde ou outra informação sensível, salvo se for indispensável para o serviço.',
                    },
                ],
            },
            {
                id: 'purposes',
                title: 'Finalidades e fundamentos',
                blocks: [
                    {
                        type: 'definitions',
                        items: [
                            {
                                term: 'Prestar o serviço',
                                description:
                                    'Criar e gerir a conta, tratar marcações e enviar notificações de serviço. Fundamento: execução de um contrato (art. 6.º, n.º 1, al. b) do RGPD).',
                            },
                            {
                                term: 'Segurança e prevenção de abusos',
                                description:
                                    'Autenticação, proteção contra acessos não autorizados, deteção de fraude e abuso, e diagnóstico técnico. Fundamento: interesse legítimo (art. 6.º, n.º 1, al. f) do RGPD).',
                            },
                            {
                                term: 'Obrigações legais',
                                description:
                                    'Responder a pedidos de autoridades e cumprir obrigações fiscais, contabilísticas ou outras. Fundamento: obrigação legal (art. 6.º, n.º 1, al. c) do RGPD).',
                            },
                            {
                                term: 'Defesa de direitos',
                                description:
                                    'Estabelecer, exercer ou defender direitos num processo. Fundamento: interesse legítimo (art. 6.º, n.º 1, al. f) do RGPD).',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content:
                            'Não vendemos dados pessoais, não os utilizamos para publicidade e não tomamos decisões exclusivamente automatizadas que produzam efeitos jurídicos sobre si.',
                    },
                ],
            },
            {
                id: 'sharing',
                title: 'Com quem partilhamos os dados',
                blocks: [
                    {
                        type: 'list',
                        items: [
                            'Negócios: quando faz uma marcação, o Negócio escolhido acede aos dados do Cliente necessários para a gerir, como o nome de utilizador, o email, o horário e as notas.',
                            'Prestadores de serviços (subcontratantes): por exemplo, alojamento da infraestrutura e envio de email. Tratam os dados apenas segundo as nossas instruções, ao abrigo de um contrato que cumpre o art. 28.º do RGPD.',
                            'Autoridades: quando a lei o exigir.',
                        ],
                    },
                ],
            },
            {
                id: 'transfers',
                title: 'Transferências internacionais',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Como regra, os dados são tratados no Espaço Económico Europeu. Se um prestador implicar uma transferência para fora do EEE, só a realizamos com as garantias previstas no RGPD, como uma decisão de adequação ou cláusulas contratuais-tipo.',
                    },
                ],
            },
            {
                id: 'retention',
                title: 'Durante quanto tempo conservamos os dados',
                blocks: [
                    {
                        type: 'definitions',
                        items: [
                            {
                                term: 'Conta e perfil',
                                description:
                                    'Enquanto a conta existir. Depois de eliminada, a conta deixa de estar acessível e os dados são eliminados ou anonimizados, exceto se tivermos de os conservar por obrigação legal ou para a defesa de direitos.',
                            },
                            {
                                term: 'Sessão',
                                description: `Os tokens de acesso expiram ao fim de ${sessions.accessTokenMinutes} minutos e os tokens de renovação ao fim de ${sessions.refreshTokenDays} dias, ou antes, se terminar a sessão. Tokens expirados ou revogados deixam de ser válidos.`,
                            },
                            {
                                term: 'Marcações e notificações',
                                description:
                                    'Pelo período necessário ao serviço e ao histórico das marcações. Depois, são eliminadas ou anonimizadas quando deixarem de ser necessárias.',
                            },
                            {
                                term: 'Dados técnicos',
                                description:
                                    'Por períodos curtos, limitados ao necessário para a segurança e o diagnóstico.',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'security',
                title: 'Como protegemos os dados',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Aplicamos medidas técnicas e organizativas adequadas ao risco, nomeadamente:',
                    },
                    {
                        type: 'list',
                        items: [
                            'palavras-passe guardadas apenas sob a forma de hash, nunca em texto simples;',
                            `tokens de acesso de curta duração (${sessions.accessTokenMinutes} minutos) e tokens de renovação guardados como hash e revogáveis;`,
                            'controlo de acessos por perfil: cada pessoa só acede ao que lhe diz respeito;',
                            'comunicação cifrada (HTTPS) em produção e cabeçalhos de segurança HTTP, incluindo uma política de segurança de conteúdos;',
                            'minimização na comunicação entre os componentes da Plataforma: apenas circulam os dados necessários e nunca palavras-passe, hashes ou tokens.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: `Nenhum sistema é totalmente seguro. Em caso de violação de dados pessoais, notificamos a ${supervisoryAuthority.acronym} e, quando existir risco elevado para si, informamo-lo, nos termos dos artigos 33.º e 34.º do RGPD.`,
                    },
                ],
            },
            {
                id: 'cookies',
                title: 'Cookies e armazenamento local',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Não utilizamos cookies de publicidade nem de análise. Para manter a sessão iniciada, guardamos um token de sessão no armazenamento local do seu navegador. É estritamente necessário ao funcionamento do serviço, pelo que não depende de consentimento (Lei n.º 41/2004).',
                    },
                    {
                        type: 'paragraph',
                        content:
                            'Pode apagar estes dados a qualquer momento nas definições do navegador, o que termina a sessão nesse dispositivo.',
                    },
                ],
            },
            {
                id: 'rights',
                title: 'Os seus direitos',
                blocks: [
                    {
                        type: 'definitions',
                        items: [
                            {
                                term: 'Acesso',
                                description:
                                    'Saber se tratamos dados seus e obter uma cópia deles (art. 15.º).',
                            },
                            {
                                term: 'Retificação',
                                description: 'Corrigir dados inexatos ou incompletos (art. 16.º).',
                            },
                            {
                                term: 'Apagamento',
                                description:
                                    'Pedir a eliminação dos seus dados, quando não tenhamos fundamento para os conservar (art. 17.º).',
                            },
                            {
                                term: 'Limitação',
                                description:
                                    'Pedir que o tratamento fique restringido em determinadas situações (art. 18.º).',
                            },
                            {
                                term: 'Portabilidade',
                                description:
                                    'Receber os dados que nos forneceu num formato estruturado e de uso corrente (art. 20.º).',
                            },
                            {
                                term: 'Oposição',
                                description:
                                    'Opor-se ao tratamento baseado em interesses legítimos (art. 21.º).',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            'Para exercer qualquer destes direitos, escreva para ',
                            privacyEmailLink,
                            '. Respondemos no prazo de um mês, que pode ser prorrogado nos termos do art. 12.º do RGPD, e podemos pedir informação adicional para confirmar a sua identidade. Se o pedido disser respeito a dados que um Negócio trata como responsável, pode dirigi-lo também a esse Negócio.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            'Tem ainda o direito de apresentar reclamação à ',
                            authorityLink,
                            ', a autoridade de controlo em Portugal.',
                        ],
                    },
                ],
            },
            {
                id: 'minors',
                title: 'Menores',
                blocks: [
                    {
                        type: 'paragraph',
                        content: `A Plataforma destina-se a maiores de ${minimumAge} anos. Não recolhemos deliberadamente dados de menores. Se tomar conhecimento de que um menor criou uma conta, contacte-nos para a eliminarmos.`,
                    },
                ],
            },
            {
                id: 'changes',
                title: 'Alterações a esta política',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Podemos atualizar esta política para refletir alterações no serviço ou na lei. A versão e as datas no topo da página identificam a edição em vigor e, em alterações relevantes, avisamo-lo com antecedência razoável.',
                    },
                ],
            },
            {
                id: 'contact',
                title: 'Contactos',
                blocks: [
                    {
                        type: 'paragraph',
                        content: [
                            'Para questões sobre privacidade, contacte ',
                            privacyEmailLink,
                            '.',
                        ],
                    },
                ],
            },
        ],
    }
}
