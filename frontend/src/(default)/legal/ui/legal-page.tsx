// src/(default)/legal/ui/legal-page.tsx

import { Suspense } from 'react'
import { useLegalDocument } from '@/src/(default)/legal/hooks/use-legal-document.ts'
import type { LegalDocumentId } from '@/src/(default)/legal/types/legal.types.ts'
import { LegalDocumentSwitcher } from '@/src/(default)/legal/ui/components/legal-document-switcher.tsx'
import { LegalHero } from '@/src/(default)/legal/ui/components/legal-hero.tsx'
import { LegalPageSkeleton } from '@/src/(default)/legal/ui/components/legal-page-skeleton.tsx'
import { LegalSection } from '@/src/(default)/legal/ui/components/legal-section.tsx'
import { LegalToc } from '@/src/(default)/legal/ui/components/legal-toc.tsx'
import { LegalLayout } from '@/src/(default)/legal/ui/legal-layout.tsx'
import { useDocumentTitle } from '@/src/hooks/use-document-title.ts'
import { useScrollToHash } from '@/src/hooks/use-scroll-to-hash.ts'
import {withPositionKeys} from "@/src/lib/utils/with-position-keys.ts";

type LegalPageProps = {
    documentId: LegalDocumentId
}

function LegalDocumentView({ documentId }: LegalPageProps) {
    const { locale, ui, brandName, legalDocument, metaItems, links } = useLegalDocument(documentId)

    useDocumentTitle(`${legalDocument.title} · ${brandName}`)
    useScrollToHash()

    return (
        <LegalLayout
            locale={locale}
            ui={ui}
            brandName={brandName}
            links={links}
            activeDocumentId={documentId}
        >
            <LegalHero
                eyebrow={ui.documentEyebrow}
                title={legalDocument.title}
                summary={legalDocument.summary}
                metaItems={metaItems}
                printLabel={ui.print}
                navigation={
                    <LegalDocumentSwitcher
                        links={links}
                        activeId={documentId}
                        label={ui.documentsNavLabel}
                    />
                }
            />
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:px-8 lg:py-16 print:block print:py-6">
                <LegalToc sections={legalDocument.sections} title={ui.tableOfContents} />
                <article>
                    {withPositionKeys(legalDocument.sections).map(({ key, item }, position) => (
                        <LegalSection
                            key={key}
                            section={item}
                            position={position}
                            linkLabel={ui.sectionLinkLabel}
                        />
                    ))}
                </article>
            </div>
        </LegalLayout>
    )
}

/**
 * Generic legal page: give it a document id and it renders the localised document.
 * Adding a document is a new id plus content, never a new page component.
 */
export function LegalPage({ documentId }: LegalPageProps) {
    return (
        <Suspense fallback={<LegalPageSkeleton />}>
            <LegalDocumentView documentId={documentId} />
        </Suspense>
    )
}
