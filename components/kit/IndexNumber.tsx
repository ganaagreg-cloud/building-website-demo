interface IndexNumberProps {
  index: number
  total: number
  theme?: 'light' | 'dark'
  className?: string
}

export function IndexNumber({ index, total, theme = 'light', className = '' }: IndexNumberProps) {
  const dividerColor = theme === 'dark' ? 'rgba(250,246,239,0.18)' : 'rgba(42,39,36,0.18)'
  const totalColor = theme === 'dark' ? 'rgba(250,246,239,0.3)' : 'rgba(42,39,36,0.3)'
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className={`flex items-center gap-2 font-display font-light ${className}`} aria-hidden="true">
      <span style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: 'var(--color-oak)' }}>{pad(index)}</span>
      <span style={{ fontSize: '10px', color: dividerColor }}>/</span>
      <span style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', color: totalColor }}>{pad(total)}</span>
    </div>
  )
}
