// src/(default)/legal/ui/components/legal-toc.tsx

import { ChevronDown } from 'lucide-react'
import { useMemo, useRef } from 'react'
import type { LegalSection } from '@/src/(default)/legal/types/legal.types.ts'
import { useActiveSection } from '@/src/hooks/use-active-section.ts'
import { cn } from '@/src/lib/utils.ts'
import {formatOrdinal} from "@/src/lib/utils/format-ordinal.ts";

type LegalTocProps = {
    sections: readonly LegalSection[]
    title: string
}

type TocListProps = {
    sections: readonly LegalSection[]
    activeId: string | null
    onNavigate?: () => void
}

function TocList({ sections, activeId, onNavigate }: TocListProps) {
    return (
        <ol className="border-l border-border">
            {sections.map((section, position) => {
                const isActive = section.id === activeId

                return (
                    <li key={section.id}>
                        <a
                            href={`#${section.id}`}
                            onClick={onNavigate}
                            aria-current={isActive ? 'location' : undefined}
                            className={cn(
                                '-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm leading-5 transition-colors',
                                isActive
                                    ? 'border-foreground font-medium text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground',
                            )}
                        >
                            <span className="w-5 shrink-0 text-xs tabular-nums leading-5 opacity-70">
                                {formatOrdinal(position)}
                            </span>
                            <span>{section.title}</span>
                        </a>
                    </li>
                )
            })}
        </ol>
    )
}

/**
 * Table of contents with scroll-spy. Collapsible on small screens, sticky sidebar on
 * large ones. Only one of the two is ever visible, so there is no duplicated reading.
 */
export function LegalToc({ sections, title }: LegalTocProps) {
    const sectionIds = useMemo(() => sections.map((section) => section.id), [sections])
    const activeId = useActiveSection(sectionIds)
    const mobileDetailsRef = useRef<HTMLDetailsElement>(null)

    return (
        <>
            <details
                ref={mobileDetailsRef}
                className="group border border-border lg:hidden print:hidden"
            >
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] marker:hidden [&::-webkit-details-marker]:hidden">
                    {title}
                    <ChevronDown
                        aria-hidden="true"
                        className="size-4 transition-transform group-open:rotate-180"
                    />
                </summary>
                <div className="border-t border-border px-4 py-3">
                    <TocList
                        sections={sections}
                        activeId={activeId}
                        onNavigate={() => mobileDetailsRef.current?.removeAttribute('open')}
                    />
                </div>
            </details>

            <nav
                aria-label={title}
                className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] self-start overflow-y-auto lg:block print:hidden"
            >
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {title}
                </p>
                <TocList sections={sections} activeId={activeId} />
            </nav>
        </>
    )
}
