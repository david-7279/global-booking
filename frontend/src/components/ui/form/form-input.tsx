// src/components/ui/form/form-input.tsx

import type { ComponentProps } from 'react'
import type { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { cn } from '@/src/lib/utils'

type FormInputProps<TFieldValues extends FieldValues = FieldValues> = {
    title: string
    inputId: string
    /** react-hook-form Controller field — name, value, onChange, onBlur, ref. */
    field: ControllerRenderProps<TFieldValues>
    error?: string
    required?: boolean
    placeholder?: string
    type?: ComponentProps<'input'>['type']
    autoComplete?: ComponentProps<'input'>['autoComplete']
    className?: string
    labelClassName?: string
}

/**
 * Reusable form input built on Field + Input.
 * Renders label, input, and validation message; exposes invalid state
 * via aria-invalid + aria-describedby. Form state stays with the parent.
 */
export const FormInput = <TFieldValues extends FieldValues = FieldValues>({
    title,
    inputId,
    required = false,
    placeholder,
    type = 'text',
    autoComplete,
    field,
    error,
    className,
    labelClassName,
}: FormInputProps<TFieldValues>) => {
    const isInvalid = Boolean(error)
    const errorId = `${inputId}-error`

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={inputId} className={cn('gap-1', labelClassName)}>
                {title}
                {required && (
                    <span className="text-destructive" aria-hidden="true">
                        {' '}
                        *
                    </span>
                )}
            </FieldLabel>

            <Input
                {...field}
                id={inputId}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                aria-invalid={isInvalid}
                aria-describedby={isInvalid ? errorId : undefined}
                className={cn('border-input', className)}
            />

            {isInvalid && <FieldError id={errorId}>{error}</FieldError>}
        </Field>
    )
}

export default { FormInput }
