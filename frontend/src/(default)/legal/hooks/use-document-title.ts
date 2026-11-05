// src/(default)/legal/hooks/use-document-title.ts

import { useEffect } from 'react'

/** Sets the browser tab title while the page is mounted and restores it afterwards. */
export function useDocumentTitle(title: string): void {
    useEffect(() => {
        const previousTitle = document.title
        document.title = title

        return () => {
            document.title = previousTitle
        }
    }, [title])
}
