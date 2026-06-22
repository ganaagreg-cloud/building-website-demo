import { notFound } from 'next/navigation'
import { getUnitTypes, getUnitsByType } from '@/lib/data/adapter'
import { DetailHeader } from '@/components/sections/detail/DetailHeader'
import { FloorPlan } from '@/components/sections/detail/FloorPlan'
import { Features } from '@/components/sections/detail/Features'
import { AvailableUnits } from '@/components/sections/detail/AvailableUnits'

interface Props {
  params: Promise<{ typeId: string }>
}

export async function generateStaticParams() {
  const types = await getUnitTypes()
  return types.map((t) => ({ typeId: t.id }))
}

export default async function ResidenceDetailPage({ params }: Props) {
  const { typeId } = await params
  const [unitTypes, units] = await Promise.all([
    getUnitTypes(),
    getUnitsByType(typeId),
  ])

  const unitType = unitTypes.find((t) => t.id === typeId)
  if (!unitType) notFound()

  return (
    <main>
      <DetailHeader unitType={unitType} />
      <FloorPlan
        src={unitType.floorPlanImage}
        alt={`${unitType.name} орон сууцны давхрын зураг`}
      />
      <Features features={unitType.features} />
      <AvailableUnits units={units} typeId={typeId} />
    </main>
  )
}
