'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { ShowcaseApartment3DConfig } from '@/types'

const ShowcaseScene = dynamic<{ modelSrc: string }>(
  () => import('./showcase-3d/ShowcaseScene').then((m) => ({ default: m.ShowcaseScene })),
  { ssr: false },
)

function Placeholder() {
  return (
    <div
      aria-hidden
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #16140F 0%, #1e1b13 60%, #16140F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '1px solid rgba(184,148,106,0.2)',
          borderTopColor: '#B8946A',
          borderRadius: '50%',
          animation: 'spin 1.2s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function ShowcaseSection({ config }: { config: ShowcaseApartment3DConfig }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  // Mount the 3D scene once the section is 200px away from the viewport —
  // early enough to be loaded by the time the user scrolls to it.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // R3F sets touch-action:none on the canvas by default, which captures wheel
  // and one-finger touch. Override to pan-y so vertical scroll passes through
  // on both desktop (trackpad) and mobile.
  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => {
      const canvas = containerRef.current?.querySelector('canvas')
      if (canvas) (canvas as HTMLElement).style.touchAction = 'pan-y'
    }, 200)
    return () => clearTimeout(timer)
  }, [inView])

  return (
    <section
      aria-label="3D интерактив загварын боломж"
      style={{ backgroundColor: '#16140F', color: '#FAF6EF' }}
    >
      {/* ── Section header ── */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: 'clamp(3rem, 6vw, 5rem) 1.5rem 2rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: '0 0 1rem',
            fontSize: '10px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#B8946A',
          }}
        >
          Жишээ боломж — Five Star-ийн бодит интерьер биш
        </p>

        <h2
          className="font-display"
          style={{
            margin: '0 0 1.25rem',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          Таны 3D загварыг{' '}
          <em style={{ fontStyle: 'italic', color: '#B8946A' }}>
            интерактив
          </em>{' '}
          болгоно
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            lineHeight: 1.7,
            color: 'rgba(250,246,239,0.6)',
          }}
        >
          Архитектораас нь хүлээн авсан Blender загварыг сайт дотор
          эргүүлж, өрөө бүрийг дотроос нь харах боломжтой болгодог.
          Доорх загвар нь энэ боломжийг харуулах жишээ юм.
        </p>
      </div>

      {/* ── 3D viewer ── */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 'clamp(480px, 80vh, 860px)',
          position: 'relative',
        }}
      >
        {inView ? <ShowcaseScene modelSrc={config.modelSrc} /> : <Placeholder />}
      </div>

      {/* ── CC BY 4.0 attribution — license obligation, not optional ── */}
      <div
        style={{
          padding: '0.75rem 1.5rem',
          textAlign: 'right',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '10px',
            color: 'rgba(250,246,239,0.3)',
            letterSpacing: '0.04em',
          }}
        >
          3D model:{' '}
          <a
            href="https://sketchfab.com/3d-models/modern-apartment-1fbb649cd6624f2bb7b7d6e30c6533a5"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(250,246,239,0.45)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Visthétique on Sketchfab
          </a>
          {' '}— CC BY 4.0
        </p>
      </div>
    </section>
  )
}
