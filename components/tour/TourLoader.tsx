'use client'

import dynamic from 'next/dynamic'

const ScrollScrubTour = dynamic(
  () => import('./ScrollScrubTour').then((m) => m.ScrollScrubTour),
  { ssr: false }
)

interface TourLoaderProps {
  frames: string[]
  isSampleVisualization?: boolean
}

export function TourLoader({ frames, isSampleVisualization }: TourLoaderProps) {
  return <ScrollScrubTour frames={frames} isSampleVisualization={isSampleVisualization} />
}
