'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import type { HeroSectionConfig } from '@/types'

export function HeroSection({ config }: { config: HeroSectionConfig }) {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tl = gsap.timeline({ delay: 0.15 })
    tl.from(headlineRef.current, {
      y: 52,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
    })
      .from(
        subRef.current,
        { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.75',
      )
      .from(
        scrollHintRef.current,
        { opacity: 0, y: 8, duration: 0.6, ease: 'power2.out' },
        '-=0.4',
      )

    return () => { tl.kill() }
  }, [])

  return (
    <section
      aria-label="Нүүр хэсэг"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '600px', backgroundColor: 'var(--bg-dark)' }}
    >
      <Image
        src={config.imageSrc}
        alt="Five Star Residence барилга"
        fill
        priority
        className="object-cover"
        sizes="100vw"
        style={{ opacity: 0.68 }}
      />

      {/* Cinematic gradient — heavier at bottom, clears toward top */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(42,36,30,0) 0%, rgba(42,36,30,0.28) 40%, rgba(42,36,30,0.94) 100%)',
        }}
      />

      {/* Headline block — bottom-left, deliberately off-centre */}
      <div
        className="absolute bottom-0 left-0 px-6 pb-20 md:px-14 md:pb-28"
        style={{ maxWidth: 'min(720px, 90vw)' }}
      >
        <h1
          ref={headlineRef}
          className="font-body font-bold text-white"
          style={{
            fontSize: 'clamp(2.4rem, 7vw, 5.6rem)',
            lineHeight: 1.03,
            letterSpacing: '-0.03em',
          }}
        >
          {config.headline}
        </h1>

        {/* Sage accent line */}
        <div
          aria-hidden
          className="mt-5 mb-5"
          style={{ width: '40px', height: '1.5px', backgroundColor: 'var(--accent)' }}
        />

        <p
          ref={subRef}
          className="font-body"
          style={{
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.005em',
            maxWidth: '400px',
          }}
        >
          {config.sub}
        </p>
      </div>

      {/* Scroll hint — bottom-center */}
      <div
        ref={scrollHintRef}
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span
          className="font-body"
          style={{
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
          }}
        >
          Доош
        </span>
        {/* Animated line */}
        <div
          className="w-px overflow-hidden"
          style={{ height: '36px', backgroundColor: 'rgba(255,255,255,0.12)' }}
        >
          <div
            className="w-full bg-white/40"
            style={{
              height: '50%',
              animation: 'scrollPulse 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  )
}
