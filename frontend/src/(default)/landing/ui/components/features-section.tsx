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
        <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 bg-background">
            <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                <Reveal>
                    <SectionHeading id={`${id}-title`} heading={features.heading} />
                </Reveal>

                <Reveal className="mt-14">
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                        {features.items.map((feature) => (
                            <li
                                key={feature.title}
                                className="group min-w-0 rounded-3xl border border-border bg-card p-7 shadow-[0_16px_45px_-38px_rgba(23,92,80,0.4)] motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-primary/30 motion-safe:hover:shadow-[0_24px_55px_-35px_rgba(23,92,80,0.4)] sm:p-8"
                            >
                                <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-secondary text-primary motion-safe:transition-colors motion-safe:duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                                    <LandingIcon name={feature.icon} className="size-5" />
                                </span>
                                <h3 className="mt-7 text-base font-semibold leading-6 text-foreground">
                                    {feature.title}
                                </h3>
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
