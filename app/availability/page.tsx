import { getUnitTypes, getUnits } from '@/lib/data/adapter'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { AvailabilityTable } from '@/components/sections/availability/AvailabilityTable'

export default async function AvailabilityPage() {
  const [unitTypes, units] = await Promise.all([getUnitTypes(), getUnits()])
  const availableCount = units.filter((u) => u.status !== 'sold').length

  return (
    <main>
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Хүртээмжтэй орон сууц" className="mb-8" />
        <EditorialHeading
          parts={[{ text: 'Боломжтой ' }, { text: 'орон сууц', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '1rem' }}
        />
        <p
          className="font-display font-light"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--color-oak)' }}
        >
          {availableCount}
        </p>
        <p
          className="font-body mb-8"
          style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}
        >
          нэгж боломжтой
        </p>
      </div>

      <div className="max-w-content mx-auto px-4 lg:px-8 pb-24">
        <AvailabilityTable units={units} unitTypes={unitTypes} />
      </div>
    </main>
  )
}
