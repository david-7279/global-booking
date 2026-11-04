import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/src/lib/utils'

const textVariants = cva('text-foreground', {
    variants: {
        variant: {
            default: 'text-base',
            h1: 'font-display scroll-m-20 text-6xl font-medium tracking-tight text-balance md:text-7xl',
            h2: 'font-display scroll-m-20 text-4xl font-medium tracking-tight text-balance',
            h3: 'font-display scroll-m-20 text-3xl font-medium tracking-tight',
            h4: 'font-display scroll-m-20 text-2xl font-medium tracking-tight',
            h5: 'font-display scroll-m-20 text-xl tracking-tight',
            p: 'leading-7 [&:not(:first-child)]:mt-4',
            blockquote:
                'font-display mt-4 border-l-2 border-border pl-4 italic text-muted-foreground',
            code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
            lead: 'text-xl text-muted-foreground',
            large: 'text-lg font-semibold',
            small: 'text-sm leading-none',
            muted: 'text-sm text-muted-foreground',
            xs: 'text-xs text-muted-foreground',
        },
    },
    defaultVariants: { variant: 'default' },
})

type TextVariant = NonNullable<VariantProps<typeof textVariants>['variant']>

const VARIANT_ELEMENT: Record<TextVariant, React.ElementType> = {
    default: 'p',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    p: 'p',
    blockquote: 'blockquote',
    code: 'code',
    lead: 'p',
    large: 'div',
    small: 'small',
    muted: 'p',
    xs: 'span',
}

export interface TextProps
    extends React.HTMLAttributes<HTMLElement>,
        VariantProps<typeof textVariants> {
    asChild?: boolean
    as?: React.ElementType
}

const Text = React.forwardRef<HTMLElement, TextProps>(
    ({ className, variant = 'default', asChild = false, as, ...props }, ref) => {
        const Comp = asChild ? Slot : (as ?? VARIANT_ELEMENT[variant ?? 'default'])

        return <Comp ref={ref} className={cn(textVariants({ variant }), className)} {...props} />
    },
)
Text.displayName = 'Text'

export { Text, textVariants }
