import {
    CalendarDaysIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CircleAlertIcon,
    Clock3Icon,
    PlusIcon,
    XIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { RoleGate } from '@/src/(services)/access/ui/role-gate.tsx'
import { useBookingMutations, useBookings } from '@/src/(services)/booking/hooks/use-booking.ts'
import type {
    BookingFilter,
    BookingResponse,
    BookingStatus,
} from '@/src/(services)/booking/types/booking.types.ts'
import AsideTopBar from '@/src/(services)/ui/layout/components/aside-top-bar.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Badge } from '@/src/components/ui/badge.tsx'
import { Button } from '@/src/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card.tsx'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/src/components/ui/dialog.tsx'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/src/components/ui/empty.tsx'
import { BookingForm } from '@/src/components/ui/forms/booking-form.tsx'
import { Input } from '@/src/components/ui/input.tsx'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select.tsx'
import { Skeleton } from '@/src/components/ui/skeleton.tsx'
import { Text } from '@/src/components/ui/text.tsx'

const statusLabels: Record<BookingStatus, string> = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmada',
    CANCELLED: 'Cancelada',
    COMPLETED: 'Concluída',
    REJECTED: 'Rejeitada',
}

const statusVariants: Record<BookingStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    PENDING: 'secondary',
    CONFIRMED: 'default',
    CANCELLED: 'outline',
    COMPLETED: 'outline',
    REJECTED: 'destructive',
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(value),
    )
}

function BookingRow({
    booking,
    onTransition,
    pending,
}: {
    booking: BookingResponse
    onTransition: (action: 'cancel' | 'confirm' | 'reject' | 'complete', id: string) => void
    pending: boolean
}) {
    const canConfirm = booking.status === 'PENDING'
    const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED'
    const canComplete = booking.status === 'CONFIRMED'
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                    <CalendarDaysIcon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <Text variant="small" className="font-medium">
                            {formatDate(booking.startAt)}
                        </Text>
                        <Badge variant={statusVariants[booking.status]}>
                            <Text asChild variant="xs">
                                <span>{statusLabels[booking.status]}</span>
                            </Text>
                        </Badge>
                    </div>
                    <Text variant="xs">Até {formatDate(booking.endAt)}</Text>
                    <Text variant="xs" className="truncate">
                        Establishment {booking.establishmentId}
                    </Text>
                </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
                {canConfirm && (
                    <Button
                        size="sm"
                        onClick={() => onTransition('confirm', booking.id)}
                        disabled={pending}
                    >
                        <CheckIcon aria-hidden="true" />
                        <Text asChild variant="small">
                            <span>Confirmar</span>
                        </Text>
                    </Button>
                )}
                {canComplete && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTransition('complete', booking.id)}
                        disabled={pending}
                    >
                        <CheckIcon aria-hidden="true" />
                        <Text asChild variant="small">
                            <span>Concluir</span>
                        </Text>
                    </Button>
                )}
                {canCancel && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onTransition('cancel', booking.id)}
                        disabled={pending}
                    >
                        <XIcon aria-hidden="true" />
                        <Text asChild variant="small">
                            <span>Cancelar</span>
                        </Text>
                    </Button>
                )}
            </div>
        </div>
    )
}

