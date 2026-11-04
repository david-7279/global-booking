// src/lib/api/api-client.ts

import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { ApiError } from '@/src/lib/api/api-errors.ts'
import type { ApiErrorBody } from './types/api.types.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const http: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10_000,
})

// Auth wiring, injected from the composition root
type TokenProvider = {
    get: () => string | null
    /** Called on 401 during normal app usage — the auth feature clears its state. */
    onUnauthorized: () => void
}

let tokenProvider: TokenProvider = { get: () => null, onUnauthorized: () => {} }

export function setTokenProvider(provider: TokenProvider) {
    tokenProvider = provider
}

// Request: attach the bearer token

http.interceptors.request.use((config) => {
    const token = tokenProvider.get()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Response: normalize every failure into ApiError

http.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorBody>) => {
        const status = error.response?.status ?? 0
        const body = error.response?.data
        const requestUrl = error.config?.url ?? ''

        if (!error.response) {
            return Promise.reject(
                new ApiError(
                    'Não foi possível contactar o servidor. Verifique a sua ligação.',
                    status,
                ),
            )
        }

        // 401 handling
        const isAuthEndpoint = requestUrl.startsWith('/auth')
        if (status === 401 && !isAuthEndpoint && tokenProvider.get() !== null) {
            tokenProvider.onUnauthorized()
        }

        return Promise.reject(
            new ApiError(
                body?.error?.message ?? 'Ocorreu um erro inesperado.',
                status,
                body?.error?.fields,
            ),
        )
    },
)
