// src/(default)/landing/i18n/locales/pt-PT/content.ts

import type { LandingContentFactory } from '@/src/(default)/landing/i18n/landing-locale.types.ts'

export const content: LandingContentFactory = ({ brandName, supportEmail }) => ({
    meta: {
        title: `${brandName} · Marcações simples para clientes e negócios`,
    },

    navigation: {
        ariaLabel: 'Navegação principal',
        skipToContent: 'Saltar para o conteúdo',
        openMenu: 'Abrir menu',
        closeMenu: 'Fechar menu',
        items: [
            { sectionId: 'audiences', label: 'Para quem' },
            { sectionId: 'how-it-works', label: 'Como funciona' },
            { sectionId: 'features', label: 'Funcionalidades' },
            { sectionId: 'security', label: 'Segurança' },
            { sectionId: 'faq', label: 'Perguntas' },
        ],
        signIn: { label: 'Entrar', target: { kind: 'route', route: 'auth' } },
        primaryCta: { label: 'Criar conta', target: { kind: 'route', route: 'auth' } },
    },

    hero: {
        eyebrow: 'Marcações para negócios de serviços',
        title: 'Marcações simples, do pedido à confirmação.',
        subtitle: `O ${brandName} liga clientes a cabeleireiros, terapeutas, treinadores pessoais e outros profissionais. Os negócios gerem serviços e horários num só lugar; os clientes pedem e acompanham cada marcação.`,
        primaryCta: { label: 'Criar conta', target: { kind: 'route', route: 'auth' } },
        secondaryCta: {
            label: 'Ver como funciona',
            target: { kind: 'section', sectionId: 'how-it-works' },
        },
        highlights: [
            'Cada pedido é confirmado pelo negócio',
            'Notificações por email e na aplicação',
            'Dados tratados de acordo com o RGPD',
        ],
        preview: {
            caption: 'Exemplo ilustrativo',
            heading: 'Nova marcação',
            serviceLabel: 'Serviço',
            serviceName: 'Corte de cabelo',
            serviceMeta: '45 min · Estabelecimento Centro',
            slotsLabel: 'Horários disponíveis',
            slots: ['09:30', '10:15', '11:00', '14:00', '14:45', '16:30'],
            defaultSlotIndex: 1,
            statusLabel: 'Estado',
            status: { idle: 'Por enviar', pending: 'Pendente', confirmed: 'Confirmada' },
            timelineLabel: 'Percurso da marcação',
            timeline: ['Pedido enviado', 'Negócio responde', 'Notificação recebida'],
            actions: {
                idle: 'Pedir marcação',
                pending: 'Simular resposta do negócio',
                confirmed: 'Recomeçar exemplo',
            },
            notification: {
                title: 'Marcação confirmada',
                body: 'O negócio confirmou o seu pedido. O horário ficou reservado.',
            },
        },
    },

    audiences: {
        heading: {
            eyebrow: 'Para quem é',
            title: 'Pensado para os dois lados da marcação.',
            intro: 'Clientes e negócios veem a mesma marcação, cada um com as ferramentas de que precisa.',
        },
        items: [
            {
                id: 'clients',
                icon: 'user',
                label: 'Clientes',
                title: 'Marque sem trocas de mensagens.',
                description:
                    'Escolha o serviço e um horário disponível e acompanhe a resposta do negócio.',
                points: [
                    'Pedidos de marcação com o horário que lhe convém',
                    'Estado sempre visível: pendente, confirmada ou concluída',
                    'Notificações por email e na aplicação a cada alteração',
                    'Cancelamento quando já não puder comparecer',
                ],
                action: {
                    label: 'Criar conta de cliente',
                    target: { kind: 'route', route: 'auth' },
                },
            },
            {
                id: 'businesses',
                icon: 'building',
                label: 'Negócios',
                title: 'Gira serviços e pedidos num só lugar.',
                description:
                    'Configure o negócio e responda aos pedidos a partir de um painel central.',
                points: [
                    'Vários estabelecimentos, cada um com morada e fuso horário próprios',
                    'Serviços com duração e recursos com capacidade definida',
                    'Horários de funcionamento e disponibilidade calculada automaticamente',
                    'Aceite ou rejeite pedidos e marque-os como concluídos',
                ],
                action: {
                    label: 'Registar o meu negócio',
                    target: { kind: 'route', route: 'auth' },
                },
                featured: true,
            },
        ],
    },

    howItWorks: {
        heading: {
            eyebrow: 'Como funciona',
            title: 'Quatro passos, sem complicações.',
            intro: 'Do registo do negócio à confirmação do cliente.',
        },
        steps: [
            {
                icon: 'settings',
                title: 'O negócio configura a oferta',
                description:
                    'Regista estabelecimentos, serviços, recursos e horários de funcionamento.',
            },
            {
                icon: 'calendar',
                title: 'O cliente escolhe um horário',
                description:
                    'Seleciona o serviço e um horário disponível e envia o pedido de marcação.',
            },
            {
                icon: 'send',
                title: 'O negócio responde',
                description:
                    'Confirma ou rejeita o pedido. Só depois da confirmação o horário fica reservado.',
            },
            {
                icon: 'bell',
                title: 'Todos ficam informados',
                description:
                    'Cada alteração de estado gera uma notificação por email e na aplicação.',
            },
        ],
        lifecycle: {
            title: 'O ciclo de vida de uma marcação',
            description: 'Cada marcação tem um estado claro e transições bem definidas.',
            mainFlow: [
                {
                    key: 'pending',
                    label: 'Pendente',
                    description: 'O pedido foi enviado e aguarda resposta.',
                },
                {
                    key: 'confirmed',
                    label: 'Confirmada',
                    description: 'O negócio aceitou e o horário fica reservado.',
                },
                {
                    key: 'completed',
                    label: 'Concluída',
                    description: 'O serviço foi prestado.',
                },
            ],
            endingsLabel: 'Também pode terminar em',
            endings: [
                {
                    key: 'rejected',
                    label: 'Rejeitada',
                    description: 'O negócio não pôde aceitar o pedido.',
                },
                {
                    key: 'cancelled',
                    label: 'Cancelada',
                    description: 'O cliente cancelou antes de o serviço ser prestado.',
                },
            ],
            note: 'Marcações concluídas, canceladas ou rejeitadas são definitivas e já não podem ser alteradas.',
        },
    },

    features: {
        heading: {
            eyebrow: 'Funcionalidades',
            title: 'Tudo o que uma marcação precisa.',
            intro: 'Ferramentas pensadas para o dia a dia de quem presta e de quem marca serviços.',
        },
        items: [
            {
                icon: 'store',
                title: 'Negócios e estabelecimentos',
                description:
                    'Um negócio pode ter vários estabelecimentos, cada um com morada e fuso horário próprios.',
            },
            {
                icon: 'layers',
                title: 'Serviços e recursos',
                description:
                    'Defina a duração de cada serviço e a capacidade de cada recurso: um profissional, uma sala ou um equipamento.',
            },
            {
                icon: 'clock',
                title: 'Horários e disponibilidade',
                description:
                    'Os horários de funcionamento e a capacidade evitam sobreposições e marcações impossíveis.',
            },
            {
                icon: 'list-checks',
                title: 'Estados e histórico',
                description:
                    'Pendente, confirmada, concluída, rejeitada ou cancelada, com registo de cada alteração.',
            },
            {
                icon: 'bell',
                title: 'Notificações',
                description:
                    'Mensagens por email e na aplicação sobre a conta e sobre cada passo da marcação.',
            },
            {
                icon: 'users',
                title: 'Perfis e permissões',
                description:
                    'Clientes, proprietários de negócio e administradores veem apenas o que lhes diz respeito.',
            },
        ],
    },

    security: {
        heading: {
            eyebrow: 'Segurança e privacidade',
            title: 'Os seus dados, tratados com cuidado.',
            intro: 'Cumprimos o RGPD e recolhemos apenas o necessário para prestar o serviço.',
        },
        points: [
            {
                icon: 'lock',
                title: 'Palavras-passe protegidas',
                description: 'Guardadas apenas sob a forma de hash, nunca em texto simples.',
            },
            {
                icon: 'shield',
                title: 'Sessões seguras',
                description:
                    'Tokens de acesso de curta duração e sessões que pode terminar a qualquer momento.',
            },
            {
                icon: 'eye-off',
                title: 'Sem publicidade',
                description: 'Não vendemos dados nem usamos cookies de publicidade ou de análise.',
            },
            {
                icon: 'file-text',
                title: 'Os seus direitos',
                description: 'Pode aceder, corrigir ou pedir a eliminação dos seus dados.',
            },
        ],
        action: {
            label: 'Ler a política de privacidade',
            target: { kind: 'route', route: 'privacy' },
        },
    },

    faq: {
        heading: {
            eyebrow: 'Perguntas frequentes',
            title: 'Respostas rápidas.',
            intro: 'O essencial para começar com confiança.',
        },
        items: [
            {
                question: `A quem se destina o ${brandName}?`,
                answer: 'A negócios de serviços com marcações, como cabeleireiros, terapeutas e treinadores pessoais, e aos clientes que os procuram.',
            },
            {
                question: 'Como sei se a minha marcação foi aceite?',
                answer: 'Cada marcação começa como pendente. Quando o negócio responde, o estado muda e recebe uma notificação por email e na aplicação.',
            },
            {
                question: 'Posso cancelar uma marcação?',
                answer: 'Sim. Pode cancelar uma marcação pendente ou confirmada, desde que ainda não esteja concluída. Faça-o com a maior antecedência possível.',
            },
            {
                question: 'A plataforma processa pagamentos?',
                answer: 'Atualmente não. Os preços e as formas de pagamento são acordados diretamente com o negócio.',
            },
            {
                question: 'Que dados pessoais são guardados?',
                answer: 'O necessário para a conta e para as marcações: nome de utilizador, email, perfil e detalhes das marcações. A lista completa está na política de privacidade.',
                action: {
                    label: 'Ver política de privacidade',
                    target: { kind: 'route', route: 'privacy' },
                },
            },
            {
                question: 'Existe uma idade mínima?',
                answer: 'Sim. A utilização da plataforma destina-se a maiores de idade. Os detalhes estão nos termos de utilização.',
                action: {
                    label: 'Ver termos de utilização',
                    target: { kind: 'route', route: 'terms' },
                },
            },
            {
                question: 'Como contacto o apoio?',
                answer: `Escreva-nos para ${supportEmail} e respondemos o mais depressa possível.`,
                action: {
                    label: 'Enviar email',
                    target: { kind: 'email', address: supportEmail },
                },
            },
        ],
    },

    cta: {
        title: 'Pronto para simplificar as suas marcações?',
        description:
            'Crie a sua conta em poucos minutos, como cliente ou para registar o seu negócio.',
        primary: { label: 'Criar conta', target: { kind: 'route', route: 'auth' } },
        secondary: { label: 'Já tenho conta', target: { kind: 'route', route: 'auth' } },
        note: 'Pode eliminar a sua conta quando quiser.',
    },

    footer: {
        tagline: 'Marcações simples para clientes e negócios.',
        groups: [
            {
                title: 'Produto',
                links: [
                    {
                        label: 'Como funciona',
                        target: { kind: 'section', sectionId: 'how-it-works' },
                    },
                    {
                        label: 'Funcionalidades',
                        target: { kind: 'section', sectionId: 'features' },
                    },
                    { label: 'Segurança', target: { kind: 'section', sectionId: 'security' } },
                    {
                        label: 'Perguntas frequentes',
                        target: { kind: 'section', sectionId: 'faq' },
                    },
                ],
            },
            {
                title: 'Conta',
                links: [
                    { label: 'Entrar', target: { kind: 'route', route: 'auth' } },
                    { label: 'Criar conta', target: { kind: 'route', route: 'auth' } },
                ],
            },
            {
                title: 'Legal',
                links: [
                    { label: 'Termos de utilização', target: { kind: 'route', route: 'terms' } },
                    {
                        label: 'Política de privacidade',
                        target: { kind: 'route', route: 'privacy' },
                    },
                ],
            },
            {
                title: 'Contacto',
                links: [{ label: supportEmail, target: { kind: 'email', address: supportEmail } }],
            },
        ],
        rights: 'Todos os direitos reservados.',
    },
})
