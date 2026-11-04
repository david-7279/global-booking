import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/src/lib/utils'

function Tabs({ className, orientation = 'horizontal', ...props }: TabsPrimitive.Root.Props) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
            {...props}
        />
    )
}

const tabsListVariants = cva(
    'group/tabs-list inline-flex items-center text-muted-foreground group-data-horizontal/tabs:h-fit group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col',
    {
        variants: {
            variant: {
                /** Seamless full-width band of block tabs (the monochrome style). */
                default: 'w-full',
                line: 'w-fit gap-1 bg-transparent',
            },
        },
        defaultVariants: { variant: 'default' },
    },
)

function TabsList({
    className,
    variant = 'default',
    ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
    return (
        <TabsPrimitive.Tab
            data-slot="tabs-trigger"
            className={cn(
                // Base block: full share of the band, generous text padding, sharp corners
                'flex-1 cursor-pointer border-0 rounded-none px-4 py-3 text-left uppercase tracking-widest text-xs font-semibold transition-colors duration-150',
                // Inactive: the muted block;
                'bg-muted text-foreground',
                // Active: full inversion — black block, white text (the design system's
                // emphasis move; no underline, no ring, no border)
                'data-active:bg-foreground data-active:text-background',
                // Focus: 2px black outline, offset — monochrome, high contrast
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground',
                'disabled:pointer-events-none disabled:opacity-50',
                // Vertical orientation variant (sidebar-style stacking) preserved
                'group-data-vertical/tabs:w-full',
                // Suppress the old underline `after` + pill styling entirely
                'after:hidden',
                className,
            )}
            {...props}
        />
    )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
    return (
        <TabsPrimitive.Panel
            data-slot="tabs-content"
            className={cn('flex-1 text-sm outline-none', className)}
            {...props}
        />
    )
}

/**
 * Two-line tab label: muted uppercase kicker over a bold uppercase label —
 * the [MODE 01] / SIGN IN pattern from the design reference.
 */
function TabsTriggerLabel({ kicker, label }: { kicker: string; label: string }) {
    return (
        <span className="flex flex-col gap-1">
            <span className="text-[10px] font-normal text-current opacity-80">{kicker}</span>
            <span className="text-[11px] font-medium text-balance">{label}</span>
        </span>
    )
}

export { Tabs, TabsContent, TabsList, TabsTrigger, TabsTriggerLabel, tabsListVariants }
