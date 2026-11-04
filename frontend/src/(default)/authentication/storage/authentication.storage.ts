// src/(features)/authentication/storage/authentication.storage.ts

import { AUTH_TOKEN_STORAGE_KEY } from '@/src/(default)/authentication/types/authentication.types.ts'

export function getStoredAuthToken(): string | null {
    try {
        const raw = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
        const token = raw?.trim()

        if (!token || token === 'null' || token === 'undefined') return null
        return token
    } catch {
        return null
    }
}

export function setStoredAuthToken(token: string): void {
    try {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
    } catch {
        // ignore
    }
}

export function clearStoredAuthToken(): void {
    try {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    } catch {
        // ignore
    }
}
