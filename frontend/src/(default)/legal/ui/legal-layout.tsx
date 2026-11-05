// src/(default)/legal/ui/legal-layout.tsx

import type { ReactNode } from 'react'
import type { LegalUiMessages } from '@/src/(default)/legal/i18n/legal-locale.types.ts'
import type { LegalDocumentId, LegalDocumentLink } from '@/src/(default)/legal/types/legal.types.ts'
import { LegalFooter } from '@/src/(default)/legal/ui/components/legal-footer.tsx'
import { LegalHeader } from '@/src/(default)/legal/ui/components/legal-header.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'

type LegalLayoutProps = {
    locale: string
    ui: LegalUiMessages
    brandName: string
    links: readonly LegalDocumentLink[]
    activeDocumentId: LegalDocumentId
    children: ReactNode
}

/** Page chrome shared by every legal document: skip link, header, main landmark, footer. */
export function LegalLayout({
    locale,
    ui,
    brandName,
    links,
    activeDocumentId,
    children,
}: LegalLayoutProps) {
    return (
        <SafeArea>
            <a
                href="#legal-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-40 focus:bg-primary focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-widest focus:text-primary-foreground"
            >
                {ui.skipToContent}
            </a>
            <LegalHeader brandName={brandName} backLabel={ui.backToHome} />
            <main id="legal-content" lang={locale} className="flex-1">
                {children}
            </main>
            <LegalFooter
                brandName={brandName}
                rightsReserved={ui.rightsReserved}
                navLabel={ui.documentsNavLabel}
                links={links}
                activeId={activeDocumentId}
            />
        </SafeArea>
    )
}
