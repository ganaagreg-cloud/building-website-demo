import Link from 'next/link'

interface CTAPairProps {
  primary: string
  primaryHref: string
  secondary: string
  secondaryHref: string
  theme?: 'light' | 'dark'
  className?: string
}

export function CTAPair({
  primary,
  primaryHref,
  secondary,
  secondaryHref,
  theme = 'light',
  className = '',
}: CTAPairProps) {
  const outlineColor = theme === 'dark' ? 'rgba(250,246,239,0.3)' : 'rgba(42,39,36,0.25)'
  const outlineText = theme === 'dark' ? 'var(--color-on-dark)' : 'var(--color-text)'

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <Link
        href={primaryHref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '48px',
          paddingInline: '28px',
          borderRadius: '9999px',
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-on-dark)',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          letterSpacing: '0.01em',
          textDecoration: 'none',
          transition: 'background-color 150ms',
        }}
      >
        {primary}
      </Link>
      <Link
        href={secondaryHref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '48px',
          paddingInline: '28px',
          borderRadius: '9999px',
          border: `1.5px solid ${outlineColor}`,
          color: outlineText,
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
          textDecoration: 'none',
          transition: 'border-color 150ms',
        }}
      >
        {secondary}
      </Link>
    </div>
  )
}
