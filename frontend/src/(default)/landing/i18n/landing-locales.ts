// src/(default)/landing/i18n/landing-locales.ts

import type { LandingLocaleBundle } from '@/src/(default)/landing/i18n/landing-locale.types.ts'
import { createLocaleRegistry } from '@/src/lib/i18n/create-locale-registry.ts'

/**
 * Registry of supported languages. To add one, create `locales/<tag>/index.ts`
 * (default-exporting a `LandingLocaleBundle`) and register it below.
 */
const LANDING_LOCALE_LOADERS = {
    'pt-PT': () => import('@/src/(default)/landing/i18n/locales/pt-PT/index.ts'),
} as const

const registry = createLocaleRegistry<LandingLocaleBundle, typeof LANDING_LOCALE_LOADERS>(
    LANDING_LOCALE_LOADERS,
    'pt-PT',
)

export type LandingLocale = keyof typeof LANDING_LOCALE_LOADERS

export const resolveLandingLocale = registry.resolveLocale
export const loadLandingBundle = registry.loadBundle
