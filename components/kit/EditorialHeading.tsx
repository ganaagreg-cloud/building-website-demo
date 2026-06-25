import type { HeadingPart } from '@/types'

interface EditorialHeadingProps {
  parts: HeadingPart[]
  as?: 'h1' | 'h2' | 'h3'
  theme?: 'light' | 'dark'
  className?: string
  style?: React.CSSProperties
}

export function EditorialHeading({
  parts,
  as: Tag = 'h2',
  theme = 'light',
  className = '',
  style,
}: EditorialHeadingProps) {
  const baseColor = theme === 'dark' ? 'var(--color-on-dark)' : 'var(--color-text)'

  return (
    <Tag
      className={`font-display font-light ${className}`}
      style={{ color: baseColor, lineHeight: 1.08, ...style }}
    >
      {parts.map((part, i) => {
        if (!part.accent) {
          return <span key={i}>{part.text}</span>
        }
        if (part.accent === 'red') {
          return (
            <span key={i} style={{ color: 'var(--color-error)' }}>
              {part.text}
            </span>
          )
        }
        if (part.accent === 'oak') {
          return (
            <span key={i} style={{ color: 'var(--color-oak)' }}>
              {part.text}
            </span>
          )
        }
        // italic — oak warmth, not terracotta
        return (
          <em key={i} style={{ fontStyle: 'italic', color: 'var(--color-oak)' }}>
            {part.text}
          </em>
        )
      })}
    </Tag>
  )
}
