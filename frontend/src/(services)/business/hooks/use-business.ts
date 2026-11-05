import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { businessDomainService } from '@/src/(services)/business/services/business-domain.service.ts'
import type {
    BookingServiceRequest,
    BusinessRequest,
    EstablishmentRequest,
    ResourceRequest,
} from '@/src/(services)/business/types/business.types.ts'

export const businessKeys = {
    all: ['business'] as const,
    list: () => [...businessKeys.all, 'list'] as const,
    establishments: (businessId: string) =>
        [...businessKeys.all, 'establishments', businessId] as const,
    services: (establishmentId: string) =>
        [...businessKeys.all, 'services', establishmentId] as const,
    resources: (establishmentId: string) =>
        [...businessKeys.all, 'resources', establishmentId] as const,
}

export function useBusinesses() {
    return useQuery({
        queryKey: businessKeys.list(),
        queryFn: businessDomainService.listBusinesses,
    })
}

export function useBusinessMutations() {
    const queryClient = useQueryClient()
    const refresh = () => queryClient.invalidateQueries({ queryKey: businessKeys.all })
    const create = useMutation({
        mutationFn: (payload: BusinessRequest) => businessDomainService.createBusiness(payload),
        onSuccess: refresh,
    })
    const update = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: BusinessRequest }) =>
            businessDomainService.updateBusiness(id, payload),
        onSuccess: refresh,
    })
    const remove = useMutation({
        mutationFn: (id: string) => businessDomainService.deleteBusiness(id),
        onSuccess: refresh,
    })
    return { create, update, remove }
}

export function useEstablishments(businessId: string | null) {
    return useQuery({
        queryKey: businessKeys.establishments(businessId ?? 'none'),
        queryFn: () => businessDomainService.listEstablishments(businessId as string),
        enabled: Boolean(businessId),
    })
}

export function useEstablishmentMutations(businessId: string) {
    const queryClient = useQueryClient()
    const refresh = () =>
        queryClient.invalidateQueries({ queryKey: businessKeys.establishments(businessId) })
    const create = useMutation({
        mutationFn: (payload: EstablishmentRequest) =>
            businessDomainService.createEstablishment(businessId, payload),
        onSuccess: refresh,
    })
    const update = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: EstablishmentRequest }) =>
            businessDomainService.updateEstablishment(id, payload),
        onSuccess: refresh,
    })
    const remove = useMutation({
        mutationFn: (id: string) => businessDomainService.deleteEstablishment(id),
        onSuccess: refresh,
    })
    return { create, update, remove }
}

export function useBookingServices(establishmentId: string | null) {
    return useQuery({
        queryKey: businessKeys.services(establishmentId ?? 'none'),
        queryFn: () => businessDomainService.listBookingServices(establishmentId as string),
        enabled: Boolean(establishmentId),
    })
}

export function useBookingServiceMutations(establishmentId: string) {
    const queryClient = useQueryClient()
    const refresh = () =>
        queryClient.invalidateQueries({ queryKey: businessKeys.services(establishmentId) })
    const create = useMutation({
        mutationFn: (payload: BookingServiceRequest) =>
            businessDomainService.createBookingService(establishmentId, payload),
        onSuccess: refresh,
    })
    const update = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: BookingServiceRequest }) =>
            businessDomainService.updateBookingService(id, payload),
        onSuccess: refresh,
    })
    const remove = useMutation({
        mutationFn: (id: string) => businessDomainService.deleteBookingService(id),
        onSuccess: refresh,
    })
    return { create, update, remove }
}

export function useResources(establishmentId: string | null) {
    return useQuery({
        queryKey: businessKeys.resources(establishmentId ?? 'none'),
        queryFn: () => businessDomainService.listResources(establishmentId as string),
        enabled: Boolean(establishmentId),
    })
}

export function useResourceMutations(establishmentId: string) {
    const queryClient = useQueryClient()
    const refresh = () =>
        queryClient.invalidateQueries({ queryKey: businessKeys.resources(establishmentId) })
    const create = useMutation({
        mutationFn: (payload: ResourceRequest) =>
            businessDomainService.createResource(establishmentId, payload),
        onSuccess: refresh,
    })
    const update = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: ResourceRequest }) =>
            businessDomainService.updateResource(id, payload),
        onSuccess: refresh,
    })
    const remove = useMutation({
        mutationFn: (id: string) => businessDomainService.deleteResource(id),
        onSuccess: refresh,
    })
    return { create, update, remove }
}
