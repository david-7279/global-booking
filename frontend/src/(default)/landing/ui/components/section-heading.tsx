// src/(default)/landing/ui/components/section-heading.tsx

import type { LandingSectionHeading } from '@/src/(default)/landing/types/landing.types.ts'
import { cn } from '@/src/lib/utils.ts'

type SectionHeadingProps = {
    id: string
    heading: LandingSectionHeading
    className?: string
}

/** Eyebrow + title + intro, shared by every section so rhythm stays consistent. */
export function SectionHeading({ id, heading, className }: SectionHeadingProps) {
    return (
        <div className={cn('max-w-3xl', className)}>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary before:h-px before:w-8 before:shrink-0 before:bg-primary">
                {heading.eyebrow}
            </p>
            <h2
                id={id}
                className="mt-5 max-w-3xl font-heading text-4xl leading-[1.08] tracking-tight text-balance text-foreground sm:text-5xl lg:text-[3.5rem]"
            >
                {heading.title}
            </h2>
            {heading.intro ? (
                <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                    {heading.intro}
                </p>
            ) : null}
        </div>
    )
}
