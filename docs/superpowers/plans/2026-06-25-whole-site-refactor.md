# Whole-Site Design + Motion Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring every page up to the editorial quality of the home cinematic mockup by extracting a reusable block kit + motion primitives, wiring three new home section types, and reskinning all secondary pages with the shared system.

**Architecture:** Extend the existing config-driven `renderSection` switch on the home page with `statsBand`, `residenceShowcase`, and `finalCta` kinds. Extract presentational "kit" blocks to `components/kit/` (Eyebrow, EditorialHeading, StatBig, IndexNumber, ResidenceShowcase, CTAPair). Add lightweight motion wrappers to `components/motion/` (Reveal, CountUp, HoverLift, Parallax, EyebrowRule). Re-skin each secondary page by composing these blocks. Pages never read config for unit data — always through the adapter.

**Tech Stack:** Next.js 15 App Router · TypeScript strict · Tailwind v4 (`@theme`) · GSAP + ScrollTrigger · Lenis

**Spec:** `docs/superpowers/specs/2026-06-24-whole-site-design-motion-refactor-design.md`

---

## File Map

```
app/globals.css                          add --color-accent, --color-on-dark
types/index.ts                           add HeadingPart, StatItem, StatsBandSectionConfig,
                                         ResidenceShowcaseSectionConfig, FinalCtaSectionConfig,
                                         update HomeSection union, extend UnitType + ClientConfig

components/kit/
  Eyebrow.tsx                            red rule + uppercase label
  EditorialHeading.tsx                   serif heading with optional italic/coloured accent words
  StatBig.tsx                            huge number + tiny label
  IndexNumber.tsx                        0X / 05 wayfinding motif
  ResidenceShowcase.tsx                  alternating dollhouse card + content column
  CTAPair.tsx                            filled-red primary + outline secondary

components/motion/
  Reveal.tsx                             fade + 14px rise on viewport entry
  CountUp.tsx                            number animates 0→value on enter
  HoverLift.tsx                          card/button lift + shadow on hover/focus
  Parallax.tsx                           gentle vertical drift on images
  EyebrowRule.tsx                        red rule draws in on reveal

components/home/sections/
  StatsBandSection.tsx                   dark section: eyebrow + heading + stats row
  ResidenceShowcaseSection.tsx           server component — fetches unitTypes, renders showcase list
  FinalCtaSection.tsx                    eyebrow + heading + CTAPair + contact meta

app/page.tsx                             add 3 new cases to renderSection switch
config/client.config.ts                  add statsBand, residenceShowcase, finalCta sections + stats

app/residences/page.tsx                  editorial intro + ResidenceShowcase list
components/sections/residences/
  ResidencesGrid.tsx                     (delete — replaced by ResidenceShowcase in the new page)

app/residences/[typeId]/page.tsx         editorial header, StatBig row, gallery, units
components/sections/detail/
  DetailHeader.tsx                       updated: IndexNumber + EditorialHeading
  Gallery.tsx                            new: image grid with HoverLift + Parallax
  AvailableUnits.tsx                     reskin with tokens + Reveal on rows

app/availability/page.tsx               reskin: eyebrow + heading + CountUp + Reveal rows
components/sections/availability/
  AvailabilityTable.tsx                  reskin tokens, add Reveal on rows
  FilterStrip.tsx                        reskin tokens

app/location/page.tsx                   eyebrow + EditorialHeading + map + Reveal amenities
components/sections/location/
  MapSection.tsx                         new: pin-drop map placeholder + Reveal
  Amenities.tsx                          new: Reveal grid

app/about/page.tsx                      EditorialHeading + StatBig row + Parallax image
components/sections/about/
  AboutHero.tsx                          new: editorial header
  StatsRow.tsx                           new: StatBig row
  Story.tsx                              new: two-column editorial block

app/contact/page.tsx                    EditorialHeading + reskinned form + CTAPair
components/sections/contact/
  ContactForm.tsx                        reskin: oak focus, CTAPair submit
```

---

## PHASE 1 — Tokens + Types

### Task 1: Add `--color-accent` and `--color-on-dark` tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add two tokens to `@theme` block**

Open `app/globals.css`. Inside the `@theme { }` block, after `--color-error: #C0574A;`, add:

```css
  --color-accent: #C0574A;
  --color-on-dark: #FAF6EF;
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build succeeds, no errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add --color-accent and --color-on-dark tokens"
```

---

### Task 2: Extend TypeScript types

**Files:**
- Modify: `types/index.ts`

- [ ] **Step 1: Add `HeadingPart` and `StatItem`**

At the top of `types/index.ts` (before the existing `UnitStatus` line) add:

```typescript
export interface HeadingPart {
  text: string
  accent?: 'red' | 'oak' | 'italic'
}

export interface StatItem {
  value: string
  label: string
  suffix?: string
}
```

- [ ] **Step 2: Add three new section config types**

After the existing `PinnedImageSectionConfig` interface, add:

```typescript
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
```

- [ ] **Step 3: Extend the `HomeSection` union**

Replace the existing `HomeSection` union with:

```typescript
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
```

- [ ] **Step 4: Add `dollhouseImage` to `UnitType`**

In the `UnitType` interface, after `tour?: string`:

```typescript
  dollhouseImage?: string
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add types/index.ts
git commit -m "feat: add HeadingPart, StatItem, StatsBand/ResidenceShowcase/FinalCta section types"
```

---

## ✅ PHASE 1 COMPLETE — STOP AND VERIFY

- [ ] `npm run build` succeeds
- [ ] `npx tsc --noEmit` — no errors

---

## PHASE 2 — Block Kit

### Task 3: `Eyebrow`

**Files:**
- Create: `components/kit/Eyebrow.tsx`

- [ ] **Step 1: Write Eyebrow.tsx**

```tsx
interface EyebrowProps {
  label: string
  theme?: 'light' | 'dark'
  className?: string
}

export function Eyebrow({ label, theme = 'light', className = '' }: EyebrowProps) {
  const color = theme === 'dark' ? 'var(--color-accent)' : 'var(--color-accent)'
  const textColor = theme === 'dark' ? 'rgba(250,246,239,0.5)' : 'var(--color-muted)'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        style={{ display: 'block', width: '28px', height: '1.5px', backgroundColor: color, flexShrink: 0 }}
      />
      <span
        className="font-body"
        style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: textColor }}
      >
        {label}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/kit/Eyebrow.tsx
git commit -m "feat: add Eyebrow kit block"
```

