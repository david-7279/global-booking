// src/(services)/ui/layout/components/aside-menu-item.tsx

import { motion, type Variants } from 'framer-motion'
import type React from 'react'
import AsideNavLink, {
    type NavItem,
} from '@/src/(services)/ui/layout/components/aside-nav-link.tsx'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from '@/src/components/ui/sidebar.tsx'

const stagger: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.04, delayChildren: 0.04 },
    },
}

interface MenuItemProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
    title?: string
    items: NavItem[]
    isActive: (item: NavItem) => boolean
    onItemClick: (item: NavItem) => void
    variants?: Variants
}

const AsideMenuItem = ({
    title,
    items,
    isActive,
    onItemClick,
    variants,
    ...props
}: MenuItemProps) => {
    return (
        <SidebarGroup {...props}>
            <motion.nav
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="flex-1 overflow-y-auto"
            >
                {title && (
                    <SidebarGroupLabel className="px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {title}
                    </SidebarGroupLabel>
                )}

                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <AsideNavLink
                                item={item}
                                active={isActive(item)}
                                onClick={() => onItemClick(item)}
                                variants={variants}
                            />
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </motion.nav>
        </SidebarGroup>
    )
}
export default AsideMenuItem
