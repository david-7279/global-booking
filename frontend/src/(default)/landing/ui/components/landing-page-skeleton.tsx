// src/(default)/landing/ui/components/landing-page-skeleton.tsx

import { Skeleton } from '@/src/components/ui/skeleton.tsx'

/** Language-agnostic placeholder shown while the locale bundle loads. */
export function LandingPageSkeleton() {
    return (
        <div aria-busy="true" className="mx-auto w-full max-w-6xl flex-1 px-6 py-24 lg:px-8">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="mt-8 h-14 w-full max-w-2xl" />
            <Skeleton className="mt-4 h-14 w-full max-w-md" />
            <Skeleton className="mt-8 h-5 w-full max-w-xl" />
        </div>
    )
}
