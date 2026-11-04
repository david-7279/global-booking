// src/lib/query/query-client.ts

import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/src/lib/api/api-errors.ts'

const STALE_TIME_MS = 1000 * 60 // 1 minute
const MAX_QUERY_RETRIES = 1
const NON_RETRYABLE_STATUSES = [400, 401, 403, 404, 409]

/** Retry only transient failures — never business-rule rejections. */
function shouldRetry(failureCount: number, error: unknown): boolean {
    if (error instanceof ApiError && NON_RETRYABLE_STATUSES.includes(error.status)) {
        return false
    }
    return failureCount < MAX_QUERY_RETRIES
}

/** Exponential backoff: 1s, 2s, 4s… */
function retryDelay(attemptIndex: number): number {
    return 2 ** attemptIndex * 1000
}

export function createQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: STALE_TIME_MS,
                retry: shouldRetry,
                retryDelay,
            },
            mutations: {
                retry: 0,
                retryDelay,
            },
        },
    })
}

/** The app's shared client — main.tsx passes this to QueryClientProvider. */
export const queryClient = createQueryClient()
