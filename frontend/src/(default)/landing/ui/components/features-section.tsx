// src/(default)/landing/ui/components/features-section.tsx

import type { LandingContent } from '@/src/(default)/landing/types/landing.types.ts'
import { LandingIcon } from '@/src/(default)/landing/ui/components/landing-icon.tsx'
import { Reveal } from '@/src/(default)/landing/ui/components/reveal.tsx'
import { SectionHeading } from '@/src/(default)/landing/ui/components/section-heading.tsx'

type FeaturesSectionProps = {
    id: string
    features: LandingContent['features']
}

export function FeaturesSection({ id, features }: FeaturesSectionProps) {
    return (
        <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16">
            <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
                <Reveal>
                    <SectionHeading id={`${id}-title`} heading={features.heading} />
                </Reveal>

                <Reveal className="mt-14">
                    <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                        {features.items.map((feature) => (
                            <li
                                key={feature.title}
                                className="group bg-background p-8 transition-colors hover:bg-muted/40"
                            >
                                <span className="flex size-10 items-center justify-center border border-border bg-muted/50 transition-colors group-hover:border-foreground group-hover:bg-primary group-hover:text-primary-foreground">
                                    <LandingIcon name={feature.icon} className="size-5" />
                                </span>
                                <h3 className="mt-6 text-base font-semibold">{feature.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {feature.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>
        </section>
    )
}
