// src/(default)/legal/hooks/use-legal-document.ts

import { use, useMemo } from 'react'
import {
    LEGAL_CONTEXT,
    LEGAL_DOCUMENT_META,
    LEGAL_DOCUMENT_PATHS,
} from '@/src/(default)/legal/config/legal.config.ts'
import type { LegalUiMessages } from '@/src/(default)/legal/i18n/legal-locale.types.ts'
import {
    type LegalLocale,
    loadLegalBundle,
    resolveLegalLocale,
} from '@/src/(default)/legal/i18n/legal-locales.ts'
import {
    LEGAL_DOCUMENT_IDS,
    type LegalDocument,
    type LegalDocumentId,
    type LegalDocumentLink,
    type LegalMetaItem,
} from '@/src/(default)/legal/types/legal.types.ts'
import { useResolvedLocale } from '@/src/hooks/use-resolved-locale.ts'
import {formatLegalDate} from "@/src/lib/utils/format-legal-date.ts";

export type LegalDocumentView = {
    locale: LegalLocale
    ui: LegalUiMessages
    brandName: string
    legalDocument: LegalDocument
    metaItems: readonly LegalMetaItem[]
    links: readonly LegalDocumentLink[]
}

/**
 * Assembles everything a legal page needs: the localised document, its versioning
 * metadata and navigation links. Suspends while the locale bundle is loading.
 */
export function useLegalDocument(documentId: LegalDocumentId): LegalDocumentView {
    const locale = useResolvedLocale(resolveLegalLocale)
    const bundle = use(loadLegalBundle(locale))

    return useMemo(() => {
        const { ui } = bundle
        const meta = LEGAL_DOCUMENT_META[documentId]

        return {
            locale,
            ui,
            brandName: LEGAL_CONTEXT.brand.name,
            legalDocument: bundle.documents[documentId](LEGAL_CONTEXT),
            metaItems: [
                { label: ui.version, value: meta.version },
                { label: ui.effectiveFrom, value: formatLegalDate(meta.effectiveDate, locale) },
                { label: ui.lastUpdated, value: formatLegalDate(meta.updatedAt, locale) },
            ],
            links: LEGAL_DOCUMENT_IDS.map((id) => ({
                id,
                label: ui.documentShortNames[id],
                name: ui.documentNames[id],
                to: LEGAL_DOCUMENT_PATHS[id],
            })),
        }
    }, [bundle, documentId, locale])
}
