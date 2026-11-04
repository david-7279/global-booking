// src/(features)/authentication/hooks/use-form-login.ts

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { useAuthentication } from '@/src/(default)/authentication/hooks/use-authentication.ts'
import {
    type LoginFormValues,
    loginSchema,
} from '@/src/(default)/authentication/ui/components/forms/schemas/auth.schema.ts'
import { toast } from '@/src/components/ui/toast.tsx'
import { isApiError } from '@/src/lib/api/api-errors.ts'
import { paths } from '@/src/router/paths.ts'

/** Generic message for unknown (non-ApiError) failures — never rendered from raw errors. */
const LOGIN_ERROR = 'Não foi possível iniciar sessão. Confirme o email e a palavra-passe.'

export function useFormLogin() {
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onSubmit',
    })

    const { login } = useAuthentication()
    const navigate = useNavigate()
    const location = useLocation()

    const onSubmit = async (values: LoginFormValues): Promise<void> => {
        try {
            // Provider: storage + status transitions
            await login(values)

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
                        form.setError(field as keyof LoginFormValues, { message: messages[0] })
                    }
                    return
                }

                form.setError('root', { type: 'server', message: error.message })

                toast.add({
                    title: 'Não foi possível entrar',
                    description: error.message ?? LOGIN_ERROR,
                    type: 'error',
                })
                return
            }

            form.setError('root', {
                type: 'server',
                message: LOGIN_ERROR,
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
