// src/components/shared/wrapper.tsx

import type { ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

interface WrapperProps {
    className?: string
    children: ReactNode
}

/**
 * Content container: centered, width-capped, horizontal padding.
 * Vertical spacing (gaps, paddings, margins) belongs to pages and
 * sections — this primitive has no vertical opinions.
 */
export default function Wrapper({ className, children }: WrapperProps) {
    return <div className={cn('mx-auto w-full max-w-4xl px-4', className)}>{children}</div>
}
