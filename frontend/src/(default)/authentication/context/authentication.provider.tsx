// src/(features)/authentication/context/authentication.provider.tsx

import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { AuthenticationApi } from '@/src/(default)/authentication/api/authentication.api.ts'
import { AuthenticationContext } from '@/src/(default)/authentication/context/authentication.context.ts'
import {
    clearStoredAuthToken,
    getStoredAuthToken,
    setStoredAuthToken,
} from '@/src/(default)/authentication/storage/authentication.storage.ts'
import type {
    AuthenticatedUser,
    AuthenticationStatus,
    AuthSession,
    LoginPayload,
    RegisterPayload,
} from '@/src/(default)/authentication/types/authentication.types.ts'
import { setTokenProvider } from '@/src/lib/api/api-client.ts'

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [status, setStatus] = useState<AuthenticationStatus>('restoring')
    const [token, setToken] = useState<string | null>(() => getStoredAuthToken())
    const [user, setUser] = useState<AuthenticatedUser | null>(null)

    const isAuthenticated = status === 'authenticated' && !!user && !!token

    // Session restore
    useEffect(() => {
        if (!token) {
            setStatus('unauthenticated')
            return
        }

        let cancelled = false

        ;(async () => {
            try {
                const user = await AuthenticationApi.me()
                if (!cancelled) {
                    setUser(user)
                    setStatus('authenticated')
                }
            } catch {
                // Expired/invalid token
                if (!cancelled) {
                    clearStoredAuthToken()
                    setToken(null)
                    setUser(null)
                    setStatus('unauthenticated')
                }
            }
        })()

        return () => {
            cancelled = true
        }
    }, [token])

    const applySession = useCallback((session: AuthSession) => {
        setStoredAuthToken(session.token.accessToken)
        setToken(session.token.accessToken)
        setUser(session.user)
        setStatus('authenticated')
    }, [])

    const onAuthFailure = useCallback(() => {
        clearStoredAuthToken()
        setToken(null)
        setUser(null)
        setStatus('unauthenticated')
    }, [])

    useEffect(() => {
        setTokenProvider({
            get: () => token,
            onUnauthorized: onAuthFailure,
        })
    }, [token, onAuthFailure])

    const login = useCallback(
        async (payload: LoginPayload) => {
            setStatus('loading')
            try {
                applySession(await AuthenticationApi.login(payload))
            } catch (error) {
                onAuthFailure()
                throw error
            }
        },
        [applySession, onAuthFailure],
    )

    const register = useCallback(
        async (payload: RegisterPayload) => {
            setStatus('loading')
            try {
                applySession(await AuthenticationApi.register(payload))
            } catch (error) {
                onAuthFailure()
                throw error
            }
        },
        [applySession, onAuthFailure],
    )

    const logout = useCallback(async () => {
        clearStoredAuthToken()
        setUser(null)
        setToken(null)
        setStatus('unauthenticated')
    }, [])

    const value = useMemo(
        () => ({ status, user, token, isAuthenticated, login, register, logout }),
        [status, user, token, isAuthenticated, login, register, logout],
    )

    return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>
}
