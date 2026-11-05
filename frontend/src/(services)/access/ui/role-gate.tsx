import { ArrowLeftIcon, LockKeyholeIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useRoleAccess } from '@/src/(services)/access/hooks/use-role-access.ts'
import type { ServiceArea } from '@/src/(services)/access/types/access.types.ts'
import { Button } from '@/src/components/ui/button.tsx'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/src/components/ui/empty.tsx'
import { paths } from '@/src/router/paths.ts'

type RoleGateProps = {
    area: ServiceArea
    children: ReactNode
}

export function RoleGate({ area, children }: RoleGateProps) {
    const { canAccess } = useRoleAccess(area)

    if (canAccess) return children

    return (
        <Empty className="min-h-[60vh] p-6">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <LockKeyholeIcon aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>Acesso restrito</EmptyTitle>
                <EmptyDescription>
                    Esta área está disponível apenas para o perfil autorizado. Volte ao dashboard
                    para continuar.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button render={<Link to={paths.workspace.dashboard} />}>
                    <ArrowLeftIcon aria-hidden="true" />
                    Voltar ao dashboard
                </Button>
            </EmptyContent>
        </Empty>
    )
}
