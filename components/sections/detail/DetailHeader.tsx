import Image from 'next/image'
import Link from 'next/link'
import type { UnitType } from '@/types'

function formatPrice(n: number) {
  return `₮${Math.round(n / 1_000_000)}M`
}

export function DetailHeader({ unitType }: { unitType: UnitType }) {
  const heroSrc = unitType.gallery[0] ?? unitType.floorPlanImage

  return (
    <>
      {/* Breadcrumb */}
      <div className="px-5 lg:px-10 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Link
          href="/residences"
          className="font-body text-[0.8125rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)]"
          style={{ color: 'var(--color-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px', minHeight: '44px' }}
        >
          <span aria-hidden>←</span> Орон сууцнууд
        </Link>
      </div>

      {/* Full-bleed hero — interior photo */}
      <div className="relative" style={{ height: 'clamp(400px, 72vh, 700px)' }}>
        <Image
          src={heroSrc}
          alt={unitType.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.12) 45%, transparent 70%)',
          }}
        />
        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 px-5 lg:px-10 pb-10">
          <p
            className="font-utility text-[10px] tracking-[0.14em] uppercase mb-3"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Студи'} ·{' '}
            {unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²
          </p>
          <h1
            className="font-display font-light"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            {unitType.name}
          </h1>
        </div>
      </div>

      {/* Info strip */}
      <div
        className="flex flex-wrap items-center justify-between gap-5 px-5 lg:px-10 py-6"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <p
          className="font-display font-light"
          style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', color: 'var(--color-oak)', lineHeight: 1 }}
        >
          {formatPrice(unitType.priceFrom)}
          <span
            className="font-body"
            style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginLeft: '0.35rem' }}
          >
            -аас
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="#units"
            className="font-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)]"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              paddingInline: '18px',
              fontSize: '0.875rem',
              color: 'var(--color-text)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '8px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'border-color 150ms',
            }}
          >
            Боломжтой орон сууц ↓
          </Link>
          <Link
            href={`/contact?type=${unitType.id}`}
            className="font-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-oak)]"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              paddingInline: '22px',
              fontSize: '0.875rem',
              backgroundColor: 'var(--color-oak)',
              color: '#FFFFFF',
              borderRadius: '8px',
              border: '1.5px solid var(--color-oak)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background-color 150ms, border-color 150ms',
            }}
          >
            Үзлэг захиалах →
          </Link>
        </div>
      </div>

      {/* Blurb */}
      <div className="px-5 lg:px-10 py-10">
        <p
          className="font-body"
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.75,
            color: 'var(--color-muted)',
            maxWidth: '540px',
          }}
        >
          {unitType.blurb}
        </p>
      </div>
    </>
  )
}
