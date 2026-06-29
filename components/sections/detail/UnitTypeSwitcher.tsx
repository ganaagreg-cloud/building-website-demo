import Link from 'next/link'
import type { UnitType } from '@/types'

function formatPrice(n: number) {
  return `₮${Math.round(n / 1_000_000)}M`
}

export function UnitTypeSwitcher({
  unitTypes,
  activeTypeId,
}: {
  unitTypes: UnitType[]
  activeTypeId: string
}) {
  return (
    <section style={{ borderTop: '1px solid var(--color-border)' }}>
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: 'clamp(2.5rem, 5vw, 4rem)' }}
      >
        <p
          className="font-utility text-[11px] tracking-[0.14em] uppercase mb-6"
          style={{ color: 'var(--color-muted)' }}
        >
          Бусад орон сууцны төрлүүд
        </p>
        <div className="flex flex-wrap gap-3">
          {unitTypes.map((ut) => {
            const isActive = ut.id === activeTypeId
            return (
              <Link
                key={ut.id}
                href={`/residences/${ut.id}`}
                aria-current={isActive ? 'page' : undefined}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)]"
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  gap: '3px',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: isActive
                    ? '1.5px solid var(--color-oak)'
                    : '1.5px solid var(--color-border)',
                  backgroundColor: isActive ? 'rgba(184,148,106,0.07)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'border-color 150ms, background-color 150ms',
                  minWidth: '110px',
                  cursor: isActive ? 'default' : 'pointer',
                }}
              >
                <span
                  className="font-body font-medium text-sm"
                  style={{ color: isActive ? 'var(--color-oak)' : 'var(--color-text)' }}
                >
                  {ut.name}
                </span>
                <span
                  className="font-utility text-[11px]"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {formatPrice(ut.priceFrom)}-аас
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
