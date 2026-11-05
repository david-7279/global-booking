import { CalendarDaysIcon, ClipboardListIcon, PlusIcon, SparklesIcon } from 'lucide-react'
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
    {
        label: 'Solicitações abertas',
        value: '—',
        hint: 'Sem dados no momento',
        icon: ClipboardListIcon,
    },
    {
        label: 'Próximos compromissos',
        value: '—',
        hint: 'Sem dados no momento',
        icon: CalendarDaysIcon,
    },
    { label: 'Saldo disponível', value: '—', hint: 'Sem dados no momento', icon: SparklesIcon },
]

export default function BookingPage() {
    const navigate = useNavigate()

    return (
        <RoleGate area="booking">
            <SafeArea>
                <AsideTopBar title="Booking" />
                <Wrapper className="flex w-full max-w-5xl flex-1 flex-col gap-8 overflow-y-auto p-6 pb-16 md:p-10">
                    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <Badge variant="secondary">Operação · Booking</Badge>
                            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-6xl">
                                Organize seus próximos passos.
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                                Acompanhe solicitações, compromissos e seu saldo em um só lugar.
                            </p>
                        </div>
                        <Button
                            className="self-start sm:self-auto"
                            onClick={() => navigate(paths.workspace.booking.dashboard)}
                        >
                            <PlusIcon aria-hidden="true" />
                            Nova solicitação
                        </Button>
                    </header>

                    <section aria-label="Resumo do booking" className="grid gap-4 md:grid-cols-3">
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
                            <CardTitle>Atividade recente</CardTitle>
                            <CardDescription>
                                Suas solicitações e atualizações aparecerão aqui.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-1">
                            <Empty className="p-4">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <CalendarDaysIcon aria-hidden="true" />
                                    </EmptyMedia>
                                    <EmptyTitle>Nenhuma atividade ainda</EmptyTitle>
                                    <EmptyDescription>
                                        Quando houver movimentações, você poderá acompanhá-las nesta
                                        área.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(paths.workspace.booking.dashboard)}
                                    >
                                        Ver solicitações
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
