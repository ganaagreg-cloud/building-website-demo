import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { MapSection } from '@/components/sections/location/MapSection'
import { Amenities } from '@/components/sections/location/Amenities'
import { clientConfig } from '@/config/client.config'

export default function LocationPage() {
  return (
    <main>
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Байршил" className="mb-8" />
        <EditorialHeading
          parts={[{ text: 'Хотын ' }, { text: 'зүрхэнд', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '1.25rem' }}
        />
        <p
          className="font-body mb-2"
          style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '460px' }}
        >
          {clientConfig.contact.address}
        </p>
      </div>

      <MapSection />
      <Amenities />
    </main>
  )
}
