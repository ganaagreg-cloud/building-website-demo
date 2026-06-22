import { UnitTypeCard } from '@/components/ui/UnitTypeCard'
import type { UnitType } from '@/types'

interface ResidencesGridProps {
  unitTypes: UnitType[]
}

export function ResidencesGrid({ unitTypes }: ResidencesGridProps) {
  if (unitTypes.length === 0) {
    return (
      <p className="font-body text-sm text-muted">
        Орон сууцны мэдээлэл одоогоор байхгүй байна.
      </p>
    )
  }

  // Editorial asymmetric layout:
  // Row 1: first card featured (wider) + second card normal
  // Row 2: third card normal + fourth card featured (wider, mirrored)
  const [first, second, third, fourth, ...rest] = unitTypes

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Row 1: featured left (7 cols) + standard right (5 cols) */}
      {first && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
          <div className="md:col-span-7">
            <UnitTypeCard unitType={first} variant="featured" />
          </div>
          {second && (
            <div className="md:col-span-5">
              <UnitTypeCard unitType={second} />
            </div>
          )}
        </div>
      )}

      {/* Row 2: standard left (5 cols) + featured right (7 cols) */}
      {(third || fourth) && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
          {third && (
            <div className="md:col-span-5">
              <UnitTypeCard unitType={third} />
            </div>
          )}
          {fourth && (
            <div className="md:col-span-7">
              <UnitTypeCard unitType={fourth} variant="featured" />
            </div>
          )}
        </div>
      )}

      {/* Overflow: any additional types in a standard 2-col grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {rest.map((ut) => (
            <UnitTypeCard key={ut.id} unitType={ut} />
          ))}
        </div>
      )}
    </div>
  )
}
