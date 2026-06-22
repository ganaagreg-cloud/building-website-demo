'use client'

import { useState } from 'react'
import { FilterStrip } from './FilterStrip'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Unit, UnitType, UnitStatus } from '@/types'

const ORIENTATION_LABELS: Record<string, string> = {
  north: 'Хойд',
  south: 'Өмнөд',
  east: 'Зүүн',
  west: 'Баруун',
  'north-east': 'ХЗ',
  'north-west': 'ХБ',
  'south-east': 'ӨЗ',
  'south-west': 'ӨБ',
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n) + ' ₮'
}

interface Props {
  units: Unit[]
  unitTypes: UnitType[]
}

export function AvailabilityTable({ units, unitTypes }: Props) {
  const [activeTypeId, setActiveTypeId] = useState('all')
  const [activeStatus, setActiveStatus] = useState<UnitStatus | 'all'>('all')

  const typeMap = new Map(unitTypes.map((t) => [t.id, t]))

  const filtered = units.filter((u) => {
    const typeMatch = activeTypeId === 'all' || u.typeId === activeTypeId
    const statusMatch = activeStatus === 'all' || u.status === activeStatus
    return typeMatch && statusMatch
  })

  return (
    <div>
      <FilterStrip
        unitTypes={unitTypes}
        activeTypeId={activeTypeId}
        activeStatus={activeStatus}
        onTypeChange={setActiveTypeId}
        onStatusChange={setActiveStatus}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="font-display font-light text-3xl mb-3">Тохирох орон сууц олдсонгүй</h3>
          <p className="font-body text-sm text-muted">Шүүлтүүрийг өөрчилж дахин хайна уу.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <table
            className="w-full text-left hidden md:table"
            aria-label="Орон сууцны жагсаалт"
          >
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Давхар', 'Төрөл', 'Хэмжээ', 'Чиглэл', 'Үнэ', 'Статус'].map((h) => (
                  <th key={h} className="font-body text-sm text-muted pb-3 pr-6 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((unit) => (
                <tr
                  key={unit.id}
                  className="border-b border-[rgba(42,39,36,0.06)] hover:bg-[rgba(42,39,36,0.03)] transition-colors"
                >
                  <td className="font-utility text-[12px] py-4 pr-6">{unit.floor}</td>
                  <td className="font-utility text-[12px] py-4 pr-6">{typeMap.get(unit.typeId)?.name}</td>
                  <td className="font-utility text-[12px] py-4 pr-6">{unit.sizeM2} м²</td>
                  <td className="font-utility text-[12px] py-4 pr-6">
                    {ORIENTATION_LABELS[unit.orientation] ?? unit.orientation}
                  </td>
                  <td
                    className={`font-utility text-[12px] py-4 pr-6 ${
                      unit.status === 'sold'
                        ? 'line-through text-[var(--color-text-disabled)]'
                        : 'text-oak'
                    }`}
                  >
                    {formatPrice(unit.price)}
                  </td>
                  <td className="py-4">
                    <StatusBadge status={unit.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-4" role="list" aria-label="Орон сууцны жагсаалт">
            {filtered.map((unit) => (
              <div
                key={unit.id}
                role="listitem"
                className="bg-surface-raised rounded-md p-4 relative"
              >
                <div className="absolute top-4 right-4">
                  <StatusBadge status={unit.status} />
                </div>
                <p className="font-display text-xl mb-2 pr-24">{typeMap.get(unit.typeId)?.name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span className="font-utility text-[11px] text-muted">{unit.floor}-р давхар</span>
                  <span className="font-utility text-[11px] text-muted">{unit.sizeM2} м²</span>
                  <span className="font-utility text-[11px] text-muted">
                    {ORIENTATION_LABELS[unit.orientation] ?? unit.orientation}
                  </span>
                  <span
                    className={`font-utility text-[11px] ${
                      unit.status === 'sold'
                        ? 'line-through text-[var(--color-text-disabled)]'
                        : 'text-oak'
                    }`}
                  >
                    {formatPrice(unit.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
