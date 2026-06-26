import React from 'react'
import { clientConfig } from '@/config/client.config'
import type { HomeSection } from '@/types'
import { HeroSection } from '@/components/home/sections/HeroSection'
import { ScrollVideoSection } from '@/components/home/sections/ScrollVideoSection'
import { ManifestoSection } from '@/components/home/sections/ManifestoSection'
import { DollhouseRevealSection } from '@/components/home/sections/DollhouseRevealSection'
import { FeatureStepsSection } from '@/components/home/sections/FeatureStepsSection'
import { InteriorPhotoSection } from '@/components/home/sections/InteriorPhotoSection'
import { PinnedImageSection } from '@/components/home/sections/PinnedImageSection'
import { StatsBandSection } from '@/components/home/sections/StatsBandSection'
import { ResidenceShowcaseSection } from '@/components/home/sections/ResidenceShowcaseSection'
import { FinalCtaSection } from '@/components/home/sections/FinalCtaSection'
import { ShowcaseSection } from '@/components/ShowcaseSection'

async function renderSection(section: HomeSection): Promise<React.ReactNode> {
  switch (section.kind) {
    case 'hero':
      return <HeroSection config={section} />
    case 'scrollVideo':
      return <ScrollVideoSection config={section} />
    case 'manifesto':
      return <ManifestoSection config={section} />
    case 'dollhouseReveal':
      return <DollhouseRevealSection config={section} />
    case 'featureSteps':
      return <FeatureStepsSection config={section} />
    case 'interiorPhoto':
      return <InteriorPhotoSection config={section} />
    case 'pinnedImage':
      return <PinnedImageSection config={section} />
    case 'statsBand':
      return <StatsBandSection config={section} />
    case 'residenceShowcase':
      return <ResidenceShowcaseSection config={section} />
    case 'showcaseApartment3D':
      return <ShowcaseSection config={section} />
    case 'finalCta':
      return <FinalCtaSection config={section} />
    default:
      return null
  }
}

export default async function HomePage() {
  const sections = clientConfig.home?.sections ?? []

  return (
    <main>
      {await Promise.all(
        sections.map(async (section, i) =>
          section.enabled ? (
            <React.Fragment key={`${section.kind}-${i}`}>
              {await renderSection(section)}
            </React.Fragment>
          ) : null,
        ),
      )}
    </main>
  )
}
