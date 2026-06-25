'use client'

import { FilterPill } from '@/components/ui/FilterPill'
import type { UnitStatus, UnitType } from '@/types'

const STATUS_FILTERS: { label: string; value: UnitStatus | 'all' }[] = [
  { label: 'Бүгд', value: 'all' },
  { label: 'Боломжтой', value: 'available' },
  { label: 'Захиалагдсан', value: 'reserved' },
  { label: 'Зарагдсан', value: 'sold' },
]

interface FilterStripProps {
  unitTypes: UnitType[]
  activeTypeId: string
  activeStatus: UnitStatus | 'all'
  onTypeChange: (id: string) => void
  onStatusChange: (s: UnitStatus | 'all') => void
}

export function FilterStrip({
  unitTypes,
  activeTypeId,
  activeStatus,
  onTypeChange,
  onStatusChange,
}: FilterStripProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Төрлөөр шүүх">
        <FilterPill label="Бүгд" active={activeTypeId === 'all'} onClick={() => onTypeChange('all')} />
        {unitTypes.map((t) => (
          <FilterPill
            key={t.id}
            label={t.name}
            active={activeTypeId === t.id}
            onClick={() => onTypeChange(t.id)}
          />
        ))}
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Статусаар шүүх"
        style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}
      >
        {STATUS_FILTERS.map((s) => (
          <FilterPill
            key={s.value}
            label={s.label}
            active={activeStatus === s.value}
            onClick={() => onStatusChange(s.value)}
          />
        ))}
      </div>
    </div>
  )
}
