import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { ResidencesGrid } from '@/components/sections/residences/ResidencesGrid'
import { getUnitTypes } from '@/lib/data/adapter'

export default async function ResidencesPage() {
  const unitTypes = await getUnitTypes()

  return (
    <main>
      <SectionWrapper number="01">
        <div className="max-w-content mx-auto">
          <h1
            className="font-display font-light mb-4"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)', lineHeight: 1.05 }}
          >
            Орон сууц
          </h1>
          <p className="font-body text-lg text-muted mb-12 max-w-reading">
            Таны амьдралын хэрэгцээнд нийцсэн, дөрвөн төрлийн орон зай.
          </p>
          <ResidencesGrid unitTypes={unitTypes} />
        </div>
      </SectionWrapper>
    </main>
  )
}
