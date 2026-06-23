'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { InteriorPhotoSectionConfig } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export function InteriorPhotoSection({ config }: { config: InteriorPhotoSectionConfig }) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    if (!section || !image) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Slow vertical drift — the image is over-tall so it never reveals an edge.
      gsap.fromTo(
        image,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label={config.caption ?? 'Интерьер'}
      className="relative w-full overflow-hidden"
      style={{ height: '92svh', backgroundColor: 'var(--bg-dark)' }}
    >
      <div
        ref={imageRef}
        className="absolute inset-x-0"
        style={{ top: '-10%', height: '120%' }}
      >
        <Image
          src={config.image}
          alt={config.caption ?? 'Five Star Residence интерьер'}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {config.caption && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(42,36,30,0.7) 0%, rgba(42,36,30,0) 45%)',
            }}
          />
          <p
            className="absolute bottom-10 left-6 md:left-14 font-body font-medium text-white"
            style={{
              fontSize: 'clamp(1.1rem, 2.4vw, 1.6rem)',
              maxWidth: 'min(560px, 80vw)',
              letterSpacing: '-0.01em',
            }}
          >
            {config.caption}
          </p>
        </>
      )}
    </section>
  )
}
