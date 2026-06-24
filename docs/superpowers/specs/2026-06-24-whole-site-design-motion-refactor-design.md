# Whole-Site Design + Motion Refactor — Design Spec

**Date:** 2026-06-24
**Status:** Approved design, pending spec review
**Owner:** Five Star Residence template (config-driven, re-skinnable per client)

## 1. Goal

Bring the whole site up to the quality of the claude_design home mockup, and make every page feel alive with motion — without losing the existing GSAP/Lenis interactivity. We extract the mockup into a reusable, tokenized **block kit** plus a set of **motion primitives**, then re-skin every page by composing them (Approach A).

The mockup is one long editorial home scroll built from the real 5 `unitTypes` (2-43, 2-44, 2-51, 2-56, 3-63). Its visual language — light↔dark section rhythm, high-contrast serif headings with italic accent words, the `0X / 05` index motif, big-number stats, dollhouse-render showcase cards, red primary CTAs — becomes the shared system for the entire site.

## 2. Scope

In scope: Home (blend), Residences, Residence detail, Availability, Location, About, Contact.

Out of scope: the Supabase admin dashboard (Premium-only, build only when a client pays); data-source changes (adapter contract stays as-is); new copy/assets beyond what config already holds (placeholders where assets are missing).

## 3. Non-negotiable constraints (carried from CLAUDE.md)

- **Config-driven.** No hardcoded client data. New content (stats, CTA copy, headline accent words, section rhythm) lives in `ClientConfig` / `client.config.ts`.
- **Adapter-only data access.** Pages read units through `lib/data` (`getUnitTypes`, `getUnits`, `getUnitsByType`). Pages never read config or a data source directly for unit data.
- **One section per component.** Kit blocks are shared, client-agnostic, composable.
- **Mobile-first.** ~90% phone users; verify mobile before desktop.
- **Quality floor every screen:** loading + empty + error states, visible keyboard focus, alt text, semantic HTML, `prefers-reduced-motion` respected.
- **TypeScript strict, no `any`.** Performance: `next/image`, lazy-load below-the-fold + galleries, code-split heavy tour code, 60fps scroll target.
- **Home keeps the signature scroll-scrub cinematic tour** (pinned ScrollTrigger + canvas frame sequence). Never a click-next carousel.
- **Tokens override skill defaults.** REFERENCE.md palette is authoritative.
- **Secondary pages = production-grade consistent motion**, not full cinematic (locked design authority: `production-ui-design`).

## 4. Tokens & type

Existing tokens in `app/globals.css` already cover most of the mockup. Additions only:

- **`--color-accent: #C0574A`** — brand terracotta-red for primary CTAs and headline italic-accent words. Keep `--color-error` as a separate semantic token (same hue acceptable).
- **`--color-on-dark: #FAF6EF`** — formalized text color for dark sections, so light/dark sections share one contract.
- No font changes: Cormorant Garamond (display + italic accents), Golos Text (body + uppercase tracked eyebrows), Space Mono (coordinates / tiny meta labels).
- **Section rhythm** becomes a first-class `theme: 'light' | 'dark'` prop on section-level blocks, mirroring the mockup's cream → charcoal → cream alternation.

Dark section bg uses existing `--bg-dark: #2A241E`; big numbers use oak `#B8946A`; light sections use `--color-surface` / `--color-surface-raised`.

## 5. Block kit (`components/kit/`)

Each block is presentational, tokenized, and fed by props derived from config/adapter. No client strings inside.

| Block | Purpose | Key props |
|---|---|---|
| `Eyebrow` | Short red rule + uppercase tracked label | `label`, `theme` |
| `EditorialHeading` | Serif heading with an italic accent word (red or oak) | `parts[]` (text + optional `accent: 'red'\|'oak'`), `as`, `theme` |
| `StatBig` | Huge serif number + tiny uppercase label | `value`, `label`, `suffix?`, `theme`, `countUp?` |
| `IndexNumber` | The `0X / 05` oak-serif wayfinding motif | `index`, `total`, `theme` |
| `ResidenceShowcase` | Dollhouse-render card + content column | `unitType`, `index`, `total`, `side: 'left'\|'right'`, `theme` |
| `CTAPair` | Filled-red primary + outline secondary (wraps `Button`) | `primary`, `secondary` |
| `Footer` | Reskinned footer (logo mark, address, phone, email, copyright) | reads `config.contact`, `config.logo` |

`ResidenceShowcase` content column = `IndexNumber` + unit meta label + `EditorialHeading` + blurb + `StatBig` row (talбай / унтлага / угаалга / давхар) + `StatusBadge` + `CTAPair`. It alternates `side` and `theme` down the list, exactly like the mockup.

Existing `StatusBadge`, `Button`, `FormInput`, `FilterPill`, `UnitTypeCard` are reused/restyled to tokens — not duplicated.

## 6. Motion primitives (`components/motion/`)

Built on the existing Lenis + GSAP/ScrollTrigger infra (`LenisProvider`, `AnimationProvider`). Each is `prefers-reduced-motion`-safe (existing pattern: animations collapse to static).

