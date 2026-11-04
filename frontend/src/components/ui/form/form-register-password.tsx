// src/components/ui/form/form-password-input.tsx

import { CheckCircle2, Eye, EyeClosed, X } from 'lucide-react'
import { useState } from 'react'
import type { ControllerRenderProps, FieldValues } from 'react-hook-form'
import {
    PASSWORD_RULES,
    passwordStrength,
} from '@/src/(default)/authentication/ui/components/forms/schemas/auth-field.schema.ts'
import { Button } from '@/src/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { cn } from '@/src/lib/utils'

type FormRegisterPasswordInputProps<TFieldValues extends FieldValues = FieldValues> = {
    title: string
    inputId: string
    /** react-hook-form Controller field — name, value, onChange, onBlur, ref. */
    field: ControllerRenderProps<TFieldValues>
    error?: string
    placeholder?: string
    className?: string
}

const STRENGTH_COLORS = ['bg-muted', 'bg-red-500', 'bg-orange-500', 'bg-teal-400', 'bg-teal-500']
const STRENGTH_TEXTS = ['', 'Fraca', 'Moderada', 'Forte', 'Muito forte']

/**
 * Password field with show/hide toggle, strength meter, and a live
 * requirements checklist. Accessibility notes:
 *  - the toggle is an icon-only button → aria-label that flips with state
 *  - the requirements list is linked to the input via aria-describedby
 *  - the strength text is a polite live region (announced on change)
 *  - icons are aria-hidden — color/icon never carries meaning alone
 * Validation itself stays with the parent form (same contract as FormInput).
 */
export function FormRegisterPasswordInput<TFieldValues extends FieldValues = FieldValues>({
    title,
    inputId,
    field,
    error,
    placeholder,
    className,
}: FormRegisterPasswordInputProps<TFieldValues>) {
    const [showPassword, setShowPassword] = useState(false)

    const value = field.value ?? ''
    const strength = passwordStrength(value)

    const errorId = `${inputId}-error`
    const requirementsId = `${inputId}-requirements`
    const strengthId = `${inputId}-strength`

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

            {/* Strength meter */}
            <div className="space-y-2 pt-1">
                <div
                    className="h-1 w-full overflow-hidden rounded-full bg-secondary"
                    role="progressbar"
                    aria-label="Força da palavra-passe"
                    aria-valuemin={0}
                    aria-valuemax={PASSWORD_RULES.length}
                    aria-valuenow={strength}
                >
                    <div
                        className={cn(
                            'h-full transition-all duration-500 ease-out',
                            STRENGTH_COLORS[strength],
                        )}
                        style={{ width: `${(strength / PASSWORD_RULES.length) * 100}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Requisitos da palavra-passe</span>
                    <span
                        id={strengthId}
                        aria-live="polite"
                        className={cn(
                            'text-xs',
                            strength <= 1 && 'text-red-500',
                            strength === 2 && 'text-orange-500',
                            strength >= 3 && 'text-teal-500',
                        )}
                    >
                        {STRENGTH_TEXTS[strength]}
                    </span>
                </div>
            </div>

            {/* Requirements checklist — described by the input while typing */}
            <ul id={requirementsId} className="space-y-1.5 pt-1">
                {PASSWORD_RULES.map((rule) => {
                    const valid = rule.test(value)
                    return (
                        <li
                            key={rule.id}
                            className={cn(
                                'flex items-center gap-2 text-[13px] transition-colors duration-200',
                                valid ? 'text-teal-500' : 'text-muted-foreground',
                            )}
                        >
                            {valid ? (
                                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            {rule.label}
                        </li>
                    )
                })}
            </ul>
        </Field>
    )
}
