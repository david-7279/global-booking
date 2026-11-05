import { type ReactNode, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { AuthenticationApi } from '@/src/(default)/authentication/api/authentication.api.ts'
import { AuthenticationContext } from '@/src/(default)/authentication/context/authentication.context.ts'
import { installAuthenticationInterceptor } from '@/src/(default)/authentication/services/authentication-http.service.ts'
import { AuthenticationSessionService } from '@/src/(default)/authentication/services/authentication-session.service.ts'
import { authenticationStorage } from '@/src/(default)/authentication/storage/authentication.storage.ts'
import type {
    AuthenticationGateway,
    AuthenticationStorage,
} from '@/src/(default)/authentication/types/authentication.types.ts'
import { toast } from '@/src/components/ui/toast.tsx'
import { http, setTokenProvider } from '@/src/lib/api/api-client.ts'

export type AuthProviderProps = {
    children: ReactNode
    /** Stable dependencies; pass fakes to exercise the services/provider in tests. */
    gateway?: AuthenticationGateway
    storage?: AuthenticationStorage
}

export function AuthProvider({
    children,
    gateway = AuthenticationApi,
    storage = authenticationStorage,
}: AuthProviderProps) {
    // Created once per mounted provider; StrictMode's effect replay shares the same services.
    const [service] = useState(() => new AuthenticationSessionService(gateway, storage))
    const snapshot = useSyncExternalStore(
        service.subscribe,
        service.getSnapshot,
        service.getSnapshot,
    )

    useEffect(() => {
        setTokenProvider({ get: service.getAccessToken, onUnauthorized: service.onUnauthorized })
        const ejectInterceptor = installAuthenticationInterceptor(http, service)
        service.activate()
        void service.restore()
        return () => {
            service.deactivate()
            ejectInterceptor()
            setTokenProvider({ get: () => null, onUnauthorized: () => {} })
        }
    }, [service])

    useEffect(() => {
        // Logout reports directly, so its warning cannot be lost to a subsequent login render.
        if (snapshot.error && !snapshot.error.startsWith('A sessão foi terminada')) {
            toast.add({ title: 'Sessão', description: snapshot.error, type: 'error' })
        }
    }, [snapshot.error])

    const value = useMemo(
        () => ({
            ...snapshot,
            login: service.login,
            register: service.register,
            retryRestore: service.retryRestore,
            logout: async () => {
                if (!(await service.logout())) {
                    toast.add({
                        title: 'Saída local efetuada',
                        description:
                            'Não foi possível confirmar a revogação da sessão no servidor.',
                        type: 'error',
                    })
                }
            },
        }),
        [service, snapshot],
    )

    return (
        <AuthenticationContext.Provider value={value}>
            <span className="sr-only" role="status" aria-live="polite">
                {snapshot.status === 'restoring'
                    ? 'A verificar a sessão.'
                    : snapshot.isRefreshing
                      ? 'A renovar a sessão.'
                      : ''}
            </span>
            {snapshot.error && (
                <span className="sr-only" role="alert">
                    {snapshot.error}
                </span>
            )}
            {children}
        </AuthenticationContext.Provider>
    )
}
