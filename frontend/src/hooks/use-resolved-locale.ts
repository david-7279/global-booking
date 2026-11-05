// src/hooks/use-resolved-locale.ts

/**
 * Single seam for "which language should this page use?".
 *
 * Follows the document language (`<html lang>`) and falls back to the browser language.
 * When the app gains a global i18n layer or locale-prefixed routes, only this hook changes.
 */
export function useResolvedLocale<TLocale extends string>(
    resolveLocale: (requested?: string | null) => TLocale,
): TLocale {
    return resolveLocale(document.documentElement.lang || navigator.language)
}