| Primitive | Behavior | Reduced-motion fallback |
|---|---|---|
| `Reveal` | Fade + 14px rise as element enters viewport | Static, fully visible |
| `CountUp` | Number animates 0→value on enter | Shows final value immediately |
| `HoverLift` | Card/button lift + shadow on hover/focus | No transform (focus ring still shows) |
| `Parallax` | Gentle drift on render/interior images | No drift |
| `PageTransition` | Fade/slide between routes for continuity | Instant swap |
| `EyebrowRule` | Red rule draws in width on reveal | Rule shown at full width |

Heavy/home-only motion (scroll-scrub tour) stays code-split and lazy. Secondary-page motion is limited to the lightweight primitives above (no per-page pinned scrub) to honor the production-grade rule.

## 7. Per-page plan

### Home (blend) — config-driven sections, new order
`hero → statsBand → scrollScrubTour → residenceShowcase (01–05) → finalCta → footer`

The scroll-scrub tour is intentionally placed **right after the stats band and before the showcase** — it is the hook that makes a visitor want to see the units, not a footnote before the CTA.

New `HomeSection` kinds added to the config/types and `renderSection` switch in `app/page.tsx`:
- `statsBand` — dark section, eyebrow + `EditorialHeading` + row of `StatBig` (`12 / 1685 / 2026`-style), values from config.
- `residenceShowcase` — leads with its own intro header (eyebrow + `EditorialHeading`, e.g. "Таван өөр зохиомж, нэг ижил чанар"), then pulls `unitTypes` via adapter and renders the alternating `ResidenceShowcase` list (reads adapter data on the server, passes to the block). The mockup's "residences intro" is this section's header, not a separate section.
- `finalCta` — eyebrow + `EditorialHeading` (italic accent) + `CTAPair` + phone/hours from `config.contact`.

Existing kinds (`manifesto`, `dollhouseReveal`, `featureSteps`, `pinnedImage`, `interiorPhoto`, `scrollVideo`) remain available; the config chooses which are enabled. The blend keeps the tour section enabled and reorders the array.

### Residences (`/residences`)
Page body = the 01–05 `ResidenceShowcase` list (alternating side + theme) with `Reveal`. Eyebrow + `EditorialHeading` intro. Cards link to detail. Loading/empty/error states.

### Residence detail (`/residences/[typeId]`)
Editorial header (`IndexNumber` + `EditorialHeading`), dollhouse + gallery with `Parallax`/`HoverLift`, `StatBig` row, features list, available units (adapter `getUnitsByType`), `CTAPair`. Same kit, richer composition.

### Availability (`/availability`)
Keep the functional `AvailabilityTable` + `FilterStrip`; reskin to tokens. `Reveal` on rows, `CountUp` on result counts, eyebrow header. Empty/error states preserved.

### Location (`/location`)
Editorial heading + existing animated map (pin drop/pulse already in `globals.css`) + amenities with `Reveal`.

### About (`/about`)
Manifesto-style `EditorialHeading`s with italic accents, `StatBig` for credibility numbers, image `Parallax`.

### Contact (`/contact`)
Editorial heading + reskinned form (`FormInput`) + `CTAPair` + hours. `Reveal` on entry. Server route `app/api/contact/route.ts` untouched (secrets stay server-side).

## 8. Responsive behavior

- `ResidenceShowcase` collapses to stacked (render on top, content below) under `md`; `side` only applies on desktop.
- `StatBig` rows wrap to 2×2 on mobile.
- Display type scales via `clamp()` (pattern already used in pages).
- Touch targets ≥ 44px; CTAs full-width on mobile where appropriate.

## 9. Architecture & data flow

- New config shape: extend `ClientConfig.home.sections` union with `statsBand`, `residenceShowcase`, `finalCta`; add a `stats` and `finalCta` content area to config. Add optional `accentWord`/`parts` data for headings so accent words are config-driven, not hardcoded.
- `residenceShowcase` section component is a server component that calls the adapter (`getUnitTypes`) and passes data into the presentational block — pages/sections never import the config for unit data.
- Block kit + motion primitives are pure client/presentational and client-agnostic, enabling cheap future re-skins.

## 10. Testing & verification

- TypeScript strict passes; `npm run lint` clean.
- Existing Jest tests under `__tests__` stay green; add light tests for new pure blocks (`EditorialHeading` accent parsing, `StatBig` formatting) where valuable.
- Manual: mobile-first walkthrough of every page; verify loading/empty/error, keyboard focus, reduced-motion (motion collapses, tour shows key stills), 60fps scroll feel.

## 11. Phasing (for the implementation plan)

1. Tokens + type additions (`globals.css`, token contract).
2. Block kit (`components/kit/`) + restyle shared UI.
3. Motion primitives (`components/motion/`).
4. Home blend (new section kinds, config, reorder with tour after stats band).
5. Residences + detail.
6. Availability + Location.
7. About + Contact.
8. Cross-page polish: `PageTransition`, QA pass against quality floor.

Each phase finishes with a summary + how-to-verify, then stops for confirmation (phase discipline).

## 12. Open questions / assumptions

- Stats band values (`12 / 1685 / 2026` etc.) are **placeholders** — wired into config as demo values, to be swapped for the developer's real figures later. Build the `statsBand` to read whatever config provides; do not hardcode these numbers.
- Dollhouse renders referenced in config (`/clients/five-star/unit-types/*-dollhouse.jpg`) are assumed present or placeholdered via `config/placeholders.ts`.
- `--color-accent` hue (`#C0574A`) matches the mockup's red closely; fine-tune against final assets if needed.
