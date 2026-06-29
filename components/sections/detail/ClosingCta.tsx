import Link from 'next/link'
import { clientConfig } from '@/config/client.config'
import type { UnitType } from '@/types'

export function ClosingCta({ unitType }: { unitType: UnitType }) {
  const phone = clientConfig.contact.phone
  const telHref = `tel:${phone.replace(/[\s-]/g, '')}`

  return (
    <section style={{ borderTop: '1px solid var(--color-border)' }}>
      <div
        className="max-w-content mx-auto px-4 lg:px-8 text-center"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        <h2
          className="font-display font-light"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.015em',
            marginBottom: '1rem',
          }}
        >
          {unitType.name} орон сууцыг{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-oak)' }}>биечлэн</em> үзэх үү?
        </h2>
        <p
          className="font-body"
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-muted)',
            maxWidth: '44ch',
            margin: '0 auto 2.5rem',
          }}
        >
          Манай баг үзлэг зохион байгуулж, таны асуултад хариулахад бэлэн байна.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={`/contact?type=${unitType.id}`}
            className="font-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-oak)]"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '52px',
              paddingInline: '28px',
              fontSize: '0.9375rem',
              backgroundColor: 'var(--color-oak)',
              color: '#FFFFFF',
              borderRadius: '9999px',
              border: '1.5px solid var(--color-oak)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background-color 150ms, border-color 150ms',
            }}
          >
            Үзлэг захиалах
          </Link>
          <a
            href={telHref}
            className="font-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)]"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '52px',
              paddingInline: '28px',
              fontSize: '0.9375rem',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              borderRadius: '9999px',
              border: '1.5px solid var(--color-border)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'border-color 150ms',
            }}
          >
            {phone}
          </a>
        </div>
      </div>
    </section>
  )
}
