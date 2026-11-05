import { BookingApi } from '@/src/(services)/booking/api/booking.api.ts'
import type {
    AvailabilityRequest,
    BookingFilter,
    BookingGateway,
    CreateBookingRequest,
    TransitionRequest,
} from '@/src/(services)/booking/types/booking.types.ts'

export class BookingApplicationService {
    private readonly gateway: BookingGateway

    constructor(gateway: BookingGateway = BookingApi) {
        this.gateway = gateway
    }

    create = (request: CreateBookingRequest, idempotencyKey: string) =>
        this.gateway.create(request, idempotencyKey)
    list = (filter?: BookingFilter) => this.gateway.list(filter)
    get = (id: string) => this.gateway.get(id)
    cancel = (id: string, request?: TransitionRequest) => this.gateway.cancel(id, request)
    confirm = (id: string, request?: TransitionRequest) => this.gateway.confirm(id, request)
    reject = (id: string, request?: TransitionRequest) => this.gateway.reject(id, request)
    complete = (id: string, request?: TransitionRequest) => this.gateway.complete(id, request)
    availability = (request: AvailabilityRequest) => this.gateway.availability(request)
}

export const bookingApplicationService = new BookingApplicationService()
