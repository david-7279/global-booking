import type { ReactNode } from 'react'
import { SidebarTrigger } from '@/src/components/ui/sidebar'
import { cn } from '@/src/lib/utils'

interface DefaultSidebarTopBarProps {
    title: string
    breadcrumb?: ReactNode
    role?: string
    className?: string
}

const AsideTopBar = ({ title, breadcrumb, role, className }: DefaultSidebarTopBarProps) => {
    return (
        <header
            className={cn(
                'flex min-h-16 shrink-0 items-center gap-3 border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur-sm md:px-6',
                className,
            )}
        >
            <SidebarTrigger className="-ml-1 shrink-0" aria-label="Toggle navigation" />
            <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                    {breadcrumb && <span className="truncate">{breadcrumb}</span>}
                    {role && (
                        <span className="truncate text-xs uppercase tracking-wider">{role}</span>
                    )}
                </div>
                <h1
                    id="page-title"
                    className="truncate text-lg font-semibold text-foreground md:text-xl"
                >
                    {title}
                </h1>
            </div>
        </header>
    )
}

export default AsideTopBar
