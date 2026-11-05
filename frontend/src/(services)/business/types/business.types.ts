export const BUSINESS_STATUSES = ['ACTIVE', 'INACTIVE', 'DELETED'] as const
export type BusinessStatus = (typeof BUSINESS_STATUSES)[number]

export type BusinessRequest = {
    name: string
    description?: string
}

export type BusinessResponse = {
    id: string
    ownerUserId: string
    name: string
    description: string | null
    status: string
    createdAt: string
    updatedAt: string
}

export type EstablishmentRequest = {
    name: string
    address?: string
    timezone: string
}

export type EstablishmentResponse = {
    id: string
    businessId: string
    name: string
    address: string | null
    timezone: string
    status: string
    createdAt: string
    updatedAt: string
}

export type BookingServiceRequest = {
    name: string
    description?: string
    durationMinutes: number
    priceCents: number
    currency: string
}

export type BookingServiceResponse = {
    id: string
    establishmentId: string
    name: string
    description: string | null
    durationMinutes: number
    priceCents: number
    currency: string
    status: string
    createdAt: string
    updatedAt: string
}

export type ResourceRequest = {
    name: string
    resourceType: string
    capacity: number
}

export type ResourceResponse = {
    id: string
    establishmentId: string
    name: string
    resourceType: string
    capacity: number
    status: string
    createdAt: string
    updatedAt: string
}

export interface BusinessGateway {
    listBusinesses(): Promise<BusinessResponse[]>
    createBusiness(payload: BusinessRequest): Promise<BusinessResponse>
    getBusiness(id: string): Promise<BusinessResponse>
    updateBusiness(id: string, payload: BusinessRequest): Promise<BusinessResponse>
    deleteBusiness(id: string): Promise<void>
    listEstablishments(businessId: string): Promise<EstablishmentResponse[]>
    createEstablishment(
        businessId: string,
        payload: EstablishmentRequest,
    ): Promise<EstablishmentResponse>
    getEstablishment(id: string): Promise<EstablishmentResponse>
    updateEstablishment(id: string, payload: EstablishmentRequest): Promise<EstablishmentResponse>
    deleteEstablishment(id: string): Promise<void>
    listBookingServices(establishmentId: string): Promise<BookingServiceResponse[]>
    createBookingService(
        establishmentId: string,
        payload: BookingServiceRequest,
    ): Promise<BookingServiceResponse>
    getBookingService(id: string): Promise<BookingServiceResponse>
    updateBookingService(
        id: string,
        payload: BookingServiceRequest,
    ): Promise<BookingServiceResponse>
    deleteBookingService(id: string): Promise<void>
    listResources(establishmentId: string): Promise<ResourceResponse[]>
    createResource(establishmentId: string, payload: ResourceRequest): Promise<ResourceResponse>
    getResource(id: string): Promise<ResourceResponse>
    updateResource(id: string, payload: ResourceRequest): Promise<ResourceResponse>
    deleteResource(id: string): Promise<void>
}
