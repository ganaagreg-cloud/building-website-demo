'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, useProgress, Html } from '@react-three/drei'
import { CameraRig, ORBIT_POSITION, type CameraRigHandle, type CamMode } from './CameraRig'
import { RoomHotspots } from './RoomHotspots'
import { showcaseRooms, type RoomHotspot } from './showcase-rooms.config'

// ── Loading overlay (inside Canvas via Html) ─────────────────────────────────
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
          backgroundColor: 'rgba(22,20,15,0.96)',
        }}
      >
        <p
          style={{
            margin: 0,
            color: 'rgba(250,246,239,0.45)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          3D загварыг ачааллаж байна
        </p>
        <div
          style={{
            width: '160px',
            height: '1px',
            backgroundColor: 'rgba(250,246,239,0.1)',
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
              transition: 'transform 0.2s ease',
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

// ── Model (throws promise via Suspense until loaded) ─────────────────────────
function ApartmentModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

// ── Scene ────────────────────────────────────────────────────────────────────
export function ShowcaseScene({ modelSrc }: { modelSrc: string }) {
  const rigRef = useRef<CameraRigHandle>(null)
  const [camMode, setCamMode] = useState<CamMode>('orbit')
  const [activeRoom, setActiveRoom] = useState<RoomHotspot | null>(null)

  const handleHotspotClick = (room: RoomHotspot) => {
    setActiveRoom(room)
    rigRef.current?.flyTo(room.cameraPosition, room.cameraTarget)
  }

  const handleBack = () => {
    setActiveRoom(null)
    rigRef.current?.returnToOrbit()
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: ORBIT_POSITION, fov: 50 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[10, 14, 8]} intensity={1.1} castShadow={false} />
        <directionalLight position={[-7, 5, -6]} intensity={0.3} />

        <Suspense fallback={<LoadingOverlay />}>
          <ApartmentModel url={modelSrc} />
        </Suspense>

        <RoomHotspots
          rooms={showcaseRooms}
          visible={camMode === 'orbit'}
          onHotspotClick={handleHotspotClick}
        />

        <CameraRig ref={rigRef} onModeChange={setCamMode} />
      </Canvas>

      {/* ── Active room label (top-centre when focused) ── */}
      {activeRoom && camMode !== 'orbit' && (
        <div
          aria-live="polite"
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(22,20,15,0.82)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(184,148,106,0.25)',
            borderRadius: '3px',
            padding: '8px 20px',
            color: '#FAF6EF',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {activeRoom.label}
        </div>
      )}

      {/* ── Back button (top-left when focused/transitioning) ── */}
      {camMode !== 'orbit' && (
        <button
          onClick={handleBack}
          aria-label="Orbit view руу буцах"
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(22,20,15,0.82)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(250,246,239,0.14)',
            borderRadius: '3px',
            padding: '8px 16px',
            color: 'rgba(250,246,239,0.75)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'color 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FAF6EF'
            e.currentTarget.style.borderColor = 'rgba(184,148,106,0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(250,246,239,0.75)'
            e.currentTarget.style.borderColor = 'rgba(250,246,239,0.14)'
          }}
        >
          <span aria-hidden style={{ fontSize: '13px' }}>←</span>
          Буцах
        </button>
      )}

      {/* ── Controls hint (orbit mode, only when hotspots exist) ── */}
      {camMode === 'orbit' && showcaseRooms.length > 0 && (
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
          Өрөө сонгоно уу
        </p>
      )}

      {/* ── Generic drag/zoom hint (orbit, no hotspots yet) ── */}
      {camMode === 'orbit' && showcaseRooms.length === 0 && (
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
          Чирэх · Эргүүлэх
        </p>
      )}
    </div>
  )
}
