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
        <div className={cn('max-w-2xl', className)}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {heading.eyebrow}
            </p>
            <h2
                id={id}
                className="mt-4 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl"
            >
                {heading.title}
            </h2>
            {heading.intro ? (
                <p className="mt-5 text-pretty text-lg leading-8 text-muted-foreground">
                    {heading.intro}
                </p>
            ) : null}
        </div>
    )
}
