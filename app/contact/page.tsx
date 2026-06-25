import { Eyebrow } from '@/components/kit/Eyebrow'
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
        style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '4rem' }}
      >
        <Eyebrow label="Холбоо барих" className="mb-6" />

        {/* Phone number IS the H1 — oversized, tappable, signals "you can call us" */}
        <a
          href={`tel:${clientConfig.contact.phone.replace(/[\s-]/g, '')}`}
          className="font-display font-light block"
          style={{
            fontSize: 'clamp(2.6rem, 7vw, 5rem)',
            color: 'var(--color-text)',
            textDecoration: 'none',
            lineHeight: 1.05,
            marginBottom: '0.5rem',
            letterSpacing: '-0.01em',
          }}
          aria-label={`Утасдах: ${clientConfig.contact.phone}`}
        >
          {clientConfig.contact.phone}
        </a>
        <p
          className="font-body mb-12"
          style={{ fontSize: '1rem', color: 'var(--color-muted)', maxWidth: '420px' }}
        >
          Ажлын цагаар залгаарай. Эсвэл доорх маягтаар үзлэг захиалаарай.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <ContactForm unitTypes={unitTypes} preselectedTypeId={type} />

          <div className="flex flex-col gap-6">
            <div>
              <p
                className="font-utility mb-1"
                style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}
              >
                Утас
              </p>
              <a
                href={`tel:${clientConfig.contact.phone.replace(/[\s-]/g, '')}`}
                className="font-body"
                style={{ fontSize: '1.05rem', color: 'var(--color-text)', textDecoration: 'none' }}
              >
                {clientConfig.contact.phone}
              </a>
            </div>
            <div>
              <p
                className="font-utility mb-1"
                style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}
              >
                И-мэйл
              </p>
              <a
                href={`mailto:${clientConfig.contact.email}`}
                className="font-body"
                style={{ fontSize: '1.05rem', color: 'var(--color-text)', textDecoration: 'none' }}
              >
                {clientConfig.contact.email}
              </a>
            </div>
            <div>
              <p
                className="font-utility mb-1"
                style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}
              >
                Хаяг
              </p>
              <p className="font-body" style={{ fontSize: '1.05rem' }}>
                {clientConfig.contact.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
