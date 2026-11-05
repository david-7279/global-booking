import {
    CheckCheckIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    type LucideIcon,
    WalletIcon,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { useAuthenticatedUser } from '@/src/(default)/authentication/hooks/use-authenticated-user.ts'
import { useAuthentication } from '@/src/(default)/authentication/hooks/use-authentication.ts'
import type { UserRole } from '@/src/(default)/authentication/types/authentication.types.ts'
import AsideHeader from '@/src/(services)/ui/layout/components/aside-header.tsx'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from '@/src/components/ui/sidebar'
import { paths } from '@/src/router/paths.ts'

interface BookingNavItem {
    label: string
    path: string
    icon: LucideIcon
    /** Roles allowed to see this item — undefined = all roles. */
    roles?: UserRole[]
    /** Optional static chip (display only — authz is `roles`). */
    badge?: string
}

const NAV_ITEMS: BookingNavItem[] = [
    {
        label: 'Dashboard',
        path: paths.workspace.dashboard,
        roles: ['USER', 'BUSINESS_OWNER', 'ADMIN'],
        icon: LayoutDashboardIcon,
    },
    {
        label: 'Business',
        path: paths.workspace.business.root,
        roles: ['BUSINESS_OWNER', 'ADMIN'],
        icon: WalletIcon,
    },
    {
        label: 'Booking',
        path: paths.workspace.booking.root,
        icon: CheckCheckIcon,
        roles: ['USER', 'ADMIN'],
    },
]

export function AsideSidebar() {
    const user = useAuthenticatedUser()
    const { logout } = useAuthentication()
    const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user.role))

    return (
        <Sidebar collapsible="icon" aria-label="Planner navigation">
            <AsideHeader />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end={item.path === paths.workspace.dashboard}
                                    >
                                        {({ isActive }) => (
                                            <SidebarMenuButton
                                                render={<span />}
                                                isActive={isActive}
                                                tooltip={item.label}
                                                className="h-10"
                                            >
                                                <item.icon aria-hidden="true" />
                                                <span>{item.label}</span>
                                                {item.badge && (
                                                    <span className="ml-auto rounded-full border border-current/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </SidebarMenuButton>
                                        )}
                                    </NavLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator />
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={
                                <button
                                    type="button"
                                    onClick={() => void logout()}
                                    aria-label="Sign out"
                                />
                            }
                            tooltip="Sign out"
                        >
                            <LogOutIcon aria-hidden="true" />
                            <span>Sign out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="min-w-0 px-2 pb-1 group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs uppercase tracking-wider text-muted-foreground">
                        {user.role}
                    </p>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
