// src/(default)/landing/lib/resolve-link.ts

import { LANDING_ROUTES } from '@/src/(default)/landing/config/landing.config.ts'
import type { LandingLinkTarget } from '@/src/(default)/landing/types/landing.types.ts'

export type ResolvedLink =
    | { type: 'route'; to: string }
    | { type: 'anchor'; href: string }
    | { type: 'mailto'; href: string }

/** Turns a semantic link target into the concrete destination the UI should render. */
export function resolveLandingLink(target: LandingLinkTarget): ResolvedLink {
    switch (target.kind) {
        case 'route':
            return { type: 'route', to: LANDING_ROUTES[target.route] }
        case 'section':
            return { type: 'anchor', href: `#${target.sectionId}` }
        case 'email':
            return { type: 'mailto', href: `mailto:${target.address}` }
    }
}
