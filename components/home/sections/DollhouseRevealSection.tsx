'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { DollhouseRevealSectionConfig } from '@/types'

gsap.registerPlugin(ScrollTrigger)

export function DollhouseRevealSection({ config }: { config: DollhouseRevealSectionConfig }) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const lightOverlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const imageWrap = imageWrapRef.current
    const lightOverlay = lightOverlayRef.current
    if (!section || !imageWrap || !lightOverlay) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Skip animation — show full image immediately, in light mode
      gsap.set(imageWrap, { clipPath: 'inset(0%)' })
      gsap.set(lightOverlay, { opacity: 0 })
      return
    }

    // Start: image clipped with dark margins showing (the "portrait" framing)
    gsap.set(imageWrap, { clipPath: 'inset(7%)' })
    gsap.set(lightOverlay, { opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 1.6,
        anticipatePin: 1,
      },
    })

    // Phase 1 (0→75%): inset shrinks to zero — image bursts to full-bleed
    tl.to(
      imageWrap,
      { clipPath: 'inset(0%)', ease: 'power2.inOut', duration: 0.75 },
      0,
    )

    // Phase 2 (60→100%): light wash fades in — the "color break" to the light world
    tl.to(
      lightOverlay,
      { opacity: 0.18, ease: 'power1.inOut', duration: 0.4 },
      0.55,
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Five Star Residence интерьерийн нэвтэрч харах"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Image — revealed via clip-path inset shrinking to 0 */}
      <div ref={imageWrapRef} className="absolute inset-0">
        <Image
          src={config.imageSrc}
          alt="Five Star Residence интерьер"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Light overlay — fades in at the end for the color-break transition */}
      <div
        ref={lightOverlayRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: 'var(--bg-light)' }}
      />
    </section>
  )
}
