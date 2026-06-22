import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { AvailabilityTable } from '@/components/sections/availability/AvailabilityTable'
import { getUnits, getUnitTypes } from '@/lib/data/adapter'

export default async function AvailabilityPage() {
  const [units, unitTypes] = await Promise.all([getUnits(), getUnitTypes()])

  return (
    <main>
      <SectionWrapper number="01">
        <div className="max-w-content mx-auto">
          <h1
            className="font-display font-light mb-4"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)', lineHeight: 1.05 }}
          >
            Боломжтой орон сууц
          </h1>
          <p className="font-body text-lg text-muted mb-10 max-w-reading">
            Одоогийн байдлаар боломжтой орон сууцны жагсаалт.
          </p>
          <AvailabilityTable units={units} unitTypes={unitTypes} />
        </div>
      </SectionWrapper>
    </main>
  )
}
