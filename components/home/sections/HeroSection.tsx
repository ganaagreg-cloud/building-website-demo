'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import type { HeroSectionConfig } from '@/types'

export function HeroSection({ config }: { config: HeroSectionConfig }) {
  const imageRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  // Split the headline into words so each can rise behind its own mask.
  const words = config.headline.split(' ')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const wordEls = headlineRef.current?.querySelectorAll('[data-word]')
    if (!wordEls) return

    const tl = gsap.timeline({ delay: 0.2 })

    // Word-by-word mask reveal — each word slides up from behind its clip.
    tl.from(wordEls, {
      yPercent: 115,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.08,
    })
      .from(
        subRef.current,
        { y: 18, opacity: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.55',
      )
      .from(
        scrollHintRef.current,
        { opacity: 0, y: 8, duration: 0.6, ease: 'power2.out' },
        '-=0.4',
      )

    // Slow Ken Burns push-in on the building render — the "alive" signal.
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 9, ease: 'power1.out' },
      )
    }

    return () => { tl.kill() }
  }, [])

  return (
    <section
      aria-label="Нүүр хэсэг"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '600px', backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Image wrapper — Ken Burns push-in animates this layer */}
      <div ref={imageRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        <Image
          src={config.imageSrc}
          alt="Five Star Residence барилга"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          style={{ opacity: 0.68 }}
        />
      </div>

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
          {words.map((word, i) => (
            <span key={i} className="inline-block whitespace-nowrap">
              <span
                className="inline-block overflow-hidden align-bottom"
                style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}
              >
                <span data-word className="inline-block">
                  {word}
                </span>
              </span>
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
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
