'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { PinnedImageSectionConfig } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export function PinnedImageSection({ config }: { config: PinnedImageSectionConfig }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)

  const { image, states } = config

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      return
    }

    const ctx = gsap.context(() => {
      // Native sticky handles the freeze; this trigger only reads progress
      // (0→1 across the 300vh scroll) to decide which of the 3 states shows.
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const i = Math.min(states.length - 1, Math.floor(self.progress * states.length))
          setActive(i)
        },
      })
    }, section)

    return () => ctx.revert()
  }, [states.length])

  // Reduced-motion / no-JS-friendly fallback: stack the states, image static.
  if (reduced) {
    return (
      <section aria-label="Орон сууцны онцлог" className="w-full">
        {states.map((state, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-8 px-6 py-20 md:flex-row md:px-14"
            style={{ backgroundColor: state.bg, color: state.textColor }}
          >
            <div
              className="relative w-full md:w-1/2"
              style={{ aspectRatio: '4 / 3', backgroundColor: 'var(--bg-dark)' }}
            >
              <Image src={image} alt="" fill className="object-cover rounded-[2px]" sizes="(max-width: 768px) 100vw, 45vw" />
            </div>
            <div className="w-full md:w-2/5">
              <h3 className="font-body font-semibold" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {state.heading}
              </h3>
              <p className="mt-4 font-body" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)', lineHeight: 1.65, opacity: 0.82 }}>
                {state.body}
              </p>
            </div>
          </div>
        ))}
      </section>
    )
  }

  const current = states[active]!

  return (
    <section
      ref={sectionRef}
      aria-label="Орон сууцны онцлог"
      className="relative w-full"
      style={{ height: '300vh' }}
    >
      <div
        className="sticky top-0 overflow-hidden"
        style={{
          height: '100vh',
          backgroundColor: current.bg,
          color: current.textColor,
          transition: 'background-color 0.6s ease, color 0.4s ease',
        }}
      >
        {/* Frozen render — never moves, never fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute hidden md:block"
          style={{ right: '5%', top: '50%', transform: 'translateY(-50%)', width: '45vw', aspectRatio: '4 / 3' }}
        >
          <Image src={image} alt="" fill className="object-cover rounded-[2px]" sizes="45vw" priority={false} />
        </div>

        {/* Mobile frozen render — top half, still frozen via sticky */}
        <div
          aria-hidden
          className="pointer-events-none absolute md:hidden"
          style={{ left: '6%', right: '6%', top: '10%', height: '38%' }}
        >
          <Image src={image} alt="" fill className="object-cover rounded-[2px]" sizes="88vw" />
        </div>

        {/* Text block — content + colors crossfade per state */}
        <div
          className="absolute md:w-2/5"
          style={{
            left: '8%',
            right: '8%',
            top: '50%',
            transform: 'translateY(-50%)',
            transition: 'opacity 0.4s ease, color 0.4s ease',
          }}
        >
          {/* Mobile: push text below the frozen image */}
          <div className="mt-[44vh] md:mt-0" style={{ width: '100%', maxWidth: '40ch' }}>
            <span
              className="font-body text-[12px] font-semibold uppercase tracking-[0.22em]"
              style={{ opacity: 0.6 }}
            >
              0{active + 1} / 0{states.length}
            </span>
            <h3
              key={`h-${active}`}
              className="mt-3 font-body font-semibold animate-[fadeUp_0.5s_ease]"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.08 }}
            >
              {current.heading}
            </h3>
            <p
              key={`b-${active}`}
              className="mt-5 font-body animate-[fadeUp_0.5s_ease]"
              style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.15rem)', lineHeight: 1.65, opacity: 0.85 }}
            >
              {current.body}
            </p>

            {/* Progress ticks */}
            <div className="mt-8 flex gap-2" aria-hidden>
              {states.map((_, i) => (
                <span
                  key={i}
                  className="block h-px transition-all duration-500"
                  style={{
                    width: i === active ? '28px' : '14px',
                    backgroundColor: 'currentColor',
                    opacity: i === active ? 0.9 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