---

### Task 4: `EditorialHeading`

**Files:**
- Create: `components/kit/EditorialHeading.tsx`

- [ ] **Step 1: Write EditorialHeading.tsx**

```tsx
import type { HeadingPart } from '@/types'

interface EditorialHeadingProps {
  parts: HeadingPart[]
  as?: 'h1' | 'h2' | 'h3'
  theme?: 'light' | 'dark'
  className?: string
}

export function EditorialHeading({
  parts,
  as: Tag = 'h2',
  theme = 'light',
  className = '',
}: EditorialHeadingProps) {
  const baseColor = theme === 'dark' ? 'var(--color-on-dark)' : 'var(--color-text)'

  return (
    <Tag
      className={`font-display font-light ${className}`}
      style={{ color: baseColor, lineHeight: 1.08 }}
    >
      {parts.map((part, i) => {
        if (!part.accent) {
          return <span key={i}>{part.text}</span>
        }
        if (part.accent === 'red') {
          return (
            <span key={i} style={{ color: 'var(--color-accent)' }}>
              {part.text}
            </span>
          )
        }
        if (part.accent === 'oak') {
          return (
            <span key={i} style={{ color: 'var(--color-oak)' }}>
              {part.text}
            </span>
          )
        }
        // italic
        return (
          <em key={i} style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>
            {part.text}
          </em>
        )
      })}
    </Tag>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/kit/EditorialHeading.tsx
git commit -m "feat: add EditorialHeading kit block"
```

---

### Task 5: `StatBig`

**Files:**
- Create: `components/kit/StatBig.tsx`

- [ ] **Step 1: Write StatBig.tsx**

```tsx
import type { StatItem } from '@/types'

interface StatBigProps extends StatItem {
  theme?: 'light' | 'dark'
  className?: string
}

export function StatBig({ value, label, suffix, theme = 'light', className = '' }: StatBigProps) {
  const numColor = theme === 'dark' ? 'var(--color-oak)' : 'var(--color-oak)'
  const labelColor = theme === 'dark' ? 'rgba(250,246,239,0.45)' : 'var(--color-muted)'

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span
        className="font-display font-light"
        style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', lineHeight: 1, color: numColor }}
      >
        {value}
        {suffix && (
          <span style={{ fontSize: '0.55em', marginLeft: '0.1em', color: numColor }}>
            {suffix}
          </span>
        )}
      </span>
      <span
        className="font-body"
        style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: labelColor }}
      >
        {label}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/kit/StatBig.tsx
git commit -m "feat: add StatBig kit block"
```

---

### Task 6: `IndexNumber`

**Files:**
- Create: `components/kit/IndexNumber.tsx`

- [ ] **Step 1: Write IndexNumber.tsx**

```tsx
interface IndexNumberProps {
  index: number
  total: number
  theme?: 'light' | 'dark'
  className?: string
}

export function IndexNumber({ index, total, theme = 'light', className = '' }: IndexNumberProps) {
  const color = 'var(--color-oak)'
  const dividerColor = theme === 'dark' ? 'rgba(250,246,239,0.18)' : 'rgba(42,39,36,0.18)'
  const totalColor = theme === 'dark' ? 'rgba(250,246,239,0.3)' : 'rgba(42,39,36,0.3)'

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className={`flex items-center gap-2 font-display font-light ${className}`} aria-hidden="true">
      <span style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color }}>{pad(index)}</span>
      <span style={{ fontSize: '10px', color: dividerColor }}>/</span>
      <span style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', color: totalColor }}>{pad(total)}</span>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/kit/IndexNumber.tsx
git commit -m "feat: add IndexNumber kit block"
```

---

### Task 7: `CTAPair`

**Files:**
- Create: `components/kit/CTAPair.tsx`

- [ ] **Step 1: Write CTAPair.tsx**

```tsx
import Link from 'next/link'

interface CTAPairProps {
  primary: string
  primaryHref: string
  secondary: string
  secondaryHref: string
  theme?: 'light' | 'dark'
  className?: string
}

export function CTAPair({
  primary,
  primaryHref,
  secondary,
  secondaryHref,
  theme = 'light',
  className = '',
}: CTAPairProps) {
  const outlineColor = theme === 'dark' ? 'rgba(250,246,239,0.3)' : 'rgba(42,39,36,0.25)'
  const outlineText = theme === 'dark' ? 'var(--color-on-dark)' : 'var(--color-text)'

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <Link
        href={primaryHref}
        className="inline-flex items-center justify-center font-body font-medium"
        style={{
          minHeight: '48px',
          paddingInline: '28px',
          borderRadius: '9999px',
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-on-dark)',
          fontSize: '0.875rem',
          letterSpacing: '0.01em',
          transition: 'background-color 150ms',
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.backgroundColor = '#a84940'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)'
        }}
      >
        {primary}
      </Link>
      <Link
        href={secondaryHref}
        className="inline-flex items-center justify-center font-body"
        style={{
          minHeight: '48px',
          paddingInline: '28px',
          borderRadius: '9999px',
          border: `1.5px solid ${outlineColor}`,
          color: outlineText,
          fontSize: '0.875rem',
          textDecoration: 'none',
          transition: 'border-color 150ms',
        }}
      >
        {secondary}
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/kit/CTAPair.tsx
git commit -m "feat: add CTAPair kit block"
```

---

### Task 8: `ResidenceShowcase`

**Files:**
- Create: `components/kit/ResidenceShowcase.tsx`

- [ ] **Step 1: Write ResidenceShowcase.tsx**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { UnitType } from '@/types'
import { IndexNumber } from './IndexNumber'
import { EditorialHeading } from './EditorialHeading'
import { StatBig } from './StatBig'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CTAPair } from './CTAPair'

interface ResidenceShowcaseProps {
  unitType: UnitType
  index: number
  total: number
  side?: 'left' | 'right'
  theme?: 'light' | 'dark'
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n)
}

