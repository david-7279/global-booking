import axios from 'axios'
import { normalizeAuthenticationError } from '@/src/(default)/authentication/api/authentication.errors.ts'
import { getStoredAuthToken } from '@/src/(default)/authentication/storage/authentication.storage.ts'
import type {
    AuthenticatedUser,
    AuthenticationGateway,
    AuthenticationResponse,
    AuthSession,
} from '@/src/(default)/authentication/types/authentication.types.ts'
import { http } from '@/src/lib/api/api-client.ts'

export type { AuthenticationGateway } from '@/src/(default)/authentication/types/authentication.types.ts'

// A separate instance retains the backend error body before the global interceptor discards it.
const authenticationHttp = axios.create({
    baseURL: http.defaults.baseURL,
    timeout: http.defaults.timeout,
})

async function request<T>(operation: () => Promise<T>): Promise<T> {
    try {
        return await operation()
    } catch (error) {
        throw normalizeAuthenticationError(error)
    }
}

export const AuthenticationApi: AuthenticationGateway = {
    register: (payload) =>
        request(async () => {
            const res = await authenticationHttp.post<AuthenticationResponse>('/auth/register', {
                username: payload.name,
                email: payload.email,
                password: payload.password,
            })
            return toSession(res.data)
        }),
    login: (payload) =>
        request(async () => {
            const res = await authenticationHttp.post<AuthenticationResponse>(
                '/auth/login',
                payload,
            )
            return toSession(res.data)
        }),
    me: (accessToken) =>
        request(async () => {
            const token = accessToken ?? getStoredAuthToken()
            const res = await authenticationHttp.get<AuthenticationResponse['user']>('/auth/me', {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            })
            return toUser(res.data)
        }),
    refresh: (refreshToken) =>
        request(async () => {
            const res = await authenticationHttp.post<AuthenticationResponse>('/auth/refresh', {
                refreshToken,
            })
            return toSession(res.data)
        }),
    logout: (refreshToken) =>
        request(async () => {
            await authenticationHttp.post<void>('/auth/logout', { refreshToken })
        }),
}

function toSession(response: AuthenticationResponse): AuthSession {
    return {
        user: toUser(response.user),
        token: response.tokens,
    }
}

function toUser(user: AuthenticationResponse['user']): AuthenticatedUser {
    return {
        publicId: user.publicId,
        name: user.username,
        email: user.email,
        role: user.role,
        teamId: null,
    }
}
