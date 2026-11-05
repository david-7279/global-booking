export const BOOKING_STATUSES = [
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'REJECTED',
] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export type CreateBookingRequest = {
    businessId: string
    establishmentId: string
    bookingServiceId: string
    resourceId: string
    startAt: string
    endAt: string
    notes?: string
}

export type TransitionRequest = {
    reason?: string
}

export type AvailabilityRequest = {
    establishmentId: string
    bookingServiceId: string
    resourceId: string
    from: string
    to: string
}

export type BookingFilter = {
    status?: BookingStatus
    establishmentId?: string
    bookingServiceId?: string
    resourceId?: string
    from?: string
    to?: string
    page?: number
    size?: number
    sort?: string
}

export type BookingResponse = {
    id: string
    userId: string
    businessId: string
    establishmentId: string
    bookingServiceId: string
    resourceId: string
    startAt: string
    endAt: string
    status: BookingStatus
    notes: string | null
    createdAt: string
    updatedAt: string
    cancelledAt: string | null
}

export type BookingPage = {
    content: BookingResponse[]
    number: number
    size: number
    totalElements: number
    totalPages: number
    first: boolean
    last: boolean
}

export type AvailabilityResponse = {
    startAt: string
    endAt: string
    available: boolean
}

export interface BookingGateway {
    create(request: CreateBookingRequest, idempotencyKey: string): Promise<BookingResponse>
    list(filter?: BookingFilter): Promise<BookingPage>
    get(id: string): Promise<BookingResponse>
    cancel(id: string, request?: TransitionRequest): Promise<BookingResponse>
    confirm(id: string, request?: TransitionRequest): Promise<BookingResponse>
    reject(id: string, request?: TransitionRequest): Promise<BookingResponse>
    complete(id: string, request?: TransitionRequest): Promise<BookingResponse>
    availability(request: AvailabilityRequest): Promise<AvailabilityResponse>
}
