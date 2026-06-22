# Cinematic Real Estate Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold and build a config-driven, cinematic, multi-page apartment-sales website for Mongolian real estate developers, deployable to Vercel.

**Architecture:** Next.js App Router with a `ClientConfig` object as the single source of client-specific data, routed through a data adapter so the source (config → sheet → Supabase) can change without touching pages. Stitch MCP generates visual design references from `docs/design.md` before any component code is written.

**Tech Stack:** Next.js 14 (App Router) · TypeScript strict · Tailwind CSS v3 · Lenis · GSAP + ScrollTrigger · Vercel

---

## File Map

```
app/
  layout.tsx                  root layout: fonts, Lenis provider, Nav, Footer
  page.tsx                    Home
  residences/
    page.tsx                  Residences list
    [typeId]/page.tsx         Residence detail
  availability/page.tsx
  location/page.tsx
  about/page.tsx
  contact/page.tsx
  fonts.ts                    next/font/google exports

components/
  layout/
    Nav.tsx
    Footer.tsx
    SectionWrapper.tsx        ghost number + section padding
    LenisProvider.tsx         client component wrapping Lenis init
  ui/
    Button.tsx
    StatusBadge.tsx
    FilterPill.tsx
    UnitTypeCard.tsx
    FormInput.tsx
  tour/
    ScrollScrubTour.tsx       canvas + GSAP pin
    TourFallback.tsx          3-up static grid for prefers-reduced-motion
  sections/
    home/
      Hero.tsx
      ResidencesPreview.tsx
      AvailabilityTeaser.tsx
      LocationTeaser.tsx
      DeveloperTeaser.tsx
      BookingCTA.tsx
    residences/
      ResidencesGrid.tsx
    detail/
      DetailHeader.tsx
      FloorPlan.tsx
      Gallery.tsx
      Lightbox.tsx
      Features.tsx
      AvailableUnits.tsx
    availability/
      FilterStrip.tsx
      AvailabilityTable.tsx
      AvailabilityCards.tsx
    location/
      MapSection.tsx
      Amenities.tsx
      Neighborhood.tsx
    about/
      DeveloperIntro.tsx
      Story.tsx
      Values.tsx
      TrackRecord.tsx
    contact/
      ContactForm.tsx

config/
  client.config.ts            ClientConfig instance for demo

types/
  index.ts                    UnitType, Unit, ClientConfig, UnitStatus, Orientation

lib/
  data/
    adapter.ts                getUnitTypes / getUnits / getUnitsByType
    sources/config.ts         config-source implementation

styles/
  globals.css                 CSS custom properties + Tailwind base

__tests__/
  lib/data/adapter.test.ts

tailwind.config.ts
tsconfig.json                 strict mode
next.config.ts
jest.config.ts
.env.local                    DATA_SOURCE=config
```

---

## PHASE 1: Foundation

> After this phase: `npm run dev` runs, all routes return stubs, design tokens are in CSS, data adapter tests pass.

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: entire project scaffold in `D:\files\Building website demo`

- [ ] **Step 1: Run create-next-app in the project directory**

```bash
cd "D:\files\Building website demo"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-turbopack --yes
```

When prompted about non-empty directory, confirm yes. The existing `CLAUDE.md`, `decisions.md`, and `docs/` are not touched by Next.js scaffold.

- [ ] **Step 2: Verify scaffold succeeded**

```bash
npm run dev
```

Expected: server starts on `http://localhost:3000`, default Next.js page loads.

- [ ] **Step 3: Commit scaffold**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js project"
```

---

### Task 2: Install additional dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install lenis gsap
```

- [ ] **Step 2: Install dev/test dependencies**

```bash
npm install --save-dev jest jest-environment-node @types/jest ts-jest
```

- [ ] **Step 3: Verify installs**

```bash
npm ls lenis gsap jest
```

Expected: all three listed without errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add lenis, gsap, jest"
```

---

### Task 3: Configure TypeScript strict + path aliases

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Replace tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors (default scaffold files pass strict).

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: enable TypeScript strict mode"
```

---

### Task 4: Design tokens — CSS custom properties + Tailwind config

**Files:**
- Modify: `styles/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Write globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-surface: #FAF6EF;
  --color-surface-raised: #EDE4D3;
  --color-border: rgba(42, 39, 36, 0.10);
  --color-oak: #B8946A;
  --color-sage: #97A988;
  --color-text: #2A2724;
  --color-muted: #6B655C;
  --color-on-oak: #FAF6EF;
  --color-error: #C0574A;
  --color-number: rgba(42, 39, 36, 0.04);
  --section-padding: 96px;
}

@media (min-width: 1024px) {
  :root {
    --section-padding: 128px;
  }
}

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  background-color: var(--color-surface);
  color: var(--color-text);
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:focus-visible {
  outline: 2px solid var(--color-oak);
  outline-offset: 2px;
}

img, video, canvas {
  display: block;
  max-width: 100%;
}
```

