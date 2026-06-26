import Link from 'next/link'
import { clientConfig } from '@/config/client.config'

export default function NotFound() {
  return (
    <main
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: 'calc(100svh - 64px)', padding: 'clamp(3rem, 8vw, 6rem) 1.5rem' }}
    >
      <span
        className="font-utility"
        style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '2rem' }}
      >
        404
      </span>

      <h1
        className="font-display font-light"
        style={{
          fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
          lineHeight: 1.02,
          letterSpacing: '-0.025em',
          color: 'var(--color-text)',
          maxWidth: '18ch',
          marginBottom: '1.25rem',
        }}
      >
        Энэ хуудас олдсонгүй
      </h1>

      <p
        className="font-body"
        style={{
          fontSize: '1.0625rem',
          lineHeight: 1.7,
          color: 'var(--color-muted)',
          maxWidth: '38ch',
          marginBottom: '2.5rem',
        }}
      >
        Таны хайж байгаа хуудас нүүлгэгдсэн эсвэл устгагдсан байж болзошгүй. Доороос буцаж үзнэ үү.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="font-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-oak)]"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '48px',
            paddingInline: '24px',
            backgroundColor: 'var(--color-oak)',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            textDecoration: 'none',
            borderRadius: '8px',
            border: '1.5px solid var(--color-oak)',
          }}
        >
          Нүүр хуудас
        </Link>
        <Link
          href="/residences"
          className="font-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-oak)]"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '48px',
            paddingInline: '24px',
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            fontSize: '0.875rem',
            textDecoration: 'none',
            borderRadius: '8px',
            border: '1.5px solid rgba(0,0,0,0.2)',
          }}
        >
          Орон сууцнууд →
        </Link>
      </div>

      <p
        className="font-body"
        style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '4rem', opacity: 0.6 }}
      >
        {clientConfig.buildingName}
      </p>
    </main>
  )
}
