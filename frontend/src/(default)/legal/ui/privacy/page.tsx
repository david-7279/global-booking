import { LegalLayout } from '@/src/(default)/legal/ui/legal-layout.tsx'

export default function PrivacyPage() {
    return (
        <LegalLayout
            eyebrow="Documento legal"
            title="Política de privacidade"
            updatedAt="4 de novembro de 2026"
        >
            <p>
                Esta política explica como o Atlas recolhe, utiliza e protege os dados necessários
                para disponibilizar o serviço.
            </p>
            <h2>1. Dados que tratamos</h2>
            <p>
                Tratamos os dados que fornece ao criar uma conta, como nome, endereço de email e
                credenciais de acesso. Também registamos informação técnica essencial para manter a
                segurança, a disponibilidade e o desempenho da aplicação.
            </p>
            <h2>2. Como utilizamos os dados</h2>
            <p>
                Utilizamos os dados para criar e manter a sua conta, permitir o acesso às
                funcionalidades, responder a pedidos de suporte e detetar situações de abuso ou
                acesso não autorizado.
            </p>
            <h2>3. Conservação e segurança</h2>
            <p>
                Conservamos os dados pelo tempo necessário à prestação do serviço e às obrigações
                legais aplicáveis. Aplicamos controlos de acesso, proteção de credenciais e medidas
                de monitorização adequadas ao risco.
            </p>
            <h2>4. Os seus direitos</h2>
            <p>
                Pode solicitar acesso, correção ou eliminação dos seus dados, bem como esclarecer
                dúvidas sobre o tratamento. Para isso, contacte-nos através do endereço indicado
                pela sua organização.
            </p>
            <h2>5. Alterações</h2>
            <p>
                Podemos atualizar esta política para refletir alterações no serviço ou na
                legislação. A data no topo da página identifica a versão mais recente.
            </p>
        </LegalLayout>
    )
}
