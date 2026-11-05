import { Building2Icon, MapPinIcon, MoreHorizontalIcon, PlusIcon, SparklesIcon } from 'lucide-react'
import { useState } from 'react'
import { RoleGate } from '@/src/(services)/access/ui/role-gate.tsx'
import {
    useBusinesses,
    useBusinessMutations,
    useEstablishments,
} from '@/src/(services)/business/hooks/use-business.ts'
import type { BusinessResponse } from '@/src/(services)/business/types/business.types.ts'
import AsideTopBar from '@/src/(services)/ui/layout/components/aside-top-bar.tsx'
import SafeArea from '@/src/components/shared/safe-area.tsx'
import Wrapper from '@/src/components/shared/wrapper.tsx'
import { Badge } from '@/src/components/ui/badge.tsx'
import { Button } from '@/src/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card.tsx'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { BusinessForm } from '@/src/components/ui/forms/business-form.tsx'
import { Skeleton } from '@/src/components/ui/skeleton.tsx'
import { Text } from '@/src/components/ui/text.tsx'

function BusinessList({
    businesses,
    selectedId,
    onSelect,
}: {
    businesses: BusinessResponse[]
    selectedId: string | null
    onSelect: (business: BusinessResponse) => void
}) {
    return (
        <div className="flex flex-col gap-2">
            {businesses.map((business) => (
                <button
                    key={business.id}
                    type="button"
                    className={`group flex items-start justify-between rounded-2xl border p-4 text-left transition-colors hover:bg-muted/50 ${business.id === selectedId ? 'border-primary/40 bg-primary/5' : 'border-border/60'}`}
                    onClick={() => onSelect(business)}
                >
                    <span className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                            <Building2Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                            <Text variant="small" className="truncate font-medium">
                                {business.name}
                            </Text>
                            <Text variant="xs" className="mt-1 line-clamp-2">
                                {business.description || 'Sem descrição adicionada'}
                            </Text>
                        </span>
                    </span>
                    <MoreHorizontalIcon
                        className="mt-1 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                    />
                </button>
            ))}
        </div>
    )
}

function BusinessDetail({ business }: { business: BusinessResponse }) {
    const { data: establishments = [], isLoading } = useEstablishments(business.id)
    return (
        <Card className="min-h-96 border-border/60 bg-card/70 shadow-none">
            <CardHeader className="gap-4 border-b border-border/60 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                    <Badge variant="secondary">
                        <Text asChild variant="xs">
                            <span>
                                {business.status === 'ACTIVE' ? 'Operação ativa' : business.status}
                            </span>
                        </Text>
                    </Badge>
                    <CardTitle>
                        <Text variant="h3">{business.name}</Text>
                    </CardTitle>
                    <Text variant="muted">
                        {business.description ||
                            'Adicione uma descrição para contextualizar sua operação.'}
                    </Text>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
                    <SparklesIcon className="size-4 text-primary" aria-hidden="true" />
                    <Text variant="xs">Estrutura organizada</Text>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <Text variant="large">Estabelecimentos</Text>
                        <Text variant="xs" className="mt-1">
                            Locais onde a sua equipe presta serviços.
                        </Text>
                    </div>
                    <Badge variant="outline">
                        <Text asChild variant="xs">
                            <span>{establishments.length} locais</span>
                        </Text>
                    </Badge>
                </div>
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                ) : establishments.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                        {establishments.map((establishment) => (
                            <div
                                key={establishment.id}
                                className="rounded-2xl border border-border/60 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <MapPinIcon
                                        className="mt-0.5 size-4 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <Text variant="small" className="font-medium">
                                            {establishment.name}
                                        </Text>
                                        <Text variant="xs" className="mt-1">
                                            {establishment.address || establishment.timezone}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty className="min-h-48 rounded-2xl border border-dashed border-border/70 p-6">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <MapPinIcon aria-hidden="true" />
                            </EmptyMedia>
                            <EmptyTitle>
                                <Text variant="large">Nenhum estabelecimento</Text>
                            </EmptyTitle>
                            <EmptyDescription>
                                <Text variant="muted">
                                    A estrutura do negócio começa pelos locais de atendimento.
                                </Text>
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Text variant="xs">
                                Os endpoints de estabelecimento já estão preparados na camada de
                                serviço.
                            </Text>
                        </EmptyContent>
                    </Empty>
                )}
            </CardContent>
        </Card>
    )
}

