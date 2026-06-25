export interface HeadingPart {
  text: string
  accent?: 'red' | 'oak' | 'italic'
}

export interface StatItem {
  value: string
  label: string
  suffix?: string
}

export type UnitStatus = 'available' | 'reserved' | 'sold'

// ─── Home page section configs ───────────────────────────────────────────────

export interface HeroSectionConfig {
  kind: 'hero'
  enabled: boolean
  headline: string
  sub: string
  imageSrc: string
  // When true, renders the sample-visualization disclosure caption.
  // For AI-generated sample interiors shown pre-sale. Default: off.
  isSampleVisualization?: boolean
}

export interface ScrollVideoSectionConfig {
  kind: 'scrollVideo'
  enabled: boolean
  videoSrc: string
}

export interface ManifestoSectionConfig {
  kind: 'manifesto'
  enabled: boolean
  lines: string[]
}

export interface DollhouseRevealSectionConfig {
  kind: 'dollhouseReveal'
  enabled: boolean
  imageSrc: string
  depthSrc?: string
}

export interface FeatureStep {
  index: string
  title: string
  body: string
  image: string
}

export interface FeatureStepsSectionConfig {
  kind: 'featureSteps'
  enabled: boolean
  label: string
  steps: FeatureStep[]
}

export interface InteriorPhotoSectionConfig {
  kind: 'interiorPhoto'
  enabled: boolean
  image: string
  caption?: string
}

export interface PinnedState {
  heading: string
  body: string
  bg: string
  textColor: string
}

export interface PinnedImageSectionConfig {
  kind: 'pinnedImage'
  enabled: boolean
  image: string
  states: PinnedState[]
}

export interface StatsBandSectionConfig {
  kind: 'statsBand'
  enabled: boolean
  eyebrow: string
  headingParts: HeadingPart[]
  stats: StatItem[]
}

export interface ResidenceShowcaseSectionConfig {
  kind: 'residenceShowcase'
  enabled: boolean
  eyebrow: string
  headingParts: HeadingPart[]
  introBody: string
}

export interface FinalCtaSectionConfig {
  kind: 'finalCta'
  enabled: boolean
  eyebrow: string
  headingParts: HeadingPart[]
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

export type HomeSection =
  | HeroSectionConfig
  | ScrollVideoSectionConfig
  | ManifestoSectionConfig
  | DollhouseRevealSectionConfig
  | FeatureStepsSectionConfig
  | InteriorPhotoSectionConfig
  | PinnedImageSectionConfig
  | StatsBandSectionConfig
  | ResidenceShowcaseSectionConfig
  | FinalCtaSectionConfig

export interface HomeConfig {
  sections: HomeSection[]
}

// ─────────────────────────────────────────────────────────────────────────────

export type Orientation =
  | 'north' | 'south' | 'east' | 'west'
  | 'north-east' | 'north-west' | 'south-east' | 'south-west'

export interface UnitType {
  id: string
  name: string
  rooms: number
  sizeRange: [number, number]
  priceFrom: number
  floorPlanImage: string
  floorPlanDepthMap?: string
  gallery: string[]
  features: string[]
  blurb: string
  tour?: string
  dollhouseImage?: string
  tourFrames?: string[]
}

export interface Unit {
  id: string
  typeId: string
  floor: number
  sizeM2: number
  orientation: Orientation
  price: number
  status: UnitStatus
}

export interface ClientConfig {
  slug: string
  buildingName: string
  tagline: string
  logo: string
  heroImage?: string
  theme: {
    oak: string
    sage: string
  }
  contact: {
    address: string
    phone: string
    email: string
  }
  tourFrames?: string[]
  // When true, the scroll-scrub tour shows the sample-visualization caption.
  // For AI-generated sample interior frames shown pre-sale. Default: off.
  tourIsSampleVisualization?: boolean
  // Config-driven disclosure label (not hardcoded in components).
  // e.g. 'Жишиг дүрслэл' (sample visualization).
  sampleVisualizationLabel?: string
  unitTypes: UnitType[]
  units: Unit[]
  home?: HomeConfig
}
