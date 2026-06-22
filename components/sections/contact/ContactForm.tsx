'use client'

import { useState } from 'react'
import { FormInput } from '@/components/ui/FormInput'
import { Button } from '@/components/ui/Button'
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
    return (
      <div className="py-12 text-center max-w-reading">
        <h2 className="font-display font-light text-3xl mb-3">Баярлалаа!</h2>
        <p className="font-body text-base text-muted">
          Таны мессежийг хүлээн авлаа. Удахгүй холбоо барина.
        </p>
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
        <Button variant="pill" type="submit" loading={loading} className="w-full md:w-auto">
          Илгээх
        </Button>
      </div>
    </form>
  )
}
