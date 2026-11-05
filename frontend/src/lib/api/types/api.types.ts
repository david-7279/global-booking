// src/lib/api/types/api.types.ts

// ── Envelopes ──────────────────────────────────────────────────────────────

/** Success envelope — every backend response is wrapped in this. */
export type ApiSuccess<T> = {
    success: true
    message: string
    data: T
}

export type ApiFieldErrors = Record<string, string[]>

/** Failure envelope — 4xx/5xx bodies, normalized into ApiError by the client. */
export type ApiErrorBody = {
    success: false
    error: {
        message: string
        /** Per-field validation detail — present on 400 validation failures. */
        fields?: ApiFieldErrors
    }
}

// ── Pagination ─────────────────────────────────────────────────────────────

export type PaginationMeta = {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
}

/** Payload of every list endpoint. */
export type PaginatedData<T> = {
    items: T[]
    pagination: PaginationMeta
}

// ── Domain: authentication ─────────────────────────────────────────────────

export type UserRole = '' | ''

export type AuthSession = {
    user: {
        id: number
        publicId: string
        name: string
        email: string
        role: UserRole
    }
    token: {
        accessToken: string
    }
}

// ── Domain: planner dashboard ──────────────────────────────────────────────

export type BalanceItem = {
    leaveTypePublicId: string
    leaveTypeName: string
    remaining: number
    usedDays: number
    allowanceDays: number
}

export type BalancesData = {
    items: BalanceItem[]
}

export type LeaveRequest = {
    publicId: string
    leaveTypeName: string
    startsAt: string
    endsAt: string
    workingDays: number
    reviewerPublicId?: string | null
}

export type CalendarEntry = {
    publicId: string
    userName: string
    leaveTypeName: string
    startsAt: string
    endsAt: string
}
