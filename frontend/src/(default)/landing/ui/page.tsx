// src/(default)/landing/ui/page.tsx

import { Suspense } from 'react'
import { LANDING_SECTION_ORDER } from '@/src/(default)/landing/config/landing.config.ts'
import { useLandingContent } from '@/src/(default)/landing/hooks/use-landing-content.ts'
import type {
    LandingContent,
    LandingSectionId,
} from '@/src/(default)/landing/types/landing.types.ts'
import { AudiencesSection } from '@/src/(default)/landing/ui/components/audiences-section.tsx'
import { CtaSection } from '@/src/(default)/landing/ui/components/cta-section.tsx'
import { FaqSection } from '@/src/(default)/landing/ui/components/faq-section.tsx'
import { FeaturesSection } from '@/src/(default)/landing/ui/components/features-section.tsx'
import { HowItWorksSection } from '@/src/(default)/landing/ui/components/how-it-works-section.tsx'
import { LandingFooter } from '@/src/(default)/landing/ui/components/landing-footer.tsx'
import { LandingHeader } from '@/src/(default)/landing/ui/components/landing-header.tsx'
import { LandingHero } from '@/src/(default)/landing/ui/components/landing-hero.tsx'
import { LandingPageSkeleton } from '@/src/(default)/landing/ui/components/landing-page-skeleton.tsx'
import { SecuritySection } from '@/src/(default)/landing/ui/components/security-section.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import { useDocumentTitle } from '@/src/hooks/use-document-title.ts'
import { useScrollToHash } from '@/src/hooks/use-scroll-to-hash.ts'
import { useSmoothAnchorScroll } from '@/src/hooks/use-smooth-anchor-scroll.ts'
import { BRAND } from '@/src/lib/brand/brand.config.ts'

type LandingSectionViewProps = {
    id: LandingSectionId
    content: LandingContent
}

/** Maps a section id to its component. The exhaustive switch flags any section left unhandled. */
function LandingSectionView({ id, content }: LandingSectionViewProps) {
    switch (id) {
        case 'audiences':
            return <AudiencesSection id={id} audiences={content.audiences} />
        case 'how-it-works':
            return <HowItWorksSection id={id} howItWorks={content.howItWorks} />
        case 'features':
            return <FeaturesSection id={id} features={content.features} />
        case 'security':
            return <SecuritySection id={id} security={content.security} />
        case 'faq':
            return <FaqSection id={id} faq={content.faq} />
    }
}

function LandingView() {
    const { locale, content } = useLandingContent()

    useDocumentTitle(content.meta.title)
    useScrollToHash()
    useSmoothAnchorScroll()

    return (
        <SafeArea>
            <a
                href="#landing-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-widest focus:text-primary-foreground"
            >
                {content.navigation.skipToContent}
            </a>
            <LandingHeader brandName={BRAND.name} navigation={content.navigation} />
            <main id="landing-content" lang={locale} className="flex-1">
                <LandingHero hero={content.hero} />
                {LANDING_SECTION_ORDER.map((id) => (
                    <LandingSectionView key={id} id={id} content={content} />
                ))}
                <CtaSection cta={content.cta} />
            </main>
            <LandingFooter brandName={BRAND.name} footer={content.footer} />
        </SafeArea>
    )
}

export default function LandingPage() {
    return (
        <Suspense fallback={<LandingPageSkeleton />}>
            <LandingView />
        </Suspense>
    )
}
