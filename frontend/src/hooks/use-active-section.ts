// src/hooks/use-active-section.ts

import { useEffect, useState } from 'react'

type UseActiveSectionOptions = {
    /** Section considered active before any observation. Defaults to the first one. */
    initialId?: string | null
    /** When true, no section is active while none is in the reading band (e.g. over a hero). */
    allowNone?: boolean
}

/**
 * Scroll-spy: reports which section is currently being read.
 *
 * The observation band sits just under a sticky header and covers the upper part of the
 * viewport, so a section becomes active as its top reaches reading position. Ties are
 * resolved by document order, given by `sectionIds`.
 */
export function useActiveSection(
    sectionIds: readonly string[],
    { initialId = sectionIds[0] ?? null, allowNone = false }: UseActiveSectionOptions = {},
): string | null {
    const [activeId, setActiveId] = useState<string | null>(initialId)

    useEffect(() => {
        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null)

        if (elements.length === 0) return

        const inBand = new Set<string>()
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) inBand.add(entry.target.id)
                    else inBand.delete(entry.target.id)
                }

                const current = sectionIds.find((id) => inBand.has(id))
                if (current) setActiveId(current)
                else if (allowNone) setActiveId(null)
            },
            { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
        )

        for (const element of elements) observer.observe(element)
        return () => observer.disconnect()
    }, [sectionIds, allowNone])

    return activeId
}
