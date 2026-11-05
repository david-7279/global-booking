export const USER_ROLES = ['BUSINESS_OWNER', 'USER', 'ADMIN'] as const
export type UserRole = (typeof USER_ROLES)[number]

/** `loading` is retained for existing consumers; submissions do not enter that state. */
export type AuthenticationStatus = 'restoring' | 'loading' | 'authenticated' | 'unauthenticated'

export type LoginPayload = {
    email: string
    password: string
}
export type RegisterPayload = {
    name: string
    email: string
    password: string
}
export type AuthToken = {
    accessToken: string
    refreshToken?: string
    tokenType?: string
    /** Access-token lifetime in seconds. */
    expiresIn?: number
}
export type AuthenticatedUser = {
    publicId: string
    name: string
    email: string
    role: UserRole
    teamId: number | null
}
export type AuthSession = {
    user: AuthenticatedUser
    token: AuthToken
}
export type AuthenticationResponse = {
    tokens: AuthToken
    user: {
        publicId: string
        username: string
        email: string
        role: UserRole
        status?: string
        createdAt?: string
    }
}

/** Tokens and absolute times only: user data is revalidated on restore. */
export type StoredAuthentication = {
    accessToken: string
    refreshToken?: string
    expiresAt?: number
    refreshAt?: number
}

/** Injectable boundaries for the session service. */
export interface AuthenticationStorage {
    load(): StoredAuthentication | null
    save(session: StoredAuthentication): void
    clear(): void
}
export interface AuthenticationGateway {
    register(payload: RegisterPayload): Promise<AuthSession>
    login(payload: LoginPayload): Promise<AuthSession>
    me(accessToken?: string): Promise<AuthenticatedUser>
    refresh(refreshToken: string): Promise<AuthSession>
    logout(refreshToken: string): Promise<void>
}

export type AuthenticationContextValue = {
    status: AuthenticationStatus
    user: AuthenticatedUser | null
    /** Kept for backward compatibility. Never display or log this value. */
    token: string | null
    isAuthenticated: boolean
    isAuthenticating: boolean
    isRefreshing: boolean
    /** Safe, user-facing session error, or null. */
    error: string | null
    login: (payload: LoginPayload) => Promise<void>
    register: (payload: RegisterPayload) => Promise<void>
    logout: () => Promise<void>
    retryRestore: () => Promise<void>
}
/** Legacy localStorage key; retained for migrations and old imports. */
export const AUTH_TOKEN_STORAGE_KEY = 'booking:authentication:token'
export const AUTH_SESSION_STORAGE_KEY = 'booking:authentication:session'
