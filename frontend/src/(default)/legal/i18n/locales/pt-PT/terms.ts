// src/(default)/legal/i18n/locales/pt-PT/terms.ts

import type { LegalDocumentFactory } from '@/src/(default)/legal/i18n/legal-locale.types.ts'

export const terms: LegalDocumentFactory = (context) => {
    const { brand, controller, contact, minimumAge, complaintsBookUrl } = context

    const privacyLink = {
        type: 'link',
        text: 'Política de privacidade',
        target: { kind: 'document', documentId: 'privacy' },
    } as const

    const supportEmailLink = {
        type: 'link',
        text: contact.supportEmail,
        target: { kind: 'email', address: contact.supportEmail },
    } as const

    const controllerIdentity = [
        controller.legalName,
        controller.address,
        controller.taxId ? `NIF ${controller.taxId}` : undefined,
    ]
        .filter(Boolean)
        .join(', ')

    return {
        id: 'terms',
        title: 'Termos de utilização',
        summary: `Estes termos regulam o acesso e a utilização do ${brand.name}, uma plataforma para gerir marcações entre clientes e negócios. Leia-os antes de criar a sua conta.`,
        sections: [
            {
                id: 'scope',
                title: 'Âmbito e aceitação',
                blocks: [
                    {
                        type: 'paragraph',
                        content: `O ${brand.name} é uma plataforma online que permite a negócios — como cabeleireiros, terapeutas, treinadores pessoais e outros prestadores de serviços — apresentar os seus serviços e gerir pedidos de marcação, e a clientes pedir e acompanhar essas marcações.`,
                    },
                    {
                        type: 'paragraph',
                        content: [
                            'Ao criar uma conta ou utilizar a Plataforma, declara que leu e aceita estes termos e a ',
                            privacyLink,
                            '. Se não concordar, não deve utilizar a Plataforma.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: `Tem de ter, pelo menos, ${minimumAge} anos e capacidade legal para celebrar contratos. Se utilizar a Plataforma em nome de um negócio, declara ter poderes para o vincular.`,
                    },
                ],
            },
            {
                id: 'definitions',
                title: 'Definições',
                blocks: [
                    {
                        type: 'definitions',
                        items: [
                            {
                                term: 'Plataforma',
                                description: `O serviço ${brand.name}, incluindo a aplicação web e as interfaces que a suportam.`,
                            },
                            {
                                term: 'Cliente',
                                description: 'Utilizador que pede marcações a um Negócio.',
                            },
                            {
                                term: 'Negócio',
                                description:
                                    'Pessoa singular ou coletiva que regista na Plataforma a sua atividade, os seus estabelecimentos e os seus serviços.',
                            },
                            {
                                term: 'Estabelecimento',
                                description:
                                    'Local onde um Negócio presta serviços, com morada e fuso horário próprios.',
                            },
                            {
                                term: 'Serviço',
                                description:
                                    'Atividade que um Negócio disponibiliza para marcação.',
                            },
                            {
                                term: 'Recurso',
                                description:
                                    'Elemento reservável de um Estabelecimento, como um profissional, uma sala ou um equipamento, com uma capacidade definida.',
                            },
                            {
                                term: 'Marcação',
                                description:
                                    'Pedido de um Cliente para usufruir de um Serviço, num Recurso e num intervalo de tempo determinados.',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'role',
                title: 'Papel da Plataforma',
                blocks: [
                    {
                        type: 'paragraph',
                        content: `O ${brand.name} é um intermediário tecnológico. Disponibilizamos as ferramentas para pedir e gerir marcações, mas não somos parte no contrato de prestação de serviços celebrado entre o Cliente e o Negócio.`,
                    },
                    {
                        type: 'paragraph',
                        content:
                            'Não prestamos nem controlamos os serviços marcados e não garantimos a sua qualidade, a sua adequação ou a sua disponibilidade.',
                    },
                    {
                        type: 'callout',
                        tone: 'info',
                        title: 'Pagamentos',
                        content:
                            'Atualmente, a Plataforma não processa pagamentos. Os preços e as formas de pagamento são acordados diretamente entre o Cliente e o Negócio.',
                    },
                ],
            },
            {
                id: 'account',
                title: 'Conta e perfis',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Para criar uma conta, indique um nome de utilizador, um endereço de email válido e uma palavra-passe que cumpra os requisitos apresentados no registo. A informação fornecida deve ser verdadeira e mantida atualizada.',
                    },
                    {
                        type: 'paragraph',
                        content: 'Cada conta tem um de três perfis:',
                    },
                    {
                        type: 'definitions',
                        items: [
                            {
                                term: 'Cliente',
                                description: 'Pede e acompanha marcações junto dos Negócios.',
                            },
                            {
                                term: 'Proprietário de negócio',
                                description:
                                    'Regista e gere negócios, estabelecimentos, serviços e recursos, e responde às marcações recebidas.',
                            },
                            {
                                term: 'Administrador',
                                description:
                                    'Perfil interno, reservado à equipa responsável pela Plataforma, para gestão e supervisão do serviço.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            'É responsável por manter as suas credenciais confidenciais e por toda a atividade realizada na sua conta. A conta é pessoal e intransmissível. Se suspeitar de um acesso não autorizado, informe-nos de imediato através de ',
                            supportEmailLink,
                            '.',
                        ],
                    },
                ],
            },
            {
                id: 'bookings',
                title: 'Marcações',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Uma marcação é um pedido: só fica garantida depois de o Negócio a confirmar. Ao longo da sua vida, uma marcação passa pelos seguintes estados.',
                    },
                    {
                        type: 'steps',
                        items: [
                            {
                                title: 'Pendente',
                                description:
                                    'O pedido foi submetido e aguarda a resposta do Negócio.',
                            },
                            {
                                title: 'Confirmada',
                                description:
                                    'O Negócio aceitou o pedido e o horário fica reservado.',
                            },
                            {
                                title: 'Concluída',
                                description:
                                    'O serviço foi prestado e a marcação foi dada como concluída.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content:
                            'Uma marcação pendente pode ser rejeitada pelo Negócio. O Cliente pode cancelar uma marcação pendente ou confirmada. Marcações concluídas, canceladas ou rejeitadas são definitivas e já não podem ser alteradas.',
                    },
                    {
                        type: 'paragraph',
                        content:
                            'A disponibilidade depende dos horários de funcionamento e da capacidade definidos pelo Negócio, pelo que um horário pode deixar de estar disponível entre a consulta e o pedido. Cada marcação é registada com data e hora exatas e segue o fuso horário do Estabelecimento.',
                    },
                    {
                        type: 'callout',
                        tone: 'warning',
                        title: 'Notas da marcação',
                        content:
                            'Pode acrescentar uma nota (até 1000 caracteres) a um pedido de marcação, visível para o Negócio. Não inclua dados de saúde nem outra informação sensível, salvo se for indispensável para o serviço.',
                    },
                ],
            },
            {
                id: 'businesses',
                title: 'Obrigações dos negócios',
                blocks: [
                    {
                        type: 'paragraph',
                        content: 'Se utilizar a Plataforma como Negócio, compromete-se a:',
                    },
                    {
                        type: 'list',
                        items: [
                            'fornecer informação verdadeira, completa e atualizada sobre o negócio, os estabelecimentos, os serviços, os horários e os preços;',
                            'responder aos pedidos de marcação em tempo útil e honrar as marcações confirmadas ou, se tal não for possível, contactar o Cliente com a maior antecedência possível;',
                            'cumprir a lei aplicável à sua atividade, incluindo as regras de defesa do consumidor, de informação pré-contratual e as licenças ou autorizações exigidas;',
                            [
                                'tratar os dados pessoais dos seus clientes de acordo com o RGPD, sendo responsável por esse tratamento, tal como descrito na ',
                                {
                                    type: 'link',
                                    text: 'Política de privacidade',
                                    target: {
                                        kind: 'document',
                                        documentId: 'privacy',
                                        sectionId: 'roles',
                                    },
                                },
                                '.',
                            ],
                        ],
                    },
                ],
            },
            {
                id: 'acceptable-use',
                title: 'Utilização aceitável',
                blocks: [
                    {
                        type: 'paragraph',
                        content: 'Ao utilizar a Plataforma, não pode:',
                    },
                    {
                        type: 'list',
                        items: [
                            'aceder a contas, dados ou sistemas sem autorização;',
                            'contornar, testar ou comprometer medidas de segurança, de autenticação ou limites de utilização;',
                            'criar marcações falsas ou abusivas, enviar spam ou prejudicar outros utilizadores;',
                            'inserir conteúdo ilícito, difamatório ou que viole direitos de terceiros;',
                            'recolher dados de outros utilizadores de forma automatizada ou sobrecarregar a infraestrutura;',
                            'fazer-se passar por outra pessoa ou entidade.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            'Se descobrir uma vulnerabilidade de segurança, agradecemos que a comunique de forma responsável para ',
                            supportEmailLink,
                            ', sem a explorar nem a divulgar antes de a podermos corrigir.',
                        ],
                    },
                ],
            },
            {
                id: 'notifications',
                title: 'Notificações',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Enviamos mensagens de serviço, por email e na própria aplicação, sobre a sua conta e as suas marcações: por exemplo, a confirmação do registo, a alteração do estado da conta e a criação, confirmação, rejeição, cancelamento ou conclusão de uma marcação.',
                    },
                    {
                        type: 'paragraph',
                        content:
                            'São mensagens necessárias ao funcionamento do serviço, e não publicidade. As notificações são processadas de forma assíncrona e podem sofrer atrasos ou falhas temporárias; por isso, confirme sempre o estado de uma marcação na Plataforma.',
                    },
                ],
            },
            {
                id: 'intellectual-property',
                title: 'Propriedade intelectual e conteúdos',
                blocks: [
                    {
                        type: 'paragraph',
                        content: `A Plataforma, a marca ${brand.name}, o design e os restantes elementos são protegidos por lei. Estes termos não transferem qualquer direito de propriedade intelectual, apenas concedem um direito pessoal, limitado, revogável e não exclusivo de utilizar a Plataforma.`,
                    },
                    {
                        type: 'paragraph',
                        content: `O código-fonte do projeto é disponibilizado sob a licença MIT, que se aplica apenas ao código e não à marca ${brand.name} nem aos dados dos utilizadores.`,
                    },
                    {
                        type: 'paragraph',
                        content:
                            'Mantém todos os direitos sobre os conteúdos que introduz, como descrições e notas. Concede-nos apenas a licença necessária para os armazenar, tratar e apresentar com o fim de prestar o serviço.',
                    },
                ],
            },
            {
                id: 'availability',
                title: 'Disponibilidade e alterações ao serviço',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Esforçamo-nos por manter a Plataforma disponível e segura, mas não garantimos um acesso ininterrupto. Podem ocorrer interrupções por motivos de manutenção, atualização ou por razões fora do nosso controlo.',
                    },
                    {
                        type: 'paragraph',
                        content:
                            'Podemos evoluir, alterar ou descontinuar funcionalidades, procurando sempre minimizar o impacto nos utilizadores.',
                    },
                ],
            },
            {
                id: 'termination',
                title: 'Suspensão e cessação',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Pode pedir a eliminação da sua conta a qualquer momento. Antes disso, cancele ou conclua as marcações em curso. O tratamento dos seus dados após a eliminação está descrito na Política de privacidade.',
                    },
                    {
                        type: 'paragraph',
                        content:
                            'Podemos suspender ou encerrar contas que violem estes termos ou a lei, ou que ponham em risco a segurança da Plataforma ou de terceiros. Uma conta pode estar ativa, suspensa ou banida; numa conta suspensa ou banida, o acesso às funcionalidades pode ser limitado ou bloqueado. Sempre que possível, indicamos o motivo.',
                    },
                ],
            },
            {
                id: 'liability',
                title: 'Responsabilidade',
                blocks: [
                    {
                        type: 'paragraph',
                        content: 'Na medida permitida por lei, não somos responsáveis por:',
                    },
                    {
                        type: 'list',
                        items: [
                            'os serviços prestados, ou não prestados, pelos Negócios, nem por incumprimentos entre Clientes e Negócios;',
                            'danos indiretos, lucros cessantes ou perda de oportunidades resultantes da utilização ou da impossibilidade de utilização da Plataforma;',
                            'interrupções ou falhas causadas por circunstâncias fora do nosso controlo razoável.',
                        ],
                    },
                    {
                        type: 'paragraph',
                        content:
                            'Nada nestes termos exclui ou limita a responsabilidade que não possa ser excluída por lei, nomeadamente em caso de dolo ou negligência grosseira, nem os direitos imperativos dos consumidores.',
                    },
                ],
            },
            {
                id: 'personal-data',
                title: 'Dados pessoais',
                blocks: [
                    {
                        type: 'paragraph',
                        content: [
                            'Tratamos dados pessoais em conformidade com o RGPD e a restante legislação aplicável, tal como descrito na ',
                            privacyLink,
                            '. Aí explicamos que dados tratamos, para que fins, durante quanto tempo e como pode exercer os seus direitos.',
                        ],
                    },
                ],
            },
            {
                id: 'changes',
                title: 'Alterações aos termos',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Podemos atualizar estes termos, por exemplo para refletir novas funcionalidades ou alterações legais. Publicamos a versão atualizada nesta página, com novo número de versão e nova data, e, em alterações relevantes, avisamos com antecedência razoável através da Plataforma ou por email.',
                    },
                    {
                        type: 'paragraph',
                        content:
                            'Se continuar a utilizar a Plataforma depois de as alterações entrarem em vigor, considera-se que as aceita. Se não concordar, pode eliminar a sua conta.',
                    },
                ],
            },
            {
                id: 'governing-law',
                title: 'Lei aplicável e litígios',
                blocks: [
                    {
                        type: 'paragraph',
                        content:
                            'Estes termos regem-se pela lei portuguesa. Sem prejuízo dos direitos imperativos dos consumidores, qualquer litígio é submetido aos tribunais portugueses competentes.',
                    },
                    {
                        type: 'paragraph',
                        content: [
                            'Os consumidores podem recorrer às entidades de resolução alternativa de litígios de consumo e ao ',
                            {
                                type: 'link',
                                text: 'Livro de Reclamações Eletrónico',
                                target: { kind: 'external', href: complaintsBookUrl },
                            },
                            '.',
                        ],
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
                            `Para qualquer questão sobre estes termos, contacte ${controllerIdentity} através de `,
                            supportEmailLink,
                            '.',
                        ],
                    },
                ],
            },
        ],
    }
}
