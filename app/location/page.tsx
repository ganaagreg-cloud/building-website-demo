import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { MapSection } from '@/components/sections/location/MapSection'
import { Amenities } from '@/components/sections/location/Amenities'
import { clientConfig } from '@/config/client.config'

export default function LocationPage() {
  return (
    <main>
      {/* Map is the masthead — first thing visible below the nav */}
      <div style={{ paddingTop: '64px' }}>
        <MapSection />
      </div>

      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: '3rem', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Байршил" className="mb-6" />
        <EditorialHeading
          parts={[{ text: 'Хотын ' }, { text: 'зүрхэнд', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '1rem' }}
        />
        <p
          className="font-body"
          style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '460px' }}
        >
          {clientConfig.contact.address}
        </p>
      </div>

      <Amenities />
    </main>
  )
}
