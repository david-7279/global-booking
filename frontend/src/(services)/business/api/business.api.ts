import type {
    BookingServiceResponse,
    BusinessGateway,
    BusinessResponse,
    EstablishmentResponse,
    ResourceResponse,
} from '@/src/(services)/business/types/business.types.ts'
import { http } from '@/src/lib/api/api-client.ts'

export const BusinessApi: BusinessGateway = {
    listBusinesses: async () => (await http.get<BusinessResponse[]>('/businesses')).data,
    createBusiness: async (payload) =>
        (await http.post<BusinessResponse>('/businesses', payload)).data,
    getBusiness: async (id) => (await http.get<BusinessResponse>(`/businesses/${id}`)).data,
    updateBusiness: async (id, payload) =>
        (await http.put<BusinessResponse>(`/businesses/${id}`, payload)).data,
    deleteBusiness: async (id) => {
        await http.delete(`/businesses/${id}`)
    },
    listEstablishments: async (businessId) =>
        (await http.get<EstablishmentResponse[]>(`/businesses/${businessId}/establishments`)).data,
    createEstablishment: async (businessId, payload) =>
        (
            await http.post<EstablishmentResponse>(
                `/businesses/${businessId}/establishments`,
                payload,
            )
        ).data,
    getEstablishment: async (id) =>
        (await http.get<EstablishmentResponse>(`/establishments/${id}`)).data,
    updateEstablishment: async (id, payload) =>
        (await http.put<EstablishmentResponse>(`/establishments/${id}`, payload)).data,
    deleteEstablishment: async (id) => {
        await http.delete(`/establishments/${id}`)
    },
    listBookingServices: async (establishmentId) =>
        (await http.get<BookingServiceResponse[]>(`/establishments/${establishmentId}/services`))
            .data,
    createBookingService: async (establishmentId, payload) =>
        (
            await http.post<BookingServiceResponse>(
                `/establishments/${establishmentId}/services`,
                payload,
            )
        ).data,
    getBookingService: async (id) =>
        (await http.get<BookingServiceResponse>(`/services/${id}`)).data,
    updateBookingService: async (id, payload) =>
        (await http.put<BookingServiceResponse>(`/services/${id}`, payload)).data,
    deleteBookingService: async (id) => {
        await http.delete(`/services/${id}`)
    },
    listResources: async (establishmentId) =>
        (await http.get<ResourceResponse[]>(`/establishments/${establishmentId}/resources`)).data,
    createResource: async (establishmentId, payload) =>
        (await http.post<ResourceResponse>(`/establishments/${establishmentId}/resources`, payload))
            .data,
    getResource: async (id) => (await http.get<ResourceResponse>(`/resources/${id}`)).data,
    updateResource: async (id, payload) =>
        (await http.put<ResourceResponse>(`/resources/${id}`, payload)).data,
    deleteResource: async (id) => {
        await http.delete(`/resources/${id}`)
    },
}
