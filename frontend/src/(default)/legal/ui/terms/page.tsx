import { legalDocuments } from '@/src/(default)/legal/content/legal-content.ts'
import { LegalLayout } from '@/src/(default)/legal/ui/legal-layout.tsx'

export default function TermsPage() {
    return <LegalLayout document={legalDocuments.terms} />
}
