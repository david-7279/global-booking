// src/(default)/legal/config/legal.config.ts

import type {
    LegalContext,
    LegalDocumentId,
    LegalDocumentMeta,
} from '@/src/(default)/legal/types/legal.types.ts'
import { paths } from '@/src/router/paths.ts'

export const LEGAL_CONTEXT: LegalContext = {
    brand: { name: 'Atlas. Booking' },
    controller: {
        legalName: 'Atlas Booking',
        // address: 'Rua Exemplo, 1, 4000-000 Porto',
        // taxId: '500 000 000',
    },
    contact: {
        privacyEmail: 'privacidade@globalbooking.example',
        supportEmail: 'apoio@globalbooking.example',
    },
    supervisoryAuthority: {
        acronym: 'CNPD',
        url: 'https://www.cnpd.pt',
    },
    complaintsBookUrl: 'https://www.livroreclamacoes.pt',
    sessions: {
        accessTokenMinutes: 15,
        refreshTokenDays: 7,
    },
    minimumAge: 18,
}

/** Bump `version` and the dates whenever the wording of a document changes. */
export const LEGAL_DOCUMENT_META: Readonly<Record<LegalDocumentId, LegalDocumentMeta>> = {
    terms: { version: '1.0', effectiveDate: '2026-11-04', updatedAt: '2026-11-04' },
    privacy: { version: '1.0', effectiveDate: '2026-11-04', updatedAt: '2026-11-04' },
}

/** Route of each document, derived from the app's route table. */
export const LEGAL_DOCUMENT_PATHS: Readonly<Record<LegalDocumentId, string>> = {
    terms: paths.public.terms,
    privacy: paths.public.privacy,
}
