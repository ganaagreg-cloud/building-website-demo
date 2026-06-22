'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-reading text-center">
        <p className="font-utility text-[12px] text-muted mb-4 tracking-widest uppercase">
          Алдаа гарлаа
        </p>
        <h1 className="font-display font-light text-4xl mb-4">
          Уучлаарай, ямар нэг асуудал гарлаа
        </h1>
        <p className="font-body text-sm text-muted mb-8">
          Хуудсыг дахин ачаалж үзнэ үү.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-oak text-on-oak rounded-full px-6 py-2.5 font-body text-sm hover:bg-[var(--color-oak-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2"
          >
            Дахин оролдох
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-[rgba(42,39,36,0.20)] rounded-full px-6 py-2.5 font-body text-sm hover:border-[rgba(42,39,36,0.40)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2"
          >
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  )
}
