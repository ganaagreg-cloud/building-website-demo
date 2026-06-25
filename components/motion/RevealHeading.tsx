'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealHeadingProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

/**
 * Heading-specific reveal: text slides up from behind a clipped edge,
 * giving a "curtain lifts" entrance. Slower and more emphatic than Reveal.
 * Outer div clips overflow; inner div is the animated element.
 */
export function RevealHeading({ children, delay = 0, className = '' }: RevealHeadingProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!innerRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const inner = innerRef.current
    const ctx = gsap.context(() => {
      gsap.from(inner, {
        y: '60%',
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top 88%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={outerRef} style={{ overflow: 'hidden' }} className={className}>
      <div ref={innerRef}>{children}</div>
    </div>
  )
}
