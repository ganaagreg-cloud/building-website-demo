'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FilterStrip } from './FilterStrip'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Unit, UnitType, UnitStatus } from '@/types'

const ORIENTATION_LABELS: Record<string, string> = {
  north:       'Хойд',
  south:       'Өмнөд',
  east:        'Зүүн',
  west:        'Баруун',
  'north-east': 'Хойд-Зүүн',
  'north-west': 'Хойд-Баруун',
  'south-east': 'Өмнөд-Зүүн',
  'south-west': 'Өмнөд-Баруун',
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
      {/* Sticky filter bar */}
      <div
        className="sticky top-16 z-10"
        style={{ backgroundColor: 'var(--color-surface)', paddingBlock: '1rem', marginBottom: '0.5rem' }}
      >
        <FilterStrip
          unitTypes={unitTypes}
          activeTypeId={activeTypeId}
          activeStatus={activeStatus}
          onTypeChange={setActiveTypeId}
          onStatusChange={setActiveStatus}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="font-display font-light text-3xl mb-3" style={{ color: 'var(--color-text)' }}>
            Тохирох орон сууц олдсонгүй
          </h3>
          <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>
            Шүүлтүүрийг өөрчилж дахин хайна уу.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          role="list"
          aria-label="Орон сууцны жагсаалт"
          style={{ backgroundColor: 'var(--color-border)' }}
        >
          {filtered.map((unit) => {
            const typeName = typeMap.get(unit.typeId)?.name ?? ''
            const isSold = unit.status === 'sold'
            return (
              <div
                key={unit.id}
                role="listitem"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  opacity: isSold ? 0.5 : 1,
                }}
              >
                {/* Top row: type name + status */}
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="font-body font-medium"
                    style={{ fontSize: '0.8125rem', letterSpacing: '0.02em', color: 'var(--color-muted)' }}
                  >
                    {typeName} · {unit.floor}-р давхар
                  </span>
                  <StatusBadge status={unit.status} />
                </div>

                {/* Price — dominant */}
                <p
                  className="font-display font-light"
                  style={{
                    fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                    lineHeight: 1.05,
                    color: isSold ? 'var(--color-muted)' : 'var(--color-oak)',
                    textDecoration: isSold ? 'line-through' : 'none',
                  }}
                >
                  {formatPrice(unit.price)}
                </p>

                {/* Specs row */}
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {[
                    `${unit.sizeM2} м²`,
                    ORIENTATION_LABELS[unit.orientation] ?? unit.orientation,
                  ].map((spec) => (
                    <span
                      key={spec}
                      className="font-utility"
                      style={{ fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.08em' }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Action */}
                {!isSold && (
                  <Link
                    href={`/contact?type=${unit.typeId}`}
                    className="font-body font-medium self-start"
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-oak)',
                      textDecoration: 'none',
                      marginTop: 'auto',
                      paddingTop: '0.25rem',
                    }}
                    aria-label={`${unit.floor}-р давхарын ${unit.sizeM2}м² орон сууц захиалах`}
                  >
                    Үзлэг захиалах{' '}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
