// src/(default)/legal/ui/components/legal-hero.tsx

import { Printer } from 'lucide-react'
import type { ReactNode } from 'react'
import type { LegalMetaItem } from '@/src/(default)/legal/types/legal.types.ts'
import { Button } from '@/src/components/ui/button.tsx'
import { withPositionKeys } from '@/src/lib/utils/with-position-keys.ts'

type LegalHeroProps = {
    eyebrow: string
    title: string
    summary: string
    metaItems: readonly LegalMetaItem[]
    printLabel: string
    /** Slot for document navigation, keeping the hero unaware of what it navigates. */
    navigation: ReactNode
}

export function LegalHero({
    eyebrow,
    title,
    summary,
    metaItems,
    printLabel,
    navigation,
}: LegalHeroProps) {
    return (
        <section className="border-b border-border/70 bg-muted/25 print:border-0 print:bg-transparent">
            <div className="mx-auto w-full max-w-6xl px-6 py-14 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 lg:px-8 lg:py-20">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {eyebrow}
                </p>
                <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                    {title}
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                    {summary}
                </p>

                <div className="mt-10 flex flex-col gap-6 border-t border-border pt-6 md:flex-row md:items-end md:justify-between">
                    <dl className="flex flex-wrap gap-x-10 gap-y-4">
                        {withPositionKeys(metaItems).map(({ key, item }) => (
                            <div key={key}>
                                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                    {item.label}
                                </dt>
                                <dd className="mt-1 text-sm font-medium tabular-nums">
                                    {item.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <div className="flex flex-wrap items-center gap-3 print:hidden">
                        {navigation}
                        <Button type="button" variant="outline" onClick={() => window.print()}>
                            <Printer aria-hidden="true" />
                            {printLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
