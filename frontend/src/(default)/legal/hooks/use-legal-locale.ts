// src/(default)/legal/hooks/use-legal-locale.ts

import { type LegalLocale, resolveLegalLocale } from '@/src/(default)/legal/i18n/legal-locales.ts'

/**
 * Single seam for "which language should legal pages use?".
 *
 * Today it follows the document language (`<html lang>`) and falls back to the
 * browser language. When the app gains a global i18n layer or locale-prefixed
 * routes, only this hook changes; every consumer stays as it is.
 */
export function useLegalLocale(): LegalLocale {
    return resolveLegalLocale(document.documentElement.lang || navigator.language)
}
