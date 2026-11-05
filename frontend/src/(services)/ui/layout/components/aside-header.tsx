import { ShredderIcon } from 'lucide-react'
import { SidebarHeader } from '@/src/components/ui/sidebar'

const AsideHeader = () => {
    return (
        <SidebarHeader className="p-2">
            <div className="flex min-w-0 items-center gap-3 rounded-xl px-2 py-2">
                <ShredderIcon className="size-8 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0 text-left group-data-[collapsible=icon]:hidden">
                    <p className="truncate text-sm font-semibold">Atlas. Booking</p>
                    <p className="truncate text-xs text-muted-foreground">Back Office</p>
                </div>
                <span className="sr-only">Atlas Booking Back Office</span>
            </div>
        </SidebarHeader>
    )
}

export default AsideHeader
