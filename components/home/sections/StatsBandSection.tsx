import type { StatsBandSectionConfig } from '@/types'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { StatBig } from '@/components/kit/StatBig'

export function StatsBandSection({ config }: { config: StatsBandSectionConfig }) {
  return (
    <section
      aria-label={config.eyebrow}
      style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--color-on-dark)' }}
    >
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        <Eyebrow label={config.eyebrow} theme="dark" className="mb-8" />
        <EditorialHeading
          parts={config.headingParts}
          as="h2"
          theme="dark"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', marginBottom: '3rem' }}
        />
        <div className="flex flex-wrap gap-12">
          {config.stats.map((stat) => (
            <StatBig
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              theme="dark"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
