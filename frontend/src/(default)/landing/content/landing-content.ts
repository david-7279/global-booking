export type LandingStep = {
    number: string
    title: string
    description: string
}

export type LandingFeature = {
    title: string
    description: string
}

export const landingContent = {
    navigation: {
        terms: 'Termos',
        privacy: 'Privacidade',
        signIn: 'Entrar',
    },
    hero: {
        eyebrow: 'Uma base melhor para trabalhar',
        title: 'Clareza para cada decisão importante.',
        description:
            'O Atlas reúne a informação essencial da sua equipa num espaço simples, seguro e preparado para acompanhar o seu crescimento.',
        primaryAction: 'Começar agora',
        secondaryAction: 'Ver como funciona',
        reassurance: 'Seguro desde o primeiro acesso',
    },
    productPreview: {
        label: 'Visão geral',
        title: 'Tudo em ordem.',
        status: 'Atualizado agora',
        items: ['Planeamento da equipa', 'Acompanhamento de tarefas', 'Decisões partilhadas'],
        footer: 'Espaço privado da sua equipa',
    },
    trust: {
        label: 'Pensado para equipas que valorizam',
        values: ['Clareza', 'Segurança', 'Continuidade'],
    },
    process: {
        eyebrow: 'Como funciona',
        title: 'Menos ruído. Mais progresso.',
        description:
            'Uma experiência intencional para transformar informação dispersa em trabalho coordenado.',
        steps: [
            {
                number: '01',
                title: 'Centralize',
                description: 'Mantenha o contexto importante acessível num único lugar.',
            },
            {
                number: '02',
                title: 'Alinhe',
                description: 'Dê à equipa uma visão comum sobre prioridades e próximos passos.',
            },
            {
                number: '03',
                title: 'Avance',
                description: 'Tome decisões com confiança e transforme planos em movimento.',
            },
        ] satisfies LandingStep[],
    },
    features: {
        eyebrow: 'Construído com intenção',
        title: 'A simplicidade também pode ser robusta.',
        items: [
            {
                title: 'Uma experiência focada',
                description:
                    'Só o essencial, apresentado de forma clara para reduzir a carga de decisão.',
            },
            {
                title: 'Segurança por princípio',
                description:
                    'Acesso protegido e uma base preparada para crescer sem comprometer a confiança.',
            },
            {
                title: 'Pronto para evoluir',
                description:
                    'Uma arquitetura modular que acompanha novas necessidades sem perder coerência.',
            },
        ] satisfies LandingFeature[],
    },
    cta: {
        eyebrow: 'Comece com clareza',
        title: 'O próximo passo pode ser mais simples.',
        description: 'Crie o seu espaço e dê à sua equipa uma base melhor para decidir e avançar.',
        action: 'Criar uma conta',
    },
    footer: {
        copyright: 'Todos os direitos reservados.',
        terms: 'Termos de utilização',
        privacy: 'Política de privacidade',
    },
} as const
