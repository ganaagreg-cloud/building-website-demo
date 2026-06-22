'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { clientConfig } from '@/config/client.config'

const NAV_LINKS = [
  { href: '/residences', label: 'Орон сууц' },
  { href: '/availability', label: 'Боломжтой' },
  { href: '/location', label: 'Байршил' },
  { href: '/about', label: 'Бидний тухай' },
]

const pillClass =
  'bg-oak text-on-oak rounded-full px-5 py-2 font-body text-sm hover:bg-[#A07E5A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2'

export function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 h-16 bg-surface border-b border-[rgba(42,39,36,0.10)] flex items-center px-4 lg:px-8 justify-between">
        <Link
          href="/"
          className="font-display text-sm tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2"
        >
          {clientConfig.buildingName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Үндсэн цэс">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'font-body text-sm transition-colors',
                pathname === link.href
                  ? 'border-b-2 border-oak pb-0.5'
                  : 'text-muted hover:text-[var(--color-text)]',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className={`${pillClass} ml-2`}>
            Үзлэг захиалах
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak"
          aria-label={open ? 'Цэс хаах' : 'Цэс нээх'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-surface-raised flex flex-col items-center justify-center gap-8"
          role="dialog"
          aria-modal="true"
          aria-label="Навигаци"
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak"
            aria-label="Хаах"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-3xl"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className={pillClass} onClick={() => setOpen(false)}>
            Үзлэг захиалах
          </Link>
        </div>
      )}
    </>
  )
}
