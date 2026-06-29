import Image from 'next/image'
import { getUnitTypes } from '@/lib/data/adapter'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { ResidenceShowcase } from '@/components/kit/ResidenceShowcase'

export default async function ResidencesPage() {
  const unitTypes = await getUnitTypes()

  return (
    <main>
      {/* Filmstrip — each unit type as a cropped image band, labels on hover */}
      <div style={{ paddingTop: '64px', overflow: 'hidden' }}>
        <div className="flex" style={{ height: 'clamp(160px, 24vw, 260px)' }}>
          {unitTypes.map((ut) => (
            <div key={ut.id} style={{ flex: '1 1 0', position: 'relative', overflow: 'hidden' }}>
              <Image
                src={ut.gallery[0] ?? ut.floorPlanImage}
                alt={ut.name}
                fill
                priority
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                sizes="25vw"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(42,39,36,0.6) 0%, transparent 55%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '12px 14px',
                }}
              >
                <span
                  className="font-body"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(250,246,239,0.88)',
                  }}
                >
                  {ut.name}
                </span>
              </div>
              {/* Thin vertical divider between strips */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '1px',
                  height: '100%',
                  backgroundColor: 'rgba(250,246,239,0.12)',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Орон сууцны төрлүүд" className="mb-6" />
        <EditorialHeading
          parts={[{ text: 'Бүх төрлийн ' }, { text: 'орон сууц', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}
        />
      </div>

      {unitTypes.map((ut, i) => (
        <ResidenceShowcase
          key={ut.id}
          unitType={ut}
          side={i % 2 === 0 ? 'left' : 'right'}
          isLast={i === unitTypes.length - 1}
        />
      ))}
    </main>
  )
}
