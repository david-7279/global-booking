// src/(default)/legal/ui/components/legal-page-skeleton.tsx

import { Skeleton } from '@/src/components/ui/skeleton.tsx'

/**
 * Language-agnostic placeholder shown while the locale bundle loads. It carries no
 * text because the language of the page is not known until the bundle arrives.
 */
export function LegalPageSkeleton() {
    return (
        <div aria-busy="true" className="mx-auto w-full max-w-6xl flex-1 px-6 py-20 lg:px-8">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-6 h-12 w-full max-w-xl" />
            <Skeleton className="mt-6 h-5 w-full max-w-2xl" />
            <Skeleton className="mt-3 h-5 w-full max-w-lg" />
        </div>
    )
}
