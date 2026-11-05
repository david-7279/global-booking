// src/(default)/legal/i18n/legal-locale.types.ts

import type {
    LegalContext,
    LegalDocument,
    LegalDocumentId,
} from '@/src/(default)/legal/types/legal.types.ts'

/** Interface chrome (navigation, labels, metadata) used around every document. */
export type LegalUiMessages = {
    documentEyebrow: string
    documentsNavLabel: string
    /** Full document names, used for titles and accessible labels. */
    documentNames: Readonly<Record<LegalDocumentId, string>>
    /** Compact names, used where space is tight (switcher, footer). */
    documentShortNames: Readonly<Record<LegalDocumentId, string>>
    backToHome: string
    skipToContent: string
    tableOfContents: string
    version: string
    effectiveFrom: string
    lastUpdated: string
    print: string
    sectionLinkLabel: string
    rightsReserved: string
}

/** Builds a document from the shared facts, so wording never hardcodes them. */
export type LegalDocumentFactory = (context: LegalContext) => LegalDocument

/**
 * Everything a language must provide. Because it is exhaustive over
 * `LegalDocumentId`, a missing translation fails the type-check, not production.
 */
export type LegalLocaleBundle = {
    ui: LegalUiMessages
    documents: Readonly<Record<LegalDocumentId, LegalDocumentFactory>>
}
