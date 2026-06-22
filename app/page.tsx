import { Hero } from '@/components/sections/home/Hero'
import { TourLoader } from '@/components/tour/TourLoader'
import { ResidencesPreview } from '@/components/sections/home/ResidencesPreview'
import { AvailabilityTeaser } from '@/components/sections/home/AvailabilityTeaser'
import { BookingCTA } from '@/components/sections/home/BookingCTA'
import { getUnitTypes, getUnits } from '@/lib/data/adapter'
import { clientConfig } from '@/config/client.config'

export default async function HomePage() {
  const [unitTypes, units] = await Promise.all([getUnitTypes(), getUnits()])

  return (
    <main>
      <Hero buildingName={clientConfig.buildingName} tagline={clientConfig.tagline} />
      <TourLoader frames={clientConfig.tourFrames ?? []} />
      <ResidencesPreview unitTypes={unitTypes} />
      <AvailabilityTeaser units={units} unitTypes={unitTypes} />
      <BookingCTA />
    </main>
  )
}
