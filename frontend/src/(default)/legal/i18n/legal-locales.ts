// src/(default)/legal/i18n/legal-locales.ts

import type { LegalLocaleBundle } from '@/src/(default)/legal/i18n/legal-locale.types.ts'
import { createLocaleRegistry } from '@/src/lib/i18n/create-locale-registry.ts'

/**
 * Registry of supported languages. To add one, create `locales/<tag>/index.ts`
 * (default-exporting a `LegalLocaleBundle`) and register it below. Nothing else changes:
 * `LegalLocale` is derived from the keys and each language ships as its own chunk.
 */
const LEGAL_LOCALE_LOADERS = {
    'pt-PT': () => import('@/src/(default)/legal/i18n/locales/pt-PT/index.ts'),
} as const

const registry = createLocaleRegistry<LegalLocaleBundle, typeof LEGAL_LOCALE_LOADERS>(
    LEGAL_LOCALE_LOADERS,
    'pt-PT',
)

export type LegalLocale = keyof typeof LEGAL_LOCALE_LOADERS

export const resolveLegalLocale = registry.resolveLocale
export const loadLegalBundle = registry.loadBundle
