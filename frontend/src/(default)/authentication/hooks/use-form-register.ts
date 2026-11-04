// src/(features)/authentication/hooks/use-form-register.ts

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { useAuthentication } from '@/src/(default)/authentication/hooks/use-authentication.ts'
import {
    type RegisterFormValues,
    registerSchema,
} from '@/src/(default)/authentication/ui/components/forms/schemas/auth.schema.ts'
import { toast } from '@/src/components/ui/toast.tsx'
import { isApiError } from '@/src/lib/api/api-errors.ts'
import { paths } from '@/src/router/paths.ts'

/** Generic message for unknown (non-ApiError) failures — never rendered from raw errors. */
const REGISTER_ERROR =
    'Não foi possível criar a sua conta. Confirme os dados introduzidos e tente novamente.'

export function useFormRegister() {
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '' },
        mode: 'onSubmit',
    })

    const { register } = useAuthentication()
    const navigate = useNavigate()
    const location = useLocation()

    const onSubmit = async (values: RegisterFormValues): Promise<void> => {
        try {
            // Provider: storage + status transitions
            await register(values)

            // ProtectedRouter remembered where the user was headed
            const from = (
                location.state as {
                    from?: {
                        pathname: string
                    }
                } | null
            )?.from?.pathname
            navigate(from ?? paths.workspace.root, { replace: true })
        } catch (error) {
            if (isApiError(error)) {
                if (error.isValidationError && error.fields) {
                    for (const [field, messages] of Object.entries(error.fields)) {
                        form.setError(field as keyof RegisterFormValues, { message: messages[0] })
                    }
                    return
                }

                form.setError('root', { type: 'server', message: error.message })

                toast.add({
                    title: 'Não foi possível criar a conta',
                    description: error.message ?? REGISTER_ERROR,
                    type: 'error',
                })
                return
            }
            form.setError('root', {
                type: 'server',
                message: REGISTER_ERROR,
            })
        }
    }

    return {
        ...form,
        onSubmit,
        isSubmitting: form.formState.isSubmitting,
        serverError: form.formState.errors.root?.message ?? null,
    } as const
}
