import type { ResidenceShowcaseSectionConfig } from '@/types'
import { getUnitTypes } from '@/lib/data/adapter'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { ResidenceShowcase } from '@/components/kit/ResidenceShowcase'

export async function ResidenceShowcaseSection({
  config,
}: {
  config: ResidenceShowcaseSectionConfig
}) {
  const unitTypes = await getUnitTypes()

  return (
    <section aria-label={config.eyebrow}>
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: 'var(--section-padding)', paddingBottom: '3rem' }}
      >
        <Eyebrow label={config.eyebrow} className="mb-8" />
        <EditorialHeading
          parts={config.headingParts}
          as="h2"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', marginBottom: '1.5rem' }}
        />
        <p
          className="font-body"
          style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '520px' }}
        >
          {config.introBody}
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
          isLast={i === unitTypes.length - 1}
        />
      ))}
    </section>
  )
}
