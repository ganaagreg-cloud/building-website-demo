import type { UnitType } from '@/types'
import { IndexNumber } from '@/components/kit/IndexNumber'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { StatBig } from '@/components/kit/StatBig'
import { CTAPair } from '@/components/kit/CTAPair'
import { Eyebrow } from '@/components/kit/Eyebrow'

interface DetailHeaderProps {
  unitType: UnitType
  index: number
  total: number
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n)
}

export function DetailHeader({ unitType, index, total }: DetailHeaderProps) {
  return (
    <div
      className="max-w-content mx-auto px-4 lg:px-8"
      style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
    >
      <IndexNumber index={index} total={total} className="mb-6" />
      <Eyebrow
        label={unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Студи'}
        className="mb-6"
      />
      <EditorialHeading
        parts={[{ text: unitType.name }]}
        as="h1"
        style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', marginBottom: '1.5rem' }}
      />
      <p
        className="font-body"
        style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '460px', marginBottom: '2.5rem' }}
      >
        {unitType.blurb}
      </p>
      <div className="flex flex-wrap gap-10 mb-10">
        <StatBig value={`${unitType.sizeRange[0]}–${unitType.sizeRange[1]}`} label="Талбай м²" />
        {unitType.rooms > 0 && <StatBig value={String(unitType.rooms)} label="Унтлага" />}
        <StatBig value={formatPrice(unitType.priceFrom)} label="₮-аас эхлэн" />
      </div>
      <CTAPair
        primary="Үзлэг захиалах"
        primaryHref="/contact"
        secondary="Боломжтой орон сууц"
        secondaryHref="#units"
      />
    </div>
  )
}
