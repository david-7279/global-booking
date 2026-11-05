// src/(default)/landing/ui/components/reveal.tsx

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/src/lib/utils.ts'

type RevealProps = {
    children: ReactNode
    className?: string
    /** Stagger offset in milliseconds. */
    delay?: number
}

/**
 * Fades content in once, the first time it scrolls into view. The hidden state only
 * applies when the user has not asked for reduced motion, so nothing is ever left invisible.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '0px 0px -8% 0px' },
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
            className={cn(
                'motion-safe:transition-[opacity,translate] motion-safe:duration-700 motion-safe:ease-out',
                !visible && 'motion-safe:translate-y-5 motion-safe:opacity-0',
                className,
            )}
        >
            {children}
        </div>
    )
}
