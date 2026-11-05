import type {
    AvailabilityResponse,
    BookingFilter,
    BookingGateway,
    BookingPage,
    BookingResponse,
    TransitionRequest,
} from '@/src/(services)/booking/types/booking.types.ts'
import { http } from '@/src/lib/api/api-client.ts'

export const BookingApi: BookingGateway = {
    create: async (request, idempotencyKey) =>
        (
            await http.post<BookingResponse>('/bookings', request, {
                headers: { 'Idempotency-Key': idempotencyKey },
            })
        ).data,
    list: async (filter = {}) =>
        (await http.get<BookingPage>('/bookings', { params: compactFilter(filter) })).data,
    get: async (id) => (await http.get<BookingResponse>(`/bookings/${id}`)).data,
    cancel: async (id, request) => transition(id, 'cancel', request),
    confirm: async (id, request) => transition(id, 'confirm', request),
    reject: async (id, request) => transition(id, 'reject', request),
    complete: async (id, request) => transition(id, 'complete', request),
    availability: async (request) =>
        (await http.get<AvailabilityResponse>('/availability', { params: request })).data,
}

function compactFilter(filter: BookingFilter): Record<string, string | number> {
    const params: Record<string, string | number> = {}
    if (filter.status) params.status = filter.status
    if (filter.establishmentId) params.establishmentId = filter.establishmentId
    if (filter.bookingServiceId) params.bookingServiceId = filter.bookingServiceId
    if (filter.resourceId) params.resourceId = filter.resourceId
    if (filter.from) params.from = filter.from
    if (filter.to) params.to = filter.to
    if (filter.page !== undefined) params.page = filter.page
    if (filter.size !== undefined) params.size = filter.size
    if (filter.sort) params.sort = filter.sort
    return params
}

async function transition(
    id: string,
    action: 'cancel' | 'confirm' | 'reject' | 'complete',
    request?: TransitionRequest,
): Promise<BookingResponse> {
    return (await http.post<BookingResponse>(`/bookings/${id}/${action}`, request)).data
}
