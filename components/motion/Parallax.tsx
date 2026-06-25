'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxProps {
  children: React.ReactNode
  strength?: number
  className?: string
}

export function Parallax({ children, strength = 40, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: strength / 2 },
        {
          y: -strength / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [strength])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
