import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import { buttonVariants } from '@/src/components/ui/button.tsx'
import { cn } from '@/src/lib/utils.ts'
import { paths } from '@/src/router/paths.ts'

type LegalLayoutProps = {
    title: string
    eyebrow: string
    updatedAt: string
    children: ReactNode
}

export function LegalLayout({ title, eyebrow, updatedAt, children }: LegalLayoutProps) {
    return (
        <SafeArea>
            <header className="border-b border-border/70">
                <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-5 lg:px-8">
                    <Link
                        to={paths.public.root}
                        className="font-heading text-xl font-semibold tracking-tight"
                    >
                        Atlas<span className="text-primary">.</span>
                    </Link>
                    <Link
                        to={paths.public.root}
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                    >
                        <ArrowLeft aria-hidden="true" /> Voltar ao início
                    </Link>
                </div>
            </header>
            <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14 lg:px-8 lg:py-20">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {eyebrow}
                </p>
                <h1 className="mt-4 font-heading text-5xl tracking-tight">{title}</h1>
                <p className="mt-4 text-sm text-muted-foreground">
                    Última atualização: {updatedAt}
                </p>
                <article className="prose prose-neutral mt-12 max-w-none text-foreground prose-headings:font-heading prose-headings:font-medium prose-p:leading-8 prose-li:leading-8">
                    {children}
                </article>
            </main>
            <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Atlas. Todos os direitos reservados.
            </footer>
        </SafeArea>
    )
}