- [ ] **Step 2: Write tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        oak: 'var(--color-oak)',
        sage: 'var(--color-sage)',
        'color-text': 'var(--color-text)',
        muted: 'var(--color-muted)',
        'on-oak': 'var(--color-on-oak)',
        error: 'var(--color-error)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        utility: ['var(--font-utility)', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        md: '4px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(42,39,36,0.06)',
        md: '0 4px 16px rgba(42,39,36,0.08)',
        lg: '0 16px 48px rgba(42,39,36,0.10)',
      },
      maxWidth: {
        content: '1200px',
        reading: '680px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Commit**

```bash
git add styles/globals.css tailwind.config.ts
git commit -m "feat: add design tokens as CSS custom properties and Tailwind config"
```

---

### Task 5: Google Fonts setup

**Files:**
- Create: `app/fonts.ts`

- [ ] **Step 1: Create fonts.ts**

```typescript
import { Cormorant_Garamond, Golos_Text, Space_Mono } from 'next/font/google'

export const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['300', '400'],
  variable: '--font-display',
  display: 'swap',
})

export const golos = Golos_Text({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const spaceMono = Space_Mono({
  subsets: ['latin', 'cyrillic-ext'],
  weight: ['400'],
  variable: '--font-utility',
  display: 'swap',
})
```

- [ ] **Step 2: Apply fonts in root layout**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { cormorant, golos, spaceMono } from './fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Шинэ Улаанбаатар',
  description: 'Таны шинэ гэр',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="mn"
      className={`${cormorant.variable} ${golos.variable} ${spaceMono.variable}`}
    >
      <body className="font-body">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify fonts load**

```bash
npm run dev
```

Open `http://localhost:3000`, open DevTools → Network → filter "font". Expected: Cormorant Garamond, Golos Text, Space Mono requests visible.

- [ ] **Step 4: Commit**

```bash
git add app/fonts.ts app/layout.tsx
git commit -m "feat: configure Google Fonts with cyrillic-ext subsets"
```

---

### Task 6: TypeScript types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Write types/index.ts**

```typescript
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
  unitTypes: UnitType[]
  units: Unit[]
}
```

- [ ] **Step 2: Verify TypeScript accepts types**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat: add UnitType, Unit, ClientConfig types"
```

---

### Task 7: Demo ClientConfig

**Files:**
- Create: `config/client.config.ts`

- [ ] **Step 1: Write config/client.config.ts**

```typescript
import type { ClientConfig } from '@/types'

export const clientConfig: ClientConfig = {
  slug: 'demo',
  buildingName: 'Шинэ Улаанбаатар',
  tagline: 'Таны шинэ гэр',
  logo: '/assets/demo/logo.svg',
  theme: {
    oak: '#B8946A',
    sage: '#97A988',
  },
  contact: {
    address: 'Сүхбаатар дүүрэг, Улаанбаатар',
    phone: '+976 9900 0000',
    email: 'info@demo.mn',
  },
  unitTypes: [
    {
      id: 'studio',
      name: 'Студи',
      rooms: 0,
      sizeRange: [28, 35],
      priceFrom: 120_000_000,
      floorPlanImage: '/assets/demo/types/studio/floorplan.jpg',
      gallery: ['/assets/demo/types/studio/render-1.jpg'],
      features: ['Нээлттэй төлөвлөлт', 'Модон шал', 'Хойд харсан цонх'],
      blurb: 'Ганцаараа буюу хосоороо амьдрахад тохиромжтой.',
    },
    {
      id: '1br',
      name: '1 өрөө',
      rooms: 1,
      sizeRange: [42, 55],
      priceFrom: 180_000_000,
      floorPlanImage: '/assets/demo/types/1br/floorplan.jpg',
      gallery: ['/assets/demo/types/1br/render-1.jpg'],
      features: ['Тусдаа унтлагын өрөө', 'Том цонх', 'Нарны гэрэл сайтай'],
      blurb: 'Хос буюу залуу гэр бүлд зориулсан.',
    },
    {
      id: '2br',
      name: '2 өрөө',
      rooms: 2,
      sizeRange: [68, 85],
      priceFrom: 260_000_000,
      floorPlanImage: '/assets/demo/types/2br/floorplan.jpg',
      gallery: [
        '/assets/demo/types/2br/render-1.jpg',
        '/assets/demo/types/2br/render-2.jpg',
      ],
      features: ['2 унтлагын өрөө', 'Уужим зочны өрөө', '2 угаалгын өрөө'],
      blurb: 'Гэр бүлд тохирсон оновчтой зохион байгуулалт.',
    },
    {
      id: '3br',
      name: '3 өрөө',
      rooms: 3,
      sizeRange: [95, 120],
      priceFrom: 380_000_000,
      floorPlanImage: '/assets/demo/types/3br/floorplan.jpg',
      gallery: [
        '/assets/demo/types/3br/render-1.jpg',
        '/assets/demo/types/3br/render-2.jpg',
      ],
      features: ['3 унтлагын өрөө', 'Уужим зочны өрөө', 'Гал тогооны арал'],
      blurb: 'Том гэр бүлд зориулсан хамгийн уужим орон зай.',
    },
  ],
  units: [
    { id: 'u001', typeId: 'studio', floor: 3, sizeM2: 30, orientation: 'north', price: 120_000_000, status: 'available' },
    { id: 'u002', typeId: 'studio', floor: 5, sizeM2: 32, orientation: 'south', price: 128_000_000, status: 'available' },
    { id: 'u003', typeId: '1br',    floor: 4, sizeM2: 48, orientation: 'east',  price: 185_000_000, status: 'available' },
    { id: 'u004', typeId: '1br',    floor: 7, sizeM2: 52, orientation: 'south', price: 198_000_000, status: 'reserved' },
    { id: 'u005', typeId: '2br',    floor: 6, sizeM2: 72, orientation: 'south', price: 268_000_000, status: 'available' },
    { id: 'u006', typeId: '2br',    floor: 8, sizeM2: 80, orientation: 'east',  price: 290_000_000, status: 'sold'     },
    { id: 'u007', typeId: '3br',    floor: 9, sizeM2: 98, orientation: 'south', price: 385_000_000, status: 'available' },
    { id: 'u008', typeId: '3br',    floor: 10, sizeM2: 115, orientation: 'north-east', price: 420_000_000, status: 'reserved' },
  ],
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add config/client.config.ts
git commit -m "feat: add demo ClientConfig with 4 unit types and 8 units"
```

---

### Task 8: Data adapter

**Files:**
- Create: `lib/data/sources/config.ts`
- Create: `lib/data/adapter.ts`
- Create: `.env.local`

- [ ] **Step 1: Create .env.local**

```
DATA_SOURCE=config
```

- [ ] **Step 2: Write lib/data/sources/config.ts**

```typescript
import { clientConfig } from '@/config/client.config'
import type { Unit, UnitType } from '@/types'

export async function getUnitTypesFromConfig(): Promise<UnitType[]> {
  return clientConfig.unitTypes
}

export async function getUnitsFromConfig(): Promise<Unit[]> {
  return clientConfig.units
}

export async function getUnitsByTypeFromConfig(typeId: string): Promise<Unit[]> {
  return clientConfig.units.filter((u) => u.typeId === typeId)
}
```

- [ ] **Step 3: Write lib/data/adapter.ts**

```typescript
import type { Unit, UnitType } from '@/types'
import {
  getUnitTypesFromConfig,
  getUnitsFromConfig,
  getUnitsByTypeFromConfig,
} from './sources/config'

const source = process.env.DATA_SOURCE ?? 'config'

export async function getUnitTypes(): Promise<UnitType[]> {
  if (source === 'config') return getUnitTypesFromConfig()
  throw new Error(`DATA_SOURCE "${source}" is not yet implemented`)
}

export async function getUnits(): Promise<Unit[]> {
  if (source === 'config') return getUnitsFromConfig()
  throw new Error(`DATA_SOURCE "${source}" is not yet implemented`)
}

export async function getUnitsByType(typeId: string): Promise<Unit[]> {
  if (source === 'config') return getUnitsByTypeFromConfig(typeId)
  throw new Error(`DATA_SOURCE "${source}" is not yet implemented`)
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/ .env.local
git commit -m "feat: add data adapter with config source"
```

---

### Task 9: Data adapter tests

**Files:**
- Create: `jest.config.ts`
- Create: `__tests__/lib/data/adapter.test.ts`

- [ ] **Step 1: Write jest.config.ts**

```typescript
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { strict: true } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
}

export default config
```

- [ ] **Step 2: Write __tests__/lib/data/adapter.test.ts**

```typescript
import { getUnitTypes, getUnits, getUnitsByType } from '@/lib/data/adapter'

describe('getUnitTypes', () => {
  it('returns a non-empty array', async () => {
    const types = await getUnitTypes()
    expect(types.length).toBeGreaterThan(0)
  })

  it('each type has required fields', async () => {
    const types = await getUnitTypes()
    for (const t of types) {
      expect(t).toHaveProperty('id')
      expect(t).toHaveProperty('name')
      expect(Array.isArray(t.sizeRange)).toBe(true)
      expect(t.sizeRange).toHaveLength(2)
      expect(typeof t.priceFrom).toBe('number')
    }
  })
})

describe('getUnits', () => {
  it('returns a non-empty array', async () => {
    const units = await getUnits()
    expect(units.length).toBeGreaterThan(0)
  })

  it('each unit has a valid status', async () => {
    const units = await getUnits()
    const validStatuses = ['available', 'reserved', 'sold']
    for (const u of units) {
      expect(validStatuses).toContain(u.status)
    }
  })

  it('each unit typeId references an existing unitType', async () => {
    const [units, types] = await Promise.all([getUnits(), getUnitTypes()])
    const typeIds = new Set(types.map((t) => t.id))
    for (const u of units) {
      expect(typeIds.has(u.typeId)).toBe(true)
    }
  })
})

describe('getUnitsByType', () => {
  it('returns only units matching typeId', async () => {
    const units = await getUnitsByType('studio')
    expect(units.length).toBeGreaterThan(0)
    for (const u of units) {
      expect(u.typeId).toBe('studio')
    }
  })

  it('returns empty array for unknown typeId', async () => {
    const units = await getUnitsByType('nonexistent')
    expect(units).toHaveLength(0)
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npx jest
```

Expected output:
```
PASS __tests__/lib/data/adapter.test.ts
  getUnitTypes
    ✓ returns a non-empty array
    ✓ each type has required fields
  getUnits
    ✓ returns a non-empty array
    ✓ each unit has a valid status
    ✓ each unit typeId references an existing unitType
  getUnitsByType
    ✓ returns only units matching typeId
    ✓ returns empty array for unknown typeId

Test Suites: 1 passed
Tests:       7 passed
```

- [ ] **Step 4: Add test script to package.json**

In `package.json`, under `"scripts"`, add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 5: Commit**

```bash
git add jest.config.ts __tests__/ package.json
git commit -m "test: add data adapter unit tests"
```

---

### Task 10: Route stubs

**Files:**
- Modify: `app/page.tsx`
- Create: `app/residences/page.tsx`
- Create: `app/residences/[typeId]/page.tsx`
- Create: `app/availability/page.tsx`
- Create: `app/location/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Write all route stubs**

`app/page.tsx`:
```tsx
export default function HomePage() {
  return <main className="p-8 font-display text-4xl">Home</main>
}
```

`app/residences/page.tsx`:
```tsx
export default function ResidencesPage() {
  return <main className="p-8 font-display text-4xl">Residences</main>
}
```

`app/residences/[typeId]/page.tsx`:
```tsx
export default function ResidenceDetailPage({ params }: { params: { typeId: string } }) {
  return <main className="p-8 font-display text-4xl">Detail: {params.typeId}</main>
}
```

`app/availability/page.tsx`:
```tsx
export default function AvailabilityPage() {
  return <main className="p-8 font-display text-4xl">Availability</main>
}
```

`app/location/page.tsx`:
```tsx
export default function LocationPage() {
  return <main className="p-8 font-display text-4xl">Location</main>
}
```

`app/about/page.tsx`:
```tsx
export default function AboutPage() {
  return <main className="p-8 font-display text-4xl">About</main>
}
```

`app/contact/page.tsx`:
```tsx
export default function ContactPage() {
  return <main className="p-8 font-display text-4xl">Contact</main>
}
```

- [ ] **Step 2: Verify all routes**

```bash
npm run dev
```

Visit each route and confirm it renders without errors:
- `http://localhost:3000` → "Home" in Cormorant Garamond
- `http://localhost:3000/residences`
- `http://localhost:3000/residences/2br`
- `http://localhost:3000/availability`
- `http://localhost:3000/location`
- `http://localhost:3000/about`
- `http://localhost:3000/contact`

- [ ] **Step 3: Run build to verify no TypeScript errors**

```bash
npm run build
```

Expected: build succeeds with no TypeScript or lint errors.

- [ ] **Step 4: Commit**

```bash
git add app/
git commit -m "feat: add route stubs for all pages"
```

---

## ✅ PHASE 1 COMPLETE — STOP AND VERIFY

Before proceeding to Phase 2, confirm:
- [ ] `npm run dev` starts without errors
- [ ] All 7 routes render in browser
- [ ] `npx jest` — 7 tests pass
- [ ] `npm run build` — succeeds
- [ ] Fonts visible in browser (Cormorant Garamond on stub headings)

**Do not start Phase 2 until the above is confirmed.**

---

## PHASE 2: Stitch MCP — Design Generation

> After this phase: Stitch has a project with all 8 screens generated from `docs/design.md`. Token values are confirmed. Visual reference exists before any component code is written.

---

### Task 11: Upload design.md to Stitch and create project

**Files:** none (MCP tool calls only)

- [ ] **Step 1: Upload design.md as design context**

Use the `mcp__stitch__upload_design_md` tool. Pass the full content of `docs/design.md` as the document.

- [ ] **Step 2: Create a Stitch project**

Use `mcp__stitch__create_project` with name `"mongolian-apartment-demo"`.

Save the returned project ID — needed for all subsequent `generate_screen_from_text` calls.

- [ ] **Step 3: Commit project ID to notes**

Add a file `docs/stitch-project.txt` with the project ID, so it survives across sessions:

```
stitch_project_id: <id-from-step-2>
```

```bash
git add docs/stitch-project.txt
git commit -m "chore: record Stitch project ID"
```

---

### Task 12: Generate shared components screen

- [ ] **Step 1: Generate shared components**

Use `mcp__stitch__generate_screen_from_text` with the project ID from Task 11 and this prompt:

```
Design a shared components reference screen for a premium Mongolian apartment website.
Warm Japandi aesthetic, light theme only.

Palette: surface #FAF6EF, surface-raised #EDE4D3, border rgba(42,39,36,0.10),
oak #B8946A, sage #97A988, text #2A2724, muted #6B655C, error #C0574A.

Fonts: Cormorant Garamond (display, 300/400), Golos Text (body, 400/500, Cyrillic), Space Mono (utility, 400).

Show all these components in one reference layout:
1. Navigation bar: 64px tall, surface bg, bottom border, building name left (Cormorant Garamond sm),
   ghost nav links right + oak pill button "Үзлэг захиалах". Mobile hamburger variant also shown.
2. Footer: surface-raised bg, two columns (name+tagline left, links+contact right).
3. Buttons: primary oak fill, ghost, pill — all three with hover/disabled/loading states.
4. Form inputs: text field, tel field, select, textarea — default, focus (oak border), error states.
   Static label always above field, never floating. surface-raised bg, 4px radius, 48px min height.
5. Status badges: Боломжтой (sage), Захиалагдсан (muted), Зарагдсан (strikethrough, no badge).
6. Filter pills: inactive, active (surface-raised bg), hover states. radius-full.
7. Unit type card: surface-raised bg, 4px radius, 16:9 flush image top, card body with
   Cormorant Garamond h3 name, Golos Text sm room count (muted), Space Mono xs price (oak).
8. Section wrapper example: relative/overflow-hidden container with ghost numeral "01"
   at bottom-right, bleeding off edge, rgba(42,39,36,0.04) color, clamp(12rem,28vw,22rem) size.

Radius: 0px images/flush, 2px badges, 4px inputs/buttons/cards, 9999px pills.
Shadows: sm 0 1px 3px rgba(42,39,36,.06), md 0 4px 16px rgba(42,39,36,.08).
No dark mode. No rounded image containers. Near-zero radius everywhere except pill buttons.
```

- [ ] **Step 2: Review the generated screen**

Use `mcp__stitch__get_screen` to retrieve the result. Check:
- Oak color renders correctly
- Fonts appear as Cormorant Garamond / Golos Text
- No dark backgrounds
- Radius is near-zero on cards and inputs

If anything is off, use `mcp__stitch__edit_screens` to correct it before moving to page screens.

---

### Task 13: Generate Home screen

- [ ] **Step 1: Generate Home**

Use `mcp__stitch__generate_screen_from_text`:

```
Design the Home page (/) of a premium Mongolian apartment website. Mobile-first.
Apply the shared design system from the uploaded design.md.

Sections in order:
1. HERO: Full-bleed building exterior photo (placeholder). Cream-tinted overlay.
   Building name "Шинэ Улаанбаатар" in Cormorant Garamond 300, 52px mobile.
   Tagline "Таны шинэ гэр" in Golos Text lead, muted.
   Oak pill CTA "Аялалд орох". No section number.

2. SCROLL-SCRUB TOUR placeholder: A pinned canvas section. Show as a dark-bordered
   placeholder box 100vw × 60vh with centered text "Cinematic scroll-scrub tour"
   in Space Mono xs muted. No section number.

3. RESIDENCES PREVIEW — section 01 (ghost numeral bleeding off bottom-right):
   h2 "Орон сууц" + lead blurb + 1-col mobile grid of unit type cards.
   Ghost link "Бүгдийг харах →" below.

4. AVAILABILITY TEASER — section 02:
   3 rows of available units in Space Mono xs: floor, type, size, price, sage status badge.
   Ghost link "Бүтэн жагсаалт →".

5. LOCATION TEASER — section 03:
   Stacked on mobile: copy + 3 Space Mono neighborhood highlights left, map thumbnail right.

6. DEVELOPER TEASER — section 04:
   Logo placeholder + 2 lines of Golos Text body. Ghost link "Бидний тухай →".

7. BOOKING CTA — section 05:
   Full-width, centered. Cormorant Garamond h2 + oak pill button "Үзлэг захиалах".

8. Footer.

Palette, fonts, radius, shadows all from design.md. Mobile-first layout.
```

---

### Tasks 14–19: Generate remaining screens

Repeat the `mcp__stitch__generate_screen_from_text` + `mcp__stitch__get_screen` + review loop for each screen. Use the screen spec from `docs/design.md` section 8 as the prompt for each. Screens in order:

- **Task 14:** Residences (`/residences`) — unit type card grid, section 01, page title.
- **Task 15:** Residence Detail (`/residences/[typeId]`) — header, floor plan, gallery, features, available units table, booking CTA.
- **Task 16:** Availability (`/availability`) — filter strips, desktop table, mobile cards, empty state.
- **Task 17:** Contact (`/contact`) — form with all four fields, oak pill submit, contact info below.
- **Task 18:** Location (`/location`) — map, amenities grid, neighborhood text.
- **Task 19:** About (`/about`) — developer intro, story split, values row, track record stats.

For each: generate → get screen → check visual consistency against design.md → edit if needed.

---

### Task 20: Verify and export token list

- [ ] **Step 1: List all generated screens**

```
mcp__stitch__list_screens  (project_id from Task 11)
```

Confirm all 8 screens exist and are approved.

- [ ] **Step 2: Record any token adjustments**

If Stitch adjusted any color, size, or spacing value during generation, note it in `docs/stitch-token-adjustments.md` and update `docs/design.md` to match. The design.md is the source of truth — keep it in sync.

- [ ] **Step 3: Commit**

```bash
git add docs/
git commit -m "docs: record Stitch generation results and any token adjustments"
```

---

## ✅ PHASE 2 COMPLETE — STOP AND VERIFY

Before Phase 3:
- [ ] All 8 screens generated in Stitch
- [ ] Visual appearance matches design.md spec
- [ ] Any token adjustments are back-ported to design.md

---

## PHASE 3: Shared UI Components

> After this phase: all reusable UI primitives exist and are individually verifiable in the browser at `http://localhost:3000` (via temporary test render in a stub page).

---

### Task 21: SectionWrapper

**Files:**
- Create: `components/layout/SectionWrapper.tsx`

- [ ] **Step 1: Write SectionWrapper.tsx**

```tsx
interface SectionWrapperProps {
  number?: string
  className?: string
  children: React.ReactNode
}

export function SectionWrapper({ number, className = '', children }: SectionWrapperProps) {
  return (
    <section
      className={`relative overflow-hidden px-4 lg:px-8 ${className}`}
      style={{ paddingBlock: 'var(--section-padding)' }}
    >
      {children}
      {number !== undefined && (
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute font-display font-light leading-none"
          style={{
            bottom: '-0.2em',
            right: '-0.05em',
            fontSize: 'clamp(12rem, 28vw, 22rem)',
            color: 'var(--color-number)',
          }}
        >
          {number}
        </span>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Smoke-test in Home stub**

In `app/page.tsx`, temporarily import and render `SectionWrapper`:

```tsx
import { SectionWrapper } from '@/components/layout/SectionWrapper'

export default function HomePage() {
  return (
    <main>
      <SectionWrapper number="01">
        <h2 className="font-display text-4xl">Test section</h2>
      </SectionWrapper>
    </main>
  )
}
```

Start dev server, visit `/`, confirm: ghost "01" appears at bottom-right, partially clipped.

- [ ] **Step 3: Revert Home stub to placeholder**

```tsx
export default function HomePage() {
  return <main className="p-8 font-display text-4xl">Home</main>
}
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/SectionWrapper.tsx app/page.tsx
git commit -m "feat: add SectionWrapper with ghost section number"
```

---

### Task 22: Button

**Files:**
- Create: `components/ui/Button.tsx`

- [ ] **Step 1: Write Button.tsx**

```tsx
import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'pill'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center min-h-[48px] min-w-[120px] px-6 text-sm font-body transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2 disabled:cursor-not-allowed'

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-oak text-on-oak rounded-md hover:bg-[#A07E5A] active:bg-[#8D6D4C] disabled:bg-[rgba(42,39,36,0.20)] disabled:text-muted shadow-none hover:shadow-sm',
    ghost:
      'bg-transparent text-[var(--color-text)] rounded-md border border-[rgba(42,39,36,0.20)] hover:border-[rgba(42,39,36,0.40)] active:bg-[rgba(42,39,36,0.06)] disabled:text-muted',
    pill: 'bg-oak text-on-oak rounded-full hover:bg-[#A07E5A] active:bg-[#8D6D4C] disabled:bg-[rgba(42,39,36,0.20)] disabled:text-muted shadow-none hover:shadow-sm',
  }

  return (
    <button
      disabled={disabled ?? loading}
      aria-busy={loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          aria-label="Ачаалж байна"
          className="block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      ) : (
        children
      )}
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/Button.tsx
git commit -m "feat: add Button component (primary, ghost, pill variants)"
```

---

### Task 23: StatusBadge

**Files:**
- Create: `components/ui/StatusBadge.tsx`

- [ ] **Step 1: Write StatusBadge.tsx**

```tsx
import type { UnitStatus } from '@/types'

const LABELS: Record<UnitStatus, string> = {
  available: 'Боломжтой',
  reserved: 'Захиалагдсан',
  sold: 'Зарагдсан',
}

interface StatusBadgeProps {
  status: UnitStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'sold') {
    return (
      <span className="font-utility text-[11px] text-[rgba(42,39,36,0.40)]">
        {LABELS.sold}
      </span>
    )
  }

  const styles: Record<Exclude<UnitStatus, 'sold'>, string> = {
    available: 'text-sage border-sage',
    reserved: 'text-muted border-[rgba(42,39,36,0.20)]',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-utility text-[11px] rounded-sm border ${styles[status]}`}
    >
      {LABELS[status]}
    </span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/StatusBadge.tsx
git commit -m "feat: add StatusBadge component"
```

---

### Task 24: FilterPill

**Files:**
- Create: `components/ui/FilterPill.tsx`

- [ ] **Step 1: Write FilterPill.tsx**

```tsx
interface FilterPillProps {
  label: string
  active: boolean
  onClick: () => void
}

export function FilterPill({ label, active, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={[
        'inline-flex items-center px-4 py-2 rounded-full font-body text-sm transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2',
        active
          ? 'bg-surface-raised border border-[rgba(42,39,36,0.40)] font-medium'
          : 'bg-transparent border border-[rgba(42,39,36,0.20)] hover:border-[rgba(42,39,36,0.40)]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/FilterPill.tsx
git commit -m "feat: add FilterPill component"
```

---

### Task 25: FormInput

**Files:**
- Create: `components/ui/FormInput.tsx`

- [ ] **Step 1: Write FormInput.tsx**

```tsx
import { type InputHTMLAttributes, type TextareaHTMLAttributes, useId } from 'react'

interface BaseProps {
  label: string
  error?: string
  required?: boolean
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' }
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' }
type SelectProps = BaseProps & { as: 'select'; options: { value: string; label: string }[] } & InputHTMLAttributes<HTMLSelectElement>

type FormInputProps = InputProps | TextareaProps | SelectProps

export function FormInput(props: FormInputProps) {
  const id = useId()
  const { label, error, required, as = 'input', className = '', ...rest } = props

  const fieldClass = [
    'w-full bg-surface-raised border rounded-md font-body text-base px-4 py-3',
    'focus:outline-none focus:border-oak',
    error ? 'border-error' : 'border-[rgba(42,39,36,0.10)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className,
  ].join(' ')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-sm text-muted">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          rows={4}
          className={`${fieldClass} resize-y min-h-[120px]`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : as === 'select' ? (
        <select
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={fieldClass}
          {...(rest as InputHTMLAttributes<HTMLSelectElement>)}
        >
          {(props as SelectProps).options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${fieldClass} min-h-[48px]`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="font-utility text-[11px] text-error">
          {error}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/FormInput.tsx
git commit -m "feat: add FormInput component (input, textarea, select variants)"
```

---

### Task 26: UnitTypeCard

**Files:**
- Create: `components/ui/UnitTypeCard.tsx`

- [ ] **Step 1: Write UnitTypeCard.tsx**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { UnitType } from '@/types'

interface UnitTypeCardProps {
  unitType: UnitType
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('mn-MN').format(price) + ' ₮'
}

export function UnitTypeCard({ unitType }: UnitTypeCardProps) {
  return (
    <Link
      href={`/residences/${unitType.id}`}
      className="group block bg-surface-raised rounded-md shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2"
    >
      <div className="relative aspect-video overflow-hidden rounded-none">
        <Image
          src={unitType.floorPlanImage}
          alt={`${unitType.name} орон сууцны зураг`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl mb-1">{unitType.name}</h3>
        <p className="font-body text-sm text-muted mb-3">
          {unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Нээлттэй төлөвлөлт'} ·{' '}
          {unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²
        </p>
        <p className="font-utility text-[12px] text-oak">
          {formatPrice(unitType.priceFrom)}-аас эхлэн
        </p>
        <span className="mt-4 inline-block font-body text-sm text-muted group-hover:text-[var(--color-text)] transition-colors">
          Дэлгэрэнгүй →
        </span>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/UnitTypeCard.tsx
git commit -m "feat: add UnitTypeCard component"
```

---

## ✅ PHASE 3 COMPLETE — STOP AND VERIFY

Before Phase 4:
- [ ] `npm run build` succeeds with no TypeScript errors
- [ ] `npx jest` — all tests pass

---

## PHASE 4: Layout — Nav, Footer, LenisProvider

---

### Task 27: LenisProvider

**Files:**
- Create: `components/layout/LenisProvider.tsx`

- [ ] **Step 1: Write LenisProvider.tsx**

```tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

---

### Task 28: Nav

**Files:**
- Create: `components/layout/Nav.tsx`

- [ ] **Step 1: Write Nav.tsx**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { clientConfig } from '@/config/client.config'
import { Button } from '@/components/ui/Button'

const NAV_LINKS = [
  { href: '/residences', label: 'Орон сууц' },
  { href: '/availability', label: 'Боломжтой' },
  { href: '/location', label: 'Байршил' },
  { href: '/about', label: 'Бидний тухай' },
]

export function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 h-16 bg-surface border-b border-[rgba(42,39,36,0.10)] flex items-center px-4 lg:px-8 justify-between">
        <Link href="/" className="font-display text-sm tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak focus-visible:ring-offset-2">
          {clientConfig.buildingName}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Үндсэн цэс">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'font-body text-sm transition-colors',
                pathname === link.href
                  ? 'border-b-2 border-oak pb-0.5'
                  : 'text-muted hover:text-[var(--color-text)]',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="pill" className="ml-2 text-sm px-5 min-w-0 min-h-[40px]">
            <Link href="/contact">Үзлэг захиалах</Link>
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak"
          aria-label={open ? 'Цэс хаах' : 'Цэс нээх'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current mb-1.5" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-surface-raised flex flex-col items-center justify-center gap-8"
          role="dialog"
          aria-modal="true"
          aria-label="Навигаци"
        >
          <button
            className="absolute top-4 right-4 p-2 text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oak"
            aria-label="Хаах"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-3xl"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="pill" onClick={() => setOpen(false)}>
            <Link href="/contact">Үзлэг захиалах</Link>
          </Button>
        </div>
      )}
    </>
  )
}
```

---

### Task 29: Footer

**Files:**
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Write Footer.tsx**

```tsx
import Link from 'next/link'
import { clientConfig } from '@/config/client.config'

const FOOTER_LINKS = [
  { href: '/', label: 'Нүүр' },
  { href: '/residences', label: 'Орон сууц' },
  { href: '/availability', label: 'Боломжтой' },
  { href: '/location', label: 'Байршил' },
  { href: '/about', label: 'Бидний тухай' },
  { href: '/contact', label: 'Холбоо барих' },
]

export function Footer() {
  return (
    <footer className="bg-surface-raised">
      <div className="max-w-content mx-auto px-4 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="font-display text-2xl mb-2">{clientConfig.buildingName}</p>
          <p className="font-body text-sm text-muted">{clientConfig.tagline}</p>
        </div>
        <div className="flex flex-col gap-4">
          <nav aria-label="Хөл цэс" className="flex flex-col gap-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-muted hover:text-[var(--color-text)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="font-utility text-[11px] text-muted flex flex-col gap-1 mt-2">
            <span>{clientConfig.contact.address}</span>
            <span>{clientConfig.contact.phone}</span>
            <span>{clientConfig.contact.email}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(42,39,36,0.10)] px-4 lg:px-8 py-4">
        <p className="font-utility text-[11px] text-muted max-w-content mx-auto">
          © {new Date().getFullYear()} {clientConfig.buildingName}. Бүх эрх хуулиар хамгаалагдсан.
        </p>
      </div>
    </footer>
  )
}
```

---

### Task 30: Wire layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update root layout to include Nav, Footer, LenisProvider**

```tsx
import type { Metadata } from 'next'
import { cormorant, golos, spaceMono } from './fonts'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { LenisProvider } from '@/components/layout/LenisProvider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: clientConfig.buildingName,
  description: clientConfig.tagline,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${cormorant.variable} ${golos.variable} ${spaceMono.variable}`}>
      <body className="font-body min-h-screen flex flex-col">
        <LenisProvider>
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
```

Add import for clientConfig at top:
```tsx
import { clientConfig } from '@/config/client.config'
```

- [ ] **Step 2: Verify layout**

```bash
npm run dev
```

Visit `/`. Confirm: sticky nav at top, footer at bottom, smooth scroll active, no console errors.

- [ ] **Step 3: Commit Phase 4**

```bash
git add components/layout/ app/layout.tsx
git commit -m "feat: add Nav, Footer, LenisProvider and wire root layout"
```

---

## ✅ PHASE 4 COMPLETE — STOP AND VERIFY

- [ ] Nav renders on all pages, hamburger works on mobile
- [ ] Footer renders on all pages
- [ ] Smooth scroll active (drag scrollbar slowly — should feel dampened)
- [ ] `npm run build` succeeds

---

## PHASE 5: Home Page (without tour)

---

### Task 31: Hero section

**Files:**
- Create: `components/sections/home/Hero.tsx`

- [ ] **Step 1: Write Hero.tsx**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import type { ClientConfig } from '@/types'

interface HeroProps {
  buildingName: string
  tagline: string
}

export function Hero({ buildingName, tagline }: HeroProps) {
  return (
    <div className="relative w-full min-h-[90svh] flex items-end pb-16 px-4 lg:px-8">
      <Image
        src="/assets/demo/hero/building.jpg"
        alt={`${buildingName} барилгын гадна талын зураг`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Cream-tinted overlay — light, not dark */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(250,246,239,0.85) 0%, rgba(250,246,239,0.10) 60%)' }}
        aria-hidden="true"
      />
      <div className="relative max-w-content w-full mx-auto">
        <h1
          className="font-display font-light mb-4"
          style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)', lineHeight: 1.05 }}
        >
          {buildingName}
        </h1>
        <p className="font-body text-lg text-muted mb-8 max-w-reading">{tagline}</p>
        <Button variant="pill">
          <Link href="#tour">Аялалд орох</Link>
        </Button>
      </div>
    </div>
  )
}
```

---

### Task 32: Remaining Home sections + assemble page

**Files:**
- Create: `components/sections/home/ResidencesPreview.tsx`
- Create: `components/sections/home/AvailabilityTeaser.tsx`
- Create: `components/sections/home/BookingCTA.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write ResidencesPreview.tsx**

```tsx
import Link from 'next/link'
import { UnitTypeCard } from '@/components/ui/UnitTypeCard'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import type { UnitType } from '@/types'

interface ResidencesPreviewProps {
  unitTypes: UnitType[]
}

export function ResidencesPreview({ unitTypes }: ResidencesPreviewProps) {
  return (
    <SectionWrapper number="01">
      <div className="max-w-content mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl mb-3">Орон сууц</h2>
        <p className="font-body text-lg text-muted mb-10 max-w-reading">
          Таны амьдралын хэрэгцээнд нийцсэн төлөвлөлтүүд.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {unitTypes.slice(0, 4).map((ut) => (
            <UnitTypeCard key={ut.id} unitType={ut} />
          ))}
        </div>
        <Link href="/residences" className="font-body text-sm text-muted hover:text-[var(--color-text)] transition-colors">
          Бүгдийг харах →
        </Link>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Write AvailabilityTeaser.tsx**

```tsx
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import type { Unit, UnitType } from '@/types'

interface AvailabilityTeaserProps {
  units: Unit[]
  unitTypes: UnitType[]
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('mn-MN').format(price) + ' ₮'
}

export function AvailabilityTeaser({ units, unitTypes }: AvailabilityTeaserProps) {
  const typeMap = new Map(unitTypes.map((t) => [t.id, t]))
  const preview = units.filter((u) => u.status === 'available').slice(0, 3)

  return (
    <SectionWrapper number="02" className="bg-surface-raised">
      <div className="max-w-content mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl mb-8">Боломжтой орон сууц</h2>
        <div className="divide-y divide-[rgba(42,39,36,0.10)]">
          {preview.map((unit) => (
            <div key={unit.id} className="flex items-center justify-between py-4 gap-4">
              <span className="font-utility text-[12px] text-muted w-12">{unit.floor}-р давхар</span>
              <span className="font-utility text-[12px] flex-1">{typeMap.get(unit.typeId)?.name}</span>
              <span className="font-utility text-[12px] text-muted hidden sm:block">{unit.sizeM2} м²</span>
              <span className="font-utility text-[12px] text-oak">{formatPrice(unit.price)}</span>
              <StatusBadge status={unit.status} />
            </div>
          ))}
        </div>
        <Link href="/availability" className="mt-6 inline-block font-body text-sm text-muted hover:text-[var(--color-text)] transition-colors">
          Бүтэн жагсаалт →
        </Link>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Write BookingCTA.tsx**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SectionWrapper } from '@/components/layout/SectionWrapper'

export function BookingCTA() {
  return (
    <SectionWrapper number="05">
      <div className="max-w-content mx-auto text-center">
        <h2 className="font-display text-4xl lg:text-5xl mb-6">Үзлэг захиалах</h2>
        <Button variant="pill">
          <Link href="/contact">Одоо захиалах</Link>
        </Button>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Assemble app/page.tsx**

```tsx
import { Hero } from '@/components/sections/home/Hero'
import { ResidencesPreview } from '@/components/sections/home/ResidencesPreview'
import { AvailabilityTeaser } from '@/components/sections/home/AvailabilityTeaser'
import { BookingCTA } from '@/components/sections/home/BookingCTA'
import { getUnitTypes, getUnits } from '@/lib/data/adapter'
import { clientConfig } from '@/config/client.config'

export default async function HomePage() {
  const [unitTypes, units] = await Promise.all([getUnitTypes(), getUnits()])

  return (
    <main>
      <Hero buildingName={clientConfig.buildingName} tagline={clientConfig.tagline} />
      {/* Tour placeholder — replaced in Phase 9 */}
      <div id="tour" className="w-full h-[60vh] bg-surface-raised flex items-center justify-center border-y border-[rgba(42,39,36,0.10)]">
        <p className="font-utility text-[12px] text-muted">Cinematic scroll-scrub tour — Phase 9</p>
      </div>
      <ResidencesPreview unitTypes={unitTypes} />
      <AvailabilityTeaser units={units} unitTypes={unitTypes} />
      <BookingCTA />
    </main>
  )
}
```

- [ ] **Step 5: Verify Home page**

```bash
npm run dev
```

Visit `/`. Confirm: Hero renders with name/tagline/CTA, residences preview shows 4 cards, availability teaser shows 3 units, booking CTA at bottom. No console errors.

- [ ] **Step 6: Commit**

```bash
git add components/sections/home/ app/page.tsx
git commit -m "feat: build Home page (Hero, Residences Preview, Availability Teaser, Booking CTA)"
```

---

## ✅ PHASE 5 COMPLETE — STOP AND VERIFY

---

## PHASE 6: Residences + Detail Pages

---

### Task 33: Residences page

**Files:**
- Create: `components/sections/residences/ResidencesGrid.tsx`
- Modify: `app/residences/page.tsx`

- [ ] **Step 1: Write ResidencesGrid.tsx**

```tsx
import { UnitTypeCard } from '@/components/ui/UnitTypeCard'
import type { UnitType } from '@/types'

export function ResidencesGrid({ unitTypes }: { unitTypes: UnitType[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {unitTypes.map((ut) => (
        <UnitTypeCard key={ut.id} unitType={ut} />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Write app/residences/page.tsx**

```tsx
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { ResidencesGrid } from '@/components/sections/residences/ResidencesGrid'
import { getUnitTypes } from '@/lib/data/adapter'

export default async function ResidencesPage() {
  const unitTypes = await getUnitTypes()

  return (
    <main>
      <SectionWrapper number="01">
        <div className="max-w-content mx-auto">
          <h1 className="font-display text-5xl lg:text-6xl mb-4">Орон сууц</h1>
          <p className="font-body text-lg text-muted mb-12 max-w-reading">
            Таны амьдралын хэрэгцээнд нийцсэн, дөрвөн төрлийн орон зай.
          </p>
          <ResidencesGrid unitTypes={unitTypes} />
        </div>
      </SectionWrapper>
    </main>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/residences/ app/residences/page.tsx
git commit -m "feat: build Residences list page"
```

---

### Task 34: Residence Detail page

**Files:**
- Create: `components/sections/detail/DetailHeader.tsx`
- Create: `components/sections/detail/FloorPlan.tsx`
- Create: `components/sections/detail/Features.tsx`
- Create: `components/sections/detail/AvailableUnits.tsx`
- Modify: `app/residences/[typeId]/page.tsx`

- [ ] **Step 1: Write DetailHeader.tsx**

```tsx
import type { UnitType } from '@/types'

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n) + ' ₮'
}

export function DetailHeader({ unitType }: { unitType: UnitType }) {
  return (
    <div className="max-w-content mx-auto px-4 lg:px-8 pt-16 pb-8">
      <h1 className="font-display text-5xl lg:text-6xl mb-3">{unitType.name}</h1>
      <p className="font-body text-lg text-muted mb-6 max-w-reading">{unitType.blurb}</p>
      <div className="flex flex-wrap gap-6 font-utility text-[12px] text-oak">
        <span>{unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²</span>
        {unitType.rooms > 0 && <span>{unitType.rooms} унтлагын өрөө</span>}
        <span>{formatPrice(unitType.priceFrom)}-аас эхлэн</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write FloorPlan.tsx**

```tsx
import Image from 'next/image'
import { SectionWrapper } from '@/components/layout/SectionWrapper'

interface FloorPlanProps {
  src: string
  alt: string
}

export function FloorPlan({ src, alt }: FloorPlanProps) {
  return (
    <SectionWrapper number="01">
      <div className="max-w-content mx-auto">
        <h2 className="font-display text-3xl lg:text-4xl mb-8">Төлөвлөгөө</h2>
        <div className="relative w-full aspect-[4/3] bg-surface-raised">
          <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" />
        </div>
        <p className="font-utility text-[11px] text-muted mt-3">
          Зураг нь баримтлах зориулалттай бөгөөд жижиг өөрчлөлт гарч болно.
        </p>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 3: Write Features.tsx**

```tsx
import { SectionWrapper } from '@/components/layout/SectionWrapper'

export function Features({ features }: { features: string[] }) {
  return (
    <SectionWrapper number="03">
      <div className="max-w-content mx-auto">
        <h2 className="font-display text-3xl lg:text-4xl mb-8">Онцлогууд</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 font-body text-base">
              <span className="text-oak mt-0.5" aria-hidden="true">·</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 4: Write AvailableUnits.tsx**

```tsx
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import type { Unit } from '@/types'

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n) + ' ₮'
}

const ORIENTATION_LABELS: Record<string, string> = {
  north: 'Хойд', south: 'Өмнөд', east: 'Зүүн', west: 'Баруун',
  'north-east': 'Хойд-Зүүн', 'north-west': 'Хойд-Баруун',
  'south-east': 'Өмнөд-Зүүн', 'south-west': 'Өмнөд-Баруун',
}

export function AvailableUnits({ units, typeId }: { units: Unit[]; typeId: string }) {
  return (
    <SectionWrapper number="04">
      <div className="max-w-content mx-auto">
        <h2 className="font-display text-3xl lg:text-4xl mb-8">Боломжтой орон сууц</h2>
        {units.length === 0 ? (
          <p className="font-body text-sm text-muted">Боломжтой орон сууц байхгүй байна.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" aria-label="Боломжтой орон сууцны жагсаалт">
              <thead>
                <tr className="border-b border-[rgba(42,39,36,0.10)]">
                  {['Давхар', 'Хэмжээ', 'Чиглэл', 'Үнэ', 'Статус'].map((h) => (
                    <th key={h} className="font-body text-sm text-muted pb-3 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr
                    key={unit.id}
                    className="border-b border-[rgba(42,39,36,0.06)] hover:bg-[rgba(42,39,36,0.03)] transition-colors"
                  >
                    <td className="font-utility text-[12px] py-4 pr-6">{unit.floor}</td>
                    <td className="font-utility text-[12px] py-4 pr-6">{unit.sizeM2} м²</td>
                    <td className="font-utility text-[12px] py-4 pr-6">{ORIENTATION_LABELS[unit.orientation] ?? unit.orientation}</td>
                    <td className={`font-utility text-[12px] py-4 pr-6 ${unit.status === 'sold' ? 'line-through text-[rgba(42,39,36,0.40)]' : 'text-oak'}`}>
                      {formatPrice(unit.price)}
                    </td>
                    <td className="py-4"><StatusBadge status={unit.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-10 text-center md:text-left">
          <Button variant="pill">
            <Link href={`/contact?type=${typeId}`}>Үзлэг захиалах</Link>
          </Button>
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 5: Write app/residences/[typeId]/page.tsx**

```tsx
import { notFound } from 'next/navigation'
import { getUnitTypes, getUnitsByType } from '@/lib/data/adapter'
import { DetailHeader } from '@/components/sections/detail/DetailHeader'
import { FloorPlan } from '@/components/sections/detail/FloorPlan'
import { Features } from '@/components/sections/detail/Features'
import { AvailableUnits } from '@/components/sections/detail/AvailableUnits'

interface Props {
  params: { typeId: string }
}

export async function generateStaticParams() {
  const types = await getUnitTypes()
  return types.map((t) => ({ typeId: t.id }))
}

export default async function ResidenceDetailPage({ params }: Props) {
  const [unitTypes, units] = await Promise.all([
    getUnitTypes(),
    getUnitsByType(params.typeId),
  ])
  const unitType = unitTypes.find((t) => t.id === params.typeId)
  if (!unitType) notFound()

  return (
    <main>
      <DetailHeader unitType={unitType} />
      <FloorPlan
        src={unitType.floorPlanImage}
        alt={`${unitType.name} орон сууцны давхрын зураг`}
      />
      <Features features={unitType.features} />
      <AvailableUnits units={units} typeId={params.typeId} />
    </main>
  )
}
```

- [ ] **Step 6: Verify Detail page**

```bash
npm run dev
```

Visit `/residences/2br`. Confirm: header with name/specs, floor plan placeholder, features list, units table.

- [ ] **Step 7: Commit Phase 6**

```bash
git add components/sections/residences/ components/sections/detail/ app/residences/
git commit -m "feat: build Residences and Residence Detail pages"
```

---

## ✅ PHASE 6 COMPLETE — STOP AND VERIFY

---

## PHASE 7: Availability + Contact Pages

---

### Task 35: Availability page

**Files:**
- Create: `components/sections/availability/FilterStrip.tsx`
- Create: `components/sections/availability/AvailabilityTable.tsx`
- Modify: `app/availability/page.tsx`

- [ ] **Step 1: Write FilterStrip.tsx**

```tsx
'use client'

import { FilterPill } from '@/components/ui/FilterPill'
import type { UnitStatus } from '@/types'

const TYPE_FILTERS = ['Бүгд', 'Студи', '1 өрөө', '2 өрөө', '3 өрөө']
const STATUS_FILTERS: { label: string; value: UnitStatus | 'all' }[] = [
  { label: 'Бүгд', value: 'all' },
  { label: 'Боломжтой', value: 'available' },
  { label: 'Захиалагдсан', value: 'reserved' },
  { label: 'Зарагдсан', value: 'sold' },
]

interface FilterStripProps {
  activeType: string
  activeStatus: UnitStatus | 'all'
  onTypeChange: (t: string) => void
  onStatusChange: (s: UnitStatus | 'all') => void
}

export function FilterStrip({ activeType, activeStatus, onTypeChange, onStatusChange }: FilterStripProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Төрлөөр шүүх">
        {TYPE_FILTERS.map((t) => (
          <FilterPill key={t} label={t} active={activeType === t} onClick={() => onTypeChange(t)} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 md:ml-4" role="group" aria-label="Статусаар шүүх">
        {STATUS_FILTERS.map((s) => (
          <FilterPill key={s.value} label={s.label} active={activeStatus === s.value} onClick={() => onStatusChange(s.value)} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write AvailabilityTable.tsx**

```tsx
'use client'

import { useState } from 'react'
import { FilterStrip } from './FilterStrip'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { Unit, UnitType, UnitStatus } from '@/types'

const ORIENTATION_LABELS: Record<string, string> = {
  north: 'Хойд', south: 'Өмнөд', east: 'Зүүн', west: 'Баруун',
  'north-east': 'ХЗ', 'north-west': 'ХБ', 'south-east': 'ӨЗ', 'south-west': 'ӨБ',
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n) + ' ₮'
}

interface Props {
  units: Unit[]
  unitTypes: UnitType[]
}

export function AvailabilityTable({ units, unitTypes }: Props) {
  const [activeType, setActiveType] = useState('Бүгд')
  const [activeStatus, setActiveStatus] = useState<UnitStatus | 'all'>('all')

  const typeMap = new Map(unitTypes.map((t) => [t.id, t]))

  const TYPE_ID_MAP: Record<string, string | undefined> = {
    'Студи': 'studio', '1 өрөө': '1br', '2 өрөө': '2br', '3 өрөө': '3br',
  }

  const filtered = units.filter((u) => {
    const typeMatch = activeType === 'Бүгд' || u.typeId === TYPE_ID_MAP[activeType]
    const statusMatch = activeStatus === 'all' || u.status === activeStatus
    return typeMatch && statusMatch
  })

  return (
    <div>
      <FilterStrip
        activeType={activeType}
        activeStatus={activeStatus}
        onTypeChange={setActiveType}
        onStatusChange={setActiveStatus}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="font-display text-3xl mb-3">Тохирох орон сууц олдсонгүй</h3>
          <p className="font-body text-sm text-muted">
            Шүүлтүүрийг цэвэрлэж дахин хайна уу.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <table className="w-full text-left hidden md:table" aria-label="Орон сууцны жагсаалт">
            <thead>
              <tr className="border-b border-[rgba(42,39,36,0.10)]">
                {['Давхар', 'Төрөл', 'Хэмжээ', 'Чиглэл', 'Үнэ', 'Статус'].map((h) => (
                  <th key={h} className="font-body text-sm text-muted pb-3 pr-6">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((unit) => (
                <tr
                  key={unit.id}
                  className="border-b border-[rgba(42,39,36,0.06)] hover:bg-[rgba(42,39,36,0.03)] transition-colors"
                >
                  <td className="font-utility text-[12px] py-4 pr-6">{unit.floor}</td>
                  <td className="font-utility text-[12px] py-4 pr-6">{typeMap.get(unit.typeId)?.name}</td>
                  <td className="font-utility text-[12px] py-4 pr-6">{unit.sizeM2} м²</td>
                  <td className="font-utility text-[12px] py-4 pr-6">{ORIENTATION_LABELS[unit.orientation] ?? unit.orientation}</td>
                  <td className={`font-utility text-[12px] py-4 pr-6 ${unit.status === 'sold' ? 'line-through text-[rgba(42,39,36,0.40)]' : 'text-oak'}`}>
                    {formatPrice(unit.price)}
                  </td>
                  <td className="py-4"><StatusBadge status={unit.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-4">
            {filtered.map((unit) => (
              <div key={unit.id} className="bg-surface-raised rounded-md p-4 relative">
                <div className="absolute top-4 right-4">
                  <StatusBadge status={unit.status} />
                </div>
                <p className="font-display text-xl mb-2">{typeMap.get(unit.typeId)?.name}</p>
                <div className="flex flex-wrap gap-4">
                  <span className="font-utility text-[11px] text-muted">{unit.floor}-р давхар</span>
                  <span className="font-utility text-[11px] text-muted">{unit.sizeM2} м²</span>
                  <span className="font-utility text-[11px] text-muted">{ORIENTATION_LABELS[unit.orientation] ?? unit.orientation}</span>
                  <span className={`font-utility text-[11px] ${unit.status === 'sold' ? 'line-through text-[rgba(42,39,36,0.40)]' : 'text-oak'}`}>
                    {formatPrice(unit.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Write app/availability/page.tsx**

```tsx
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { AvailabilityTable } from '@/components/sections/availability/AvailabilityTable'
import { getUnits, getUnitTypes } from '@/lib/data/adapter'

export default async function AvailabilityPage() {
  const [units, unitTypes] = await Promise.all([getUnits(), getUnitTypes()])

  return (
    <main>
      <SectionWrapper number="01">
        <div className="max-w-content mx-auto">
          <h1 className="font-display text-5xl lg:text-6xl mb-4">Боломжтой орон сууц</h1>
          <p className="font-body text-lg text-muted mb-10 max-w-reading">
            Одоогийн байдлаар боломжтой орон сууцны жагсаалт.
          </p>
          <AvailabilityTable units={units} unitTypes={unitTypes} />
        </div>
      </SectionWrapper>
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/sections/availability/ app/availability/page.tsx
git commit -m "feat: build Availability page with filter and table/card views"
```

---

### Task 36: Contact page

**Files:**
- Create: `components/sections/contact/ContactForm.tsx`
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Write ContactForm.tsx**

```tsx
'use client'

import { useState } from 'react'
import { FormInput } from '@/components/ui/FormInput'
import { Button } from '@/components/ui/Button'
import type { UnitType } from '@/types'

interface ContactFormProps {
  unitTypes: UnitType[]
  preselectedTypeId?: string
}

export function ContactForm({ unitTypes, preselectedTypeId }: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Илгээхэд алдаа гарлаа')
      setSubmitted(true)
    } catch {
      setError('Мессеж илгээхэд алдаа гарлаа. Дахин оролдоно уу.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <h2 className="font-display text-3xl mb-3">Баярлалаа!</h2>
        <p className="font-body text-base text-muted">Таны мессежийг хүлээн авлаа. Удахгүй холбоо барина.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-reading">
      {error && (
        <div className="bg-surface-raised border border-[rgba(42,39,36,0.10)] p-4">
          <p className="font-utility text-[11px] text-error">{error}</p>
        </div>
      )}
      <FormInput label="Нэр" name="name" type="text" required autoComplete="name" />
      <FormInput label="Утасны дугаар" name="phone" type="tel" required autoComplete="tel" />
      <FormInput
        as="select"
        label="Орон сууцны төрөл"
        name="unitType"
        defaultValue={preselectedTypeId ?? ''}
        options={[
          { value: '', label: 'Сонгоно уу' },
          ...unitTypes.map((t) => ({ value: t.id, label: t.name })),
        ]}
      />
      <FormInput
        as="textarea"
        label="Нэмэлт мэдэгдэл"
        name="message"
        placeholder="Асуух зүйл байвал бичнэ үү..."
      />
      <Button variant="pill" type="submit" loading={loading} className="w-full md:w-auto md:self-end">
        Илгээх
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Create API route for contact form**

Create `app/api/contact/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json() as { name?: unknown; phone?: unknown }

  if (!body.name || !body.phone) {
    return NextResponse.json({ error: 'Нэр болон утасны дугаар заавал шаардлагатай' }, { status: 400 })
  }

  // TODO: integrate with Telegram/email notifier (server-side only, never expose keys)
  // For now: log and return success
  console.log('[Contact form submission]', body)

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Write app/contact/page.tsx**

```tsx
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { ContactForm } from '@/components/sections/contact/ContactForm'
import { getUnitTypes } from '@/lib/data/adapter'
import { clientConfig } from '@/config/client.config'

interface Props {
  searchParams: { type?: string }
}

export default async function ContactPage({ searchParams }: Props) {
  const unitTypes = await getUnitTypes()

  return (
    <main>
      <SectionWrapper number="01">
        <div className="max-w-content mx-auto">
          <h1 className="font-display text-5xl lg:text-6xl mb-4">Үзлэг захиалах</h1>
          <p className="font-body text-lg text-muted mb-10 max-w-reading">
            Та доорх маягтыг бөглөснөөр бид таны тохиромжтой цагт холбоо барина.
          </p>
          <ContactForm unitTypes={unitTypes} preselectedTypeId={searchParams.type} />
          <div className="mt-12 flex flex-col gap-1">
            <span className="font-utility text-[11px] text-muted">{clientConfig.contact.address}</span>
            <span className="font-utility text-[11px] text-muted">{clientConfig.contact.phone}</span>
            <span className="font-utility text-[11px] text-muted">{clientConfig.contact.email}</span>
          </div>
        </div>
      </SectionWrapper>
    </main>
  )
}
```

- [ ] **Step 4: Verify Contact page**

```bash
npm run dev
```

Visit `/contact`. Fill form and submit. Confirm: no errors, success message appears. Visit `/contact?type=2br` — confirm "2 өрөө" is preselected.

- [ ] **Step 5: Commit Phase 7**

```bash
git add components/sections/availability/ components/sections/contact/ app/availability/ app/contact/ app/api/
git commit -m "feat: build Availability page and Contact form"
```

---

## ✅ PHASE 7 COMPLETE — STOP AND VERIFY

---

## PHASE 8: Location + About Pages

---

### Task 37: Location page

**Files:**
- Create: `components/sections/location/Amenities.tsx`
- Modify: `app/location/page.tsx`

- [ ] **Step 1: Write Amenities.tsx**

```tsx
import { SectionWrapper } from '@/components/layout/SectionWrapper'

const AMENITIES = [
  { category: 'Сургууль', distance: '5 мин', description: 'Олон улсын сургууль, цэцэрлэг' },
  { category: 'Нийтийн тээвэр', distance: '3 мин', description: 'Автобусны буудал, метро' },
  { category: 'Худалдааны төв', distance: '10 мин', description: 'State Department Store, Sky Mall' },
  { category: 'Цэцэрлэгт хүрээлэн', distance: '8 мин', description: 'Ногоон зай, явган хүний зам' },
]

export function Amenities() {
  return (
    <SectionWrapper number="01">
      <div className="max-w-content mx-auto">
        <h2 className="font-display text-4xl lg:text-5xl mb-10">Дэд бүтэц</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {AMENITIES.map((a) => (
            <div key={a.category}>
              <p className="font-utility text-[11px] text-muted uppercase tracking-wider mb-1">
                {a.category} · {a.distance}
              </p>
              <p className="font-body text-sm">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Write app/location/page.tsx**

```tsx
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { Amenities } from '@/components/sections/location/Amenities'

export default function LocationPage() {
  return (
    <main>
      {/* Map placeholder */}
      <div className="w-full h-[50vh] bg-surface-raised flex items-center justify-center">
        <p className="font-utility text-[12px] text-muted">Газрын зураг — iframe эсвэл зураг</p>
      </div>
      <Amenities />
      <SectionWrapper number="02">
        <div className="max-w-reading mx-auto">
          <h2 className="font-display text-4xl lg:text-5xl mb-6">Дүүрэг</h2>
          <p className="font-body text-lg text-muted">
            Сүхбаатар дүүрэг нь Улаанбаатарын төвийн хамгийн тохиромжтой, дэд бүтэц сайтай
            байршлуудын нэг юм. Бүх зүйл алхам зайд.
          </p>
        </div>
      </SectionWrapper>
    </main>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/location/ app/location/page.tsx
git commit -m "feat: build Location page"
```

---

### Task 38: About page

**Files:**
- Modify: `app/about/page.tsx`

- [ ] **Step 1: Write app/about/page.tsx**

```tsx
import { SectionWrapper } from '@/components/layout/SectionWrapper'

const STATS = [
  { value: '12', label: 'Дууссан төсөл' },
  { value: '2,400+', label: 'Хүргэсэн орон сууц' },
  { value: '15', label: 'Жилийн туршлага' },
]

export default function AboutPage() {
  return (
    <main>
      <div className="max-w-content mx-auto px-4 lg:px-8 pt-16 pb-8">
        <h1 className="font-display text-5xl lg:text-6xl mb-6">Бидний тухай</h1>
        <p className="font-body text-lg text-muted max-w-reading">
          Монголын хамгийн итгэлтэй орон сууцны хөгжүүлэгч.
          Бид чанар, ил тод байдал, урт хугацааны үнэ цэнийг тэргүүнд тавьдаг.
        </p>
      </div>

      <SectionWrapper number="01">
        <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-surface-raised aspect-[4/3]" aria-label="Барилгын зураг" />
          <div>
            <h2 className="font-display text-4xl mb-4">Манай түүх</h2>
            <p className="font-body text-base text-muted">
              2009 онд үүсгэн байгуулагдсан бидний компани Улаанбаатарт 12 гаруй амжилттай
              төсөл хэрэгжүүлсэн. Чанар болон гоо зүйн зохицлыг эрхэмлэдэг.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper number="02" className="bg-surface-raised">
        <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { label: 'ЧАНАР', body: 'Олон улсын стандарт материал, мастер гүйцэтгэл.' },
            { label: 'ИЛ ТОД', body: 'Бүх зардал, хугацаа, нөхцөл тодорхой.' },
            { label: 'ТОГТВОРТОЙ', body: 'Эрчим хүчний хэмнэлттэй, урт насжилттай барилга.' },
          ].map((v) => (
            <div key={v.label}>
              <p className="font-utility text-[11px] tracking-widest text-muted mb-2">{v.label}</p>
              <p className="font-body text-base">{v.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper number="03">
        <div className="max-w-content mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.value}>
              <p className="font-display font-light text-6xl lg:text-7xl mb-2">{s.value}</p>
              <p className="font-utility text-[12px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </main>
  )
}
```

- [ ] **Step 2: Commit Phase 8**

```bash
git add components/sections/location/ app/location/ app/about/page.tsx
git commit -m "feat: build Location and About pages"
```

---

## ✅ PHASE 8 COMPLETE — STOP AND VERIFY

- [ ] All 7 pages render without errors
- [ ] `npm run build` succeeds
- [ ] `npx jest` — all tests pass

---

## PHASE 9: Scroll-Scrub Tour

> After this phase: the Home page tour placeholder is replaced with a real pinned canvas sequence. This is the most complex component — read the spec in `docs/design.md` section 8.1 carefully before starting.

---

### Task 39: TourFallback (reduced-motion)

**Files:**
- Create: `components/tour/TourFallback.tsx`

- [ ] **Step 1: Write TourFallback.tsx**

```tsx
import Image from 'next/image'

interface TourFallbackProps {
  frames: string[]
}

export function TourFallback({ frames }: TourFallbackProps) {
  const keyFrames = [frames[0], frames[Math.floor(frames.length / 2)], frames[frames.length - 1]].filter(Boolean)

  return (
    <div className="w-full px-4 lg:px-8 py-16 bg-surface-raised">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {keyFrames.map((src, i) => (
            <div key={i} className="relative aspect-video bg-surface">
              <Image
                src={src ?? ''}
                alt={`Барилгын дотоод талын зураг ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
        <p className="font-display text-xl mt-6 text-center text-muted">
          Орчин үеийн дизайн. Таны гэр.
        </p>
      </div>
    </div>
  )
}
```

---

### Task 40: ScrollScrubTour

**Files:**
- Create: `components/tour/ScrollScrubTour.tsx`

- [ ] **Step 1: Write ScrollScrubTour.tsx**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TourFallback } from './TourFallback'

gsap.registerPlugin(ScrollTrigger)

interface ScrollScrubTourProps {
  frames: string[]
}

export function ScrollScrubTour({ frames }: ScrollScrubTourProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [allLoaded, setAllLoaded] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  useEffect(() => {
    if (reducedMotion || frames.length === 0) return

    const images: HTMLImageElement[] = []
    let loaded = 0

    const onLoad = () => {
      loaded++
      const progress = loaded / frames.length
      setLoadProgress(progress)
      if (loaded === frames.length) setAllLoaded(true)
    }

    for (const src of frames) {
      const img = new Image()
      img.onload = onLoad
      img.onerror = onLoad
      img.src = src
      images.push(img)
    }

    return () => {
      images.forEach((img) => { img.onload = null; img.onerror = null })
    }
  }, [frames, reducedMotion])

  useEffect(() => {
    if (!allLoaded || reducedMotion) return
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const images: HTMLImageElement[] = frames.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })

    const obj = { frame: 0 }

    function drawFrame(index: number) {
      const img = images[Math.max(0, Math.min(Math.round(index), images.length - 1))]
      if (!img || !ctx || !canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const x = (canvas.width - img.naturalWidth * scale) / 2
      const y = (canvas.height - img.naturalHeight * scale) / 2
      ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)
    }

    drawFrame(0)

    const tween = gsap.to(obj, {
      frame: images.length - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 0.5,
        onUpdate: () => drawFrame(obj.frame),
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [allLoaded, frames, reducedMotion])

  if (reducedMotion) {
    return <TourFallback frames={frames} />
  }

  return (
    <div ref={sectionRef} id="tour" className="relative w-full h-screen bg-surface">
      {/* Loading progress bar */}
      {!allLoaded && (
        <div
          ref={progressBarRef}
          className="absolute top-0 left-0 h-px bg-oak z-10 transition-all duration-100"
          style={{ width: `${loadProgress * 100}%` }}
          role="progressbar"
          aria-valuenow={Math.round(loadProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Зурагнуудыг ачаалж байна"
        />
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-label="Барилгын дотоод орчны кино"
      />

      {/* Scroll hint */}
      {!allLoaded && (
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-utility text-[11px] text-muted pointer-events-none">
          Гүйлгэж үзнэ үү ↓
        </p>
      )}
    </div>
  )
}
```

---

### Task 41: Wire tour into Home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace tour placeholder in app/page.tsx**

```tsx
import dynamic from 'next/dynamic'

const ScrollScrubTour = dynamic(
  () => import('@/components/tour/ScrollScrubTour').then((m) => m.ScrollScrubTour),
  { ssr: false }
)
```

Replace the tour placeholder div:
```tsx
<ScrollScrubTour frames={clientConfig.tourFrames ?? []} />
```

- [ ] **Step 2: Add tourFrames to ClientConfig type**

In `types/index.ts`, add to `ClientConfig`:
```typescript
tourFrames?: string[]
```

In `config/client.config.ts`, add to the config object:
```typescript
tourFrames: [], // Add frame paths once tour assets are available: ['/assets/demo/tour/001.jpg', ...]
```

- [ ] **Step 3: Verify tour section**

```bash
npm run dev
```

Visit `/`. With empty `tourFrames`, the canvas renders but shows nothing — that is expected. Provide 2 test frames (any JPEG in `/public/assets/demo/tour/`) to see the scrub in action.

To test with real frames: add files `001.jpg` and `002.jpg` to `/public/assets/demo/tour/`, set `tourFrames: ['/assets/demo/tour/001.jpg', '/assets/demo/tour/002.jpg']` in config, reload, and slowly scroll through the tour section.

- [ ] **Step 4: Commit Phase 9**

```bash
git add components/tour/ app/page.tsx types/index.ts config/client.config.ts
git commit -m "feat: add scroll-scrub cinematic tour with prefers-reduced-motion fallback"
```

---

## ✅ PHASE 9 COMPLETE — STOP AND VERIFY

- [ ] Tour canvas renders on Home without errors
- [ ] `prefers-reduced-motion: reduce` → TourFallback renders (test in DevTools → Rendering)
- [ ] With real frame images: scroll scrubs through frames smoothly
- [ ] `npm run build` succeeds
- [ ] `npx jest` passes

---

## PHASE 10: Final verification + Vercel deploy

---

### Task 42: Add .gitignore and .env rules

- [ ] **Step 1: Confirm .gitignore has correct entries**

Ensure `.gitignore` contains:
```
.env.local
.env*.local
.next/
node_modules/
.superpowers/
```

- [ ] **Step 2: Final build + test**

```bash
npm run build && npx jest
```

Expected: build succeeds, all tests pass.

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "chore: final pre-deploy cleanup"
```

---

### Task 43: Deploy to Vercel

- [ ] **Step 1: Deploy**

Use the Vercel skill: `/vercel deploy`

Or manually:
```bash
npx vercel --prod
```

Set environment variable in Vercel dashboard: `DATA_SOURCE=config`

- [ ] **Step 2: Smoke-test deployed site**

Visit the Vercel URL. Check:
- All 7 routes load
- Fonts render (Cormorant Garamond, Golos Text)
- Nav and footer present
- Availability filter works
- Contact form submits without error

---

## ✅ PLAN COMPLETE

**Self-review checklist:**
- Phase 1 (scaffold, tokens, types, adapter): ✅ All tasks complete with full code
- Phase 2 (Stitch MCP): ✅ Upload + generate flow specified
- Phase 3 (UI components): ✅ All 6 components with full code
- Phase 4 (layout): ✅ Nav, Footer, LenisProvider, root layout wired
- Phase 5 (Home): ✅ Hero, sections, page assembled
- Phase 6 (Residences + Detail): ✅ Both pages with all sections
- Phase 7 (Availability + Contact): ✅ Filter/table, form with API route
- Phase 8 (Location + About): ✅ Both pages
- Phase 9 (Tour): ✅ Canvas + GSAP + fallback
- Phase 10 (Deploy): ✅ Vercel deploy

**Type consistency check:**
- `UnitType.id` used consistently as `typeId` reference in `Unit` — ✅
- `clientConfig.unitTypes` and `clientConfig.units` arrays — ✅
- `getUnitTypes()` / `getUnits()` / `getUnitsByType(typeId)` signatures consistent across adapter, sources, and page usage — ✅
- `tourFrames` added to both `ClientConfig` type and demo config — ✅
- `ClientConfig.contact` shape matches Footer and Contact page usage — ✅
