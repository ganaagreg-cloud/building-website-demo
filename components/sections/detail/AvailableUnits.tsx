import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import type { Unit } from '@/types'

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n) + ' ₮'
}

const ORIENTATION_LABELS: Record<string, string> = {
  north: 'Хойд',
  south: 'Өмнөд',
  east: 'Зүүн',
  west: 'Баруун',
  'north-east': 'Хойд-Зүүн',
  'north-west': 'Хойд-Баруун',
  'south-east': 'Өмнөд-Зүүн',
  'south-west': 'Өмнөд-Баруун',
}

interface AvailableUnitsProps {
  units: Unit[]
  typeId: string
}

export function AvailableUnits({ units, typeId }: AvailableUnitsProps) {
  return (
    <SectionWrapper number="03">
      <div className="max-w-content mx-auto">
        <h2 className="font-display font-light text-3xl lg:text-4xl mb-8">Боломжтой орон сууц</h2>

        {units.length === 0 ? (
          <p className="font-body text-sm text-muted">
            Энэ төрлийн боломжтой орон сууц байхгүй байна.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" aria-label="Боломжтой орон сууцны жагсаалт">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {['Давхар', 'Хэмжээ', 'Чиглэл', 'Үнэ', 'Статус'].map((h) => (
                    <th key={h} className="font-body text-sm text-muted pb-3 pr-6 font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr
                    key={unit.id}
                    className="border-b border-[rgba(42,39,36,0.06)] hover:bg-[rgba(42,39,36,0.03)] transition-colors"
                  >
                    <td className="font-utility text-[12px] py-4 pr-6">{unit.floor}</td>
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
          </div>
        )}

        <div className="mt-10">
          <Link
            href={`/contact?type=${typeId}`}
            className="inline-flex items-center justify-center bg-oak text-on-oak rounded-full px-8 py-3 font-body text-sm hover:bg-[var(--color-oak-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2"
          >
            Үзлэг захиалах
          </Link>
        </div>
      </div>
    </SectionWrapper>
  )
}
