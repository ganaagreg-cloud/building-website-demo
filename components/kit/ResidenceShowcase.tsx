'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { UnitType } from '@/types'
import { DepthParallax } from '@/components/common/DepthParallax'

interface ResidenceShowcaseProps {
  unitType: UnitType
  side?: 'left' | 'right'
  isLast?: boolean
}

function formatPrice(n: number) {
  return `₮${Math.round(n / 1_000_000)}M`
}

export function ResidenceShowcase({
  unitType,
  side = 'left',
  isLast = false,
}: ResidenceShowcaseProps) {
  const imageSrc = unitType.dollhouseImage ?? unitType.floorPlanImage
  const depthSrc = unitType.dollhouseImage ? unitType.floorPlanDepthMap : undefined
  const borderColor = 'rgba(0,0,0,0.07)'
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const contentCol = (
    <div
      className="flex flex-col justify-center"
      style={{
        flex: '0 0 45%',
        padding: 'clamp(2.8rem, 6vw, 5rem)',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Meta label */}
      <p
        className="font-utility text-[10px] tracking-[0.14em] uppercase mb-5"
        style={{ color: 'var(--color-muted)' }}
      >
        {unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Студи'} ·{' '}
        {unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²
      </p>

      {/* Unit name — large editorial heading */}
      <h2
        className="font-display font-light mb-6"
        style={{
          fontSize: 'clamp(3rem, 6vw, 5.5rem)',
          lineHeight: 1.0,
          letterSpacing: '-0.025em',
          color: 'var(--color-text)',
        }}
      >
        {unitType.name}
      </h2>

      {/* Blurb */}
      <p
        className="font-body mb-10"
        style={{
          fontSize: '1rem',
          lineHeight: 1.75,
          color: 'var(--color-muted)',
          maxWidth: '32ch',
        }}
      >
        {unitType.blurb}
      </p>

      {/* Numbered features */}
      <div style={{ borderTop: `1px solid ${borderColor}` }}>
        {unitType.features.map((feat, i) => (
          <div
            key={feat}
            className="flex items-baseline gap-5 py-3.5"
            style={{ borderBottom: `1px solid ${borderColor}` }}
          >
            <span
              className="font-utility text-[10px] shrink-0 tabular-nums"
              style={{ color: 'rgba(0,0,0,0.28)' }}
            >
              0{i + 1}
            </span>
            <span
              className="font-body text-sm"
              style={{ color: 'var(--color-text)', lineHeight: 1.5 }}
            >
              {feat}
            </span>
          </div>
        ))}
      </div>

      {/* Price + links */}
      <div className="flex items-baseline justify-between flex-wrap gap-4 mt-8">
        <p
          className="font-display font-light"
          style={{
            fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
            color: 'var(--color-oak)',
            lineHeight: 1,
          }}
        >
          {formatPrice(unitType.priceFrom)}
          <span
            className="font-body font-normal"
            style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginLeft: '0.35rem' }}
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
            style={{ color: 'var(--color-text)' }}
          >
            Үзлэг захиалах
          </Link>
        </div>
      </div>
    </div>
  )

  const imageCol = (
    <div
      ref={imageContainerRef}
      className="relative"
      style={{
        flex: '0 0 55%',
        minHeight: 'clamp(320px, 50vw, 680px)',
        // Dollhouse PNGs are rendered from the opposite angle — rotate to correct orientation
        transform: unitType.dollhouseImage ? 'rotate(180deg)' : undefined,
      }}
    >
      {depthSrc ? (
        <DepthParallax
          colorSrc={imageSrc}
          depthSrc={depthSrc}
          alt={`${unitType.name} орон сууцны төлөвлөгөө`}
          intensity={0.03}
          sizes="(max-width: 768px) 100vw, 55vw"
          scrollTriggerTarget={imageContainerRef}
          objectFit="cover"
        />
      ) : (
        <Image
          src={imageSrc}
          alt={`${unitType.name} орон сууцны дотоод`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 55vw"
        />
      )}
    </div>
  )

  const flexClass =
    side === 'left'
      ? 'flex-col md:flex-row-reverse'
      : 'flex-col-reverse md:flex-row'

  return (
    <div
      className={`flex ${flexClass}`}
      style={{ borderBottom: isLast ? 'none' : `1px solid ${borderColor}` }}
    >
      {imageCol}
      {contentCol}
    </div>
  )
}
