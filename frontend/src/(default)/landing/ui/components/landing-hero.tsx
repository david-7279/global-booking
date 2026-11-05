// src/(default)/landing/ui/components/landing-hero.tsx

import { Check } from 'lucide-react'
import type { LandingHero as LandingHeroContent } from '@/src/(default)/landing/types/landing.types.ts'
import { BookingPreview } from '@/src/(default)/landing/ui/components/booking-preview.tsx'
import { LandingButtonLink } from '@/src/(default)/landing/ui/components/landing-link.tsx'
import { withPositionKeys } from '@/src/lib/utils/with-position-keys.ts'

type LandingHeroProps = {
    hero: LandingHeroContent
}

export function LandingHero({ hero }: LandingHeroProps) {
    return (
        <section className="relative isolate border-b border-border/80 bg-background">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(ellipse_at_80%_12%,#e7f1eb_0%,transparent_42%)]"
            />
            <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-24 xl:gap-24 xl:pb-32 xl:pt-28">
                <div className="min-w-0 max-w-2xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
                    <p className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold leading-relaxed tracking-[0.08em] text-primary [overflow-wrap:anywhere]">
                        <span
                            aria-hidden="true"
                            className="size-2 shrink-0 rounded-full bg-primary"
                        />
                        {hero.eyebrow}
                    </p>
                    <h1 className="mt-7 max-w-[15ch] font-heading text-[clamp(2.6rem,5.4vw,4.75rem)] font-medium leading-[1.08] tracking-[-0.045em] text-balance text-foreground [overflow-wrap:anywhere] sm:mt-8">
                        {hero.title}
                    </h1>
                    <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-muted-foreground sm:mt-7 sm:text-lg">
                        {hero.subtitle}
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <LandingButtonLink action={hero.primaryCta} size="lg" arrow />
                        <LandingButtonLink action={hero.secondaryCta} size="lg" variant="outline" />
                    </div>
                    <ul className="mt-10 grid gap-3 border-t border-border pt-7 text-sm leading-6 text-muted-foreground sm:grid-cols-2 sm:gap-x-6">
                        {withPositionKeys(hero.highlights).map(({ key, item }) => (
                            <li key={key} className="flex min-w-0 items-start gap-2.5">
                                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                                    <Check aria-hidden="true" className="size-3" />
                                </span>
                                <span className="min-w-0 [overflow-wrap:anywhere]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="min-w-0 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:delay-150 motion-safe:duration-700">
                    <BookingPreview preview={hero.preview} />
                </div>
            </div>
        </section>
    )
}
