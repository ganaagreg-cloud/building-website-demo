import type { StatItem } from '@/types'

interface StatBigProps extends StatItem {
  theme?: 'light' | 'dark'
  className?: string
}

export function StatBig({ value, label, suffix, theme = 'light', className = '' }: StatBigProps) {
  const numColor = 'var(--color-oak)'
  const labelColor = theme === 'dark' ? 'rgba(250,246,239,0.45)' : 'var(--color-muted)'

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span
        className="font-display font-light"
        style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', lineHeight: 1, color: numColor }}
      >
        {value}
        {suffix && (
          <span style={{ fontSize: '0.55em', marginLeft: '0.1em', color: numColor }}>
            {suffix}
          </span>
        )}
      </span>
      <span
        className="font-body"
        style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: labelColor }}
      >
        {label}
      </span>
    </div>
  )
}
