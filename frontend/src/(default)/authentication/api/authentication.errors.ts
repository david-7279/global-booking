import axios from 'axios'
import { ApiError, isApiError } from '@/src/lib/api/api-errors.ts'
import type { ApiFieldErrors } from '@/src/lib/api/types/api.types.ts'

const NETWORK_MESSAGE = 'Não foi possível contactar o servidor. Verifique a sua ligação.'
const UNEXPECTED_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'

const CODE_MESSAGES: Record<string, string> = {
    VALIDATION_ERROR: 'Verifique os campos assinalados e tente novamente.',
    INVALID_REQUEST: 'Não foi possível processar o pedido. Verifique os dados e tente novamente.',
    AUTHENTICATION_FAILED: 'Não foi possível autenticar. Verifique os dados e tente novamente.',
    INVALID_CREDENTIALS: 'Email ou palavra-passe incorretos.',
    TOKEN_INVALID: 'A sua sessão é inválida. Inicie sessão novamente.',
    TOKEN_EXPIRED: 'A sua sessão expirou. Inicie sessão novamente.',
    ACCESS_DENIED: 'Não tem permissão para realizar esta operação.',
    USER_NOT_FOUND: 'Não foi possível encontrar a conta.',
    USER_ALREADY_EXISTS: 'Já existe uma conta com estes dados.',
    INTERNAL_ERROR: UNEXPECTED_MESSAGE,
}

/** A feature-specific error which remains compatible with consumers of ApiError. */
export class AuthenticationErrors extends ApiError {
    public readonly code?: string

    constructor(message: string, status: number, code?: string, fields?: ApiFieldErrors) {
        super(message, status, fields)
        this.name = 'AuthenticationErrors'
        this.code = code
    }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : undefined
}

/** Accept user-facing messages, not exception dumps or markup from intermediaries. */
function safeMessage(value: unknown): string | undefined {
    if (typeof value !== 'string') return undefined
    const message = value.trim()
    if (
        !message ||
        message.length > 300 ||
        /[\r\n<>]/.test(message) ||
        /\b(?:exception|stack\s*trace|sqlstate|select\s+.+\s+from|bearer\s+\S+)\b/i.test(message)
    ) {
        return undefined
    }
    return message
}

function normalizeFields(details: unknown, envelopeFields: unknown): ApiFieldErrors | undefined {
    const fields: ApiFieldErrors = Object.create(null)
    const add = (field: unknown, value: unknown) => {
        if (typeof field !== 'string' || !field.trim()) return
        const name = field === 'username' ? 'name' : field
        const values = Array.isArray(value) ? value : [value]
        for (const item of values) {
            const message = safeMessage(item)
            if (message) {
                fields[name] ??= []
                fields[name].push(message)
            }
        }
    }

    if (Array.isArray(details)) {
        for (const detail of details) {
            const entry = asRecord(detail)
            if (entry) add(entry.field, entry.message)
        }
    }
    const sharedFields = asRecord(envelopeFields)
    if (sharedFields) {
        for (const [field, messages] of Object.entries(sharedFields)) add(field, messages)
    }
    return Object.keys(fields).length ? fields : undefined
}

/** Normalize the real backend body, as well as the shared client's optional error envelope. */
export function normalizeAuthenticationError(error: unknown): AuthenticationErrors {
    if (error instanceof AuthenticationErrors) {
        if (error.status >= 500 || error.status < 0 || (error.status > 0 && error.status < 400)) {
            return new AuthenticationErrors(UNEXPECTED_MESSAGE, error.status, error.code)
        }
        return error
    }

    if (axios.isAxiosError(error)) {
        const response = error.response
        if (!response) return new AuthenticationErrors(NETWORK_MESSAGE, 0)

        const status = response.status
        const body = asRecord(response.data)
        const envelope = asRecord(body?.error)
        const rawCode = body?.code ?? envelope?.code
        const code = typeof rawCode === 'string' && rawCode.trim() ? rawCode.trim() : undefined

        // Do not use server-provided messages or details for 5xx or unexpected statuses.
        if (status < 400 || status >= 500) {
            return new AuthenticationErrors(UNEXPECTED_MESSAGE, status, code)
        }
        const message =
            (code && Object.hasOwn(CODE_MESSAGES, code) ? CODE_MESSAGES[code] : undefined) ??
            safeMessage(body?.message) ??
            safeMessage(envelope?.message) ??
            UNEXPECTED_MESSAGE
        const fields = normalizeFields(
            body?.details ?? envelope?.details,
            envelope?.fields ?? body?.fields,
        )
        return new AuthenticationErrors(message, status, code, fields)
    }

    // The shared client may already have normalized an error into ApiError.
    if (isApiError(error)) {
        const status = error.status
        if (status === 0) return new AuthenticationErrors(NETWORK_MESSAGE, 0)
        if (status < 400 || status >= 500)
            return new AuthenticationErrors(UNEXPECTED_MESSAGE, status)
        return new AuthenticationErrors(
            safeMessage(error.message) ?? UNEXPECTED_MESSAGE,
            status,
            undefined,
            normalizeFields(undefined, error.fields),
        )
    }

    return new AuthenticationErrors(UNEXPECTED_MESSAGE, 0)
}
