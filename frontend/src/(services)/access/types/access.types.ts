import type { UserRole } from '@/src/(default)/authentication/types/authentication.types.ts'

export type ServiceArea = 'booking' | 'business'

export type AccessRule = {
    area: ServiceArea
    roles: readonly UserRole[]
}

export const SERVICE_ACCESS_RULES: Record<ServiceArea, AccessRule> = {
    booking: {
        area: 'booking',
        roles: ['USER', 'ADMIN'],
    },
    business: {
        area: 'business',
        roles: ['BUSINESS_OWNER', 'ADMIN'],
    },
}
