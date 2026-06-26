'use client'

import { Suspense, useState, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, useProgress } from '@react-three/drei'

function LoadingOverlay() {
  const { progress } = useProgress()
  return (
    <Html fullscreen>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          backgroundColor: 'rgba(22,20,15,0.95)',
          color: '#FAF6EF',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity: 0.5,
          }}
        >
          3D загварыг ачааллаж байна
        </p>
        <div
          style={{
            width: '180px',
            height: '1px',
            backgroundColor: 'rgba(250,246,239,0.12)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#B8946A',
              transform: `scaleX(${progress / 100})`,
              transformOrigin: 'left',
              transition: 'transform 0.25s ease',
            }}
          />
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#B8946A', fontVariantNumeric: 'tabular-nums' }}>
          {Math.round(progress)}%
        </p>
      </div>
    </Html>
  )
}

function Model({
  url,
  onSelect,
}: {
  url: string
  onSelect: (name: string) => void
}) {
  const { scene } = useGLTF(url)

  const handleClick = useCallback(
    (e: { stopPropagation: () => void; object: { name: string; parent: { name: string } | null } }) => {
      e.stopPropagation()
      const name = e.object.name || e.object.parent?.name || ''
      if (name) onSelect(name)
    },
    [onSelect],
  )

  const handlePointerOver = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      document.body.style.cursor = 'pointer'
    },
    [],
  )

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'auto'
  }, [])

  return (
    <primitive
      object={scene}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  )
}

interface Props {
  modelSrc: string
}

export function Dollhouse3DViewer({ modelSrc }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInteractionStart = useCallback(() => {
    setAutoRotate(false)
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
  }, [])

  const handleInteractionEnd = useCallback(() => {
    resumeTimer.current = setTimeout(() => setAutoRotate(true), 3000)
  }, [])

  const formatRoomName = (raw: string) =>
    raw
      .replace(/[_.-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim()

  return (
    <section
      aria-label="Орон сууцны 3D загварын харагдац"
      style={{ height: '100svh', position: 'relative', backgroundColor: '#16140F' }}
    >
      <Canvas
        camera={{ position: [0, 8, 14], fov: 50 }}
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 14, 8]} intensity={1.1} />
        <directionalLight position={[-7, 4, -6]} intensity={0.3} />

        <Suspense fallback={<LoadingOverlay />}>
          <Model url={modelSrc} onSelect={setSelected} />
        </Suspense>

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={0.35}
          enableDamping
          dampingFactor={0.07}
          minDistance={4}
          maxDistance={30}
          maxPolarAngle={Math.PI * 0.52}
          onStart={handleInteractionStart}
          onEnd={handleInteractionEnd}
        />
      </Canvas>

      {selected && (
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(26,23,20,0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(184,148,106,0.22)',
            borderRadius: '3px',
            padding: '9px 22px',
            color: '#FAF6EF',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {formatRoomName(selected)}
        </div>
      )}

      <p
        style={{
          position: 'absolute',
          bottom: '1.25rem',
          right: '1.5rem',
          margin: 0,
          color: 'rgba(250,246,239,0.25)',
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        Чирэх · Томруулах · Дарах
      </p>
    </section>
  )
}
