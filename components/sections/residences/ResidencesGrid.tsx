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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {unitTypes.map((ut) => (
        <UnitTypeCard key={ut.id} unitType={ut} />
      ))}
    </div>
  )
}
