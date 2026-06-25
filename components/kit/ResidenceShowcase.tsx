import Image from 'next/image'
import Link from 'next/link'
import type { UnitType } from '@/types'

interface ResidenceShowcaseProps {
  unitType: UnitType
  side?: 'left' | 'right'
  theme?: 'light' | 'dark'
  isLast?: boolean
}

function formatPrice(n: number) {
  return `₮${Math.round(n / 1_000_000)}M`
}

export function ResidenceShowcase({
  unitType,
  side = 'left',
  theme = 'light',
  isLast = false,
}: ResidenceShowcaseProps) {
  const imageSrc = unitType.dollhouseImage ?? unitType.gallery[0] ?? unitType.floorPlanImage

  const isLight = theme === 'light'
  const contentBg    = isLight ? '#FFFFFF'                    : 'var(--bg-dark)'
  const panelBg      = isLight ? '#F4F4F4'                    : '#111111'
  const headingColor = isLight ? 'var(--color-text)'          : 'var(--color-on-dark)'
  const bodyColor    = isLight ? 'var(--color-muted)'         : 'rgba(255,255,255,0.5)'
  const borderColor  = isLight ? 'rgba(0,0,0,0.07)'          : 'rgba(255,255,255,0.08)'
  const numColor     = isLight ? 'var(--color-muted)'         : 'rgba(255,255,255,0.3)'
  const featureColor = isLight ? 'var(--color-text)'          : 'rgba(255,255,255,0.82)'

  const contentCol = (
    <div
      className="flex flex-col justify-center"
      style={{
        flex: '0 0 44%',
        padding: 'clamp(2.5rem, 5vw, 4.5rem)',
        backgroundColor: contentBg,
      }}
    >
      {/* Meta label */}
      <p
        className="font-utility text-[10px] tracking-[0.14em] uppercase mb-5"
        style={{ color: bodyColor }}
      >
        {unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Студи'} · {unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²
      </p>

      {/* Unit name */}
      <h2
        className="font-display font-light mb-4"
        style={{
          fontSize: 'clamp(2.4rem, 4.5vw, 3.75rem)',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: headingColor,
        }}
      >
        {unitType.name}
      </h2>

      {/* Blurb */}
      <p
        className="font-body mb-8"
        style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: bodyColor, maxWidth: '30ch' }}
      >
        {unitType.blurb}
      </p>

      {/* Numbered features — like reference */}
      <div style={{ borderTop: `1px solid ${borderColor}` }}>
        {unitType.features.map((feat, i) => (
          <div
            key={feat}
            className="flex items-baseline gap-4 py-3"
            style={{ borderBottom: `1px solid ${borderColor}` }}
          >
            <span
              className="font-utility text-[10px] shrink-0 tabular-nums"
              style={{ color: numColor }}
            >
              0{i + 1}
            </span>
            <span className="font-body text-sm" style={{ color: featureColor, lineHeight: 1.4 }}>
              {feat}
            </span>
          </div>
        ))}
      </div>

      {/* Price + links */}
      <div className="flex items-baseline justify-between flex-wrap gap-4 mt-8">
        <p
          className="font-display font-light"
          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: 'var(--color-oak)', lineHeight: 1 }}
        >
          {formatPrice(unitType.priceFrom)}
          <span
            className="font-body font-normal"
            style={{ fontSize: '0.75rem', color: bodyColor, marginLeft: '0.35rem' }}
          >
            -аас
          </span>
        </p>
        <div className="flex gap-5">
          <Link
            href={`/residences/${unitType.id}`}
            className="font-body font-medium text-[0.8125rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)]"
            style={{ color: 'var(--color-oak)' }}
          >
            Дэлгэрэнгүй →
          </Link>
          <Link
            href={`/contact?type=${unitType.id}`}
            className="font-body font-medium text-[0.8125rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)]"
            style={{ color: featureColor }}
          >
            Үзлэг захиалах
          </Link>
        </div>
      </div>
    </div>
  )

  // Gray panel — floor plan floats on colored background
  const imageCol = (
    <div
      className="relative flex items-center justify-center"
      style={{
        flex: '0 0 56%',
        backgroundColor: panelBg,
        minHeight: 'clamp(300px, 45vw, 600px)',
        padding: 'clamp(2rem, 5vw, 4rem)',
      }}
    >
      <div className="relative w-full" style={{ maxWidth: '520px', aspectRatio: '4 / 3' }}>
        <Image
          src={imageSrc}
          alt={`${unitType.name} орон сууцны зохион байгуулалт`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 56vw"
        />
      </div>
    </div>
  )

  // Image is first in DOM so on mobile (flex-col) it appears on top.
  // side='left'  → md:flex-row-reverse  (content left, image right on desktop)
  // side='right' → md:flex-row           (image left, content right on desktop)
  return (
    <div
      className={`flex flex-col ${side === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'}`}
      style={{ borderBottom: isLast ? 'none' : `1px solid ${borderColor}` }}
    >
      {imageCol}
      {contentCol}
    </div>
  )
}
