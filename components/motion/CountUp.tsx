'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CountUpProps {
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function CountUp({ to, duration = 1.4, prefix = '', suffix = '', className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${prefix}${to}${suffix}`
      return
    }

    const obj = { val: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: to,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [to, duration, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
