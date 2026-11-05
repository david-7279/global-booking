import {ArrowDown, ArrowRight, Check, LockKeyhole, ShieldCheck, Sparkles} from 'lucide-react'
import {Link} from 'react-router'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import {buttonVariants} from '@/src/components/ui/button.tsx'
import {cn} from '@/src/lib/utils.ts'
import {paths} from '@/src/router/paths.ts'
import {landingContent} from "@/src/(default)/landing/content/landing-content.ts";

export default function LandingPage() {
    const {navigation, hero, productPreview, trust, process, features, cta, footer} = landingContent

    return (
        <SafeArea>
            <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
                    <Link
                        to={paths.public.root}
                        className="font-heading text-xl font-semibold tracking-tight"
                    >
                        Atlas<span className="text-primary">.</span>
                    </Link>
                    <nav
                        aria-label="Navegação principal"
                        className="flex items-center gap-3 sm:gap-7"
                    >
                        <Link
                            to={paths.public.terms}
                            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
                        >
                            {navigation.terms}
                        </Link>
                        <Link
                            to={paths.public.privacy}
                            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
                        >
                            {navigation.privacy}
                        </Link>
                        <Link
                            to={paths.auth}
                            className={cn(buttonVariants({variant: 'outline', size: 'sm'}))}
                        >
                            {navigation.signIn}
                        </Link>
                    </nav>
                </div>
            </header>

            <main>
                <section className="relative overflow-hidden border-b border-border">
                    <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_32rem)]"/>
                    <div
                        className="relative mx-auto grid w-full max-w-7xl gap-16 px-6 pb-20 pt-20 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-28">
                        <div className="max-w-2xl">
                            <div
                                className="mb-7 inline-flex items-center gap-2 border border-border bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                <Sparkles className="size-3.5 text-primary" aria-hidden="true"/>
                                {hero.eyebrow}
                            </div>
                            <h1 className="max-w-xl font-heading text-5xl leading-[0.96] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
                                {hero.title}
                            </h1>
                            <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">
                                {hero.description}
                            </p>
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to={paths.auth}
                                    className={cn(buttonVariants({size: 'lg'}))}
                                >
                                    {hero.primaryAction}
                                    <ArrowRight aria-hidden="true"/>
                                </Link>
                                <a
                                    href="#como-funciona"
                                    className={cn(
                                        buttonVariants({size: 'lg', variant: 'outline'}),
                                    )}
                                >
                                    {hero.secondaryAction}
                                </a>
                            </div>
                            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
                                <ShieldCheck className="size-4 text-primary" aria-hidden="true"/>
                                {hero.reassurance}
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
                            <div
                                className="absolute -inset-5 bg-primary/5 blur-3xl"
                                aria-hidden="true"
                            />
                            <div className="relative border border-border bg-muted/35 p-4 sm:p-7">
                                <div
                                    className="border border-border bg-card shadow-[0_24px_80px_-35px_color-mix(in_oklch,var(--foreground)_40%,transparent)]">
                                    <div
                                        className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-7">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                                {productPreview.label}
                                            </p>
                                            <p className="mt-2 font-heading text-2xl tracking-tight">
                                                {productPreview.title}
                                            </p>
                                        </div>
                                        <div
                                            className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <Check className="size-5" aria-hidden="true"/>
                                        </div>
                                    </div>
                                    <div className="space-y-3 p-5 sm:p-7">
                                        {productPreview.items.map((item, index) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-3 border border-border/80 bg-background p-3.5"
                                            >
                                                <span
                                                    className="flex size-7 items-center justify-center bg-muted text-[10px] font-semibold tracking-wider text-muted-foreground">
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
                                    <div
                                        className="flex items-center gap-2 border-t border-border px-5 py-4 text-xs text-muted-foreground sm:px-7">
                                        <LockKeyhole className="size-3.5" aria-hidden="true"/>
                                        {productPreview.footer}
                                        <span className="ml-auto text-primary">
                                            {productPreview.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a
                        href="#como-funciona"
                        aria-label="Descer para saber mais"
                        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground lg:block"
                    >
                        <ArrowDown className="size-4" aria-hidden="true"/>
                    </a>
                </section>

                <section
                    aria-label="Valores do Atlas"
                    className="border-b border-border bg-muted/20"
                >
                    <div
                        className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {trust.label}
                        </p>
                        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
                            {trust.values.map((value) => (
                                <span key={value} className="flex items-center gap-2">
                                    <span
                                        className="size-1.5 rounded-full bg-primary"
                                        aria-hidden="true"
                                    />
                                    {value}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="como-funciona" className="border-b border-border">
                    <div
                        className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:py-28">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {process.eyebrow}
                            </p>
                            <h2 className="mt-4 max-w-md font-heading text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
                                {process.title}
                            </h2>
                            <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
                                {process.description}
                            </p>
                        </div>
                        <div className="grid gap-0 border-t border-border">
                            {process.steps.map((step) => (
                                <article
                                    key={step.number}
                                    className="grid gap-5 border-b border-border py-7 sm:grid-cols-[4rem_0.8fr_1fr] sm:items-start sm:gap-8"
                                >
                                    <span className="font-heading text-2xl text-primary">
                                        {step.number}
                                    </span>
                                    <h3 className="text-lg font-semibold">{step.title}</h3>
                                    <p className="max-w-sm leading-7 text-muted-foreground">
                                        {step.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-muted/25">
                    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
                        <div className="max-w-xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                {features.eyebrow}
                            </p>
                            <h2 className="mt-4 font-heading text-4xl tracking-[-0.03em] sm:text-5xl">
                                {features.title}
                            </h2>
                        </div>
                        <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-3">
                            {features.items.map((feature) => (
                                <article key={feature.title} className="bg-background p-7 sm:p-9">
                                    <div
                                        className="mb-12 flex size-9 items-center justify-center border border-primary/40 text-primary">
                                        <Check className="size-4" aria-hidden="true"/>
                                    </div>
                                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                                    <p className="mt-3 leading-7 text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="border-y border-border bg-primary text-primary-foreground">
                    <div
                        className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 sm:flex-row sm:items-end sm:justify-between lg:px-10 lg:py-20">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">
                                {cta.eyebrow}
                            </p>
                            <h2 className="mt-4 font-heading text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
                                {cta.title}
                            </h2>
                            <p className="mt-5 max-w-lg leading-7 text-primary-foreground/75">
                                {cta.description}
                            </p>
                        </div>
                        <Link
                            to={paths.auth}
                            className={cn(buttonVariants({variant: 'secondary', size: 'lg'}))}
                        >
                            {cta.action}
                            <ArrowRight aria-hidden="true"/>
                        </Link>
                    </div>
                </section>
            </main>

            <footer
                className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
                <p>
                    © {new Date().getFullYear()} Atlas. {footer.copyright}
                </p>
                <nav aria-label="Links legais" className="flex flex-wrap gap-x-6 gap-y-2">
                    <Link
                        to={paths.public.terms}
                        className="transition-colors hover:text-foreground"
                    >
                        {footer.terms}
                    </Link>
                    <Link
                        to={paths.public.privacy}
                        className="transition-colors hover:text-foreground"
                    >
                        {footer.privacy}
                    </Link>
                </nav>
            </footer>
        </SafeArea>
    )
}
