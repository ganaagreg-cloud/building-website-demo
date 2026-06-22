import Image from 'next/image'
import Link from 'next/link'
import type { UnitType } from '@/types'

interface UnitTypeCardProps {
  unitType: UnitType
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('mn-MN').format(price) + ' ₮'
}

export function UnitTypeCard({ unitType }: UnitTypeCardProps) {
  return (
    <Link
      href={`/residences/${unitType.id}`}
      className="group block bg-surface-raised rounded-md shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2"
    >
      {/* rounded-t-md clips the image to the card's top corners; image itself has no rounding */}
      <div className="relative aspect-video overflow-hidden rounded-t-md">
        <Image
          src={unitType.floorPlanImage}
          alt={`${unitType.name} орон сууцны зураг`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl mb-1">{unitType.name}</h3>
        <p className="font-body text-sm text-muted mb-3">
          {unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Нээлттэй төлөвлөлт'} ·{' '}
          {unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²
        </p>
        <p className="font-utility text-[12px] text-oak">
          {formatPrice(unitType.priceFrom)}-аас эхлэн
        </p>
        <span className="mt-4 inline-block font-body text-sm text-muted group-hover:text-[var(--color-text)] transition-colors">
          Дэлгэрэнгүй →
        </span>
      </div>
    </Link>
  )
}
