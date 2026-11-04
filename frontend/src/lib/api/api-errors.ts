// src/lib/api/api-errors.ts

import type { ApiFieldErrors } from './types/api.types.js'

/** The single error type the UI ever handles. */
export class ApiError extends Error {
    public readonly status: number
    public readonly fields?: ApiFieldErrors

    constructor(message: string, status: number, fields?: ApiFieldErrors) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.fields = fields
    }

    get isValidationError(): boolean {
        return this.status === 400 && this.fields !== undefined
    }

    get isUnauthorized(): boolean {
        return this.status === 401
    }

    get isForbidden(): boolean {
        return this.status === 403
    }

    get isConflict(): boolean {
        return this.status === 409
    }
}

/** Type-safe check that works even with duplicated module instances. */
export function isApiError(error: unknown): error is ApiError {
    return (
        error instanceof ApiError ||
        (error instanceof Error && (error as { isApiError?: boolean }).isApiError === true)
    )
}
