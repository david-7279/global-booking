import { ArrowLeft, CalendarDays, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router'
import { FormLogin } from '@/src/(default)/authentication/ui/components/forms/form-login.tsx'
import { FormRegister } from '@/src/(default)/authentication/ui/components/forms/form-register.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import { Card, CardContent, CardFooter, CardHeader } from '@/src/components/ui/card.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs.tsx'
import { BRAND } from '@/src/lib/brand/brand.config.ts'
import { paths } from '@/src/router/paths.ts'

export default function AuthenticationPage() {
    return (
        <SafeArea className="relative isolate overflow-hidden bg-background text-foreground motion-reduce:[&_*]:animate-none motion-reduce:[&_*]:transition-none">
            <title>{`${BRAND.name} · Área reservada`}</title>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(ellipse_at_8%_35%,#e9f2e9_0%,transparent_42%),radial-gradient(ellipse_at_95%_90%,#edf5ee_0%,transparent_38%)]"
            />

            <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6 sm:py-8 lg:px-8">
                <Link
                    to={paths.public.root}
                    className="flex min-w-0 items-center gap-2.5 rounded-md font-heading text-xl font-semibold leading-tight tracking-tight outline-none focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                    <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary"
                    >
                        <span className="size-3.5 rounded-[4px] border border-primary-foreground/90" />
                    </span>
                    <span className="min-w-0 [overflow-wrap:anywhere]">
                        {BRAND.name}
                        <span className="text-primary">.</span>
                    </span>
                </Link>
                <Link
                    to={paths.public.root}
                    className="group inline-flex shrink-0 items-center gap-2 rounded-md py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                    <ArrowLeft
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none"
                    />
                    <span>Voltar ao site</span>
                </Link>
            </header>

            <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-9 px-6 pb-12 pt-5 sm:gap-12 sm:pb-16 lg:grid-cols-[1fr_minmax(0,500px)] lg:gap-16 lg:px-8 lg:pb-20 lg:pt-8 xl:gap-28">
                <section className="min-w-0 max-w-xl lg:pb-8" aria-labelledby="auth-heading">
                    <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-primary">
                        <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
                        Área reservada
                    </p>
                    <h1
                        id="auth-heading"
                        className="mt-6 max-w-[13ch] font-heading text-[clamp(2.75rem,5vw,4.75rem)] font-medium leading-[1.08] tracking-[-0.045em] text-balance sm:mt-7"
                    >
                        A sua equipa começa aqui.
                    </h1>
                    <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
                        Entre na sua conta ou crie um acesso para continuar.
                    </p>

                    <div className="relative mt-12 hidden max-w-[27rem] overflow-hidden rounded-[1.5rem] border border-[#d4e4d8] bg-[#e7f1e9] p-7 lg:block">
                        <div
                            aria-hidden="true"
                            className="absolute -right-12 -top-16 size-48 rounded-full border border-primary/10"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute -right-5 -top-9 size-32 rounded-full border border-primary/10"
                        />
                        <div className="relative flex items-start gap-4">
                            <span
                                aria-hidden="true"
                                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm"
                            >
                                <CalendarDays className="size-5" />
                            </span>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                                    Clientes e negócios
                                </p>
                                <p className="mt-2 max-w-[19rem] font-heading text-2xl leading-snug tracking-tight text-foreground">
                                    Marcações simples, do pedido à confirmação.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <Card className="w-full gap-0 rounded-[1.5rem] border border-border bg-card py-0 shadow-[0_20px_60px_-24px_rgba(24,51,47,0.2)] ring-0">
                    <CardHeader className="gap-0 px-6 pb-5 pt-7 sm:px-9 sm:pt-9">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                            Bem-vindo
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Escolha como pretende continuar.
                        </p>
                    </CardHeader>
                    <CardContent className="px-6 pb-7 sm:px-9 sm:pb-9">
                        <Tabs defaultValue="login" className="w-full gap-0">
                            <TabsList className="w-full gap-1 rounded-xl bg-muted p-1">
                                <TabsTrigger
                                    value="login"
                                    className="rounded-[0.6rem] bg-transparent px-3 py-3 text-center text-sm font-medium normal-case tracking-normal text-muted-foreground transition-colors hover:text-primary data-active:bg-card data-active:text-primary data-active:shadow-sm data-active:ring-1 data-active:ring-input focus-visible:outline-ring"
                                >
                                    Entrar
                                </TabsTrigger>
                                <TabsTrigger
                                    value="register"
                                    className="rounded-[0.6rem] bg-transparent px-3 py-3 text-center text-sm font-medium normal-case tracking-normal text-muted-foreground transition-colors hover:text-primary data-active:bg-card data-active:text-primary data-active:shadow-sm data-active:ring-1 data-active:ring-input focus-visible:outline-ring"
                                >
                                    Criar conta
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="pt-7">
                                <h2 className="font-heading text-2xl leading-tight tracking-tight text-foreground">
                                    Entrar na conta
                                </h2>
                                <p className="mb-6 mt-2 text-sm leading-6 text-muted-foreground">
                                    Introduza os seus dados para continuar.
                                </p>
                                <FormLogin />
                            </TabsContent>
                            <TabsContent value="register" className="pt-7">
                                <h2 className="font-heading text-2xl leading-tight tracking-tight text-foreground">
                                    Criar uma conta
                                </h2>
                                <p className="mb-6 mt-2 text-sm leading-6 text-muted-foreground">
                                    Preencha os seus dados para começar.
                                </p>
                                <FormRegister />
                                <p className="mt-6 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
                                    Ao criar uma conta, aceita os nossos{' '}
                                    <Link
                                        to={paths.public.terms}
                                        className="rounded-sm font-medium text-primary underline underline-offset-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
                                    >
                                        termos de utilização
                                    </Link>{' '}
                                    e a{' '}
                                    <Link
                                        to={paths.public.privacy}
                                        className="rounded-sm font-medium text-primary underline underline-offset-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring"
                                    >
                                        política de privacidade
                                    </Link>
                                    .
                                </p>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="gap-3 border-t border-border bg-muted/50 px-6 py-5 sm:px-9">
                        <LockKeyhole aria-hidden="true" className="size-4 shrink-0 text-primary" />
                        <p className="text-xs leading-5 text-muted-foreground">
                            Os seus dados são protegidos e utilizados apenas para disponibilizar o
                            serviço.
                        </p>
                    </CardFooter>
                </Card>
            </main>
        </SafeArea>
    )
}
