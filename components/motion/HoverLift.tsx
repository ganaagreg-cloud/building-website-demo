'use client'

import { useRef } from 'react'

interface HoverLiftProps {
  children: React.ReactNode
  className?: string
}

export function HoverLift({ children, className = '' }: HoverLiftProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ref.current.style.transform = 'translateY(-4px)'
    ref.current.style.boxShadow = 'var(--shadow-md)'
  }

  const handleLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = ''
    ref.current.style.boxShadow = ''
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: 'transform 200ms ease, box-shadow 200ms ease' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
    </div>
  )
}
