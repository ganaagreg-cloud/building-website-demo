'use client'

import { useState } from 'react'
import { Html } from '@react-three/drei'
import type { RoomHotspot } from './showcase-rooms.config'

function Hotspot({
  room,
  onClick,
}: {
  room: RoomHotspot
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <group position={room.hotspotPosition}>
      {/* 3D pin sphere */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial
          color="#B8946A"
          emissive="#B8946A"
          emissiveIntensity={hovered ? 0.9 : 0.35}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Pulsing ring (visible even when not hovered, draws the eye) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.22, 32]} />
        <meshBasicMaterial
          color="#B8946A"
          transparent
          opacity={hovered ? 0.6 : 0.25}
        />
      </mesh>

      {/* Projected label */}
      <Html
        position={[0, 0.45, 0]}
        center
        distanceFactor={9}
        style={{ pointerEvents: 'none' }}
        occlude={false}
      >
        <div
          style={{
            background: 'rgba(22,20,15,0.88)',
            backdropFilter: 'blur(8px)',
            border: `1px solid rgba(184,148,106,${hovered ? 0.5 : 0.22})`,
            borderRadius: '3px',
            padding: '4px 12px',
            color: '#FAF6EF',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            opacity: hovered ? 1 : 0.8,
            transition: 'opacity 0.2s ease, border-color 0.2s ease',
            userSelect: 'none',
          }}
        >
          {room.label}
        </div>
      </Html>
    </group>
  )
}

interface Props {
  rooms: RoomHotspot[]
  visible: boolean
  onHotspotClick: (room: RoomHotspot) => void
}

export function RoomHotspots({ rooms, visible, onHotspotClick }: Props) {
  if (!visible || rooms.length === 0) return null

  return (
    <>
      {rooms.map((room) => (
        <Hotspot key={room.id} room={room} onClick={() => onHotspotClick(room)} />
      ))}
    </>
  )
}
