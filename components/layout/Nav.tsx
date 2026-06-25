'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
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
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const linksRef = useRef<HTMLDivElement>(null)

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const threshold = isHome ? window.innerHeight * 0.7 : 40
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  function openMenu() {
    setOpen(true)
    // Double rAF ensures element is painted before transition fires
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }

  function closeMenu() {
    setVisible(false)
    setTimeout(() => setOpen(false), 260)
  }

  // GSAP link stagger on open
  useEffect(() => {
    if (!visible || !linksRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const items = linksRef.current.querySelectorAll<HTMLElement>('.nav-item')
    gsap.fromTo(
      items,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.07, delay: 0.08 },
    )
  }, [visible])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const textColor = transparent ? 'rgba(255,255,255,0.92)' : 'var(--color-text)'
  const tickColor = transparent ? 'rgba(255,255,255,0.55)' : 'var(--color-oak)'
  const btnColor  = transparent ? 'rgba(255,255,255,0.65)' : 'var(--color-muted)'

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-5 lg:px-10 justify-between transition-[background-color,border-color] duration-300 ease-out"
        style={{
          backgroundColor: transparent ? 'transparent' : '#FFFFFF',
          borderBottom: transparent ? '1px solid transparent' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)] focus-visible:ring-offset-2"
        >
          <span
            aria-hidden
            className="inline-block transition-all duration-300 group-hover:scale-y-150"
            style={{ width: '2px', height: '14px', backgroundColor: tickColor }}
          />
          <span
            className="font-body font-bold text-[15px] tracking-tight transition-colors duration-300"
            style={{ color: textColor }}
          >
            {clientConfig.buildingName}
          </span>
        </Link>

        {/* Цэс button */}
        <button
          type="button"
          aria-label={open ? 'Цэс хаах' : 'Цэс нээх'}
          aria-expanded={open}
          aria-controls="nav-overlay"
          onClick={open ? closeMenu : openMenu}
          className="flex items-center gap-2.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)] focus-visible:ring-offset-2"
        >
          <span
            className="font-utility text-[10px] tracking-[0.14em] uppercase transition-colors duration-300"
            style={{ color: btnColor }}
          >
            {open ? 'Хаах' : 'Цэс'}
          </span>
          {/* Two-line icon morphs to ✕ */}
          <span
            aria-hidden
            className="relative flex flex-col justify-center"
            style={{ width: '18px', height: '11px' }}
          >
            <span
              className="absolute block h-px w-full transition-all duration-300"
              style={{
                backgroundColor: textColor,
                top: 0,
                transform: open ? 'translateY(5.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="absolute block h-px transition-all duration-300"
              style={{
                backgroundColor: textColor,
                bottom: 0,
                right: 0,
                width: open ? '100%' : '70%',
                transform: open ? 'translateY(-5.5px) rotate(-45deg)' : 'none',
              }}
            />
          </span>
        </button>
      </header>

      {/* Inner-page spacer */}
      {!isHome && <div aria-hidden className="h-16" />}

      {/* ─── Editorial full-screen overlay ─── */}
      {open && (
        <div
          id="nav-overlay"
          className="fixed inset-0 z-[60] flex flex-col"
          style={{
            backgroundColor: '#FFFFFF',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.26s ease-out',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Навигаци"
        >
          {/* Mirror of the top bar */}
          <div
            className="flex items-center justify-between h-16 px-5 lg:px-10 shrink-0"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
          >
            <Link
              href="/"
              onClick={closeMenu}
              className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)] focus-visible:ring-offset-2"
            >
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:scale-y-150"
                style={{ width: '2px', height: '14px', backgroundColor: 'var(--color-oak)' }}
              />
              <span className="font-body font-bold text-[15px] tracking-tight" style={{ color: 'var(--color-text)' }}>
                {clientConfig.buildingName}
              </span>
            </Link>

            <button
              type="button"
              aria-label="Хаах"
              onClick={closeMenu}
              className="flex items-center gap-2.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)]"
            >
              <span className="font-utility text-[10px] tracking-[0.14em] uppercase" style={{ color: 'var(--color-muted)' }}>
                Хаах
              </span>
              <span aria-hidden className="relative flex flex-col justify-center" style={{ width: '18px', height: '11px' }}>
                <span className="absolute block h-px w-full" style={{ backgroundColor: 'var(--color-muted)', top: 0, transform: 'translateY(5.5px) rotate(45deg)' }} />
                <span className="absolute block h-px w-full" style={{ backgroundColor: 'var(--color-muted)', bottom: 0, transform: 'translateY(-5.5px) rotate(-45deg)' }} />
              </span>
            </button>
          </div>

          {/* Links — vertically centred */}
          <div ref={linksRef} className="flex-1 flex flex-col justify-center px-5 lg:px-10 overflow-y-auto">
            <nav aria-label="Үндсэн цэс">
              {NAV_LINKS.map((link, i) => {
                const active = pathname === link.href
                return (
                  <div
                    key={link.href}
                    className="nav-item"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={active ? 'page' : undefined}
                      className="group flex items-baseline gap-5 py-5 lg:py-6 focus-visible:outline-none"
                    >
                      <span
                        className="font-utility text-[10px] shrink-0 transition-colors duration-200"
                        style={{ color: active ? 'var(--color-oak)' : 'var(--color-muted)', minWidth: '1.25rem' }}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className="font-display font-light transition-colors duration-200 group-hover:text-[var(--color-oak)]"
                        style={{
                          fontSize: 'clamp(2rem, 5.5vw, 3.75rem)',
                          lineHeight: 1,
                          letterSpacing: '-0.02em',
                          color: active ? 'var(--color-oak)' : 'var(--color-text)',
                        }}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </div>
                )
              })}

              {/* CTA — text link, not a pill */}
              <div className="nav-item mt-8 pt-2">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="inline-flex items-center gap-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-oak)] focus-visible:ring-offset-2"
                >
                  <span
                    className="font-body font-medium"
                    style={{ fontSize: '0.9375rem', color: 'var(--color-oak)' }}
                  >
                    Үзлэг захиалах
                  </span>
                  <span aria-hidden style={{ color: 'var(--color-oak)', fontSize: '0.9rem' }}>→</span>
                </Link>
              </div>
            </nav>
          </div>

          {/* Footer — tagline + address */}
          <div
            className="px-5 lg:px-10 py-5 shrink-0"
            style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
          >
            <p
              className="font-utility text-[10px] tracking-[0.14em] uppercase"
              style={{ color: 'var(--color-muted)' }}
            >
              {clientConfig.tagline} · {clientConfig.contact.address}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
