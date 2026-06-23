'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { ManifestoSectionConfig } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export function ManifestoSection({ config }: { config: ManifestoSectionConfig }) {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([])

  useEffect(() => {
    const section = sectionRef.current
    const lines = lineRefs.current.filter((el): el is HTMLParagraphElement => el !== null)
    if (!section || lines.length === 0) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(lines, { opacity: 1, y: 0 })
      return
    }

    // Start hidden — each line scrubs in as user scrolls through the pinned section
    gsap.set(lines, { opacity: 0, y: 40 })

    // Timeline covers ~220% viewport height of scroll.
    // Each line fills its own third of that distance.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=220%',
        pin: true,
        scrub: 1.4,
        anticipatePin: 1,
      },
    })

    lines.forEach((line, i) => {
      tl.to(
        line,
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.45 },
        i * 0.55 + 0.1,
      )
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Манифест"
      className="relative w-full flex items-center justify-center"
      style={{
        minHeight: '100svh',
        backgroundColor: 'var(--bg-dark)',
        paddingBlock: 'clamp(5rem, 12vw, 9rem)',
        paddingInline: 'clamp(1.5rem, 6vw, 4rem)',
      }}
    >
      <div
        className="w-full text-center"
        style={{ maxWidth: 'min(760px, 90vw)' }}
      >
        {config.lines.map((line, i) => (
          <div key={i}>
            {i > 0 && (
              <div
                aria-hidden
                className="mx-auto"
                style={{
                  width: '28px',
                  height: '1px',
                  backgroundColor: 'var(--line-dark)',
                  marginBlock: 'clamp(1.8rem, 4vw, 3rem)',
                }}
              />
            )}
            <p
              ref={(el) => { lineRefs.current[i] = el }}
              className="font-body text-white"
              style={{
                fontSize: 'clamp(1.5rem, 4.2vw, 3.2rem)',
                fontWeight: 500,
                lineHeight: 1.18,
                letterSpacing: '-0.02em',
              }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
