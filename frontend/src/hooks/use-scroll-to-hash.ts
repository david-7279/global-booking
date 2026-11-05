// src/hooks/use-scroll-to-hash.ts

import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Client-side navigation keeps the previous scroll offset and cannot target anchors
 * that were not yet rendered. On every navigation, jump to the requested section,
 * or back to the top when the URL carries no hash.
 */
export function useScrollToHash(): void {
    const location = useLocation()

    useEffect(() => {
        if (!location.hash) {
            window.scrollTo({ top: 0 })
            return
        }

        const id = decodeURIComponent(location.hash.slice(1))
        document.getElementById(id)?.scrollIntoView()
    }, [location])
}