export function BookingOverview() {
    const [page, setPage] = useState(0)
    const [status, setStatus] = useState<BookingStatus | undefined>()
    const [searchId, setSearchId] = useState('')
    const [isCreateOpen, setCreateOpen] = useState(false)
    const filter = useMemo<BookingFilter>(
        () => ({
            page,
            size: 10,
            status,
            establishmentId: searchId.trim() || undefined,
            sort: 'startAt,asc',
        }),
        [page, searchId, status],
    )
    const { data, isLoading, isError } = useBookings(filter)
    const { create, transition } = useBookingMutations()
    const bookings = data?.content ?? []

    const handleStatus = (value: string | null) => {
        setStatus(value && value !== 'ALL' ? (value as BookingStatus) : undefined)
        setPage(0)
    }
    const handleTransition = (action: 'cancel' | 'confirm' | 'reject' | 'complete', id: string) =>
        transition.mutate({ action, id })

    return (
        <RoleGate area="booking">
            <SafeArea>
                <AsideTopBar title="Booking" />
                <Wrapper className="flex w-full max-w-7xl flex-1 flex-col gap-8 overflow-y-auto p-6 pb-16 md:p-10">
                    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <Badge variant="secondary">
                                <Text asChild variant="xs">
                                    <span>Operação · Booking</span>
                                </Text>
                            </Badge>
                            <Text variant="h1">Organize seus próximos passos.</Text>
                            <Text variant="lead">
                                Acompanhe solicitações, compromissos e mudanças de estado em um só
                                lugar.
                            </Text>
                        </div>
                        <Button
                            className="self-start sm:self-auto"
                            onClick={() => setCreateOpen(true)}
                        >
                            <PlusIcon aria-hidden="true" />
                            <Text asChild variant="small">
                                <span>Nova solicitação</span>
                            </Text>
                        </Button>
                    </header>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card size="sm">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <CardTitle>
                                    <Text variant="muted">Solicitações nesta página</Text>
                                </CardTitle>
                                <Clock3Icon
                                    className="size-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            </CardHeader>
                            <CardContent>
                                <Text variant="h3">{data?.content.length ?? '—'}</Text>
                                <Text variant="xs" className="mt-1">
                                    Resultados carregados
                                </Text>
                            </CardContent>
                        </Card>
                        <Card size="sm">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <CardTitle>
                                    <Text variant="muted">Total de solicitações</Text>
                                </CardTitle>
                                <CalendarDaysIcon
                                    className="size-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            </CardHeader>
                            <CardContent>
                                <Text variant="h3">{data?.totalElements ?? '—'}</Text>
                                <Text variant="xs" className="mt-1">
                                    Em todas as páginas
                                </Text>
                            </CardContent>
                        </Card>
                        <Card size="sm">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <CardTitle>
                                    <Text variant="muted">Página atual</Text>
                                </CardTitle>
                                <CircleAlertIcon
                                    className="size-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            </CardHeader>
                            <CardContent>
                                <Text variant="h3">{data ? data.number + 1 : '—'}</Text>
                                <Text variant="xs" className="mt-1">
                                    De {data?.totalPages ?? '—'}
                                </Text>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="border-border/60 bg-card/70 shadow-none">
                        <CardHeader className="gap-5 border-b border-border/60">
                            <div>
                                <CardTitle>
                                    <Text variant="h4">Solicitações</Text>
                                </CardTitle>
                                <Text variant="muted" className="mt-2">
                                    Filtre e acompanhe os agendamentos da operação.
                                </Text>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Input
                                    aria-label="Filtrar por establishment ID"
                                    placeholder="Establishment ID"
                                    value={searchId}
                                    onChange={(event) => {
                                        setSearchId(event.target.value)
                                        setPage(0)
                                    }}
                                />
                                <Select value={status ?? 'ALL'} onValueChange={handleStatus}>
                                    <SelectTrigger className="w-full sm:w-44">
                                        <SelectValue>
                                            <Text variant="small">
                                                {status ? statusLabels[status] : 'Todos os estados'}
                                            </Text>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            <Text variant="small">Todos os estados</Text>
                                        </SelectItem>
                                        {Object.entries(statusLabels).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                <Text variant="small">{label}</Text>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            {isError ? (
                                <div className="rounded-2xl border border-destructive/30 p-6">
                                    <Text variant="muted">
                                        Não foi possível carregar as solicitações agora. Tente
                                        novamente em instantes.
                                    </Text>
                                </div>
                            ) : isLoading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            ) : bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <BookingRow
                                        key={booking.id}
                                        booking={booking}
                                        onTransition={handleTransition}
                                        pending={transition.isPending}
                                    />
                                ))
                            ) : (
                                <Empty className="min-h-56 rounded-2xl border border-dashed border-border/70 p-6">
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <CalendarDaysIcon aria-hidden="true" />
                                        </EmptyMedia>
                                        <EmptyTitle>
                                            <Text variant="large">
                                                Nenhuma solicitação encontrada
                                            </Text>
                                        </EmptyTitle>
                                        <EmptyDescription>
                                            <Text variant="muted">
                                                Ajuste os filtros ou crie uma nova solicitação para
                                                começar.
                                            </Text>
                                        </EmptyDescription>
                                    </EmptyHeader>
                                    <EmptyContent>
                                        <Button
                                            variant="outline"
                                            onClick={() => setCreateOpen(true)}
                                        >
                                            <Text asChild variant="small">
                                                <span>Criar solicitação</span>
                                            </Text>
                                        </Button>
                                    </EmptyContent>
                                </Empty>
                            )}
                            {data && data.totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-border/60 pt-5">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={data.first}
                                        onClick={() =>
                                            setPage((current) => Math.max(0, current - 1))
                                        }
                                    >
                                        <ChevronLeftIcon aria-hidden="true" />
                                        <Text asChild variant="small">
                                            <span>Anterior</span>
                                        </Text>
                                    </Button>
                                    <Text variant="xs">
                                        Página {data.number + 1} de {data.totalPages}
                                    </Text>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={data.last}
                                        onClick={() => setPage((current) => current + 1)}
                                    >
                                        <Text asChild variant="small">
                                            <span>Seguinte</span>
                                        </Text>
                                        <ChevronRightIcon aria-hidden="true" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Wrapper>
                <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                <Text variant="h4">Nova solicitação</Text>
                            </DialogTitle>
                            <DialogDescription>
                                <Text variant="muted">
                                    Informe os identificadores do catálogo e o período do
                                    agendamento.
                                </Text>
                            </DialogDescription>
                        </DialogHeader>
                        <BookingForm
                            pending={create.isPending}
                            onCancel={() => setCreateOpen(false)}
                            onSubmit={(request) =>
                                create.mutate(
                                    { request, idempotencyKey: crypto.randomUUID() },
                                    { onSuccess: () => setCreateOpen(false) },
                                )
                            }
                        />
                    </DialogContent>
                </Dialog>
            </SafeArea>
        </RoleGate>
    )
}
