import type { ReactNode } from 'react'

interface SectionWrapperProps {
  number?: string
  className?: string
  children: ReactNode
}

export function SectionWrapper({ number, className = '', children }: SectionWrapperProps) {
  return (
    <section
      className={`relative overflow-hidden px-4 lg:px-8 ${className}`}
      style={{ paddingBlock: 'var(--section-padding)' }}
    >
      {children}
      {number !== undefined && (
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute font-display font-light leading-none"
          style={{
            bottom: '-0.2em',
            right: '-0.05em',
            fontSize: 'clamp(12rem, 28vw, 22rem)',
            color: 'var(--color-number)',
          }}
        >
          {number}
        </span>
      )}
    </section>
  )
}