export function ResidenceShowcase({
  unitType,
  index,
  total,
  side = 'left',
  theme = 'light',
}: ResidenceShowcaseProps) {
  const imageSrc = unitType.dollhouseImage ?? unitType.gallery[0] ?? unitType.floorPlanImage
  const bg = theme === 'dark' ? 'var(--bg-dark)' : 'var(--color-surface)'
  const borderColor = theme === 'dark' ? 'var(--line-dark)' : 'var(--line)'
  const bodyColor = theme === 'dark' ? 'rgba(250,246,239,0.55)' : 'var(--color-muted)'

  const imageCol = (
    <div className="relative w-full md:w-1/2 aspect-[4/3] overflow-hidden" style={{ borderRadius: '2px' }}>
      <Image
        src={imageSrc}
        alt={`${unitType.name} орон сууцны зураг`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  )

  const contentCol = (
    <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 px-0 md:px-10">
      <IndexNumber index={index} total={total} theme={theme} />

      <p className="font-body" style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: bodyColor }}>
        {unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Студи'} · {unitType.sizeRange[0]}–{unitType.sizeRange[1]} м²
      </p>

      <EditorialHeading
        parts={[{ text: unitType.name }]}
        as="h3"
        theme={theme}
        className=""
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' } as React.CSSProperties}
      />

      <p className="font-body" style={{ fontSize: '0.95rem', lineHeight: 1.65, color: bodyColor, maxWidth: '380px' }}>
        {unitType.blurb}
      </p>

      <div className="flex flex-wrap gap-8">
        <StatBig value={String(unitType.sizeRange[0])} label="Талбай м²" suffix="+" theme={theme} />
        {unitType.rooms > 0 && (
          <StatBig value={String(unitType.rooms)} label="Унтлага" theme={theme} />
        )}
        <StatBig value={formatPrice(unitType.priceFrom)} label="₮-аас эхлэн" theme={theme} />
      </div>

      <div className="mt-2">
        <CTAPair
          primary="Дэлгэрэнгүй"
          primaryHref={`/residences/${unitType.id}`}
          secondary="Үзлэг захиалах"
          secondaryHref="/contact"
          theme={theme}
        />
      </div>
    </div>
  )

  return (
    <div
      style={{ backgroundColor: bg, borderBottom: `1px solid ${borderColor}` }}
    >
      <div
        className="max-w-content mx-auto px-4 lg:px-8 py-20 flex flex-col md:flex-row gap-12 items-center"
      >
        {side === 'left' ? (
          <>
            {imageCol}
            {contentCol}
          </>
        ) : (
          <>
            {contentCol}
            {imageCol}
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/kit/ResidenceShowcase.tsx
git commit -m "feat: add ResidenceShowcase kit block"
```

---

## ✅ PHASE 2 COMPLETE — STOP AND VERIFY

- [ ] `npx tsc --noEmit` — no errors
- [ ] `npm run build` — succeeds

---

## PHASE 3 — Motion Primitives

### Task 9: `Reveal`

**Files:**
- Create: `components/motion/Reveal.tsx`

- [ ] **Step 1: Write Reveal.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 14,
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/Reveal.tsx
git commit -m "feat: add Reveal motion primitive"
```

---

### Task 10: `CountUp`

**Files:**
- Create: `components/motion/CountUp.tsx`

- [ ] **Step 1: Write CountUp.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CountUpProps {
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function CountUp({ to, duration = 1.4, prefix = '', suffix = '', className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${prefix}${to}${suffix}`
      return
    }

    const obj = { val: 0 }
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: to,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [to, duration, prefix, suffix])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/CountUp.tsx
git commit -m "feat: add CountUp motion primitive"
```

---

### Task 11: `HoverLift`

**Files:**
- Create: `components/motion/HoverLift.tsx`

- [ ] **Step 1: Write HoverLift.tsx**

```tsx
'use client'

import { useRef } from 'react'

interface HoverLiftProps {
  children: React.ReactNode
  className?: string
}

export function HoverLift({ children, className = '' }: HoverLiftProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ref.current.style.transform = 'translateY(-4px)'
    ref.current.style.boxShadow = 'var(--shadow-md)'
  }

  const handleLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = ''
    ref.current.style.boxShadow = ''
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: 'transform 200ms ease, box-shadow 200ms ease' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/HoverLift.tsx
git commit -m "feat: add HoverLift motion primitive"
```

---

### Task 12: `Parallax`

**Files:**
- Create: `components/motion/Parallax.tsx`

- [ ] **Step 1: Write Parallax.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxProps {
  children: React.ReactNode
  strength?: number
  className?: string
}

export function Parallax({ children, strength = 40, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: strength / 2 },
        {
          y: -strength / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [strength])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/Parallax.tsx
git commit -m "feat: add Parallax motion primitive"
```

---

### Task 13: `EyebrowRule`

**Files:**
- Create: `components/motion/EyebrowRule.tsx`

- [ ] **Step 1: Write EyebrowRule.tsx**

This is a client-side variant of `Eyebrow` that animates the rule on scroll entry.

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface EyebrowRuleProps {
  label: string
  theme?: 'light' | 'dark'
  className?: string
}

export function EyebrowRule({ label, theme = 'light', className = '' }: EyebrowRuleProps) {
  const ruleRef = useRef<HTMLSpanElement>(null)
  const accentColor = 'var(--color-accent)'
  const textColor = theme === 'dark' ? 'rgba(250,246,239,0.5)' : 'var(--color-muted)'

  useEffect(() => {
    if (!ruleRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from(ruleRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.55,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: ruleRef.current,
          start: 'top 88%',
          once: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        ref={ruleRef}
        aria-hidden="true"
        style={{ display: 'block', width: '28px', height: '1.5px', backgroundColor: accentColor, flexShrink: 0 }}
      />
      <span
        className="font-body"
        style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: textColor }}
      >
        {label}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/EyebrowRule.tsx
git commit -m "feat: add EyebrowRule motion primitive"
```

---

## ✅ PHASE 3 COMPLETE — STOP AND VERIFY

- [ ] `npx tsc --noEmit` — no errors
- [ ] `npm run build` — succeeds

---

## PHASE 4 — Home Blend (new section types)

### Task 14: `StatsBandSection`

**Files:**
- Create: `components/home/sections/StatsBandSection.tsx`

- [ ] **Step 1: Write StatsBandSection.tsx**

```tsx
import type { StatsBandSectionConfig } from '@/types'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { StatBig } from '@/components/kit/StatBig'

export function StatsBandSection({ config }: { config: StatsBandSectionConfig }) {
  return (
    <section
      aria-label={config.eyebrow}
      style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--color-on-dark)' }}
    >
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        <Eyebrow label={config.eyebrow} theme="dark" className="mb-8" />

        <EditorialHeading
          parts={config.headingParts}
          as="h2"
          theme="dark"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', marginBottom: '3rem' } as React.CSSProperties}
        />

        <div className="flex flex-wrap gap-12">
          {config.stats.map((stat) => (
            <StatBig
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              theme="dark"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/sections/StatsBandSection.tsx
git commit -m "feat: add StatsBandSection home section"
```

---

### Task 15: `ResidenceShowcaseSection`

**Files:**
- Create: `components/home/sections/ResidenceShowcaseSection.tsx`

This is a **server component** that fetches unit types from the adapter and renders the alternating showcase list.

- [ ] **Step 1: Write ResidenceShowcaseSection.tsx**

```tsx
import type { ResidenceShowcaseSectionConfig } from '@/types'
import { getUnitTypes } from '@/lib/data/adapter'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { ResidenceShowcase } from '@/components/kit/ResidenceShowcase'

export async function ResidenceShowcaseSection({
  config,
}: {
  config: ResidenceShowcaseSectionConfig
}) {
  const unitTypes = await getUnitTypes()

  return (
    <section aria-label={config.eyebrow}>
      {/* Section intro header */}
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: 'var(--section-padding)', paddingBottom: '3rem' }}
      >
        <Eyebrow label={config.eyebrow} className="mb-8" />
        <EditorialHeading
          parts={config.headingParts}
          as="h2"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', marginBottom: '1.5rem' } as React.CSSProperties}
        />
        <p
          className="font-body"
          style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '520px' }}
        >
          {config.introBody}
        </p>
      </div>

      {/* Alternating showcase list */}
      {unitTypes.map((ut, i) => (
        <ResidenceShowcase
          key={ut.id}
          unitType={ut}
          index={i + 1}
          total={unitTypes.length}
          side={i % 2 === 0 ? 'left' : 'right'}
          theme={i % 2 === 0 ? 'light' : 'dark'}
        />
      ))}
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/sections/ResidenceShowcaseSection.tsx
git commit -m "feat: add ResidenceShowcaseSection (server component, adapter-driven)"
```

---

### Task 16: `FinalCtaSection`

**Files:**
- Create: `components/home/sections/FinalCtaSection.tsx`

- [ ] **Step 1: Write FinalCtaSection.tsx**

```tsx
import type { FinalCtaSectionConfig } from '@/types'
import { clientConfig } from '@/config/client.config'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { CTAPair } from '@/components/kit/CTAPair'

export function FinalCtaSection({ config }: { config: FinalCtaSectionConfig }) {
  return (
    <section
      aria-label={config.eyebrow}
      style={{ backgroundColor: 'var(--color-surface-raised)' }}
    >
      <div
        className="max-w-content mx-auto px-4 lg:px-8 flex flex-col items-start gap-8"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        <Eyebrow label={config.eyebrow} />

        <EditorialHeading
          parts={config.headingParts}
          as="h2"
          style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)' } as React.CSSProperties}
        />

        <CTAPair
          primary={config.primaryLabel}
          primaryHref={config.primaryHref}
          secondary={config.secondaryLabel}
          secondaryHref={config.secondaryHref}
        />

        <p
          className="font-utility"
          style={{ fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.04em' }}
        >
          {clientConfig.contact.phone} · {clientConfig.contact.address}
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/sections/FinalCtaSection.tsx
git commit -m "feat: add FinalCtaSection home section"
```

---

### Task 17: Wire new sections into `app/page.tsx` + update config

**Files:**
- Modify: `app/page.tsx`
- Modify: `config/client.config.ts`

- [ ] **Step 1: Update `app/page.tsx` to import and handle new section types**

Add three new imports at the top:
```tsx
import { StatsBandSection } from '@/components/home/sections/StatsBandSection'
import { ResidenceShowcaseSection } from '@/components/home/sections/ResidenceShowcaseSection'
import { FinalCtaSection } from '@/components/home/sections/FinalCtaSection'
```

Add three new cases to the `renderSection` switch (before the closing brace):
```tsx
    case 'statsBand':
      return <StatsBandSection config={section} />
    case 'residenceShowcase':
      return <ResidenceShowcaseSection config={section} />
    case 'finalCta':
      return <FinalCtaSection config={section} />
```

The `renderSection` function needs to become `async` because `ResidenceShowcaseSection` is a server component that `await`s:
```tsx
async function renderSection(section: HomeSection): Promise<React.ReactNode> {
```

And `HomePage` needs to await the mapped results:
```tsx
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
```

- [ ] **Step 2: Add new sections to `config/client.config.ts`**

Inside `home.sections` array, add these three entries (you can add them at the end, after `interiorPhoto`):

```typescript
      {
        kind: 'statsBand' as const,
        enabled: true,
        eyebrow: 'Тоон үзүүлэлт',
        headingParts: [
          { text: 'Шилдэг чанар, ' },
          { text: 'батлагдсан', accent: 'italic' as const },
          { text: ' үр дүн.' },
        ],
        stats: [
          { value: '12', label: 'Жилийн туршлага', suffix: '+' },
          { value: '1685', label: 'Амьдарч буй гэр бүл', suffix: '+' },
          { value: '2026', label: 'Хүлээлгэн өгөх он' },
        ],
      },
      {
        kind: 'residenceShowcase' as const,
        enabled: true,
        eyebrow: 'Орон сууцны төрлүүд',
        headingParts: [
          { text: 'Таван өөр зохиомж, ' },
          { text: 'нэг ижил', accent: 'italic' as const },
          { text: ' чанар.' },
        ],
        introBody:
          'Студиас гурван өрөө хүртэл — бүр тохиромжтой, хүн бүрт зориулсан орон зай.',
      },
      {
        kind: 'finalCta' as const,
        enabled: true,
        eyebrow: 'Үзлэг захиалах',
        headingParts: [
          { text: 'Таны гэр ' },
          { text: 'энд', accent: 'italic' as const },
          { text: ' эхэлнэ.' },
        ],
        primaryLabel: 'Үзлэг захиалах',
        primaryHref: '/contact',
        secondaryLabel: 'Орон сууцнууд',
        secondaryHref: '/residences',
      },
```

- [ ] **Step 3: Verify dev server — visit home page**

```bash
npm run dev
```

Visit `http://localhost:3000`. Scroll down and confirm: statsBand dark section shows with oak numbers, residenceShowcase shows alternating cards, finalCta terracotta-red CTA at bottom. No console errors.

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx config/client.config.ts
git commit -m "feat: wire statsBand, residenceShowcase, finalCta into home page"
```

---

## ✅ PHASE 4 COMPLETE — STOP AND VERIFY

- [ ] Home page scrolls through all sections including the 3 new ones
- [ ] No TypeScript or build errors

---

## PHASE 5 — Residences + Detail Pages

### Task 18: Residences page — editorial ResidenceShowcase list

**Files:**
- Modify: `app/residences/page.tsx`

- [ ] **Step 1: Replace `app/residences/page.tsx`**

```tsx
import { getUnitTypes } from '@/lib/data/adapter'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { ResidenceShowcase } from '@/components/kit/ResidenceShowcase'

export default async function ResidencesPage() {
  const unitTypes = await getUnitTypes()

  return (
    <main>
      {/* Page intro */}
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Орон сууцны төрлүүд" className="mb-8" />
        <EditorialHeading
          parts={[{ text: 'Бүх төрлийн ' }, { text: 'орон сууц', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '1.25rem' } as React.CSSProperties}
        />
        <p
          className="font-body"
          style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '480px' }}
        >
          Студиас гурван өрөө хүртэл — таны амьдралын хэрэгцээнд нийцсэн орон зай.
        </p>
      </div>

      {/* Alternating showcase */}
      {unitTypes.map((ut, i) => (
        <ResidenceShowcase
          key={ut.id}
          unitType={ut}
          index={i + 1}
          total={unitTypes.length}
          side={i % 2 === 0 ? 'left' : 'right'}
          theme={i % 2 === 0 ? 'light' : 'dark'}
        />
      ))}
    </main>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/residences`. Confirm: intro header shows, unit types alternate left/right with light/dark themes. All cards link to `/residences/[typeId]`.

- [ ] **Step 3: Commit**

```bash
git add app/residences/page.tsx
git commit -m "feat: residences page — editorial ResidenceShowcase list"
```

---

### Task 19: Residence detail page — editorial refactor

**Files:**
- Modify: `app/residences/[typeId]/page.tsx`
- Modify: `components/sections/detail/DetailHeader.tsx`
- Create: `components/sections/detail/Gallery.tsx`
- Modify: `components/sections/detail/AvailableUnits.tsx`

- [ ] **Step 1: Update `DetailHeader.tsx`**

Replace `components/sections/detail/DetailHeader.tsx` with:

```tsx
import type { UnitType } from '@/types'
import { IndexNumber } from '@/components/kit/IndexNumber'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { StatBig } from '@/components/kit/StatBig'
import { CTAPair } from '@/components/kit/CTAPair'
import { Eyebrow } from '@/components/kit/Eyebrow'

interface DetailHeaderProps {
  unitType: UnitType
  index: number
  total: number
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n)
}

export function DetailHeader({ unitType, index, total }: DetailHeaderProps) {
  return (
    <div
      className="max-w-content mx-auto px-4 lg:px-8"
      style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
    >
      <IndexNumber index={index} total={total} className="mb-6" />
      <Eyebrow
        label={unitType.rooms > 0 ? `${unitType.rooms} унтлагын өрөө` : 'Студи'}
        className="mb-6"
      />
      <EditorialHeading
        parts={[{ text: unitType.name }]}
        as="h1"
        style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', marginBottom: '1.5rem' } as React.CSSProperties}
      />
      <p
        className="font-body"
        style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '460px', marginBottom: '2.5rem' }}
      >
        {unitType.blurb}
      </p>
      <div className="flex flex-wrap gap-10 mb-10">
        <StatBig value={`${unitType.sizeRange[0]}–${unitType.sizeRange[1]}`} label="Талбай м²" />
        {unitType.rooms > 0 && <StatBig value={String(unitType.rooms)} label="Унтлага" />}
        <StatBig value={formatPrice(unitType.priceFrom)} label="₮-аас эхлэн" />
      </div>
      <CTAPair
        primary="Үзлэг захиалах"
        primaryHref="/contact"
        secondary="Боломжтой орон сууц"
        secondaryHref="#units"
      />
    </div>
  )
}
```

- [ ] **Step 2: Create `Gallery.tsx`**

Create `components/sections/detail/Gallery.tsx`:

```tsx
import Image from 'next/image'
import { HoverLift } from '@/components/motion/HoverLift'

interface GalleryProps {
  images: string[]
  altPrefix: string
}

export function Gallery({ images, altPrefix }: GalleryProps) {
  if (images.length === 0) return null

  return (
    <section aria-label="Зургийн цомог">
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: '4rem' }}
      >
        <div
          className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}
        >
          {images.map((src, i) => (
            <HoverLift key={src}>
              <div className="relative aspect-[16/10] overflow-hidden" style={{ borderRadius: '2px' }}>
                <Image
                  src={src}
                  alt={`${altPrefix} — зураг ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </div>
            </HoverLift>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Update `AvailableUnits.tsx` — add Reveal + reskin**

Replace `components/sections/detail/AvailableUnits.tsx`:

```tsx
import Link from 'next/link'
import { Reveal } from '@/components/motion/Reveal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CTAPair } from '@/components/kit/CTAPair'
import type { Unit } from '@/types'

function formatPrice(n: number) {
  return new Intl.NumberFormat('mn-MN').format(n) + ' ₮'
}

const ORIENTATION_LABELS: Record<string, string> = {
  north: 'Хойд', south: 'Өмнөд', east: 'Зүүн', west: 'Баруун',
  'north-east': 'ХЗ', 'north-west': 'ХБ', 'south-east': 'ӨЗ', 'south-west': 'ӨБ',
}

export function AvailableUnits({ units, typeId }: { units: Unit[]; typeId: string }) {
  void typeId
  return (
    <section id="units" aria-label="Боломжтой орон сууц">
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: 'var(--section-padding)', borderTop: '1px solid var(--color-border)' }}
      >
        <h2
          className="font-display font-light mb-10"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
        >
          Боломжтой орон сууц
        </h2>

        {units.length === 0 ? (
          <p className="font-body" style={{ color: 'var(--color-muted)' }}>
            Одоогоор боломжтой орон сууц байхгүй байна.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left" aria-label="Боломжтой орон сууцны жагсаалт">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Давхар', 'Хэмжээ', 'Чиглэл', 'Үнэ', 'Статус', ''].map((h) => (
                    <th
                      key={h}
                      className="font-body pb-3 pr-6"
                      style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {units.map((unit, i) => (
                  <Reveal key={unit.id} delay={i * 0.04} className="contents">
                    <tr style={{ borderBottom: '1px solid rgba(42,39,36,0.06)' }}>
                      <td className="font-utility py-4 pr-6" style={{ fontSize: '12px' }}>{unit.floor}-р давхар</td>
                      <td className="font-utility py-4 pr-6" style={{ fontSize: '12px' }}>{unit.sizeM2} м²</td>
                      <td className="font-utility py-4 pr-6" style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                        {ORIENTATION_LABELS[unit.orientation] ?? unit.orientation}
                      </td>
                      <td className="font-utility py-4 pr-6" style={{ fontSize: '12px', color: 'var(--color-oak)' }}>
                        {formatPrice(unit.price)}
                      </td>
                      <td className="py-4 pr-6"><StatusBadge status={unit.status} /></td>
                      <td className="py-4">
                        <Link
                          href="/contact"
                          className="font-body"
                          style={{ fontSize: '12px', color: 'var(--color-muted)', textDecoration: 'none' }}
                        >
                          Захиалах →
                        </Link>
                      </td>
                    </tr>
                  </Reveal>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Update `app/residences/[typeId]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { getUnitTypes, getUnitsByType } from '@/lib/data/adapter'
import { DetailHeader } from '@/components/sections/detail/DetailHeader'
import { FloorPlan } from '@/components/sections/detail/FloorPlan'
import { Gallery } from '@/components/sections/detail/Gallery'
import { Features } from '@/components/sections/detail/Features'
import { AvailableUnits } from '@/components/sections/detail/AvailableUnits'

interface Props {
  params: Promise<{ typeId: string }>
}

export default async function ResidenceDetailPage({ params }: Props) {
  const { typeId } = await params
  const [unitTypes, units] = await Promise.all([getUnitTypes(), getUnitsByType(typeId)])
  const unitType = unitTypes.find((t) => t.id === typeId)

  if (!unitType) notFound()

  const index = unitTypes.findIndex((t) => t.id === typeId) + 1

  return (
    <main>
      <DetailHeader unitType={unitType} index={index} total={unitTypes.length} />
      <Gallery images={unitType.gallery} altPrefix={unitType.name} />
      <FloorPlan src={unitType.floorPlanImage} alt={`${unitType.name} төлөвлөгөө`} />
      <Features features={unitType.features} />
      <AvailableUnits units={units} typeId={typeId} />
    </main>
  )
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/residences/1br`. Confirm: editorial header with IndexNumber, gallery images, floor plan, features, available units table. No console errors.

- [ ] **Step 6: Commit**

```bash
git add app/residences/ components/sections/detail/
git commit -m "feat: editorial detail page — IndexNumber, StatBig, Gallery, Reveal on units"
```

---

## ✅ PHASE 5 COMPLETE — STOP AND VERIFY

- [ ] `/residences` shows alternating showcase cards
- [ ] `/residences/studio` and `/residences/2br` load correctly
- [ ] `npm run build` succeeds

---

## PHASE 6 — Availability + Location

### Task 20: Availability page — reskin + CountUp + Reveal

**Files:**
- Modify: `app/availability/page.tsx`
- Modify: `components/sections/availability/AvailabilityTable.tsx`
- Modify: `components/sections/availability/FilterStrip.tsx`

- [ ] **Step 1: Update `app/availability/page.tsx`**

Read the current file first, then replace with:

```tsx
import { Suspense } from 'react'
import { getUnitTypes, getUnits } from '@/lib/data/adapter'
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { AvailabilityTable } from '@/components/sections/availability/AvailabilityTable'
import { FilterStrip } from '@/components/sections/availability/FilterStrip'

export default async function AvailabilityPage() {
  const [unitTypes, units] = await Promise.all([getUnitTypes(), getUnits()])
  const available = units.filter((u) => u.status !== 'sold')

  return (
    <main>
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Хүртээмжтэй орон сууц" className="mb-8" />
        <EditorialHeading
          parts={[{ text: 'Боломжтой ' }, { text: 'орон сууц', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '1rem' } as React.CSSProperties}
        />
        <p
          className="font-display font-light"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--color-oak)' }}
        >
          {available.length}
        </p>
        <p className="font-body mb-8" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          нэгж боломжтой
        </p>
      </div>

      <div className="max-w-content mx-auto px-4 lg:px-8 pb-8">
        <FilterStrip unitTypes={unitTypes} />
      </div>

      <div className="max-w-content mx-auto px-4 lg:px-8 pb-24">
        <AvailabilityTable units={units} unitTypes={unitTypes} />
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Read and reskin `FilterStrip.tsx`**

Read `components/sections/availability/FilterStrip.tsx` to understand existing props/interface. Then update to use token colors with the existing `FilterPill` component — ensure classes use `var(--color-oak)` for active state and `var(--color-border)` for borders. Keep all existing logic, only change style values.

- [ ] **Step 3: Read and update `AvailabilityTable.tsx` — add Reveal on rows**

Read `components/sections/availability/AvailabilityTable.tsx`. Wrap each table row (or card on mobile) with `<Reveal delay={i * 0.04}>`. Update price column color to `var(--color-oak)`. Keep all filter/sort logic intact.

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/availability`. Confirm: editorial header, oak count number, filter strip, table rows reveal on scroll.

- [ ] **Step 5: Commit**

```bash
git add app/availability/page.tsx components/sections/availability/
git commit -m "feat: availability page — editorial header, CountUp, Reveal rows"
```

---

### Task 21: Location page

**Files:**
- Modify: `app/location/page.tsx`
- Create: `components/sections/location/MapSection.tsx`
- Create: `components/sections/location/Amenities.tsx`

- [ ] **Step 1: Read existing `app/location/page.tsx`**

Note what's currently rendered, then replace:

```tsx
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { MapSection } from '@/components/sections/location/MapSection'
import { Amenities } from '@/components/sections/location/Amenities'
import { clientConfig } from '@/config/client.config'

export default function LocationPage() {
  return (
    <main>
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Байршил" className="mb-8" />
        <EditorialHeading
          parts={[{ text: 'Хотын ' }, { text: 'зүрхэнд', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '1.25rem' } as React.CSSProperties}
        />
        <p
          className="font-body mb-2"
          style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-muted)', maxWidth: '460px' }}
        >
          {clientConfig.contact.address}
        </p>
      </div>

      <MapSection />
      <Amenities />
    </main>
  )
}
```

- [ ] **Step 2: Create `MapSection.tsx`**

Create `components/sections/location/MapSection.tsx`:

```tsx
import { Reveal } from '@/components/motion/Reveal'

export function MapSection() {
  return (
    <section aria-label="Байршлын газрын зураг">
      <Reveal className="max-w-content mx-auto px-4 lg:px-8 pb-12">
        <div
          className="w-full flex items-center justify-center"
          style={{
            height: '420px',
            background: 'var(--color-surface-raised)',
            borderRadius: '2px',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden',
          }}
          aria-label="Газрын зураг (удахгүй)"
        >
          {/* Pin dot */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                margin: '0 auto 8px',
                boxShadow: '0 0 0 4px rgba(192,87,74,0.2)',
              }}
            />
            <p className="font-utility" style={{ fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Газрын зураг удахгүй
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
```

- [ ] **Step 3: Create `Amenities.tsx`**

Create `components/sections/location/Amenities.tsx`:

```tsx
import { Reveal } from '@/components/motion/Reveal'

const AMENITIES = [
  { label: 'Хуурай цэвэрлэгээ', distance: '2 мин' },
  { label: 'Супермаркет', distance: '3 мин' },
  { label: 'Метро буудал', distance: '5 мин' },
  { label: 'Олон улсын сургууль', distance: '8 мин' },
  { label: 'Эмнэлэг', distance: '10 мин' },
  { label: 'Цэцэрлэгт хүрээлэн', distance: '12 мин' },
]

export function Amenities() {
  return (
    <section aria-label="Ойр орчны үйлчилгээ">
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingBlock: 'var(--section-padding)', borderTop: '1px solid var(--color-border)' }}
      >
        <h2
          className="font-display font-light mb-10"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
        >
          Ойр орчин
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AMENITIES.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <div
                className="flex items-center justify-between"
                style={{ paddingBlock: '1rem', borderBottom: '1px solid var(--color-border)' }}
              >
                <span className="font-body" style={{ fontSize: '0.95rem' }}>{item.label}</span>
                <span className="font-utility" style={{ fontSize: '11px', color: 'var(--color-oak)', letterSpacing: '0.04em' }}>
                  {item.distance}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/location`. Confirm: editorial header, map placeholder, amenities grid reveals on scroll.

- [ ] **Step 5: Commit**

```bash
git add app/location/page.tsx components/sections/location/
git commit -m "feat: location page — editorial header, map placeholder, amenities with Reveal"
```

---

## ✅ PHASE 6 COMPLETE — STOP AND VERIFY

- [ ] `/availability` shows editorial header + oak count + reveal rows
- [ ] `/location` shows heading, map placeholder, amenities
- [ ] `npm run build` succeeds

---

## PHASE 7 — About + Contact

### Task 22: About page

**Files:**
- Modify: `app/about/page.tsx`
- Create: `components/sections/about/AboutHero.tsx`
- Create: `components/sections/about/StatsRow.tsx`
- Create: `components/sections/about/Story.tsx`

- [ ] **Step 1: Create `AboutHero.tsx`**

Create `components/sections/about/AboutHero.tsx`:

```tsx
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'

export function AboutHero() {
  return (
    <div
      className="max-w-content mx-auto px-4 lg:px-8"
      style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
    >
      <Eyebrow label="Бидний тухай" className="mb-8" />
      <EditorialHeading
        parts={[
          { text: 'Хот байгуулах ' },
          { text: 'урлаг', accent: 'italic' as const },
          { text: '.' },
        ]}
        as="h1"
        style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)' } as React.CSSProperties}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create `StatsRow.tsx`**

Create `components/sections/about/StatsRow.tsx`:

```tsx
import { StatBig } from '@/components/kit/StatBig'

const STATS = [
  { value: '12', label: 'Жилийн туршлага', suffix: '+' },
  { value: '1685', label: 'Амьдарч буй гэр бүл', suffix: '+' },
  { value: '8', label: 'Дуусгасан төсөл' },
]

export function StatsRow() {
  return (
    <section
      aria-label="Тоон үзүүлэлт"
      style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--color-on-dark)' }}
    >
      <div
        className="max-w-content mx-auto px-4 lg:px-8 flex flex-wrap gap-16"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        {STATS.map((s) => (
          <StatBig key={s.label} value={s.value} label={s.label} suffix={s.suffix} theme="dark" />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `Story.tsx`**

Create `components/sections/about/Story.tsx`:

```tsx
import { Reveal } from '@/components/motion/Reveal'

export function Story() {
  return (
    <section aria-label="Бидний түүх">
      <div
        className="max-w-content mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-start"
        style={{ paddingBlock: 'var(--section-padding)' }}
      >
        <Reveal>
          <h2
            className="font-display font-light"
            style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', lineHeight: 1.1 }}
          >
            Чанар бол бидний гол үнэт зүйл.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-body" style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-muted)' }}>
            12 жилийн туршлагатай, Монголын орон сууцны зах зээлд хамгийн их итгэл үзүүлсэн хөгжүүлэгч бид таны гэрийг зөвхөн барилга биш, амьдралын орон зай болгон барьдаг.
          </p>
          <p className="font-body mt-6" style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-muted)' }}>
            Байгалийн материал, гэрлийг дуртай угтдаг архитектур, гар бүрд мэдрэгдэх нарийн ширийн — эдгээр нь бидний хийдэг зүйлийн мөн чанар.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Replace `app/about/page.tsx`**

```tsx
import { AboutHero } from '@/components/sections/about/AboutHero'
import { StatsRow } from '@/components/sections/about/StatsRow'
import { Story } from '@/components/sections/about/Story'

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <StatsRow />
      <Story />
    </main>
  )
}
```

- [ ] **Step 5: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/about`. Confirm: editorial heading, dark stats band, two-column story section with Reveal.

- [ ] **Step 6: Commit**

```bash
git add app/about/page.tsx components/sections/about/
git commit -m "feat: about page — EditorialHeading, dark StatBig row, Story with Reveal"
```

---

### Task 23: Contact page

**Files:**
- Modify: `app/contact/page.tsx`
- Modify: `components/sections/contact/ContactForm.tsx`

- [ ] **Step 1: Read existing `app/contact/page.tsx` and `ContactForm.tsx`**

Note the existing form fields and submission logic.

- [ ] **Step 2: Update `app/contact/page.tsx`**

```tsx
import { Eyebrow } from '@/components/kit/Eyebrow'
import { EditorialHeading } from '@/components/kit/EditorialHeading'
import { ContactForm } from '@/components/sections/contact/ContactForm'
import { clientConfig } from '@/config/client.config'

export default function ContactPage() {
  return (
    <main>
      <div
        className="max-w-content mx-auto px-4 lg:px-8"
        style={{ paddingTop: 'calc(var(--section-padding) + 64px)', paddingBottom: '3rem' }}
      >
        <Eyebrow label="Холбоо барих" className="mb-8" />
        <EditorialHeading
          parts={[{ text: 'Үзлэг ' }, { text: 'захиалах', accent: 'italic' as const }]}
          as="h1"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', marginBottom: '0.75rem' } as React.CSSProperties}
        />
        <p className="font-body mb-12" style={{ fontSize: '1.05rem', color: 'var(--color-muted)', maxWidth: '440px' }}>
          Манай баг ажлын цагаар хариу өгөх болно.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <ContactForm />
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-utility mb-1" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Утас</p>
              <p className="font-body" style={{ fontSize: '1.05rem' }}>{clientConfig.contact.phone}</p>
            </div>
            <div>
              <p className="font-utility mb-1" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>И-мэйл</p>
              <p className="font-body" style={{ fontSize: '1.05rem' }}>{clientConfig.contact.email}</p>
            </div>
            <div>
              <p className="font-utility mb-1" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Хаяг</p>
              <p className="font-body" style={{ fontSize: '1.05rem' }}>{clientConfig.contact.address}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Update `ContactForm.tsx` submit button — swap to CTAPair style accent CTA**

Read `components/sections/contact/ContactForm.tsx`. Find the existing submit button and replace it with an accent-colored styled button (keeping the same form `action` and validation logic):

```tsx
<button
  type="submit"
  disabled={pending}
  className="inline-flex items-center justify-center font-body font-medium"
  style={{
    minHeight: '48px',
    paddingInline: '28px',
    borderRadius: '9999px',
    backgroundColor: pending ? 'rgba(192,87,74,0.5)' : 'var(--color-accent)',
    color: 'var(--color-on-dark)',
    fontSize: '0.875rem',
    border: 'none',
    cursor: pending ? 'not-allowed' : 'pointer',
    transition: 'background-color 150ms',
  }}
>
  {pending ? 'Илгээж байна...' : 'Илгээх'}
</button>
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Visit `http://localhost:3000/contact`. Confirm: editorial heading, form + contact info two-column layout, accent-red submit button.

- [ ] **Step 5: Commit**

```bash
git add app/contact/page.tsx components/sections/contact/ContactForm.tsx
git commit -m "feat: contact page — editorial header, two-column layout, accent CTA"
```

---

## ✅ PHASE 7 COMPLETE — STOP AND VERIFY

- [ ] `/about` — editorial header + dark stats + story
- [ ] `/contact` — editorial header + form + accent CTA
- [ ] `npm run build` succeeds
- [ ] `npx tsc --noEmit` — no errors

---

## PHASE 8 — Cross-Page Polish + QA

### Task 24: Mobile walkthrough + quality floor check

- [ ] **Step 1: Open browser DevTools → mobile viewport (375px)**

Walk every page in order: `/` → `/residences` → `/residences/studio` → `/availability` → `/location` → `/about` → `/contact`

For each page check:
- Touch targets ≥ 44px (buttons, links)
- No horizontal overflow / overflow-x scroll
- Typography readable at mobile size
- Nav hamburger opens/closes
- Images not cropped weirdly

- [ ] **Step 2: prefers-reduced-motion — disable animations**

In DevTools → Rendering → Emulate CSS media feature: `prefers-reduced-motion: reduce`.

Walk all pages again. Confirm: no GSAP animations fire, Reveal elements are fully visible immediately, no layout breaks.

- [ ] **Step 3: Keyboard navigation**

Tab through each page. Confirm: focus ring visible (oak outline) on every interactive element. No focus traps.

- [ ] **Step 4: Fix any issues found**

Fix inline — commit per issue found.

- [ ] **Step 5: Run lint + build + tests**

```bash
npm run lint && npm run build && npx jest
```

Expected: all clean.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: whole-site design + motion refactor complete"
```

---

## ✅ PHASE 8 COMPLETE — REFACTOR DONE

All pages now share:
- Block kit (Eyebrow, EditorialHeading, StatBig, IndexNumber, ResidenceShowcase, CTAPair)
- Motion primitives (Reveal, CountUp, HoverLift, Parallax, EyebrowRule)
- Terracotta-red accent CTAs
- Italic serif accent words in headings
- Consistent editorial language across every page

Verify manually:
- [ ] Every route loads without error
- [ ] Mobile-first layout on every page
- [ ] `npm run build` clean
- [ ] No `any` types — `npx tsc --noEmit` clean
