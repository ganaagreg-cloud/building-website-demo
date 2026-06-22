import { SectionWrapper } from '@/components/layout/SectionWrapper'
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
      <SectionWrapper number="01">
        <div className="max-w-content mx-auto">
          <h1
            className="font-display font-light mb-4"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 4.5rem)', lineHeight: 1.05 }}
          >
            Үзлэг захиалах
          </h1>
          <p className="font-body text-lg text-muted mb-10 max-w-reading">
            Та доорх маягтыг бөглөснөөр бид таны тохиромжтой цагт холбоо барина.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ContactForm unitTypes={unitTypes} preselectedTypeId={type} />

            <address className="not-italic flex flex-col gap-3 lg:pt-2">
              <p className="font-display text-xl mb-2">{clientConfig.buildingName}</p>
              <a
                href={`tel:${clientConfig.contact.phone}`}
                className="font-utility text-[12px] text-muted hover:text-[var(--color-text)] transition-colors"
              >
                {clientConfig.contact.phone}
              </a>
              <a
                href={`mailto:${clientConfig.contact.email}`}
                className="font-utility text-[12px] text-muted hover:text-[var(--color-text)] transition-colors"
              >
                {clientConfig.contact.email}
              </a>
              <p className="font-utility text-[12px] text-muted">{clientConfig.contact.address}</p>
            </address>
          </div>
        </div>
      </SectionWrapper>
    </main>
  )
}
