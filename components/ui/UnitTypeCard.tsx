import Image from 'next/image'
import Link from 'next/link'
import type { UnitType } from '@/types'
import { BLUR_URL } from '@/config/placeholders'

interface UnitTypeCardProps {
  unitType: UnitType
  variant?: 'standard' | 'featured'
}

function formatPriceNumber(price: number): string {
  return new Intl.NumberFormat('mn-MN').format(price)
}

export function UnitTypeCard({ unitType, variant = 'standard' }: UnitTypeCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <Link
      href={`/residences/${unitType.id}`}
      className={[
        'group block bg-surface border border-[rgba(42,39,36,0.12)] shadow-sm',
        'hover:shadow-md transition-shadow duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2',
        isFeatured ? 'md:flex' : '',
      ].join(' ')}
    >
      {/* Image — portrait for standard, landscape for featured */}
      <div
        className={[
          'relative overflow-hidden shrink-0',
          isFeatured
            ? 'aspect-[4/3] md:aspect-auto md:w-[55%] md:min-h-[360px]'
            : 'aspect-[4/5]',
        ].join(' ')}
      >
        <Image
          src={unitType.floorPlanImage}
          alt={`${unitType.name} орон сууцны зураг`}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
          sizes={
            isFeatured
              ? '(max-width: 768px) 100vw, 55vw'
              : '(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px'
          }
          placeholder="blur"
          blurDataURL={BLUR_URL}
        />
      </div>

      {/* Content */}
      <div className={['flex flex-col justify-center', isFeatured ? 'p-8 lg:p-10' : 'p-5'].join(' ')}>
        {/* Specs — quiet, above the name */}
        <p className="font-utility text-[10px] tracking-[0.12em] uppercase text-muted mb-2">
          {unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Нээлттэй төлөвлөлт'}
          {' · '}
          {unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²
        </p>

        {/* Type name — focal typographic element */}
        <h3
          className={[
            'font-display font-light leading-tight mb-4',
            isFeatured ? 'text-4xl lg:text-5xl' : 'text-2xl lg:text-3xl',
          ].join(' ')}
        >
          {unitType.name}
        </h3>

        {/* Price — hero of the card: number in charcoal bold, suffix in oak */}
        <div className="flex items-baseline gap-1.5 mb-5">
          <span className="font-utility font-bold text-[15px] tracking-tight text-[var(--color-text)]">
            {formatPriceNumber(unitType.priceFrom)}
          </span>
          <span className="font-utility text-[11px] text-oak">₮-аас эхлэн</span>
        </div>

        <span className="font-body text-xs text-muted group-hover:text-[var(--color-text)] transition-colors">
          Дэлгэрэнгүй →
        </span>
      </div>
    </Link>
  )
}
