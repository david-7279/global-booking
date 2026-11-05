import { useAuthenticatedUser } from '@/src/(default)/authentication/hooks/use-authenticated-user.ts'
import {
    SERVICE_ACCESS_RULES,
    type ServiceArea,
} from '@/src/(services)/access/types/access.types.ts'

export function useRoleAccess(area: ServiceArea) {
    const user = useAuthenticatedUser()
    const rule = SERVICE_ACCESS_RULES[area]

    return {
        area,
        user,
        canAccess: rule.roles.includes(user.role),
        allowedRoles: rule.roles,
    }
}
