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
const INPUT_CLASS =
    'h-12 rounded-xl border border-input bg-[#fcfdfa] px-4 text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 aria-invalid:border-destructive aria-invalid:border-b-destructive dark:aria-invalid:border-b-destructive'

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
                <div
                    role="alert"
                    className="mb-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive"
                >
                    {serverError}
                </div>
            )}

            <FieldGroup className="gap-5 [&_[data-slot=field]]:gap-2 [&_[data-slot=field-label]]:text-[13px] [&_[data-slot=field-label]]:font-semibold [&_[data-slot=field-label]]:normal-case [&_[data-slot=field-label]]:tracking-normal dark:[&_[data-slot=button][type=button]]:hover:bg-transparent">
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
                            className={INPUT_CLASS}
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
                            className={`${INPUT_CLASS} pr-12`}
                        />
                    )}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    size="lg"
                    className="mt-1 h-12 w-full rounded-xl bg-primary px-5 text-sm font-semibold normal-case tracking-normal text-primary-foreground shadow-sm hover:bg-[#124b41] focus-visible:ring-ring/40 motion-reduce:active:!translate-y-0"
                >
                    {isSubmitting && (
                        <Spinner
                            aria-label="A carregar"
                            className="size-4 motion-reduce:animate-none"
                        />
                    )}
                    <Text
                        variant="small"
                        className="inline-flex w-full items-center justify-between gap-2 text-primary-foreground"
                    >
                        Entrar
                        <ArrowRightIcon
                            aria-hidden="true"
                            className="size-4 transition-transform group-hover/button:translate-x-1 motion-reduce:transform-none"
                        />
                    </Text>
                </Button>
            </FieldGroup>
        </form>
    )
}
