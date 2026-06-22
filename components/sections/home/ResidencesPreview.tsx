import Link from 'next/link'
import { UnitTypeCard } from '@/components/ui/UnitTypeCard'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import type { UnitType } from '@/types'

interface ResidencesPreviewProps {
  unitTypes: UnitType[]
}

export function ResidencesPreview({ unitTypes }: ResidencesPreviewProps) {
  return (
    <SectionWrapper number="01">
      <div className="max-w-content mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl mb-3">Орон сууц</h2>
        <p className="font-body text-lg text-muted mb-10 max-w-reading">
          Таны амьдралын хэрэгцээнд нийцсэн төлөвлөлтүүд.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {unitTypes.slice(0, 4).map((ut) => (
            <UnitTypeCard key={ut.id} unitType={ut} />
          ))}
        </div>
        <Link
          href="/residences"
          className="font-body text-sm text-muted hover:text-[var(--color-text)] transition-colors"
        >
          Бүгдийг харах →
        </Link>
      </div>
    </SectionWrapper>
  )
}
