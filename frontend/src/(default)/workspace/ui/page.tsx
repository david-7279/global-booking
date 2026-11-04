import { LogOut, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuthentication } from '@/src/(default)/authentication/hooks/use-authentication.ts'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import { Button } from '@/src/components/ui/button.tsx'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card.tsx'
import { paths } from '@/src/router/paths.ts'

export default function WorkspacePage() {
    const { user, logout } = useAuthentication()
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        navigate(paths.public.root, { replace: true })
    }

    return (
        <SafeArea>
            <header className="border-b border-border/70">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
                    <span className="font-heading text-xl font-semibold tracking-tight">
                        Atlas<span className="text-primary">.</span>
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut aria-hidden="true" /> Sair
                    </Button>
                </div>
            </header>
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 lg:px-8 lg:py-20">
                <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Área autenticada
                    </p>
                    <h1 className="mt-4 font-heading text-5xl tracking-tight">
                        Bem-vindo, {user?.name ?? 'à sua conta'}.
                    </h1>
                    <p className="mt-5 text-lg leading-8 text-muted-foreground">
                        Esta é a base protegida da aplicação. As próximas funcionalidades podem
                        crescer aqui sem alterar o núcleo público ou a autenticação.
                    </p>
                </div>
                <Card className="mt-12 max-w-xl">
                    <CardHeader className="border-b border-border">
                        <p className="font-heading text-2xl">Sessão ativa</p>
                        <p className="text-sm text-muted-foreground">
                            A sua conta está autenticada e pronta a utilizar.
                        </p>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ShieldCheck aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium">{user?.email}</p>
                            <p className="text-sm text-muted-foreground">Acesso protegido</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </SafeArea>
    )
}
