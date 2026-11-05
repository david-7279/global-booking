// src/(default)/landing/ui/components/security-section.tsx

import type { LandingContent } from '@/src/(default)/landing/types/landing.types.ts'
import { LandingIcon } from '@/src/(default)/landing/ui/components/landing-icon.tsx'
import { LandingButtonLink } from '@/src/(default)/landing/ui/components/landing-link.tsx'
import { Reveal } from '@/src/(default)/landing/ui/components/reveal.tsx'
import { SectionHeading } from '@/src/(default)/landing/ui/components/section-heading.tsx'

type SecuritySectionProps = {
    id: string
    security: LandingContent['security']
}

export function SecuritySection({ id, security }: SecuritySectionProps) {
    return (
        <section
            id={id}
            aria-labelledby={`${id}-title`}
            className="scroll-mt-16 border-y border-border bg-muted/25"
        >
            <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8 lg:py-28">
                <Reveal>
                    <SectionHeading id={`${id}-title`} heading={security.heading} />
                    <div className="mt-8">
                        <LandingButtonLink action={security.action} variant="outline" arrow />
                    </div>
                </Reveal>

                <Reveal delay={120}>
                    <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
                        {security.points.map((point) => (
                            <li key={point.title} className="border-t border-foreground pt-6">
                                <LandingIcon name={point.icon} className="size-5" />
                                <h3 className="mt-4 text-base font-semibold">{point.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {point.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>
        </section>
    )
}
