// src/router/protected-router.tsx

import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthentication } from '@/src/(default)/authentication/hooks/use-authentication.ts'
import { AuthGateLoading } from '@/src/components/layout/auth-gate-loading.tsx'
import { paths } from '@/src/router/paths.ts'

/**
 * Route gate for authenticated-only pages (planner: dashboard, requests,
 * calendar, balances, approvals).
 * - Session resolving (restoring/loading) → wait — never redirect mid-check
 * - Unauthenticated → login, remembering the destination (the auth flow
 *   reads location.state.from after success)
 * - Otherwise → render the protected route tree
 */
export function ProtectedRouter() {
    const { status, isAuthenticated } = useAuthentication()
    const location = useLocation()

    if (status === 'restoring' || status === 'loading') {
        return <AuthGateLoading />
    }

    if (!isAuthenticated) {
        return <Navigate to={paths.auth} replace state={{ from: location }} />
    }

    return <Outlet />
}
