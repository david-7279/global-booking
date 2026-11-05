// src/(default)/landing/types/landing.types.ts

/**
 * Language-neutral content model for the landing page.
 *
 * Copy is plain data; icons are referenced by key and routes by name, so wording can be
 * translated without touching components, and components can be restyled without
 * touching wording.
 */

/** Page sections rendered between the hero and the closing call to action. */
export const LANDING_SECTION_IDS = [
    'audiences',
    'how-it-works',
    'features',
    'security',
    'faq',
] as const
export type LandingSectionId = (typeof LANDING_SECTION_IDS)[number]

export type LandingIconKey =
    | 'building'
    | 'user'
    | 'store'
    | 'layers'
    | 'clock'
    | 'list-checks'
    | 'bell'
    | 'users'
    | 'lock'
    | 'shield'
    | 'eye-off'
    | 'file-text'
    | 'calendar'
    | 'send'
    | 'settings'
    | 'mail'

export type LandingRouteKey = 'auth' | 'terms' | 'privacy'

export type LandingLinkTarget =
    | { kind: 'route'; route: LandingRouteKey }
    | { kind: 'section'; sectionId: LandingSectionId }
    | { kind: 'email'; address: string }

export type LandingAction = {
    label: string
    target: LandingLinkTarget
}

export type LandingSectionHeading = {
    eyebrow: string
    title: string
    intro?: string
}

export type LandingNavigation = {
    ariaLabel: string
    skipToContent: string
    openMenu: string
    closeMenu: string
    items: readonly { sectionId: LandingSectionId; label: string }[]
    signIn: LandingAction
    primaryCta: LandingAction
}

export type LandingBookingPreview = {
    caption: string
    heading: string
    serviceLabel: string
    serviceName: string
    serviceMeta: string
    slotsLabel: string
    slots: readonly string[]
    defaultSlotIndex: number
    statusLabel: string
    status: { idle: string; pending: string; confirmed: string }
    timelineLabel: string
    timeline: readonly string[]
    actions: { idle: string; pending: string; confirmed: string }
    notification: { title: string; body: string }
}

export type LandingHero = {
    eyebrow: string
    title: string
    subtitle: string
    primaryCta: LandingAction
    secondaryCta: LandingAction
    highlights: readonly string[]
    preview: LandingBookingPreview
}

export type LandingAudience = {
    id: string
    icon: LandingIconKey
    label: string
    title: string
    description: string
    points: readonly string[]
    action: LandingAction
    /** Draws the card with inverted colours to create contrast between the two audiences. */
    featured?: boolean
}

export type LandingStep = {
    icon: LandingIconKey
    title: string
    description: string
}

/** Language-neutral state keys; the UI decides how each one looks. */
export type LandingBookingStateKey =
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'rejected'
    | 'cancelled'

export type LandingBookingState = {
    key: LandingBookingStateKey
    label: string
    description: string
}

export type LandingLifecycle = {
    title: string
    description: string
    mainFlow: readonly LandingBookingState[]
    endingsLabel: string
    endings: readonly LandingBookingState[]
    note: string
}

export type LandingFeature = {
    icon: LandingIconKey
    title: string
    description: string
}

export type LandingFaqItem = {
    question: string
    answer: string
    action?: LandingAction
}

export type LandingFooterGroup = {
    title: string
    links: readonly LandingAction[]
}

export type LandingContent = {
    meta: { title: string }
    navigation: LandingNavigation
    hero: LandingHero
    audiences: { heading: LandingSectionHeading; items: readonly LandingAudience[] }
    howItWorks: {
        heading: LandingSectionHeading
        steps: readonly LandingStep[]
        lifecycle: LandingLifecycle
    }
    features: { heading: LandingSectionHeading; items: readonly LandingFeature[] }
    security: {
        heading: LandingSectionHeading
        points: readonly LandingFeature[]
        action: LandingAction
    }
    faq: { heading: LandingSectionHeading; items: readonly LandingFaqItem[] }
    cta: {
        title: string
        description: string
        primary: LandingAction
        secondary: LandingAction
        note: string
    }
    footer: {
        tagline: string
        groups: readonly LandingFooterGroup[]
        rights: string
    }
}

/** Facts the copy depends on, injected so wording never hardcodes them. */
export type LandingContext = {
    brandName: string
    supportEmail: string
}
