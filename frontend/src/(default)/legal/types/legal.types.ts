// src/(default)/legal/types/legal.types.ts

/**
 * Language-neutral content model for legal documents.
 *
 * Documents are plain data (sections made of typed blocks), never JSX. That keeps
 * wording separate from presentation: translators edit data, designers edit
 * components, and neither touches the other.
 */

/** Every legal document the platform publishes. Add an id here to add a document. */
export const LEGAL_DOCUMENT_IDS = ['terms', 'privacy'] as const
export type LegalDocumentId = (typeof LEGAL_DOCUMENT_IDS)[number]

/** Semantic link destinations; the UI layer decides how each one becomes a URL. */
export type LegalLinkTarget =
    | { kind: 'document'; documentId: LegalDocumentId; sectionId?: string }
    | { kind: 'email'; address: string }
    | { kind: 'external'; href: string }

export type LegalInlineNode =
    | string
    | { type: 'strong'; text: string }
    | { type: 'link'; text: string; target: LegalLinkTarget }

/** A plain string, or a sequence of inline nodes when emphasis or links are needed. */
export type LegalRichText = string | readonly LegalInlineNode[]

export type LegalCalloutTone = 'info' | 'warning'

export type LegalTableColumn = {
    key: string
    label: string
}

export type LegalBlock =
    | { type: 'paragraph'; content: LegalRichText }
    | { type: 'list'; ordered?: boolean; items: readonly LegalRichText[] }
    | {
          type: 'definitions'
          items: readonly { term: string; description: LegalRichText }[]
      }
    | {
          type: 'steps'
          items: readonly { title: string; description: LegalRichText }[]
      }
    | { type: 'callout'; tone: LegalCalloutTone; title?: string; content: LegalRichText }
    | {
          type: 'table'
          caption: string
          columns: readonly LegalTableColumn[]
          rows: readonly Readonly<Record<string, LegalRichText>>[]
      }

export type LegalSection = {
    /**
     * Stable, locale-independent anchor (e.g. "account"). Deep links such as
     * `/termos#account` must survive translations, so never localise ids.
     * Section numbers are derived from position and never written by hand.
     */
    id: string
    title: string
    blocks: readonly LegalBlock[]
}

export type LegalDocument = {
    id: LegalDocumentId
    title: string
    summary: string
    sections: readonly LegalSection[]
}

/** Versioning data shared by every language of a document. ISO dates (YYYY-MM-DD). */
export type LegalDocumentMeta = {
    version: string
    effectiveDate: string
    updatedAt: string
}

/**
 * Facts the wording depends on, injected into every document factory so text never
 * hardcodes names, contacts or limits that can change independently of the wording.
 */
export type LegalContext = {
    brand: { name: string }
    controller: {
        legalName: string
        address?: string
        taxId?: string
    }
    contact: {
        privacyEmail: string
        supportEmail: string
    }
    supervisoryAuthority: {
        acronym: string
        url: string
    }
    complaintsBookUrl: string
    sessions: {
        accessTokenMinutes: number
        refreshTokenDays: number
    }
    minimumAge: number
}

/** A labelled, already-localised metadata entry shown under a document title. */
export type LegalMetaItem = {
    label: string
    value: string
}

/** A localised link to one of the published legal documents. */
export type LegalDocumentLink = {
    id: LegalDocumentId
    label: string
    name: string
    to: string
}
