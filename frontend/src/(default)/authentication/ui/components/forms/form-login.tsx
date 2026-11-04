// src/(default)/authentication/ui/components/form/form-login.tsx

import { ArrowRightIcon } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { useFormLogin } from '@/src/(default)/authentication/hooks/use-form-login.ts'
import { Button } from '@/src/components/ui/button'
import { FieldGroup } from '@/src/components/ui/field.tsx'
import { FormInput } from '@/src/components/ui/form/form-input.tsx'
import { FormLoginPasswordInput } from '@/src/components/ui/form/form-login-password.tsx'
import { Spinner } from '@/src/components/ui/spinner.tsx'
import { Text } from '@/src/components/ui/text.tsx'

const FORM_ID = 'form-login'

/**
 * Login form — thin UI over useFormLogin.
 * All state, validation, submission, error mapping, and navigation live in
 * the hook; this component renders fields, the server error banner, and
 * the submit control in its three states (idle, submitting, failed).
 */
export function FormLogin() {
    const { control, handleSubmit, onSubmit, isSubmitting, serverError } = useFormLogin()

    return (
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate>
            {serverError && (
                <div role="alert" className="text-destructive mb-4 text-sm">
                    {serverError}
                </div>
            )}

            <FieldGroup>
                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FormInput
                            title="Email"
                            field={field}
                            inputId="form-login-email"
                            placeholder="Introduza o seu email"
                            autoComplete="email"
                            type="email"
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FormLoginPasswordInput
                            title="Palavra-passe"
                            field={field}
                            inputId="form-login-password"
                            placeholder="Introduza a sua palavra-passe"
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} size="lg">
                    {isSubmitting && <Spinner className="size-4" />}
                    <Text
                        variant="small"
                        className="inline-flex gap-2 items-center text-primary-foreground"
                    >
                        Entrar
                        <ArrowRightIcon />
                    </Text>
                </Button>
            </FieldGroup>
        </form>
    )
}
