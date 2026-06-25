'use client'

import { useState } from 'react'
import { FormInput } from '@/components/ui/FormInput'
import { clientConfig } from '@/config/client.config'
import type { UnitType } from '@/types'

interface ContactFormProps {
  unitTypes: UnitType[]
  preselectedTypeId?: string
}

export function ContactForm({ unitTypes, preselectedTypeId }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const data = Object.fromEntries(new FormData(e.currentTarget))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('server')
      setSubmitted(true)
    } catch {
      setError('Мессеж илгээхэд алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    const phone = clientConfig.contact.phone
    const telHref = `tel:${phone.replace(/[\s-]/g, '')}`
    return (
      <div className="py-10 max-w-reading flex flex-col gap-6">
        {/* Oak hairline rule — signals completion */}
        <div style={{ width: '32px', height: '2px', backgroundColor: 'var(--color-oak)' }} aria-hidden />

        <div className="flex flex-col gap-2">
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.1 }}>
            Баярлалаа.
          </h2>
          <p className="font-body" style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)' }}>
            Таны захиалгыг хүлээн авлаа. Манай баг{' '}
            <strong className="font-semibold" style={{ color: 'var(--color-text)' }}>
              24 цагийн дотор
            </strong>{' '}
            утасдана.
          </p>
        </div>

        {/* Direct phone channel */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
          }}
        >
          <p className="font-utility" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Яаралтай бол шууд залгаарай
          </p>
          <a
            href={telHref}
            className="font-display font-light"
            style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'var(--color-text)', textDecoration: 'none', lineHeight: 1.1 }}
            aria-label={`Утасдах: ${phone}`}
          >
            {phone}
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 max-w-reading">
      {error && (
        <div
          role="alert"
          className="bg-surface-raised border border-error rounded-sm p-4"
        >
          <p className="font-utility text-[11px] text-error">{error}</p>
        </div>
      )}

      <FormInput
        label="Нэр"
        name="name"
        type="text"
        required
        autoComplete="name"
      />
      <FormInput
        label="Утасны дугаар"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
      />
      <FormInput
        as="select"
        label="Орон сууцны төрөл"
        name="unitType"
        defaultValue={preselectedTypeId ?? ''}
        options={[
          { value: '', label: 'Сонгоно уу' },
          ...unitTypes.map((t) => ({ value: t.id, label: t.name })),
        ]}
      />
      <FormInput
        as="textarea"
        label="Нэмэлт мэдэгдэл"
        name="message"
        placeholder="Асуух зүйл байвал бичнэ үү..."
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '48px',
            paddingInline: '28px',
            borderRadius: '9999px',
            backgroundColor: loading ? 'rgba(184,148,106,0.55)' : 'var(--color-accent)',
            color: 'var(--color-on-dark)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 150ms',
          }}
        >
          {loading ? 'Илгээж байна...' : 'Илгээх'}
        </button>
      </div>
    </form>
  )
}
