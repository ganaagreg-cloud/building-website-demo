import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Unit } from '@/types'

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n) + ' ₮'
}

const ORIENTATION_LABELS: Record<string, string> = {
  north: 'Хойд', south: 'Өмнөд', east: 'Зүүн', west: 'Баруун',
  'north-east': 'ХЗ', 'north-west': 'ХБ', 'south-east': 'ӨЗ', 'south-west': 'ӨБ',
}

export function AvailableUnits({ units, typeId }: { units: Unit[]; typeId: string }) {
  return (
    <section id="units" aria-label="Боломжтой орон сууц">
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: 'var(--section-padding)', borderTop: '1px solid var(--color-border)' }}
      >
        <h2
          className="font-display font-light mb-10"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
        >
          Боломжтой орон сууц
        </h2>

        {units.length === 0 ? (
          <p className="font-body" style={{ color: 'var(--color-muted)' }}>
            Одоогоор боломжтой орон сууц байхгүй байна.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" aria-label="Боломжтой орон сууцны жагсаалт">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Давхар', 'Хэмжээ', 'Чиглэл', 'Үнэ', 'Статус', ''].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="font-body pb-3 pr-6"
                      style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr
                    key={unit.id}
                    style={{ borderBottom: '1px solid rgba(42,39,36,0.06)' }}
                  >
                    <td className="font-utility py-4 pr-6" style={{ fontSize: '12px' }}>{unit.floor}-р давхар</td>
                    <td className="font-utility py-4 pr-6" style={{ fontSize: '12px' }}>{unit.sizeM2} м²</td>
                    <td className="font-utility py-4 pr-6" style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                      {ORIENTATION_LABELS[unit.orientation] ?? unit.orientation}
                    </td>
                    <td className="font-utility py-4 pr-6" style={{ fontSize: '12px', color: 'var(--color-oak)' }}>
                      {formatPrice(unit.price)}
                    </td>
                    <td className="py-4 pr-6"><StatusBadge status={unit.status} /></td>
                    <td className="py-4">
                      <Link
                        href={`/contact?type=${typeId}`}
                        aria-label={`${unit.floor}-р давхарын ${unit.sizeM2}м² орон сууц захиалах`}
                        className="font-body"
                        style={{ fontSize: '12px', color: 'var(--color-muted)', textDecoration: 'none' }}
                      >
                        Захиалах <span aria-hidden="true">→</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
