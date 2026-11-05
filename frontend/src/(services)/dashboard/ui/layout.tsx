import { Outlet } from 'react-router'
import { AsideSidebar } from '@/src/(services)/ui/layout/components/aside-sidebar.tsx'
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar'
import { TooltipProvider } from '@/src/components/ui/tooltip'

const PlannerLayout = () => {
    return (
        <TooltipProvider>
            <SidebarProvider className="h-svh min-h-0 overflow-hidden">
                <AsideSidebar />
                <SidebarInset className="min-h-0 overflow-hidden">
                    <Outlet />
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}

export default PlannerLayout
