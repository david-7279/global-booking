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
        <section className="relative isolate overflow-hidden border-b border-border/70">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_75%_65%_at_25%_0%,black,transparent)]"
            />
            <div className="mx-auto grid w-full max-w-6xl gap-16 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:px-8 lg:pb-28 lg:pt-24">
                <div className="max-w-2xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
                    <p className="inline-flex items-center gap-2 border border-border bg-background/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <span aria-hidden="true" className="size-1.5 bg-foreground" />
                        {hero.eyebrow}
                    </p>
                    <h1 className="mt-7 font-heading text-5xl leading-[0.98] tracking-tight text-balance sm:text-6xl">
                        {hero.title}
                    </h1>
                    <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
                        {hero.subtitle}
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <LandingButtonLink action={hero.primaryCta} size="lg" arrow />
                        <LandingButtonLink action={hero.secondaryCta} size="lg" variant="outline" />
                    </div>
                    <ul className="mt-10 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
                        {withPositionKeys(hero.highlights).map(({ key, item }) => (
                            <li key={key} className="flex items-center gap-3">
                                <Check
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-foreground"
                                />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:delay-150 motion-safe:duration-700 lg:pl-4">
                    <BookingPreview preview={hero.preview} />
                </div>
            </div>
        </section>
    )
}
