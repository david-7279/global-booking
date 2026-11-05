import { ArrowLeft, ArrowUpRight, FileText, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
import type { LegalDocument } from '@/src/(default)/legal/content/legal-content.ts'
import { legalDocuments } from '@/src/(default)/legal/content/legal-content.ts'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import { buttonVariants } from '@/src/components/ui/button.tsx'
import { cn } from '@/src/lib/utils.ts'
import { paths } from '@/src/router/paths.ts'

type LegalLayoutProps = {
    document: LegalDocument
}

const documentIcons = {
    terms: FileText,
    privacy: ShieldCheck,
} as const

export function LegalLayout({ document }: LegalLayoutProps) {
    const DocumentIcon = documentIcons[document.id]
    const otherDocument = document.id === 'terms' ? legalDocuments.privacy : legalDocuments.terms

    return (
        <SafeArea className="bg-[#fafaf9] dark:bg-background">
            <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
                    <Link
                        to={paths.public.root}
                        aria-label="Atlas — voltar à página inicial"
                        className="font-heading text-xl font-semibold tracking-[-0.04em]"
                    >
                        Atlas<span className="text-primary">.</span>
                    </Link>
                    <nav aria-label="Navegação legal" className="hidden items-center gap-1 sm:flex">
                        <Link
                            to={paths.public.terms}
                            className={cn(
                                'rounded-full px-3 py-2 text-sm transition-colors hover:bg-muted',
                                document.id === 'terms'
                                    ? 'font-medium text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            Termos
                        </Link>
                        <Link
                            to={paths.public.privacy}
                            className={cn(
                                'rounded-full px-3 py-2 text-sm transition-colors hover:bg-muted',
                                document.id === 'privacy'
                                    ? 'font-medium text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        >
                            Privacidade
                        </Link>
                    </nav>
                    <Link
                        to={paths.public.root}
                        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'shrink-0')}
                    >
                        <ArrowLeft aria-hidden="true" />
                        <span className="hidden sm:inline">Voltar ao início</span>
                        <span className="sm:hidden">Início</span>
                    </Link>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-20">
                    <div className="min-w-0">
                        <header className="max-w-3xl border-b border-border/70 pb-10 sm:pb-12">
                            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background">
                                    <DocumentIcon className="size-4" aria-hidden="true" />
                                </span>
                                <span>{document.eyebrow}</span>
                            </div>
                            <h1 className="mt-7 max-w-3xl font-heading text-4xl leading-[1.05] tracking-[-0.045em] text-balance sm:text-6xl">
                                {document.title}
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                                {document.summary}
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-2">
                                    <span
                                        className="size-1.5 rounded-full bg-emerald-500"
                                        aria-hidden="true"
                                    />
                                    {document.effectiveLabel}
                                </span>
                                <span
                                    className="hidden size-1 rounded-full bg-border sm:block"
                                    aria-hidden="true"
                                />
                                <span>Última atualização: {document.updatedAt}</span>
                            </div>
                        </header>

                        <article className="mt-10 max-w-3xl sm:mt-12">
                            {document.sections.map((section, index) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-28 border-b border-border/70 py-9 first:pt-0 last:border-b-0 last:pb-0 sm:py-11"
                                >
                                    <div className="grid gap-5 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-7">
                                        <span className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div>
                                            <h2 className="font-heading text-2xl tracking-[-0.025em] sm:text-3xl">
                                                {section.title}
                                            </h2>
                                            <div className="mt-5 space-y-4 text-[0.98rem] leading-8 text-muted-foreground sm:text-base">
                                                {section.paragraphs.map((paragraph) => (
                                                    <p key={paragraph}>{paragraph}</p>
                                                ))}
                                            </div>
                                            {section.bullets ? (
                                                <ul className="mt-5 space-y-3 text-[0.98rem] leading-7 text-muted-foreground sm:text-base">
                                                    {section.bullets.map((bullet) => (
                                                        <li key={bullet} className="flex gap-3">
                                                            <span
                                                                className="mt-3 size-1.5 shrink-0 rounded-full bg-foreground"
                                                                aria-hidden="true"
                                                            />
                                                            <span>{bullet}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : null}
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </article>
                    </div>

                    <aside className="order-first lg:order-none">
                        <div className="lg:sticky lg:top-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                Nesta página
                            </p>
                            <nav
                                aria-label={`Secções de ${document.title}`}
                                className="mt-4 border-l border-border"
                            >
                                {document.sections.map((section, index) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="group flex gap-3 border-l-2 border-transparent py-2 pl-4 text-sm leading-5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                                    >
                                        <span className="font-mono text-[0.68rem] text-border transition-colors group-hover:text-muted-foreground">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span>{section.title}</span>
                                    </a>
                                ))}
                            </nav>
                            <div className="mt-10 border-t border-border pt-6">
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Também pode consultar
                                </p>
                                <Link
                                    to={
                                        otherDocument.id === 'terms'
                                            ? paths.public.terms
                                            : paths.public.privacy
                                    }
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                                >
                                    {otherDocument.title}
                                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="border-t border-border/70 bg-background px-5 py-7 sm:px-8 lg:px-10">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <span>© {new Date().getFullYear()} Atlas. Todos os direitos reservados.</span>
                    <span>Documentação legal do serviço</span>
                </div>
            </footer>
        </SafeArea>
    )
}
