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
            <Reveal className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                <div className="relative isolate overflow-hidden rounded-[2rem] border border-primary bg-primary px-6 py-14 text-primary-foreground shadow-xl shadow-primary/10 sm:px-12 sm:py-20 lg:px-20">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-24 -top-32 -z-10 size-96 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 sm:size-[32rem]"
                    />
                    <h2
                        id="landing-cta-title"
                        className="max-w-3xl font-heading text-4xl leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl"
                    >
                        {cta.title}
                    </h2>
                    <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-primary-foreground/85">
                        {cta.description}
                    </p>
                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-start">
                        <LandingButtonLink
                            action={cta.primary}
                            size="lg"
                            variant="secondary"
                            className="h-auto min-h-12 max-w-full rounded-full px-7 py-3 text-center whitespace-normal focus-visible:outline-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transition-none"
                            arrow
                        />
                        <LandingButtonLink
                            action={cta.secondary}
                            size="lg"
                            variant="default"
                            className="h-auto min-h-12 max-w-full rounded-full border-primary-foreground/50 bg-transparent px-7 py-3 text-center text-primary-foreground whitespace-normal hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:border-primary-foreground focus-visible:outline-primary-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transition-none"
                        />
                    </div>
                    <p className="mt-8 text-sm leading-6 text-primary-foreground/75">{cta.note}</p>
                </div>
            </Reveal>
        </section>
    )
}
