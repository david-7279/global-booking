// src/(default)/legal/i18n/legal-locales.ts

import type { LegalLocaleBundle } from '@/src/(default)/legal/i18n/legal-locale.types.ts'

type LegalLocaleLoader = () => Promise<{ default: LegalLocaleBundle }>

/**
 * Registry of supported languages. To add one, create `locales/<tag>/index.ts`
 * (default-exporting a `LegalLocaleBundle`) and register it here. Nothing else changes:
 * `LegalLocale` is derived from the keys, and each language ships as its own chunk,
 * loaded only when needed.
 */
const LEGAL_LOCALE_LOADERS = {
    'pt-PT': () => import('@/src/(default)/legal/i18n/locales/pt-PT/index.ts'),
} as const satisfies Readonly<Record<string, LegalLocaleLoader>>

export type LegalLocale = keyof typeof LEGAL_LOCALE_LOADERS

export const DEFAULT_LEGAL_LOCALE: LegalLocale = 'pt-PT'

export const SUPPORTED_LEGAL_LOCALES = Object.keys(LEGAL_LOCALE_LOADERS) as LegalLocale[]

function languageOf(tag: string): string {
    return tag.toLowerCase().split('-')[0]
}

/**
 * Maps any BCP 47 tag to a supported locale: exact match first, then same language
 * (e.g. "pt-BR" → "pt-PT"), otherwise the default.
 */
export function resolveLegalLocale(requested?: string | null): LegalLocale {
    if (!requested) return DEFAULT_LEGAL_LOCALE

    const exact = SUPPORTED_LEGAL_LOCALES.find(
        (locale) => locale.toLowerCase() === requested.toLowerCase(),
    )
    if (exact) return exact

    const sameLanguage = SUPPORTED_LEGAL_LOCALES.find(
        (locale) => languageOf(locale) === languageOf(requested),
    )
    return sameLanguage ?? DEFAULT_LEGAL_LOCALE
}

const bundleCache = new Map<LegalLocale, Promise<LegalLocaleBundle>>()

/**
 * Loads a locale bundle once and reuses the same promise afterwards. A stable promise
 * is required for React's `use()`, and failed loads are evicted so a retry can succeed.
 */
export function loadLegalBundle(locale: LegalLocale): Promise<LegalLocaleBundle> {
    const cached = bundleCache.get(locale)
    if (cached) return cached

    const pending = LEGAL_LOCALE_LOADERS[locale]()
        .then((module) => module.default)
        .catch((error: unknown) => {
            bundleCache.delete(locale)
            throw error
        })

    bundleCache.set(locale, pending)
    return pending
}
