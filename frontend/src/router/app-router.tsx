import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { AppLayout } from '@/src/(default)/layout.tsx'
import NotFoundPage from '@/src/not-found.tsx'
import { GuestRouter } from '@/src/router/guest-router.tsx'
import { paths } from '@/src/router/paths.ts'
import { ProtectedRouter } from '@/src/router/protected-router.tsx'

const LandingPage = lazy(() => import('@/src/(default)/landing/ui/page.tsx'))
const AuthenticationPage = lazy(() => import('@/src/(default)/authentication/ui/page.tsx'))
const PrivacyPage = lazy(() => import('@/src/(default)/legal/ui/privacy/page.tsx'))
const TermsPage = lazy(() => import('@/src/(default)/legal/ui/terms/page.tsx'))
const WorkspacePage = lazy(() => import('@/src/(default)/workspace/ui/page.tsx'))

function RouteLoading() {
    return (
        <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
            A carregar…
        </div>
    )
}

export default function AppRouter() {
    return (
        <Suspense fallback={<RouteLoading />}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path={paths.public.root} element={<LandingPage />} />
                    <Route path={paths.public.terms} element={<TermsPage />} />
                    <Route path={paths.public.privacy} element={<PrivacyPage />} />
                    <Route element={<GuestRouter />}>
                        <Route path={paths.auth} element={<AuthenticationPage />} />
                    </Route>
                    <Route element={<ProtectedRouter />}>
                        <Route path={paths.workspace.root} element={<WorkspacePage />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    )
}