export function BusinessOverview() {
    const { data: businesses = [], isLoading, isError } = useBusinesses()
    const { create } = useBusinessMutations()
    const [selected, setSelected] = useState<BusinessResponse | null>(null)
    const [isCreateOpen, setCreateOpen] = useState(false)
    const activeBusiness =
        selected && businesses.some((business) => business.id === selected.id)
            ? selected
            : (businesses[0] ?? null)

    return (
        <RoleGate area="business">
            <SafeArea>
                <AsideTopBar title="Business" />
                <Wrapper className="flex w-full max-w-7xl flex-1 flex-col gap-8 overflow-y-auto p-6 pb-16 md:p-10">
                    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <Badge variant="secondary">
                                <Text asChild variant="xs">
                                    <span>Operação · Business</span>
                                </Text>
                            </Badge>
                            <Text variant="h1">Uma visão clara do seu negócio.</Text>
                            <Text variant="lead">
                                Organize a operação, os locais e os serviços em um só lugar.
                            </Text>
                        </div>
                        <Button
                            className="self-start sm:self-auto"
                            onClick={() => setCreateOpen(true)}
                        >
                            <PlusIcon aria-hidden="true" />
                            <Text asChild variant="small">
                                <span>Novo negócio</span>
                            </Text>
                        </Button>
                    </header>
                    {isError ? (
                        <Card className="border-destructive/30">
                            <CardContent className="p-6">
                                <Text variant="muted">
                                    Não foi possível carregar os negócios agora. Tente novamente em
                                    instantes.
                                </Text>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.8fr)]">
                            <Card className="border-border/60 bg-card/50 shadow-none">
                                <CardHeader>
                                    <CardTitle>
                                        <Text variant="h4">Seus negócios</Text>
                                    </CardTitle>
                                    <Text variant="muted">
                                        Selecione uma operação para ver os detalhes.
                                    </Text>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="flex flex-col gap-3">
                                            <Skeleton className="h-16 w-full" />
                                            <Skeleton className="h-16 w-full" />
                                        </div>
                                    ) : businesses.length > 0 ? (
                                        <BusinessList
                                            businesses={businesses}
                                            selectedId={activeBusiness?.id ?? null}
                                            onSelect={setSelected}
                                        />
                                    ) : (
                                        <Empty className="py-8">
                                            <EmptyHeader>
                                                <EmptyMedia variant="icon">
                                                    <Building2Icon aria-hidden="true" />
                                                </EmptyMedia>
                                                <EmptyTitle>
                                                    <Text variant="large">
                                                        Comece pelo seu negócio
                                                    </Text>
                                                </EmptyTitle>
                                                <EmptyDescription>
                                                    <Text variant="muted">
                                                        Crie a primeira operação para desbloquear a
                                                        gestão.
                                                    </Text>
                                                </EmptyDescription>
                                            </EmptyHeader>
                                            <EmptyContent>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setCreateOpen(true)}
                                                >
                                                    <Text asChild variant="small">
                                                        <span>Criar negócio</span>
                                                    </Text>
                                                </Button>
                                            </EmptyContent>
                                        </Empty>
                                    )}
                                </CardContent>
                            </Card>
                            {activeBusiness ? (
                                <BusinessDetail business={activeBusiness} />
                            ) : (
                                <Card className="flex min-h-96 items-center justify-center border-border/60 bg-muted/20 shadow-none">
                                    <Text variant="muted">
                                        Selecione um negócio para continuar.
                                    </Text>
                                </Card>
                            )}
                        </div>
                    )}
                </Wrapper>
                <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                <Text variant="h4">Novo negócio</Text>
                            </DialogTitle>
                            <DialogDescription>
                                <Text variant="muted">
                                    Cadastre a operação principal sem sair do painel.
                                </Text>
                            </DialogDescription>
                        </DialogHeader>
                        <BusinessForm
                            pending={create.isPending}
                            onCancel={() => setCreateOpen(false)}
                            onSubmit={(value) =>
                                create.mutate(value, { onSuccess: () => setCreateOpen(false) })
                            }
                        />
                        <DialogFooter>
                            <DialogClose render={<Button variant="ghost" />}>
                                <Text asChild variant="small">
                                    <span>Fechar</span>
                                </Text>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SafeArea>
        </RoleGate>
    )
}
