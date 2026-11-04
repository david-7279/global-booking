import { ArrowRight, Check, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import { buttonVariants } from '@/src/components/ui/button.tsx'
import { cn } from '@/src/lib/utils.ts'
import { paths } from '@/src/router/paths.ts'

const benefits = [
    'Uma experiência simples para toda a equipa',
    'Acesso protegido e sessão preparada para crescer',
    'Informação organizada num único lugar',
]

export default function LandingPage() {
    return (
        <SafeArea>
            <header className="border-b border-border/70 bg-background/90 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
                    <Link
                        to={paths.public.root}
                        className="font-heading text-xl font-semibold tracking-tight"
                    >
                        Atlas<span className="text-primary">.</span>
                    </Link>
                    <nav
                        aria-label="Navegação principal"
                        className="flex items-center gap-2 sm:gap-6"
                    >
                        <Link
                            to={paths.public.terms}
                            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
                        >
                            Termos
                        </Link>
                        <Link
                            to={paths.public.privacy}
                            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
                        >
                            Privacidade
                        </Link>
                        <Link
                            to={paths.auth}
                            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                        >
                            Entrar
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-28">
                    <div className="max-w-2xl">
                        <div className="mb-7 inline-flex items-center gap-2 border border-border bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            <Sparkles className="size-3.5" aria-hidden="true" />
                            Uma base para trabalhar melhor
                        </div>
                        <h1 className="font-heading text-5xl leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                            Clareza para cada decisão importante.
                        </h1>
                        <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
                            Atlas reúne as ferramentas essenciais da sua equipa numa experiência
                            segura, simples e pronta para evoluir consigo.
                        </p>
                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link to={paths.auth} className={cn(buttonVariants({ size: 'lg' }))}>
                                Começar agora
                                <ArrowRight aria-hidden="true" />
                            </Link>
                            <a
                                href="#como-funciona"
                                className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
                            >
                                Ver como funciona
                            </a>
                        </div>
                        <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
                            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                            Segurança e privacidade desde o primeiro acesso
                        </div>
                    </div>

                    <div className="relative overflow-hidden border border-border bg-muted/30 p-5 sm:p-8">
                        <div className="absolute right-0 top-0 h-32 w-32 bg-primary/10 blur-3xl" />
                        <div className="relative border border-border bg-card p-5 shadow-sm sm:p-7">
                            <div className="flex items-center justify-between border-b border-border pb-5">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                        Visão geral
                                    </p>
                                    <p className="mt-2 font-heading text-2xl">Tudo em ordem.</p>
                                </div>
                                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <Check className="size-5" aria-hidden="true" />
                                </div>
                            </div>
                            <div className="space-y-3 py-6">
                                {[
                                    'Planeamento da equipa',
                                    'Acompanhamento de tarefas',
                                    'Decisões partilhadas',
                                ].map((item, index) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 border border-border/70 bg-background p-3"
                                    >
                                        <span className="flex size-7 items-center justify-center bg-muted text-xs font-semibold">
                                            0{index + 1}
                                        </span>
                                        <span className="text-sm font-medium">{item}</span>
                                        <Check
                                            className="ml-auto size-4 text-primary"
                                            aria-hidden="true"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
                                <LockKeyhole className="size-3.5" aria-hidden="true" />
                                Espaço privado da sua equipa
                            </div>
                        </div>
                    </div>
                </section>

                <section id="como-funciona" className="border-y border-border bg-muted/25">
                    <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                Feito para durar
                            </p>
                            <h2 className="mt-4 font-heading text-4xl tracking-tight">
                                Uma base sólida, sem complicações.
                            </h2>
                        </div>
                        <div className="grid gap-4">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit}
                                    className="flex items-start gap-4 border-b border-border pb-4 text-base text-foreground last:border-b-0"
                                >
                                    <Check
                                        className="mt-0.5 size-5 shrink-0 text-primary"
                                        aria-hidden="true"
                                    />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
                <p>© {new Date().getFullYear()} Atlas. Todos os direitos reservados.</p>
                <div className="flex gap-5">
                    <Link to={paths.public.terms} className="hover:text-foreground">
                        Termos de utilização
                    </Link>
                    <Link to={paths.public.privacy} className="hover:text-foreground">
                        Política de privacidade
                    </Link>
                </div>
            </footer>
        </SafeArea>
    )
}
