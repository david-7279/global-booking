// src/(features)/authentication/context/authentication.context.ts

import { createContext } from 'react'
import type { AuthenticationContextValue } from '@/src/(default)/authentication/types/authentication.types.ts'

export const AuthenticationContext = createContext<AuthenticationContextValue | null>(null)
