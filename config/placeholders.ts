// TEMPORARY PLACEHOLDERS — single swap-point for every demo image.
// Point these at real client assets without touching any component.
//
// Two asset classes, kept deliberately separate (see client.config flags):
//   1. AI sample interior visualizations — hero + tour + interior shots.
//      Intentionally AI-generated (Hailuo/MiniMax style) for pre-sale,
//      warm Japandi, soft diffused window light. Disclosed at pitch time
//      via `isSampleVisualization` → renders "Жишиг дүрслэл". Real interior
//      photography may still replace these per unit later.
//   2. Real developer assets — exterior / building-level imagery. NOT AI;
//      sourced from the developer's own renders/photography.

const Q = '?w=1200&q=85&auto=format&fit=crop'
const QL = '?w=2000&q=85&auto=format&fit=crop'
const base = 'https://images.unsplash.com'

export const BLUR_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjYiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjYiIGZpbGw9IiNFREU0RDMiLz48L3N2Zz4='

export const PLACEHOLDER_IMAGES = {
  // ── AI sample interior visualizations (warm Japandi, soft window light) ──
  // REPLACE with: AI interior frames matched to the cream/oak/beige tokens,
  // or real interior photography per unit. Flag via isSampleVisualization.
  hero: `${base}/photo-1586023492125-27b2c045efd7${QL}`,
  interior: `${base}/photo-1598928506311-c55ded91a20c${QL}`,

  // ── Real developer asset — exterior / building-level (NOT AI) ──
  // REPLACE with: the developer's real building render / exterior photo.
  exterior: `${base}/photo-1545324418-cc1a3fa10c00${QL}`,

  // Dollhouse reveal — dramatic interior cross-section / interior render
  dollhouse: `${base}/photo-1560185007-5f0bb1866cab${Q}`,

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

  // 3D architectural renders — pinned feature-steps section (interior finishes).
  renders: [
    `${base}/photo-1502672260266-1c1ef2d93688${QL}`,
    `${base}/photo-1560448204-e02f11c3d0e2${QL}`,
    `${base}/photo-1574362848149-11496d93a7c7${QL}`,
    `${base}/photo-1586023492125-27b2c045efd7${QL}`,
  ],
} as const

// AI sample tour frame sequence — numbered in walk order (single swap point).
// REPLACE with: real AI-extracted frames in /public/assets/demo/tour/ (or
// repoint this array). Wrong order = broken scrub. Disclose via the tour's
// isSampleVisualization flag in client.config.
export const TOUR_FRAMES: string[] = Array.from({ length: 40 }, (_, i) =>
  `/assets/demo/tour/frame_${String(i + 1).padStart(3, '0')}.webp`,
)
