'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { DepthParallaxRenderer } from '@/lib/webgl/depthParallax'

interface DepthParallaxProps {
  colorSrc: string
  depthSrc: string
  alt: string
  intensity?: number
  sizes?: string
  /**
   * When provided, the parent controls scroll progress.
   * The component sets renderRef.current = renderer.render after init.
   * Call renderRef.current(progress) from a GSAP onUpdate callback.
   * progress range: −1 (start) to +1 (end).
   */
  renderRef?: React.MutableRefObject<((progress: number) => void) | null>
  /**
   * When renderRef is not provided, the component creates its own ScrollTrigger
   * on this element. The element must be in the DOM when the component mounts.
   */
  scrollTriggerTarget?: React.RefObject<HTMLElement | null>
}

export function DepthParallax({
  colorSrc,
  depthSrc,
  alt,
  intensity = 0.04,
  sizes = '100vw',
  renderRef,
  scrollTriggerTarget,
}: DepthParallaxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<DepthParallaxRenderer | null>(null)
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWebglFailed(true)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    let stInstance: { kill(): void } | null = null

    import('@/lib/webgl/depthParallax')
      .then(({ createDepthParallaxRenderer }) =>
        createDepthParallaxRenderer(canvas, colorSrc, depthSrc, intensity),
      )
      .then((renderer) => {
        if (cancelled) {
          renderer?.destroy()
          return
        }
        if (!renderer) {
          setWebglFailed(true)
          return
        }

        rendererRef.current = renderer

        if (renderRef) {
          // Parent (DollhouseRevealSection) drives progress via GSAP onUpdate
          renderRef.current = renderer.render
        } else if (scrollTriggerTarget?.current) {
          // Self-managed: create a ScrollTrigger for detail-page floor plans
          Promise.all([
            import('gsap').then((m) => m.default),
            import('gsap/ScrollTrigger').then((m) => m.default),
          ]).then(([gsap, ScrollTrigger]) => {
            if (cancelled) return
            gsap.registerPlugin(ScrollTrigger)
            stInstance = ScrollTrigger.create({
              trigger: scrollTriggerTarget.current,
              start: 'top 85%',
              end: 'bottom 15%',
              scrub: 1.4,
              onUpdate: (self) => renderer.render(self.progress * 2 - 1),
            })
          })
        }
      })
      .catch(() => {
        if (!cancelled) setWebglFailed(true)
      })

    return () => {
      cancelled = true
      stInstance?.kill()
      rendererRef.current?.destroy()
      rendererRef.current = null
      if (renderRef) renderRef.current = null
    }
  }, [colorSrc, depthSrc, intensity, renderRef, scrollTriggerTarget])

  if (webglFailed) {
    return (
      <Image
        src={colorSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
      />
    )
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      {/* Accessible label for screen readers since the canvas is aria-hidden */}
      <span className="sr-only">{alt}</span>
    </>
  )
}
