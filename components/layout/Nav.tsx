'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { clientConfig } from '@/config/client.config'

const NAV_LINKS = [
  { href: '/residences', label: 'Орон сууц' },
  { href: '/availability', label: 'Боломжтой' },
  { href: '/location', label: 'Байршил' },
  { href: '/about', label: 'Бидний тухай' },
]

export function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === '/'
  // Transparent-over-hero only at the top of the home page.
  const transparent = isHome && !scrolled

  useEffect(() => {
    // On home, flip to solid once the hero is mostly scrolled past.
    // On inner pages, flip almost immediately.
    const threshold = isHome ? window.innerHeight * 0.7 : 40
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const textColor = transparent ? 'rgba(255,255,255,0.92)' : 'var(--text)'
  const mutedColor = transparent ? 'rgba(255,255,255,0.6)' : 'var(--text-soft)'

  return (
    <>
      <header
        className={[
          'fixed top-0 inset-x-0 z-50 h-16',
          'flex items-center px-5 lg:px-10 justify-between',
          'transition-[background-color,box-shadow,border-color] duration-300 ease-out',
        ].join(' ')}
        style={{
          backgroundColor: transparent ? 'transparent' : 'rgba(250,250,248,0.82)',
          backdropFilter: transparent ? 'none' : 'saturate(180%) blur(12px)',
          WebkitBackdropFilter: transparent ? 'none' : 'saturate(180%) blur(12px)',
          borderBottom: transparent ? '1px solid transparent' : '1px solid var(--line)',
          boxShadow: transparent ? 'none' : '0 1px 0 rgba(28,26,23,0.02)',
        }}
      >
        {/* Wordmark — grotesk, tight, with a sage tick */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        >
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:scale-y-150"
            style={{ width: '3px', height: '16px', backgroundColor: 'var(--accent)' }}
          />
          <span
            className="font-body font-bold text-[15px] tracking-tight transition-colors duration-300"
            style={{ color: textColor }}
          >
            {clientConfig.buildingName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Үндсэн цэс">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-body text-[13px] font-medium tracking-tight transition-colors duration-300"
                style={{ color: active ? textColor : mutedColor }}
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-0 h-px transition-all duration-300"
                  style={{
                    width: active ? '100%' : '0%',
                    backgroundColor: 'var(--accent)',
                  }}
                />
              </Link>
            )
          })}
          <Link
            href="/contact"
            className="ml-1 rounded-full px-5 py-2 font-body text-[13px] font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: transparent ? 'rgba(255,255,255,0.12)' : 'var(--accent)',
              color: transparent ? '#fff' : '#fff',
              border: transparent
                ? '1px solid rgba(255,255,255,0.35)'
                : '1px solid transparent',
              boxShadow: transparent ? 'none' : '0 2px 12px rgba(124,139,111,0.28)',
            }}
          >
            Үзлэг захиалах
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label={open ? 'Цэс хаах' : 'Цэс нээх'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-5 h-px mb-1.5 transition-colors" style={{ backgroundColor: textColor }} />
          <span className="block w-5 h-px mb-1.5 transition-colors" style={{ backgroundColor: textColor }} />
          <span className="block w-5 h-px transition-colors" style={{ backgroundColor: textColor }} />
        </button>
      </header>

      {/* Spacer — on inner pages the fixed nav would otherwise overlap content.
          The home hero intentionally sits under the transparent nav. */}
      {!isHome && <div aria-hidden className="h-16" />}

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8"
          style={{
            backgroundColor: 'var(--color-surface)',
            animation: 'navOverlayIn 0.2s ease-out both',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Навигаци"
        >
          <button
            type="button"
            className="absolute top-5 right-5 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)]"
            style={{ color: 'var(--color-muted)', fontSize: '1.125rem' }}
            aria-label="Хаах"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-body font-semibold text-3xl tracking-tight"
                style={{ color: 'var(--color-text)' }}
                onClick={() => setOpen(false)}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-1.5 left-0 h-px w-full"
                    style={{ backgroundColor: 'var(--color-oak)' }}
                  />
                )}
              </Link>
            )
          })}
          <Link
            href="/contact"
            className="mt-2 rounded-full px-6 py-2.5 font-body font-semibold text-sm"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-on-dark)',
            }}
            onClick={() => setOpen(false)}
          >
            Үзлэг захиалах
          </Link>
        </div>
      )}
    </>
  )
}
