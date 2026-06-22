import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import type { Unit, UnitType } from '@/types'

interface AvailabilityTeaserProps {
  units: Unit[]
  unitTypes: UnitType[]
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('mn-MN').format(price) + ' ₮'
}

export function AvailabilityTeaser({ units, unitTypes }: AvailabilityTeaserProps) {
  const typeMap = new Map(unitTypes.map((t) => [t.id, t]))
  const preview = units.filter((u) => u.status === 'available').slice(0, 3)

  return (
    <SectionWrapper number="02" className="bg-surface-raised">
      <div className="max-w-content mx-auto">
        <h2 className="font-display font-light text-4xl lg:text-5xl mb-8">Боломжтой орон сууц</h2>
        {preview.length === 0 ? (
          <p className="font-body text-sm text-muted">Одоогоор боломжтой орон сууц байхгүй байна.</p>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {preview.map((unit) => (
              <Link
                key={unit.id}
                href="/availability"
                className="flex items-center justify-between py-4 gap-4 hover:bg-[rgba(42,39,36,0.03)] transition-colors -mx-2 px-2 rounded-sm"
              >
                <span className="font-utility text-[12px] text-muted w-14 shrink-0">
                  {unit.floor}-р давхар
                </span>
                <span className="font-utility text-[12px] flex-1">
                  {typeMap.get(unit.typeId)?.name}
                </span>
                <span className="font-utility text-[12px] text-muted hidden sm:block shrink-0">
                  {unit.sizeM2} м²
                </span>
                <span className="font-utility text-[12px] text-oak shrink-0">
                  {formatPrice(unit.price)}
                </span>
                <div className="shrink-0">
                  <StatusBadge status={unit.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
        <Link
          href="/availability"
          className="mt-6 py-2 inline-block font-body text-sm text-muted hover:text-[var(--color-text)] transition-colors"
        >
          Бүтэн жагсаалт →
        </Link>
      </div>
    </SectionWrapper>
  )
}
