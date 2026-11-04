// src/router/guest-router.tsx

import { Navigate, Outlet } from 'react-router'
import { useAuthentication } from '@/src/(default)/authentication/hooks/use-authentication.ts'
import { AuthGateLoading } from '@/src/components/layout/auth-gate-loading.tsx'
import { paths } from '@/src/router/paths.ts'

/**
 * Route gate for unauthenticated-only pages (the auth page).
 * - Session resolving (restoring/loading) → wait — never redirect mid-check
 * - Already authenticated → the app root
 * - Otherwise → render the guest route tree
 */
export function GuestRouter() {
    const { status, isAuthenticated } = useAuthentication()

    if (status === 'restoring' || status === 'loading') {
        return <AuthGateLoading />
    }

    if (isAuthenticated) {
        return <Navigate to={paths.workspace.root} replace />
    }

    return <Outlet />
}
