// src/(default)/legal/ui/components/legal-header.tsx

import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/src/components/ui/button.tsx'
import { cn } from '@/src/lib/utils.ts'
import { paths } from '@/src/router/paths.ts'

type LegalHeaderProps = {
    brandName: string
    backLabel: string
}

export function LegalHeader({ brandName, backLabel }: LegalHeaderProps) {
    return (
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur print:static print:border-0">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 lg:px-8">
                <Link
                    to={paths.public.root}
                    className="font-heading text-xl font-semibold tracking-tight"
                >
                    {brandName}
                    <span className="text-primary">.</span>
                </Link>
                <Link
                    to={paths.public.root}
                    aria-label={backLabel}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'print:hidden')}
                >
                    <ArrowLeft aria-hidden="true" />
                    <span className="hidden sm:inline">{backLabel}</span>
                </Link>
            </div>
        </header>
    )
}
