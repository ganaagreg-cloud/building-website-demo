import { notFound } from 'next/navigation'
import { getUnitTypes, getUnitsByType } from '@/lib/data/adapter'
import { DetailHeader } from '@/components/sections/detail/DetailHeader'
import { Gallery } from '@/components/sections/detail/Gallery'
import { FloorPlan } from '@/components/sections/detail/FloorPlan'
import { AvailableUnits } from '@/components/sections/detail/AvailableUnits'
import { UnitTypeSwitcher } from '@/components/sections/detail/UnitTypeSwitcher'
import { ClosingCta } from '@/components/sections/detail/ClosingCta'

interface Props {
  params: Promise<{ typeId: string }>
}

export async function generateStaticParams() {
  const types = await getUnitTypes()
  return types.map((t) => ({ typeId: t.id }))
}

export default async function ResidenceDetailPage({ params }: Props) {
  const { typeId } = await params
  const [unitTypes, units] = await Promise.all([getUnitTypes(), getUnitsByType(typeId)])
  const unitType = unitTypes.find((t) => t.id === typeId)

  if (!unitType) notFound()

  return (
    <main>
      <DetailHeader unitType={unitType} />
      <Gallery images={unitType.gallery.slice(1)} altPrefix={unitType.name} />
      <FloorPlan unitType={unitType} />
      <AvailableUnits units={units} typeId={typeId} />
      <UnitTypeSwitcher unitTypes={unitTypes} activeTypeId={typeId} />
      <ClosingCta unitType={unitType} />
    </main>
  )
}
