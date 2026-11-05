import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingApplicationService } from '@/src/(services)/booking/services/booking-application.service.ts'
import type {
    AvailabilityRequest,
    BookingFilter,
    CreateBookingRequest,
    TransitionRequest,
} from '@/src/(services)/booking/types/booking.types.ts'

export const bookingKeys = {
    all: ['booking'] as const,
    list: (filter: BookingFilter) => [...bookingKeys.all, 'list', filter] as const,
    detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
    availability: (request: AvailabilityRequest) =>
        [...bookingKeys.all, 'availability', request] as const,
}

export function useBookings(filter: BookingFilter) {
    return useQuery({
        queryKey: bookingKeys.list(filter),
        queryFn: () => bookingApplicationService.list(filter),
    })
}

export function useBookingMutations() {
    const queryClient = useQueryClient()
    const refresh = () => queryClient.invalidateQueries({ queryKey: bookingKeys.all })
    const create = useMutation({
        mutationFn: ({
            request,
            idempotencyKey,
        }: {
            request: CreateBookingRequest
            idempotencyKey: string
        }) => bookingApplicationService.create(request, idempotencyKey),
        onSuccess: refresh,
    })
    const transition = useMutation({
        mutationFn: ({
            action,
            id,
            request,
        }: {
            action: 'cancel' | 'confirm' | 'reject' | 'complete'
            id: string
            request?: TransitionRequest
        }) => bookingApplicationService[action](id, request),
        onSuccess: refresh,
    })
    return { create, transition }
}

export function useBooking(id: string | null) {
    return useQuery({
        queryKey: bookingKeys.detail(id ?? 'none'),
        queryFn: () => bookingApplicationService.get(id as string),
        enabled: Boolean(id),
    })
}

export function useAvailability(request: AvailabilityRequest | null) {
    return useQuery({
        queryKey: bookingKeys.availability(
            request ?? {
                establishmentId: 'none',
                bookingServiceId: 'none',
                resourceId: 'none',
                from: '',
                to: '',
            },
        ),
        queryFn: () => bookingApplicationService.availability(request as AvailabilityRequest),
        enabled: Boolean(request),
    })
}
