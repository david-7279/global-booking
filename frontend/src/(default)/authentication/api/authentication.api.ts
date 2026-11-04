// src/(default)/authentication/api/authentication.api.ts

import type {
    AuthenticatedUser,
    AuthenticationResponse,
    AuthSession,
    LoginPayload,
    RegisterPayload,
} from '@/src/(default)/authentication/types/authentication.types.ts'
import { http } from '@/src/lib/api/api-client.ts'

export const AuthenticationApi = {
    /**
     * Register a new user
     * @param payload The registration payload
     * @returns The authentication session
     */
    register: async (payload: RegisterPayload): Promise<AuthSession> => {
        const res = await http.post<AuthenticationResponse>('/auth/register', {
            username: payload.name,
            email: payload.email,
            password: payload.password,
        })
        return toSession(res.data)
    },

    /**
     * Login a user
     * @param payload The login payload
     * @returns The authentication response
     */
    login: async (payload: LoginPayload): Promise<AuthSession> => {
        const res = await http.post<AuthenticationResponse>('/auth/login', payload)
        return toSession(res.data)
    },

    /**
     * Get the current user
     * @returns The authentication response
     */
    me: async (): Promise<AuthenticatedUser> => {
        const res = await http.get<AuthenticationResponse['user']>('/auth/me')
        return toUser(res.data)
    },
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
