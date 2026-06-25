import Image from 'next/image'
import type { UnitType } from '@/types'
import { IndexNumber } from './IndexNumber'
import { EditorialHeading } from './EditorialHeading'
import { StatBig } from './StatBig'
import { CTAPair } from './CTAPair'

interface ResidenceShowcaseProps {
  unitType: UnitType
  index: number
  total: number
  side?: 'left' | 'right'
  theme?: 'light' | 'dark'
  isLast?: boolean
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n)
}

export function ResidenceShowcase({
  unitType,
  index,
  total,
  side = 'left',
  theme = 'light',
  isLast = false,
}: ResidenceShowcaseProps) {
  const imageSrc = unitType.dollhouseImage ?? unitType.gallery[0] ?? unitType.floorPlanImage
  const bg = theme === 'dark' ? 'var(--bg-dark)' : 'var(--color-surface)'
  const borderColor = theme === 'dark' ? 'var(--line-dark)' : 'var(--line)'
  const bodyColor = theme === 'dark' ? 'rgba(250,246,239,0.55)' : 'var(--color-muted)'

  const imageCol = (
    <div className="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden" style={{ borderRadius: '2px' }}>
      <Image
        src={imageSrc}
        alt={`${unitType.name} орон сууцны зураг`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  )

  const contentCol = (
    <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 px-0 md:px-10">
      <IndexNumber index={index} total={total} theme={theme} />

      <p className="font-body" style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: bodyColor }}>
        {unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Студи'} · {unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²
      </p>

      <EditorialHeading
        parts={[{ text: unitType.name }]}
        as="h3"
        theme={theme}
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
      />

      <p className="font-body" style={{ fontSize: '0.95rem', lineHeight: 1.65, color: bodyColor, maxWidth: '380px' }}>
        {unitType.blurb}
      </p>

      <div className="flex flex-wrap gap-8">
        <StatBig value={String(unitType.sizeRange[0])} label="Талбай м²" suffix="+" theme={theme} />
        {unitType.rooms > 0 && (
          <StatBig value={String(unitType.rooms)} label="Унтлага" theme={theme} />
        )}
        <StatBig value={formatPrice(unitType.priceFrom)} label="₮-аас эхлэн" theme={theme} />
      </div>

      <div className="mt-2">
        <CTAPair
          primary="Дэлгэрэнгүй"
          primaryHref={`/residences/${unitType.id}`}
          secondary="Үзлэг захиалах"
          secondaryHref="/contact"
          theme={theme}
        />
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: bg, borderBottom: isLast ? 'none' : `1px solid ${borderColor}` }}>
      <div className="max-w-content mx-auto px-4 lg:px-8 py-20 flex flex-col md:flex-row gap-12 items-center">
        {side === 'left' ? (
          <>
            {imageCol}
            {contentCol}
          </>
        ) : (
          <>
            {contentCol}
            {imageCol}
          </>
        )}
      </div>
    </div>
  )
}
