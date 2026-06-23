'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx: gsap.Context | undefined
    const rafId = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        // 1. Hero name: fade + rise on load
        const heroName = document.querySelector<HTMLElement>('[data-hero-name]')
        if (heroName) {
          gsap.from(heroName, { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15 })
        }

        // 2. Hero tagline
        const heroSub = document.querySelector<HTMLElement>('[data-hero-sub]')
        if (heroSub) {
          gsap.from(heroSub, { y: 12, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.45 })
        }

        // 3. Hero CTA
        const heroCta = document.querySelector<HTMLElement>('[data-hero-cta]')
        if (heroCta) {
          gsap.from(heroCta, { y: 8, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.65 })
        }

        // 4. Oak hairlines: scaleX 0 → 1
        document.querySelectorAll<HTMLElement>('[data-oak-hairline]').forEach((el) => {
          const inHero = !!el.closest('[data-hero-section]')
          gsap.from(el, {
            scaleX: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            ...(inHero
              ? { delay: 0.7 }
              : {
                  scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                  },
                }),
          })
        })

        // 5. Section content reveals
        document.querySelectorAll<HTMLElement>('[data-reveal-section]').forEach((section) => {
          const kids = Array.from(section.children).filter(
            (el) => !el.hasAttribute('data-parallax-number'),
          ) as HTMLElement[]
          if (kids.length === 0) return
          gsap.from(kids, {
            y: 16,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            },
          })
        })

        // 6. Ghost number parallax
        document.querySelectorAll<HTMLElement>('[data-parallax-number]').forEach((el) => {
          const section = el.closest('section')
          if (!section) return
          gsap.to(el, {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        })

        ScrollTrigger.refresh()
      })
    })

    return () => {
      cancelAnimationFrame(rafId)
      ctx?.revert()
    }
  }, [pathname])

  return <>{children}</>
}
