import { BarChart3Icon, Building2Icon, PlusIcon, UsersIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { RoleGate } from '@/src/(services)/access/ui/role-gate.tsx'
import AsideTopBar from '@/src/(services)/ui/layout/components/aside-top-bar.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Badge } from '@/src/components/ui/badge.tsx'
import { Button } from '@/src/components/ui/button.tsx'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/src/components/ui/card.tsx'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/src/components/ui/empty.tsx'
import { paths } from '@/src/router/paths.ts'

const metrics = [
    { label: 'Reservas no período', value: '—', hint: 'Sem dados no momento', icon: BarChart3Icon },
    { label: 'Equipe ativa', value: '—', hint: 'Sem dados no momento', icon: UsersIcon },
    { label: 'Perfil do negócio', value: '—', hint: 'Ainda não configurado', icon: Building2Icon },
]

export default function BusinessPage() {
    const navigate = useNavigate()

    return (
        <RoleGate area="business">
            <SafeArea>
                <AsideTopBar title="Business" />
                <Wrapper className="flex w-full max-w-5xl flex-1 flex-col gap-8 overflow-y-auto p-6 pb-16 md:p-10">
                    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <Badge variant="secondary">Operação · Business</Badge>
                            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-6xl">
                                Uma visão clara do seu negócio.
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                                Acompanhe a operação da equipe e prepare o próximo ciclo de
                                reservas.
                            </p>
                        </div>
                        <Button
                            className="self-start sm:self-auto"
                            onClick={() => navigate(paths.workspace.dashboard)}
                        >
                            <PlusIcon aria-hidden="true" />
                            Configurar negócio
                        </Button>
                    </header>

                    <section aria-label="Resumo do business" className="grid gap-4 md:grid-cols-3">
                        {metrics.map(({ label, value, hint, icon: Icon }) => (
                            <Card key={label} size="sm">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <CardTitle className="text-muted-foreground">{label}</CardTitle>
                                    <Icon
                                        className="size-4 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </CardHeader>
                                <CardContent>
                                    <p className="font-display text-3xl">{value}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </section>

                    <Card className="min-h-72">
                        <CardHeader>
                            <CardTitle>Visão operacional</CardTitle>
                            <CardDescription>
                                Indicadores e alertas do negócio aparecerão aqui.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-1">
                            <Empty className="p-4">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Building2Icon aria-hidden="true" />
                                    </EmptyMedia>
                                    <EmptyTitle>Sem dados operacionais</EmptyTitle>
                                    <EmptyDescription>
                                        Configure seu negócio para começar a acompanhar sua
                                        operação.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(paths.workspace.dashboard)}
                                    >
                                        Ir para o dashboard
                                    </Button>
                                </EmptyContent>
                            </Empty>
                        </CardContent>
                    </Card>
                </Wrapper>
            </SafeArea>
        </RoleGate>
    )
}
