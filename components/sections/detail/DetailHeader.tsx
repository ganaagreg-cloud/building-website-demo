import type { UnitType } from '@/types'

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n) + ' ₮'
}

export function DetailHeader({ unitType }: { unitType: UnitType }) {
  return (
    <header className="max-w-content mx-auto px-4 lg:px-8 pt-16 pb-8">
      <h1
        className="font-display font-light mb-3"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1 }}
      >
        {unitType.name}
      </h1>
      <p className="font-body text-lg text-muted mb-6 max-w-reading">{unitType.blurb}</p>
      <div className="flex flex-wrap gap-6 font-utility text-[12px] text-oak">
        <span>
          {unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²
        </span>
        {unitType.rooms > 0 && <span>{unitType.rooms} унтлагын өрөө</span>}
        <span>{formatPrice(unitType.priceFrom)}-аас эхлэн</span>
      </div>
    </header>
  )
}
