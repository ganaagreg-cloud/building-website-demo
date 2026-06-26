'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

// Dollhouse 3/4 angle: ~38° elevation, ~40° yaw — reads as cutaway, not eye-level.
// Values tuned for real-world-scale GLBs (~1 unit = 1 m). Scale uniformly if needed.
export const ORBIT_POSITION: [number, number, number] = [30, 35, 30]
export const ORBIT_TARGET: [number, number, number] = [0, 3, 0]

// Exponential lerp speed: 1 = fast (0.5s), 3 = medium (1s), 5 = slow (1.5s).
// Frame-rate independent via Math.exp(-SPEED * delta).
const LERP_SPEED = 3
const SNAP_DIST = 0.015

export type CamMode = 'orbit' | 'transitioning' | 'focused'

export interface CameraRigHandle {
  flyTo: (pos: [number, number, number], target: [number, number, number]) => void
  returnToOrbit: () => void
}

interface Props {
  onModeChange: (mode: CamMode) => void
}

export const CameraRig = forwardRef<CameraRigHandle, Props>(({ onModeChange }, ref) => {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null)

  // Live transition targets — mutated in place, no re-render needed.
  const destPos = useRef(new THREE.Vector3(...ORBIT_POSITION))
  const destTarget = useRef(new THREE.Vector3(...ORBIT_TARGET))
  const transitioning = useRef(false)
  const destMode = useRef<'orbit' | 'focused'>('orbit')

  useImperativeHandle(ref, () => ({
    flyTo(pos, target) {
      destPos.current.set(...pos)
      destTarget.current.set(...target)
      destMode.current = 'focused'
      transitioning.current = true

      const ctrl = controlsRef.current
      if (ctrl) {
        ctrl.autoRotate = false
        ctrl.enabled = false
      }
      onModeChange('transitioning')
    },

    returnToOrbit() {
      destPos.current.set(...ORBIT_POSITION)
      destTarget.current.set(...ORBIT_TARGET)
      destMode.current = 'orbit'
      transitioning.current = true

      const ctrl = controlsRef.current
      if (ctrl) ctrl.enabled = false
      onModeChange('transitioning')
    },
  }))

  useFrame((_, delta) => {
    if (!transitioning.current) return
    const ctrl = controlsRef.current

    // Frame-rate independent exponential lerp — feels like spring, no overshoot.
    const alpha = 1 - Math.exp(-LERP_SPEED * delta)
    camera.position.lerp(destPos.current, alpha)
    if (ctrl) {
      ctrl.target.lerp(destTarget.current, alpha)
      ctrl.update()
    }

    const arrPos = camera.position.distanceTo(destPos.current)
    const arrTgt = ctrl ? ctrl.target.distanceTo(destTarget.current) : 0

    if (arrPos < SNAP_DIST && arrTgt < SNAP_DIST) {
      // Snap to exact destination, end transition
      camera.position.copy(destPos.current)
      if (ctrl) {
        ctrl.target.copy(destTarget.current)
        ctrl.update()
        ctrl.enabled = true
        ctrl.autoRotate = destMode.current === 'orbit'
      }
      transitioning.current = false
      onModeChange(destMode.current)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      target={ORBIT_TARGET}
      autoRotate
      autoRotateSpeed={0.35}
      enableDamping
      dampingFactor={0.07}
      minDistance={8}
      maxDistance={120}
      maxPolarAngle={Math.PI * 0.55}
      enableZoom={false}
      enablePan={false}
    />
  )
})

CameraRig.displayName = 'CameraRig'
