'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealImageProps {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Image-specific reveal: the container fades in while the image
 * scales very subtly from 1.04→1, giving a gentle "breathe in" entrance.
 * Wrap your next/image or img element with this.
 */
export function RevealImage({ children, delay = 0, className = '', style }: RevealImageProps) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const outer = outerRef.current
    const inner = innerRef.current
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top 90%',
          once: true,
        },
      })
      tl.from(outer, { opacity: 0, duration: 0.6, ease: 'power2.out', delay })
      tl.from(inner, { scale: 1.04, duration: 0.9, ease: 'power2.out' }, '<')
    })

    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={outerRef} className={className} style={{ overflow: 'hidden', ...style }}>
      <div ref={innerRef} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  )
}
