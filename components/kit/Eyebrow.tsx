interface EyebrowProps {
  label: string
  theme?: 'light' | 'dark'
  className?: string
}

export function Eyebrow({ label, theme = 'light', className = '' }: EyebrowProps) {
  const textColor = theme === 'dark' ? 'rgba(250,246,239,0.5)' : 'var(--color-muted)'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        style={{ display: 'block', width: '28px', height: '1.5px', backgroundColor: 'var(--color-accent)', flexShrink: 0 }}
      />
      <span
        className="font-body"
        style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: textColor }}
      >
        {label}
      </span>
    </div>
  )
}
