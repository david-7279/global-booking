// src/(default)/legal/ui/components/legal-section.tsx

import { Hash } from 'lucide-react'
import type { LegalSection as LegalSectionModel } from '@/src/(default)/legal/types/legal.types.ts'
import { LegalBlockView } from '@/src/(default)/legal/ui/components/legal-block.tsx'
import { formatOrdinal } from '@/src/lib/utils/format-ordinal.ts'
import { withPositionKeys } from '@/src/lib/utils/with-position-keys.ts'

type LegalSectionProps = {
    section: LegalSectionModel
    position: number
    linkLabel: string
}

export function LegalSection({ section, position, linkLabel }: LegalSectionProps) {
    const titleId = `${section.id}-title`

    return (
        <section
            id={section.id}
            aria-labelledby={titleId}
            className="grid scroll-mt-24 gap-x-4 gap-y-5 border-t border-border py-10 first:border-t-0 first:pt-0 sm:grid-cols-[2.75rem_minmax(0,1fr)] sm:py-12"
        >
            <span
                aria-hidden="true"
                className="pt-1.5 text-xs font-semibold tabular-nums tracking-[0.16em] text-muted-foreground sm:pt-3"
            >
                {formatOrdinal(position)}
            </span>
            <h2
                id={titleId}
                className="font-heading text-2xl leading-tight tracking-tight text-balance sm:text-3xl"
            >
                <a
                    href={`#${section.id}`}
                    title={linkLabel}
                    className="group inline-flex items-baseline gap-2"
                >
                    {section.title}
                    <Hash
                        aria-hidden="true"
                        className="size-4 shrink-0 self-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 print:hidden"
                    />
                </a>
            </h2>
            <div className="max-w-2xl space-y-5 sm:col-start-2">
                {withPositionKeys(section.blocks).map(({ key, item }) => (
                    <LegalBlockView key={key} block={item} />
                ))}
            </div>
        </section>
    )
}
