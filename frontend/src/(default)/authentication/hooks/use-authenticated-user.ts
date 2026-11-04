// src/(features)/authentication/hooks/use-authenticated-user.ts

import { useAuthentication } from '@/src/(default)/authentication/hooks/use-authentication.ts'
import type { AuthenticatedUser } from '@/src/(default)/authentication/types/authentication.types.ts'

/**
 * Returns the authenticated user, guaranteed non-null — for components
 * rendered inside <ProtectedRouter /> (or otherwise behind the auth gate).
 *
 * Throws UnauthorizedError (→ 401 behavior via the error boundary) when
 * the session is absent. For gates/route components that must HANDLE the
 * unauthenticated state, use useAuthentication() instead.
 */
export function useAuthenticatedUser(): AuthenticatedUser {
    const { user } = useAuthentication()

    if (!user) {
        throw new Error('Authentication required')
    }

    return user
}
