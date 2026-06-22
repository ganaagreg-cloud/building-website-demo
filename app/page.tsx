import { Hero } from '@/components/sections/home/Hero'
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

      {/* Tour placeholder — replaced in Phase 9 */}
      <section
        id="tour"
        aria-label="Орон сууцны аялал"
        className="w-full h-[60vh] bg-surface-raised flex items-center justify-center border-y border-[rgba(42,39,36,0.10)]"
      >
        <p className="font-utility text-[12px] text-muted tracking-widest uppercase">
          Cinematic scroll-scrub tour — coming soon
        </p>
      </section>

      <ResidencesPreview unitTypes={unitTypes} />
      <AvailabilityTeaser units={units} unitTypes={unitTypes} />
      <BookingCTA />
    </main>
  )
}
