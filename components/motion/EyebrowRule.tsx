'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface EyebrowRuleProps {
  label: string
  theme?: 'light' | 'dark'
  className?: string
}

export function EyebrowRule({ label, theme = 'light', className = '' }: EyebrowRuleProps) {
  const ruleRef = useRef<HTMLSpanElement>(null)
  const textColor = theme === 'dark' ? 'rgba(250,246,239,0.5)' : 'var(--color-muted)'

  useEffect(() => {
    if (!ruleRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from(ruleRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.55,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: ruleRef.current,
          start: 'top 88%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        ref={ruleRef}
        aria-hidden="true"
        style={{
          display: 'block',
          width: '28px',
          height: '1.5px',
          backgroundColor: 'var(--color-accent)',
          flexShrink: 0,
        }}
      />
      <span
        className="font-body"
        style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: textColor }}
      >
        {label}
      </span>
    </div>
  )
}
