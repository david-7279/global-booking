// src/(default)/legal/hooks/use-active-section.ts

import { useEffect, useState } from 'react'

/**
 * Scroll-spy: reports which section is currently being read.
 *
 * The observation band sits just under the sticky header and covers the upper part
 * of the viewport, so a section becomes active as its heading reaches reading position.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
    const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null)

    useEffect(() => {
        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null)

        if (elements.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                const topmost = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]

                if (topmost) setActiveId(topmost.target.id)
            },
            { rootMargin: '-96px 0px -65% 0px', threshold: 0 },
        )

        for (const element of elements) observer.observe(element)
        return () => observer.disconnect()
    }, [sectionIds])

    return activeId
}
