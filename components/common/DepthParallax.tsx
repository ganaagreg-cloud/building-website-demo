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
  /** 'cover' (default) or 'contain' — applied to both the fallback and skeleton images. */
  objectFit?: 'cover' | 'contain'
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
  objectFit = 'cover',
  renderRef,
  scrollTriggerTarget,
}: DepthParallaxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<DepthParallaxRenderer | null>(null)
  const [webglFailed, setWebglFailed] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Holds the ScrollTrigger instance so the cleanup function always sees it,
  // even if the component unmounts while the Promise is still in-flight.
  const stRef = useRef<{ kill(): void } | null>(null)

  // Tracks the most recent progress value so ResizeObserver can redraw correctly.
  const lastProgressRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWebglFailed(true)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false

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
        setIsReady(true)

        if (renderRef) {
          // Parent (DollhouseRevealSection) drives progress via GSAP onUpdate
          renderRef.current = (progress: number) => {
            lastProgressRef.current = progress
            renderer.render(progress)
          }
        } else if (scrollTriggerTarget?.current) {
          // Self-managed: create a ScrollTrigger for detail-page floor plans
          Promise.all([
            import('gsap').then((m) => m.default),
            import('gsap/ScrollTrigger').then((m) => m.default),
          ]).then(([gsap, ScrollTrigger]) => {
            if (cancelled) return
            gsap.registerPlugin(ScrollTrigger)
            stRef.current = ScrollTrigger.create({
              trigger: scrollTriggerTarget.current,
              start: 'top 85%',
              end: 'bottom 15%',
              scrub: 1.4,
              onUpdate: (self) => {
                const progress = self.progress * 2 - 1
                lastProgressRef.current = progress
                renderer.render(progress)
              },
            })
          })
        }
      })
      .catch(() => {
        if (!cancelled) setWebglFailed(true)
      })

    return () => {
      cancelled = true
      stRef.current?.kill()
      stRef.current = null
      rendererRef.current?.destroy()
      rendererRef.current = null
      if (renderRef) renderRef.current = null
    }
  }, [colorSrc, depthSrc, intensity, renderRef, scrollTriggerTarget])

  // ResizeObserver: keeps the canvas buffer in sync with its CSS size across
  // orientation changes, panel resizes, etc.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ro = new ResizeObserver(() => {
      const renderer = rendererRef.current
      if (!renderer) return
      renderer.resize()
      renderer.render(lastProgressRef.current)
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  if (webglFailed) {
    return (
      <Image
        src={colorSrc}
        alt={alt}
        fill
        className={`object-${objectFit}`}
        sizes={sizes}
      />
    )
  }

  return (
    <>
      {/* Skeleton/fallback shown at reduced opacity while textures load */}
      {!isReady && (
        <Image
          src={colorSrc}
          alt={alt}
          fill
          className={`object-${objectFit}`}
          sizes={sizes}
          style={{ opacity: 0.3 }}
        />
      )}
      {/* Canvas is always mounted so WebGL init can proceed */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
      {/* Accessible label for screen readers since the canvas is aria-hidden */}
      <span className="sr-only">{alt}</span>
    </>
  )
}
