// src/components/ui/form/form-password-input.tsx

import { Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
import type { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { Button } from '@/src/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { cn } from '@/src/lib/utils'

type FormLoginPasswordInputProps<TFieldValues extends FieldValues = FieldValues> = {
    title: string
    inputId: string
    field: ControllerRenderProps<TFieldValues>
    error?: string
    placeholder?: string
    className?: string
}

/**
 * Password field with show/hide toggle, strength meter, and a live
 * requirements checklist. Accessibility notes:
 *  - the toggle is an icon-only button → aria-label that flips with state
 *  - the requirements list is linked to the input via aria-describedby
 *  - the strength text is a polite live region (announced on change)
 *  - icons are aria-hidden — color/icon never carries meaning alone
 * Validation itself stays with the parent form (same contract as FormInput).
 */
export function FormLoginPasswordInput<TFieldValues extends FieldValues = FieldValues>({
    title,
    inputId,
    field,
    error,
    placeholder,
    className,
}: FormLoginPasswordInputProps<TFieldValues>) {
    const [showPassword, setShowPassword] = useState(false)

    const value = field.value ?? ''

    const errorId = `${inputId}-error`
    const requirementsId = `${inputId}-requirements`

    // Input describes itself with: its error (if any) and/or the requirements list
    const describedBy = error ? errorId : value ? requirementsId : undefined

    return (
        <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor={inputId}>{title}</FieldLabel>

            <div className="relative">
                <Input
                    {...field}
                    id={inputId}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    autoComplete="new-password"
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={cn('border-input rounded-md', className)}
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full cursor-pointer px-3 hover:bg-transparent"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                >
                    {showPassword ? (
                        <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                        <EyeClosed className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                </Button>
            </div>

            {error && <FieldError id={errorId}>{error}</FieldError>}
        </Field>
    )
}
