'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { DepthParallax } from '@/components/common/DepthParallax'
import type { UnitType } from '@/types'

export function FloorPlan({ unitType }: { unitType: UnitType }) {
  const floorPanelRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}
    >
      {/* Left: numbered features */}
      <div
        className="flex flex-col justify-center"
        style={{
          flex: '0 0 44%',
          padding: 'clamp(2.5rem, 5vw, 4.5rem)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <h2
          className="font-display font-light mb-8"
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
            lineHeight: 1.1,
            color: 'var(--color-text)',
          }}
        >
          Онцлогууд
        </h2>
        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          {unitType.features.map((feat, i) => (
            <div
              key={feat}
              className="flex items-baseline gap-4 py-3"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <span
                className="font-utility text-[10px] shrink-0 tabular-nums"
                style={{ color: 'rgba(0,0,0,0.28)' }}
              >
                0{i + 1}
              </span>
              <span
                className="font-body text-sm"
                style={{ color: 'var(--color-text)', lineHeight: 1.5 }}
              >
                {feat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: floor plan (or depth-parallax canvas) on gray panel */}
      <div
        ref={floorPanelRef}
        className="relative flex items-center justify-center"
        style={{
          flex: '0 0 56%',
          backgroundColor: 'var(--color-surface-raised)',
          minHeight: 'clamp(280px, 40vw, 520px)',
          padding: 'clamp(2rem, 5vw, 4rem)',
        }}
      >
        <span
          className="font-utility text-[10px] tracking-[0.12em] uppercase absolute"
          style={{ top: '1.25rem', left: '1.5rem', color: 'rgba(0,0,0,0.32)' }}
        >
          Төлөвлөгөө
        </span>
        <div className="relative w-full" style={{ maxWidth: '480px', aspectRatio: '4/3' }}>
          {unitType.floorPlanDepthMap ? (
            <DepthParallax
              colorSrc={unitType.floorPlanImage}
              depthSrc={unitType.floorPlanDepthMap}
              alt={`${unitType.name} орон сууцны давхрын зураг`}
              intensity={0.025}
              objectFit="contain"
              scrollTriggerTarget={floorPanelRef}
              sizes="(max-width: 768px) 100vw, 56vw"
            />
          ) : (
            <Image
              src={unitType.floorPlanImage}
              alt={`${unitType.name} орон сууцны давхрын зураг`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 56vw"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  )
}
