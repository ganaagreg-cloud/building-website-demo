'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { TourFallback } from './TourFallback'
import { SampleVizCaption } from '@/components/common/SampleVizCaption'

gsap.registerPlugin(ScrollTrigger)

interface ScrollScrubTourProps {
  frames: string[]
  isSampleVisualization?: boolean
}

export function ScrollScrubTour({ frames, isSampleVisualization }: ScrollScrubTourProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (frames.length === 0) return

    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = { frame: 0 }

    // Declare images BEFORE drawFrame / resizeCanvas reference it
    const images: HTMLImageElement[] = []

    function drawFrame(index: number) {
      if (!ctx || !canvas) return
      const img = images[Math.round(index)]
      if (!img?.complete || img.naturalWidth === 0) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
    }

    function resizeCanvas() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      drawFrame(state.frame)
    }

    // Safe to call now — images is already declared (empty array)
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Populate images after resizeCanvas is wired up
    frames.forEach((src, i) => {
      const img = new window.Image()
      img.src = src
      img.onload = () => { if (i === 0) drawFrame(0) }
      images[i] = img
    })

    const tween = gsap.to(state, {
      frame: frames.length - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${frames.length * 80}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: () => drawFrame(state.frame),
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [frames])

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return <TourFallback frames={frames} />
  }

  if (frames.length === 0) {
    return (
      <section
        id="tour"
        aria-label="Орон сууцны аялал"
        className="w-full h-[60vh] bg-surface-raised flex items-center justify-center border-y border-[var(--color-border)]"
      >
        <p className="font-utility text-[12px] text-muted tracking-widest uppercase">
          Tour frames loading…
        </p>
      </section>
    )
  }

  return (
    <section
      id="tour"
      ref={sectionRef}
      aria-label="Орон сууцны аялал"
      className="relative w-full h-screen overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" aria-hidden="true" />
      {isSampleVisualization && (
        <div className="absolute bottom-5 right-5 md:bottom-6 md:right-8">
          <SampleVizCaption tone="light" />
        </div>
      )}
    </section>
  )
}
