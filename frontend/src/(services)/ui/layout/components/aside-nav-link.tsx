// src/(services)/ui/layout/components/aside-nav-link.tsx

import { motion, type Variants } from 'framer-motion'
import type { ComponentType } from 'react'

export type NavItem = {
    label: string
    path?: string
    icon: ComponentType<{ size?: number; className?: string }>
}

interface NavLinkProps {
    item: NavItem
    active: boolean
    onClick: () => void
    variants?: Variants
}

export default function AsideNavLink({ item, active, onClick, variants }: NavLinkProps) {
    const Icon = item.icon

    return (
        <motion.button
            type="button"
            variants={variants}
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            className={`relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                active
                    ? 'bg-accent/30 text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-gray-900dark:hover:bg-neutral-800/60 dark:hover:text-neutral-50'
            }`}
        >
            {active && (
                <motion.span
                    layoutId="nav-active-bar"
                    className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent-foreground"
                />
            )}
            <Icon size={16} className={active ? 'text-foreground' : 'text-muted-foreground'} />
            {item.label}
        </motion.button>
    )
}
