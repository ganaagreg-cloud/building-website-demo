'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealStatProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

/**
 * Stat-specific reveal: heavier upward drift (20px) with a clean
 * power3 ease. Use to wrap StatBig, big numerals, or KPI blocks.
 * Pair with CountUp inside for number animation.
 */
export function RevealStat({ children, delay = 0, className = '' }: RevealStatProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 20,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
