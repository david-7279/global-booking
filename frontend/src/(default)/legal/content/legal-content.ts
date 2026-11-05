export type LegalDocumentId = 'terms' | 'privacy'

export type LegalSection = {
    id: string
    title: string
    paragraphs: string[]
    bullets?: string[]
}

export type LegalDocument = {
    id: LegalDocumentId
    eyebrow: string
    title: string
    summary: string
    updatedAt: string
    effectiveLabel: string
    sections: LegalSection[]
}

export const legalDocuments: Record<LegalDocumentId, LegalDocument> = {
    terms: {
        id: 'terms',
        eyebrow: 'Centro legal',
        title: 'Termos de utilização',
        summary:
            'As regras que orientam o acesso e a utilização responsável do Atlas, de forma clara e transparente.',
        updatedAt: '5 de novembro de 2026',
        effectiveLabel: 'Em vigor',
        sections: [
            {
                id: 'acceptance',
                title: 'Aceitação dos termos',
                paragraphs: [
                    'Ao aceder ou utilizar o Atlas, confirma que leu e compreendeu estes termos. Se utilizar o serviço em nome de uma organização, declara que tem autorização para a representar.',
                    'Se não concordar com qualquer parte destes termos, não deverá utilizar o serviço.',
                ],
            },
            {
                id: 'service-use',
                title: 'Utilização do serviço',
                paragraphs: [
                    'O Atlas deve ser utilizado de forma legítima, responsável e em conformidade com a legislação aplicável. O acesso destina-se apenas às finalidades autorizadas pela sua organização.',
                ],
                bullets: [
                    'Não tente aceder a contas, dados ou sistemas sem autorização.',
                    'Não utilize o serviço para introduzir código malicioso, spam ou conteúdos ilícitos.',
                    'Não interfira com a disponibilidade, segurança ou desempenho do serviço.',
                ],
            },
            {
                id: 'account',
                title: 'Conta e credenciais',
                paragraphs: [
                    'É responsável por manter as suas credenciais confidenciais e por toda a atividade realizada através da sua conta. Deve comunicar imediatamente qualquer utilização não autorizada ou suspeita.',
                    'As informações fornecidas devem ser verdadeiras, atuais e suficientes para a gestão segura da conta.',
                ],
            },
            {
                id: 'content-availability',
                title: 'Conteúdo e disponibilidade',
                paragraphs: [
                    'A organização ou o utilizador que introduz informação no Atlas mantém a responsabilidade pelo respetivo conteúdo e pelas permissões atribuídas.',
                    'Trabalhamos para manter o serviço seguro e disponível. Podem ocorrer interrupções programadas, atualizações ou medidas urgentes necessárias para proteger o serviço e os seus utilizadores.',
                ],
            },
            {
                id: 'intellectual-property',
                title: 'Propriedade intelectual',
                paragraphs: [
                    'O Atlas, a sua marca, o código, o design e os elementos visuais são protegidos pelas leis aplicáveis. Estes termos não transferem qualquer direito de propriedade sobre o serviço.',
                ],
            },
            {
                id: 'changes-contact',
                title: 'Alterações e contacto',
                paragraphs: [
                    'Podemos atualizar estes termos para refletir alterações no serviço, requisitos de segurança ou obrigações legais. A data apresentada no topo identifica a versão mais recente.',
                    'Para esclarecer uma questão sobre estes termos, contacte o administrador da sua organização ou o canal de suporte indicado no seu contrato.',
                ],
            },
        ],
    },
    privacy: {
        id: 'privacy',
        eyebrow: 'Centro legal',
        title: 'Política de privacidade',
        summary:
            'Como recolhemos, utilizamos e protegemos a informação necessária para disponibilizar o Atlas.',
        updatedAt: '5 de novembro de 2026',
        effectiveLabel: 'Em vigor',
        sections: [
            {
                id: 'scope',
                title: 'Âmbito desta política',
                paragraphs: [
                    'Esta política explica como o Atlas trata dados pessoais quando utiliza o serviço, visita as páginas públicas ou contacta o suporte.',
                    'O Atlas foi concebido para recolher apenas a informação necessária à prestação, segurança e melhoria do serviço.',
                ],
            },
            {
                id: 'data',
                title: 'Dados que tratamos',
                paragraphs: [
                    'Dependendo da forma como utiliza o Atlas, podemos tratar as seguintes categorias de informação:',
                ],
                bullets: [
                    'Dados de conta, como nome, endereço de email, função e identificadores técnicos.',
                    'Dados introduzidos no serviço pela sua organização ou por si, de acordo com as permissões atribuídas.',
                    'Dados técnicos, como endereço IP, tipo de dispositivo, navegador, registos de acesso e eventos de segurança.',
                    'Comunicações que nos envia quando solicita suporte ou esclarecimentos.',
                ],
            },
            {
                id: 'purposes',
                title: 'Como utilizamos os dados',
                paragraphs: ['Utilizamos a informação tratada para:'],
                bullets: [
                    'Criar, autenticar e manter a sua conta.',
                    'Disponibilizar as funcionalidades solicitadas e manter o serviço operacional.',
                    'Proteger contas, detetar abuso e investigar acessos não autorizados.',
                    'Responder a pedidos de suporte e comunicar alterações relevantes ao serviço.',
                    'Cumprir obrigações legais e defender os nossos direitos quando necessário.',
                ],
            },
            {
                id: 'sharing',
                title: 'Partilha e subcontratantes',
                paragraphs: [
                    'Não vendemos os seus dados pessoais. Podemos partilhar informação com fornecedores que prestam serviços essenciais, como alojamento, segurança, suporte ou envio de comunicações, sempre de acordo com instruções e medidas de proteção adequadas.',
                    'Também podemos divulgar informação quando tal seja exigido por lei, por uma autoridade competente ou para proteger o serviço e os seus utilizadores.',
                ],
            },
            {
                id: 'retention-security',
                title: 'Conservação e segurança',
                paragraphs: [
                    'Conservamos os dados pelo tempo necessário à prestação do serviço, ao cumprimento das obrigações legais e à resolução de litígios. Os períodos concretos podem depender do tipo de dado e da relação com a organização.',
                    'Aplicamos controlos de acesso, proteção de credenciais, registos de auditoria e medidas de monitorização adequadas ao risco. Nenhum sistema é totalmente imune a riscos, mas trabalhamos continuamente para os reduzir.',
                ],
            },
            {
                id: 'rights',
                title: 'Os seus direitos',
                paragraphs: [
                    'Consoante a legislação aplicável, pode solicitar acesso, correção, eliminação, limitação ou portabilidade dos seus dados, bem como opor-se a determinados tratamentos.',
                    'Para exercer os seus direitos, contacte o administrador da sua organização ou o canal de suporte indicado no seu contrato. Poderemos pedir informação adicional para confirmar a sua identidade.',
                ],
            },
            {
                id: 'updates',
                title: 'Alterações a esta política',
                paragraphs: [
                    'Podemos atualizar esta política para refletir alterações no serviço ou na legislação. A data no topo da página identifica a versão mais recente. Quando a alteração for relevante, procuraremos comunicá-la através de um canal adequado.',
                ],
            },
        ],
    },
}
