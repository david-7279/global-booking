// src/(default)/landing/ui/components/cta-section.tsx

import type { LandingContent } from '@/src/(default)/landing/types/landing.types.ts'
import { LandingButtonLink } from '@/src/(default)/landing/ui/components/landing-link.tsx'
import { Reveal } from '@/src/(default)/landing/ui/components/reveal.tsx'

type CtaSectionProps = {
    cta: LandingContent['cta']
}

export function CtaSection({ cta }: CtaSectionProps) {
    return (
        <section aria-labelledby="landing-cta-title">
            <Reveal className="mx-auto w-full max-w-6xl px-6 pb-20 lg:px-8 lg:pb-28">
                <div className="relative isolate overflow-hidden bg-primary px-8 py-16 text-primary-foreground sm:px-14 sm:py-20">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--primary-foreground)_10%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--primary-foreground)_10%,transparent)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_90%_at_100%_100%,black,transparent)]"
                    />
                    <h2
                        id="landing-cta-title"
                        className="max-w-2xl font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl"
                    >
                        {cta.title}
                    </h2>
                    <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-primary-foreground/75">
                        {cta.description}
                    </p>
                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                        <LandingButtonLink
                            action={cta.primary}
                            size="lg"
                            variant="secondary"
                            arrow
                        />
                        <LandingButtonLink
                            action={cta.secondary}
                            size="lg"
                            variant="outline"
                            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                        />
                    </div>
                    <p className="mt-8 text-sm text-primary-foreground/60">{cta.note}</p>
                </div>
            </Reveal>
        </section>
    )
}
