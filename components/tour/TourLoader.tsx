'use client'

import dynamic from 'next/dynamic'

const ScrollScrubTour = dynamic(
  () => import('./ScrollScrubTour').then((m) => m.ScrollScrubTour),
  { ssr: false }
)

interface TourLoaderProps {
  frames: string[]
}

export function TourLoader({ frames }: TourLoaderProps) {
  return <ScrollScrubTour frames={frames} />
}
