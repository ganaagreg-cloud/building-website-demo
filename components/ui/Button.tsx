import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'pill'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center min-h-[48px] min-w-[120px] px-6 text-sm font-body transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 disabled:cursor-not-allowed'

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-oak text-on-oak rounded-md hover:bg-[#A07E5A] active:bg-[#8D6D4C] disabled:bg-[rgba(42,39,36,0.20)] disabled:text-muted hover:shadow-sm',
    ghost:
      'bg-transparent text-[var(--color-text)] rounded-md border border-[rgba(42,39,36,0.20)] hover:border-[rgba(42,39,36,0.40)] active:bg-[rgba(42,39,36,0.06)] disabled:text-muted',
    pill: 'bg-oak text-on-oak rounded-full hover:bg-[#A07E5A] active:bg-[#8D6D4C] disabled:bg-[rgba(42,39,36,0.20)] disabled:text-muted hover:shadow-sm',
  }

  return (
    <button
      type={props.type ?? 'button'}
      disabled={disabled ?? loading}
      aria-busy={loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          aria-label="Ачаалж байна"
          className="block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      ) : (
        children
      )}
    </button>
  )
}
