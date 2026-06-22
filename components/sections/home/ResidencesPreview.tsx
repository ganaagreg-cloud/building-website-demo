import Link from 'next/link'
import { UnitTypeCard } from '@/components/ui/UnitTypeCard'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import type { UnitType } from '@/types'

interface ResidencesPreviewProps {
  unitTypes: UnitType[]
}

export function ResidencesPreview({ unitTypes }: ResidencesPreviewProps) {
  if (unitTypes.length === 0) {
    return (
      <SectionWrapper number="01">
        <div className="max-w-content mx-auto">
          <h2 className="font-display font-light text-4xl lg:text-5xl mb-3">Орон сууц</h2>
          <p className="font-body text-sm text-muted">Орон сууцны мэдээлэл одоогоор байхгүй байна.</p>
        </div>
      </SectionWrapper>
    )
  }

  const [first, ...others] = unitTypes.slice(0, 4)
  const rest = others.slice(0, 3)

  return (
    <SectionWrapper number="01">
      <div className="max-w-content mx-auto">
        {/* Section header */}
        <div className="mb-10 max-w-reading">
          <h2 className="font-display font-light text-4xl lg:text-5xl mb-3">Орон сууц</h2>
          <p className="font-body text-lg text-muted">
            Таны амьдралын хэрэгцээнд нийцсэн төлөвлөлтүүд.
          </p>
        </div>

        {/* Editorial layout: featured first card + up to 3 standard */}
        <div className="flex flex-col gap-4 lg:gap-6">
          {/* Row 1: featured (spans 7) + first standard (spans 5) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
            {first && (
              <div className="md:col-span-7">
                <UnitTypeCard unitType={first} variant="featured" />
              </div>
            )}
            {rest[0] && (
              <div className="md:col-span-5">
                <UnitTypeCard unitType={rest[0]} />
              </div>
            )}
          </div>

          {/* Row 2: remaining standard cards */}
          {rest.slice(1).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {rest.slice(1).map((ut) => (
                <UnitTypeCard key={ut.id} unitType={ut} />
              ))}
            </div>
          )}
        </div>

        <Link
          href="/residences"
          className="mt-10 py-2 inline-block font-body text-sm text-muted hover:text-[var(--color-text)] transition-colors"
        >
          Бүгдийг харах →
        </Link>
      </div>
    </SectionWrapper>
  )
}
