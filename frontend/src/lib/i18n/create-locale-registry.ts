// src/lib/i18n/create-locale-registry.ts

type LocaleLoader<TBundle> = () => Promise<{ default: TBundle }>

export type LocaleRegistry<TBundle, TLocale extends string> = {
    defaultLocale: TLocale
    supportedLocales: readonly TLocale[]
    /** Maps any BCP 47 tag to a supported locale (exact, then same language, then default). */
    resolveLocale: (requested?: string | null) => TLocale
    /** Loads a bundle once; the same promise is reused so React's `use()` stays stable. */
    loadBundle: (locale: TLocale) => Promise<TBundle>
}

function languageOf(tag: string): string {
    return tag.toLowerCase().split('-')[0]
}

/**
 * Builds a lazy, cached locale registry for a feature. Each locale is its own chunk and
 * is fetched only when needed. Failed loads are evicted so a retry can succeed.
 *
 * Usage: `createLocaleRegistry({ 'pt-PT': () => import('./locales/pt-PT') }, 'pt-PT')`
 */
export function createLocaleRegistry<
    TBundle,
    TLoaders extends Readonly<Record<string, LocaleLoader<TBundle>>>,
>(
    loaders: TLoaders,
    defaultLocale: keyof TLoaders & string,
): LocaleRegistry<TBundle, keyof TLoaders & string> {
    type TLocale = keyof TLoaders & string

    const supportedLocales = Object.keys(loaders) as TLocale[]
    const cache = new Map<TLocale, Promise<TBundle>>()

    function resolveLocale(requested?: string | null): TLocale {
        if (!requested) return defaultLocale

        const exact = supportedLocales.find(
            (locale) => locale.toLowerCase() === requested.toLowerCase(),
        )
        if (exact) return exact

        const sameLanguage = supportedLocales.find(
            (locale) => languageOf(locale) === languageOf(requested),
        )
        return sameLanguage ?? defaultLocale
    }

    function loadBundle(locale: TLocale): Promise<TBundle> {
        const cached = cache.get(locale)
        if (cached) return cached

        const pending = loaders[locale]()
            .then((module) => module.default)
            .catch((error: unknown) => {
                cache.delete(locale)
                throw error
            })

        cache.set(locale, pending)
        return pending
    }

    return { defaultLocale, supportedLocales, resolveLocale, loadBundle }
}
