// src/(default)/authentication/ui/components/forms/schemas/auth.schemas.ts

import { z } from 'zod'
import {
    emailSchema,
    nameSchema,
    passwordSchema,
} from '@/src/(default)/authentication/ui/components/forms/schemas/auth-field.schema.ts'

/** Schema used by the login form. */
export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
