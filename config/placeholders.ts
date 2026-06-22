// TEMPORARY PLACEHOLDERS — REPLACE BEFORE DEMO
// All placeholder image URLs are defined here. Swap this file to point
// to real client renders without touching any component.

const Q = '?w=1200&q=85&auto=format&fit=crop'
const base = 'https://images.unsplash.com'

export const BLUR_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjYiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjYiIGZpbGw9IiNFREU0RDMiLz48L3N2Zz4='

export const PLACEHOLDER_IMAGES = {
  // Hero — building exterior
  hero: `${base}/photo-1545324418-cc1a3fa10c00${Q}`,

  // Unit type card images (one per type)
  studio:  `${base}/photo-1522708323590-d24dbb6b0267${Q}`,
  oneBr:   `${base}/photo-1560448204-e02f11c3d0e2${Q}`,
  twoBr:   `${base}/photo-1502672260266-1c1ef2d93688${Q}`,
  threeBr: `${base}/photo-1631679706909-1844bbd07221${Q}`,

  // Gallery / interior shots
  gallery: [
    `${base}/photo-1586023492125-27b2c045efd7${Q}`,
    `${base}/photo-1556912173-3bb406ef7e8c${Q}`,
    `${base}/photo-1574362848149-11496d93a7c7${Q}`,
    `${base}/photo-1598928506311-c55ded91a20c${Q}`,
  ],
} as const
