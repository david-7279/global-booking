import { BusinessApi } from '@/src/(services)/business/api/business.api.ts'
import type {
    BookingServiceRequest,
    BusinessGateway,
    BusinessRequest,
    EstablishmentRequest,
    ResourceRequest,
} from '@/src/(services)/business/types/business.types.ts'

export class BusinessDomainService {
    private readonly gateway: BusinessGateway

    constructor(gateway: BusinessGateway = BusinessApi) {
        this.gateway = gateway
    }

    listBusinesses = () => this.gateway.listBusinesses()
    createBusiness = (payload: BusinessRequest) => this.gateway.createBusiness(payload)
    getBusiness = (id: string) => this.gateway.getBusiness(id)
    updateBusiness = (id: string, payload: BusinessRequest) =>
        this.gateway.updateBusiness(id, payload)
    deleteBusiness = (id: string) => this.gateway.deleteBusiness(id)
    listEstablishments = (businessId: string) => this.gateway.listEstablishments(businessId)
    createEstablishment = (businessId: string, payload: EstablishmentRequest) =>
        this.gateway.createEstablishment(businessId, payload)
    getEstablishment = (id: string) => this.gateway.getEstablishment(id)
    updateEstablishment = (id: string, payload: EstablishmentRequest) =>
        this.gateway.updateEstablishment(id, payload)
    deleteEstablishment = (id: string) => this.gateway.deleteEstablishment(id)
    listBookingServices = (establishmentId: string) =>
        this.gateway.listBookingServices(establishmentId)
    createBookingService = (establishmentId: string, payload: BookingServiceRequest) =>
        this.gateway.createBookingService(establishmentId, payload)
    getBookingService = (id: string) => this.gateway.getBookingService(id)
    updateBookingService = (id: string, payload: BookingServiceRequest) =>
        this.gateway.updateBookingService(id, payload)
    deleteBookingService = (id: string) => this.gateway.deleteBookingService(id)
    listResources = (establishmentId: string) => this.gateway.listResources(establishmentId)
    createResource = (establishmentId: string, payload: ResourceRequest) =>
        this.gateway.createResource(establishmentId, payload)
    getResource = (id: string) => this.gateway.getResource(id)
    updateResource = (id: string, payload: ResourceRequest) =>
        this.gateway.updateResource(id, payload)
    deleteResource = (id: string) => this.gateway.deleteResource(id)
}

export const businessDomainService = new BusinessDomainService()
