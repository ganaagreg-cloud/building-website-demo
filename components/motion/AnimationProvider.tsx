'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Small tick ensures the page DOM is fully rendered
      const rafId = requestAnimationFrame(() => {
        // 1. Hero name: fade + rise on load
        const heroName = document.querySelector<HTMLElement>('[data-hero-name]')
        if (heroName) {
          gsap.from(heroName, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.15,
          })
        }

        // 2. Hero tagline
        const heroSub = document.querySelector<HTMLElement>('[data-hero-sub]')
        if (heroSub) {
          gsap.from(heroSub, {
            y: 12,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.45,
          })
        }

        // 3. Hero CTA
        const heroCta = document.querySelector<HTMLElement>('[data-hero-cta]')
        if (heroCta) {
          gsap.from(heroCta, {
            y: 8,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: 0.65,
          })
        }

        // 4. Oak hairlines: scaleX 0 → 1 on scroll-in (hero hairline fires immediately)
        document.querySelectorAll<HTMLElement>('[data-oak-hairline]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            delay: el.closest('[data-hero-section]') ? 0.7 : 0,
            scrollTrigger: el.closest('[data-hero-section]')
              ? undefined
              : {
                  trigger: el,
                  start: 'top 88%',
                },
          })
        })

        // 5. Section content reveals — stagger direct children of each section
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

        // 6. Ghost number parallax: drift upward ~40px as section scrolls through
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

      return () => {
        cancelAnimationFrame(rafId)
        ScrollTrigger.getAll().forEach((st) => st.kill())
      }
    })

    return () => {
      mm.revert()
    }
  }, [pathname])

  return <>{children}</>
}
