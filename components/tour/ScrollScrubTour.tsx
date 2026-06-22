'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { TourFallback } from './TourFallback'

gsap.registerPlugin(ScrollTrigger)

interface ScrollScrubTourProps {
  frames: string[]
}

export function ScrollScrubTour({ frames }: ScrollScrubTourProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  useEffect(() => {
    if (prefersReducedMotion || frames.length === 0) return

    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Size canvas to match its CSS display size
    function resizeCanvas() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Preload all frames
    const images: HTMLImageElement[] = []
    let loadedCount = 0
    let allLoaded = false

    function drawFrame(index: number) {
      if (!ctx || !canvas) return
      const img = images[index]
      if (!img?.complete) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
    }

    if (frames.length === 0) {
      allLoaded = true
    } else {
      frames.forEach((src, i) => {
        const img = new window.Image()
        img.src = src
        img.onload = () => {
          loadedCount++
          if (i === 0) drawFrame(0)
          if (loadedCount === frames.length) allLoaded = true
        }
        img.onerror = () => {
          loadedCount++
          if (loadedCount === frames.length) allLoaded = true
        }
        images[i] = img
      })
    }

    const state = { frame: 0 }

    const tween = gsap.to(state, {
      frame: frames.length - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${frames.length * 5}`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: () => {
          if (allLoaded) drawFrame(Math.round(state.frame))
        },
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [frames, prefersReducedMotion])

  if (prefersReducedMotion) {
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
      className="w-full h-screen overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </section>
  )
}
