import type { FinalCtaSectionConfig } from '@/types'
import { clientConfig } from '@/config/client.config'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { CTAPair } from '@/components/kit/CTAPair'

export function FinalCtaSection({ config }: { config: FinalCtaSectionConfig }) {
  return (
    <section
      aria-label={config.eyebrow}
      style={{ backgroundColor: 'var(--color-surface-raised)' }}
    >
      <div
        className="max-w-content mx-auto px-4 lg:px-8 flex flex-col items-start gap-8"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        <Eyebrow label={config.eyebrow} />
        <EditorialHeading
          parts={config.headingParts}
          as="h2"
          style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)' }}
        />
        <CTAPair
          primary={config.primaryLabel}
          primaryHref={config.primaryHref}
          secondary={config.secondaryLabel}
          secondaryHref={config.secondaryHref}
        />
        <p
          className="font-utility"
          style={{ fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.04em' }}
        >
          {clientConfig.contact.phone} · {clientConfig.contact.address}
        </p>
      </div>
    </section>
  )
}
