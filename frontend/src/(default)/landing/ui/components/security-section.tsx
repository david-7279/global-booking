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
            className="scroll-mt-24 border-y border-border bg-muted/40"
        >
            <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-8 lg:py-28">
                <Reveal>
                    <SectionHeading id={`${id}-title`} heading={security.heading} />
                    <div className="mt-8">
                        <LandingButtonLink
                            action={security.action}
                            variant="default"
                            className="h-auto min-h-12 max-w-full rounded-full border-border bg-card px-6 py-3 text-center text-foreground whitespace-normal hover:border-primary hover:bg-secondary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
                            arrow
                        />
                    </div>
                </Reveal>

                <Reveal delay={120}>
                    <ul className="grid gap-4 sm:grid-cols-2">
                        {security.points.map((point) => (
                            <li
                                key={point.title}
                                className="rounded-2xl border border-border bg-card p-6 shadow-sm shadow-primary/5 sm:p-7"
                            >
                                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                                    <LandingIcon name={point.icon} className="size-5" />
                                </span>
                                <h3 className="mt-6 text-base font-semibold leading-6 text-foreground">
                                    {point.title}
                                </h3>
                                <p className="mt-2 text-sm leading-7 text-muted-foreground">
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
