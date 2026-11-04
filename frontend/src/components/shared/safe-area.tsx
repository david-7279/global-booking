// src/components/shared/safe-area.tsx

import type { ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

interface SafeAreaProps {
    className?: string
    children: ReactNode
}

/**
 * Outermost page band: full dynamic viewport height, flexible column.
 *
 * `min-h-dvh` (dynamic viewport height) instead of `h-screen` — on mobile,
 * 100vh is the *largest* viewport (browser chrome collapsed), which pushes
 * content under the URL bar; dvh tracks the visible viewport.
 *
 * Carries no overflow rules and no padding — pages own those decisions.
 */
export default function SafeArea({ className, children }: SafeAreaProps) {
    return <div className={cn('flex min-h-dvh flex-1 flex-col', className)}>{children}</div>
}
