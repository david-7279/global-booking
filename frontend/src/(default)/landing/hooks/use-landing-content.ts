// src/(default)/landing/hooks/use-landing-content.ts

import { use, useMemo } from 'react'
import { LANDING_CONTEXT } from '@/src/(default)/landing/config/landing.config.ts'
import {
    type LandingLocale,
    loadLandingBundle,
    resolveLandingLocale,
} from '@/src/(default)/landing/i18n/landing-locales.ts'
import type { LandingContent } from '@/src/(default)/landing/types/landing.types.ts'
import { useResolvedLocale } from '@/src/hooks/use-resolved-locale.ts'

export type LandingView = {
    locale: LandingLocale
    content: LandingContent
}

/** Resolves the language and builds the page copy. Suspends while the bundle loads. */
export function useLandingContent(): LandingView {
    const locale = useResolvedLocale(resolveLandingLocale)
    const bundle = use(loadLandingBundle(locale))

    return useMemo(() => ({ locale, content: bundle.content(LANDING_CONTEXT) }), [bundle, locale])
}
