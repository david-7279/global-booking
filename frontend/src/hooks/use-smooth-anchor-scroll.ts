// src/hooks/use-smooth-anchor-scroll.ts

import { useEffect } from 'react'

/**
 * Enables smooth in-page anchor scrolling while the page is mounted, unless the user
 * prefers reduced motion. The previous value is restored on unmount so other pages are
 * unaffected.
 */
export function useSmoothAnchorScroll(): void {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const root = document.documentElement
        const previous = root.style.scrollBehavior
        root.style.scrollBehavior = 'smooth'

        return () => {
            root.style.scrollBehavior = previous
        }
    }, [])
}
