'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { DepthParallax } from '@/components/common/DepthParallax'
import type { DollhouseRevealSectionConfig } from '@/types'

gsap.registerPlugin(ScrollTrigger)

const Dollhouse3DViewer = dynamic(
  () => import('./Dollhouse3DViewer').then((m) => ({ default: m.Dollhouse3DViewer })),
  { ssr: false },
)

function ParallaxReveal({ config }: { config: DollhouseRevealSectionConfig }) {
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const lightOverlayRef = useRef<HTMLDivElement>(null)
  const depthRenderRef = useRef<((progress: number) => void) | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const imageWrap = imageWrapRef.current
    const lightOverlay = lightOverlayRef.current
    if (!section || !imageWrap || !lightOverlay) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(imageWrap, { clipPath: 'inset(0%)' })
      gsap.set(lightOverlay, { opacity: 0 })
      return
    }

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
        onUpdate: (self) => {
          depthRenderRef.current?.((self.progress - 0.5) * 2)
        },
      },
    })

    tl.to(imageWrap, { clipPath: 'inset(0%)', ease: 'power2.inOut', duration: 0.75 }, 0)
    tl.to(lightOverlay, { opacity: 0.18, ease: 'power1.inOut', duration: 0.4 }, 0.55)

    return () => {
      depthRenderRef.current = null
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
      <div ref={imageWrapRef} className="absolute inset-0">
        {config.depthSrc ? (
          <DepthParallax
            colorSrc={config.imageSrc}
            depthSrc={config.depthSrc}
            alt="Five Star Residence интерьер"
            intensity={0.05}
            renderRef={depthRenderRef}
          />
        ) : (
          <Image
            src={config.imageSrc}
            alt="Five Star Residence интерьер"
            fill
            className="object-cover"
            sizes="100vw"
          />
        )}
      </div>
      <div
        ref={lightOverlayRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: 'var(--bg-light)' }}
      />
    </section>
  )
}

export function DollhouseRevealSection({ config }: { config: DollhouseRevealSectionConfig }) {
  if (config.modelSrc) {
    return <Dollhouse3DViewer modelSrc={config.modelSrc} />
  }
  return <ParallaxReveal config={config} />
}
