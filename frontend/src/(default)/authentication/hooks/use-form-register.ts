// src/(features)/authentication/hooks/use-form-register.ts

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { handleAuthenticationFormError } from '@/src/(default)/authentication/hooks/authentication-form-error.ts'
import { useAuthentication } from '@/src/(default)/authentication/hooks/use-authentication.ts'
import {
    type RegisterFormValues,
    registerSchema,
} from '@/src/(default)/authentication/ui/components/forms/schemas/auth.schema.ts'
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
            handleAuthenticationFormError(error, {
                setError: form.setError,
                fields: ['name', 'email', 'password'],
                title: 'Não foi possível criar a conta',
                fallback: REGISTER_ERROR,
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
