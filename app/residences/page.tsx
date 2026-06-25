import { getUnitTypes } from '@/lib/data/adapter'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { ResidenceShowcase } from '@/components/kit/ResidenceShowcase'

export default async function ResidencesPage() {
  const unitTypes = await getUnitTypes()

  return (
    <main>
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Орон сууцны төрлүүд" className="mb-8" />
        <EditorialHeading
          parts={[{ text: 'Бүх төрлийн ' }, { text: 'орон сууц', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '1.25rem' }}
        />
        <p
          className="font-body"
          style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '480px' }}
        >
          Студиас гурван өрөө хүртэл — таны амьдралын хэрэгцээнд нийцсэн орон зай.
        </p>
      </div>

      {unitTypes.map((ut, i) => (
        <ResidenceShowcase
          key={ut.id}
          unitType={ut}
          index={i + 1}
          total={unitTypes.length}
          side={i % 2 === 0 ? 'left' : 'right'}
          theme={i % 2 === 0 ? 'light' : 'dark'}
        />
      ))}
    </main>
  )
}
