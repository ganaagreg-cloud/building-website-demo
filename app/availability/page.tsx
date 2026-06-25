import { getUnitTypes, getUnits } from '@/lib/data/adapter'
import { Eyebrow } from '@/components/kit/Eyebrow'
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
        <Eyebrow label="Боломжтой орон сууц" className="mb-6" />

        {/* Count IS the H1 — the number dominates */}
        <div
          className="flex items-baseline flex-wrap"
          style={{ gap: '1.25rem', marginBottom: '1.5rem' }}
        >
          <h1
            className="font-display font-light"
            style={{
              fontSize: 'clamp(5rem, 18vw, 10rem)',
              lineHeight: 1,
              color: 'var(--color-oak)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {availableCount}
          </h1>
          <span
            className="font-display font-light"
            style={{
              fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
              color: 'var(--color-text)',
              lineHeight: 1.2,
            }}
          >
            нэгж<br />боломжтой
          </span>
        </div>

        <p
          className="font-body"
          style={{ fontSize: '1rem', color: 'var(--color-muted)', maxWidth: '440px' }}
        >
          Давхар, хэмжээ, чиглэлээр шүүж, тохирох орон сууцаа олоорой.
        </p>
      </div>

      <div className="max-w-content mx-auto px-4 lg:px-8 pb-24">
        <AvailabilityTable units={units} unitTypes={unitTypes} />
      </div>
    </main>
  )
}
