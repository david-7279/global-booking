// src/(default)/landing/i18n/landing-locale.types.ts

import type { LandingContent, LandingContext } from '@/src/(default)/landing/types/landing.types.ts'

/** Builds the page copy from shared facts, so wording never hardcodes them. */
export type LandingContentFactory = (context: LandingContext) => LandingContent

/** Everything a language must provide. A missing field fails the type-check. */
export type LandingLocaleBundle = {
    content: LandingContentFactory
}
