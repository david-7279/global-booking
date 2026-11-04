import { LegalLayout } from '@/src/(default)/legal/ui/legal-layout.tsx'

export default function TermsPage() {
    return (
        <LegalLayout
            eyebrow="Documento legal"
            title="Termos de utilização"
            updatedAt="4 de novembro de 2026"
        >
            <p>
                Ao utilizar o Atlas, concorda com estes termos. Se estiver a utilizar o serviço em
                nome de uma organização, confirma que tem autorização para aceitar estes termos.
            </p>
            <h2>1. Utilização do serviço</h2>
            <p>
                O Atlas deve ser utilizado de forma legítima, responsável e de acordo com as
                instruções da sua organização. Não pode tentar aceder a contas, dados ou sistemas
                sem autorização.
            </p>
            <h2>2. Conta e credenciais</h2>
            <p>
                É responsável por manter as suas credenciais confidenciais e por comunicar
                imediatamente qualquer acesso suspeito. Cada conta deve representar uma pessoa
                identificável, salvo indicação diferente da organização.
            </p>
            <h2>3. Conteúdo e disponibilidade</h2>
            <p>
                A organização é responsável pelo conteúdo que introduz no serviço. Trabalhamos para
                manter o Atlas disponível e seguro, mas podem ocorrer interrupções programadas ou
                necessárias para proteção do serviço.
            </p>
            <h2>4. Propriedade intelectual</h2>
            <p>
                O Atlas, a sua marca, o código e os elementos visuais são protegidos pelas leis
                aplicáveis. Estes termos não transferem qualquer direito de propriedade sobre o
                serviço.
            </p>
            <h2>5. Alterações e contacto</h2>
            <p>
                Podemos atualizar estes termos quando necessário. Continuar a utilizar o serviço
                depois da publicação de uma nova versão significa que aceita os termos atualizados.
            </p>
        </LegalLayout>
    )
}
