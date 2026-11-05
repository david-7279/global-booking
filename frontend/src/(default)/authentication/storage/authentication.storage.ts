import {
    AUTH_SESSION_STORAGE_KEY,
    AUTH_TOKEN_STORAGE_KEY,
    type AuthenticationStorage,
    type StoredAuthentication,
} from '@/src/(default)/authentication/types/authentication.types.ts'

function validToken(value: unknown): string | null {
    if (typeof value !== 'string') return null
    const token = value.trim()
    return token && token !== 'null' && token !== 'undefined' ? token : null
}

function readSession(): StoredAuthentication | null {
    try {
        const raw = sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)
        if (!raw) return null
        const value: unknown = JSON.parse(raw)
        if (!value || typeof value !== 'object') return null
        const record = value as Record<string, unknown>
        const accessToken = validToken(record.accessToken)
        if (!accessToken) return null
        const refreshToken = validToken(record.refreshToken)
        return {
            accessToken,
            ...(refreshToken ? { refreshToken } : {}),
            ...(typeof record.expiresAt === 'number' && Number.isFinite(record.expiresAt)
                ? { expiresAt: record.expiresAt }
                : {}),
            ...(typeof record.refreshAt === 'number' && Number.isFinite(record.refreshAt)
                ? { refreshAt: record.refreshAt }
                : {}),
        }
    } catch {
        return null
    }
}

function removeLegacy(): void {
    try {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    } catch {
        // Storage can be unavailable (private mode, denied access, SSR).
    }
}

/**
 * Per-tab sessionStorage survives reload, not closing the tab. Both tokens are
 * readable by JavaScript: an XSS can steal them. A backend-issued HttpOnly,
 * Secure, SameSite cookie is the recommended future refresh-token transport.
 */
export const authenticationStorage: AuthenticationStorage = {
    load() {
        const current = readSession()
        if (current) {
            removeLegacy()
            return current
        }
        try {
            const accessToken = validToken(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY))
            if (!accessToken) {
                removeLegacy()
                return null
            }
            const session = { accessToken }
            try {
                sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
            } catch {
                // The current page can still use this legacy token in memory only.
            }
            // Retire persistent legacy storage even when sessionStorage is unavailable.
            removeLegacy()
            return session
        } catch {
            return null
        }
    },
    save(session) {
        try {
            sessionStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
            removeLegacy()
        } catch {
            // The session remains usable in memory even when browser storage is blocked.
            // Remove a possibly stale legacy credential whenever it is possible.
            removeLegacy()
        }
    },
    clear() {
        try {
            sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
        } catch {
            // Best effort: browser storage may be unavailable.
        }
        removeLegacy()
    },
}

/** Backward-compatible access-token helpers. */
export function getStoredAuthToken(): string | null {
    return authenticationStorage.load()?.accessToken ?? null
}
export function setStoredAuthToken(token: string): void {
    const accessToken = validToken(token)
    if (accessToken) authenticationStorage.save({ accessToken })
    else authenticationStorage.clear()
}
export function clearStoredAuthToken(): void {
    authenticationStorage.clear()
}
