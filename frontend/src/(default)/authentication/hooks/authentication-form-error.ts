import axios from 'axios'
import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form'
import { normalizeAuthenticationError } from '@/src/(default)/authentication/api/authentication.errors.ts'
import { toast } from '@/src/components/ui/toast.tsx'
import { isApiError } from '@/src/lib/api/api-errors.ts'

type FormErrorOptions<T extends FieldValues> = {
    setError: UseFormSetError<T>
    fields: readonly FieldPath<T>[]
    title: string
    fallback: string
}

/** Map only recognized fields, surface the rest at the root, and notify once. */
export function handleAuthenticationFormError<T extends FieldValues>(
    error: unknown,
    { setError, fields, title, fallback }: FormErrorOptions<T>,
): void {
    const normalized =
        isApiError(error) || axios.isAxiosError(error) ? normalizeAuthenticationError(error) : null
    const message = normalized?.message || fallback
    let hasFieldError = false
    let hasUnknownField = false

    for (const [name, messages] of Object.entries(normalized?.fields ?? {})) {
        const field = fields.find((knownField) => knownField === name)
        const fieldMessage = messages[0]
        if (!fieldMessage) continue
        if (field) {
            setError(field, { type: 'server', message: fieldMessage })
            hasFieldError = true
        } else {
            hasUnknownField = true
        }
    }
    if (!hasFieldError || hasUnknownField) {
        setError('root', { type: 'server', message })
    }
    toast.add({ title, description: message, type: 'error' })
}
