'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { FeatureStepsSectionConfig } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export function FeatureStepsSection({ config }: { config: FeatureStepsSectionConfig }) {
  const sectionRef = useRef<HTMLElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  const { label, steps } = config

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Each step text panel rises from below as it enters; the centred
      // step drives which render is shown in the sticky column.
      steps.forEach((_, i) => {
        const el = stepRefs.current[i]
        if (!el) return

        if (!reduce) {
          gsap.fromTo(
            el,
            { y: 56, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'power2.out',
              duration: 0.6,
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'top 55%',
                scrub: true,
              },
            },
          )
        }

        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActive(i)
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [steps])

  return (
    <section
      ref={sectionRef}
      aria-label={label}
      className="relative w-full"
      style={{ backgroundColor: 'var(--bg-light)' }}
    >
      <div className="max-w-content mx-auto px-6 md:px-14">
        <div className="md:grid md:grid-cols-2 md:gap-16">
          {/* Sticky render column — stays pinned while descriptions scroll past.
              Renders crossfade as the active step changes. */}
          <div className="hidden md:block">
            <div
              className="sticky top-0 flex items-center"
              style={{ height: '100svh' }}
            >
              <div
                className="relative w-full overflow-hidden rounded-[2px]"
                style={{ aspectRatio: '4 / 5', backgroundColor: 'var(--bg-dark)' }}
              >
                {steps.map((step, i) => (
                  <Image
                    key={i}
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover transition-opacity duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ opacity: i === active ? 1 : 0 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Step descriptions — each is one viewport tall so the render has
              room to dwell before the next step takes over. */}
          <div>
            <p
              className="pt-20 pb-2 font-body text-[12px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: 'var(--accent)' }}
            >
              {label}
            </p>

            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => {
                  stepRefs.current[i] = el
                }
                }
                className="flex flex-col justify-center"
                style={{ minHeight: '88svh' }}
              >
                {/* Mobile render — inline above each step (no pin on phones) */}
                <div
                  className="md:hidden relative w-full overflow-hidden rounded-[2px] mb-8"
                  style={{ aspectRatio: '4 / 5', backgroundColor: 'var(--bg-dark)' }}
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>

                <span
                  className="font-body font-light leading-none"
                  style={{
                    fontSize: 'clamp(2.6rem, 6vw, 4rem)',
                    color: 'var(--accent-warm)',
                  }}
                >
                  {step.index}
                </span>
                <h3
                  className="mt-4 font-body font-semibold"
                  style={{
                    fontSize: 'clamp(1.6rem, 3.4vw, 2.4rem)',
                    color: 'var(--text)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-4 font-body"
                  style={{
                    fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                    color: 'var(--text-soft)',
                    maxWidth: '34ch',
                    lineHeight: 1.65,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
