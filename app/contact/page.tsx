import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { ContactForm } from '@/components/sections/contact/ContactForm'
import { getUnitTypes } from '@/lib/data/adapter'
import { clientConfig } from '@/config/client.config'

interface Props {
  searchParams: Promise<{ type?: string }>
}

export default async function ContactPage({ searchParams }: Props) {
  const [unitTypes, { type }] = await Promise.all([getUnitTypes(), searchParams])

  return (
    <main>
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Холбоо барих" className="mb-8" />
        <EditorialHeading
          parts={[{ text: 'Үзлэг ' }, { text: 'захиалах', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '0.75rem' }}
        />
        <p className="font-body mb-12" style={{ fontSize: '1.05rem', color: 'var(--color-muted)', maxWidth: '440px' }}>
          Манай баг ажлын цагаар хариу өгөх болно.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <ContactForm unitTypes={unitTypes} preselectedTypeId={type} />
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-utility mb-1" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Утас</p>
              <p className="font-body" style={{ fontSize: '1.05rem' }}>{clientConfig.contact.phone}</p>
            </div>
            <div>
              <p className="font-utility mb-1" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>И-мэйл</p>
              <p className="font-body" style={{ fontSize: '1.05rem' }}>{clientConfig.contact.email}</p>
            </div>
            <div>
              <p className="font-utility mb-1" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Хаяг</p>
              <p className="font-body" style={{ fontSize: '1.05rem' }}>{clientConfig.contact.address}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
