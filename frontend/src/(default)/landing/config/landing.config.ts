// src/(default)/landing/config/landing.config.ts

import type {
    LandingContext,
    LandingRouteKey,
    LandingSectionId,
} from '@/src/(default)/landing/types/landing.types.ts'
import { BRAND } from '@/src/lib/brand/brand.config.ts'
import { paths } from '@/src/router/paths.ts'

export const LANDING_CONTEXT: LandingContext = {
    brandName: BRAND.name,
    supportEmail: BRAND.supportEmail,
}

/** Order in which sections appear on the page. Reorder or remove entries to restructure. */
export const LANDING_SECTION_ORDER: readonly LandingSectionId[] = [
    'audiences',
    'how-it-works',
    'features',
    'security',
    'faq',
]

/** Named routes the copy can point to, resolved from the app's route table. */
export const LANDING_ROUTES: Readonly<Record<LandingRouteKey, string>> = {
    auth: paths.auth,
    terms: paths.public.terms,
    privacy: paths.public.privacy,
}
