// src/(default)/landing/ui/components/landing-link.tsx

import type { VariantProps } from 'class-variance-authority'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { resolveLandingLink } from '@/src/(default)/landing/lib/resolve-link.ts'
import type {
    LandingAction,
    LandingLinkTarget,
} from '@/src/(default)/landing/types/landing.types.ts'
import { buttonVariants } from '@/src/components/ui/button.tsx'
import { cn } from '@/src/lib/utils.ts'

type LandingLinkProps = {
    target: LandingLinkTarget
    className?: string
    onClick?: () => void
    children: ReactNode
}

/** Renders the right kind of anchor for a semantic target: router link, in-page anchor or mailto. */
export function LandingLink({ target, className, onClick, children }: LandingLinkProps) {
    const link = resolveLandingLink(target)

    if (link.type === 'route') {
        return (
            <Link to={link.to} className={className} onClick={onClick}>
                {children}
            </Link>
        )
    }

    return (
        <a href={link.href} className={className} onClick={onClick}>
            {children}
        </a>
    )
}

type LandingButtonLinkProps = VariantProps<typeof buttonVariants> & {
    action: LandingAction
    arrow?: boolean
    className?: string
    onClick?: () => void
}

/** A link styled as one of the design system's buttons. */
export function LandingButtonLink({
    action,
    variant,
    size,
    arrow = false,
    className,
    onClick,
}: LandingButtonLinkProps) {
    // The landing has its own light palette even when the rest of the app uses dark mode.
    const landingVariants = buttonVariants({ variant, size })
        .split(' ')
        .filter((token) => !token.startsWith('dark:'))
        .join(' ')

    return (
        <LandingLink
            target={action.target}
            onClick={onClick}
            className={cn(
                landingVariants,
                'h-auto min-h-10 min-w-0 max-w-full shrink gap-2 rounded-lg px-5 py-2.5 text-center text-sm font-semibold leading-snug normal-case tracking-normal whitespace-normal [overflow-wrap:anywhere] shadow-sm transition-[background-color,border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:active:!translate-y-0',
                size === 'lg' && 'min-h-12 px-6 py-3',
                variant === 'ghost' && 'shadow-none',
                className,
            )}
        >
            {action.label}
            {arrow ? <ArrowRight aria-hidden="true" className="size-4" /> : null}
        </LandingLink>
    )
}
