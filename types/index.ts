export type UnitStatus = 'available' | 'reserved' | 'sold'

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
  gallery: string[]
  features: string[]
  blurb: string
  tour?: string
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
  unitTypes: UnitType[]
  units: Unit[]
}
