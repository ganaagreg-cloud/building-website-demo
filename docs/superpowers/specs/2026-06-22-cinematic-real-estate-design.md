# Cinematic Real Estate Website — Design Spec
*Date: 2026-06-22*

## Summary
Premium, cinematic, multi-page apartment-sales website for Mongolian real estate developers. Config-driven template re-skinned per client. Light theme, warm Japandi aesthetic, mobile-first (~90% phone users). Apple-page smooth, editorial, deliberately distinctive.

## Decisions Made

### Typography (locked)
- Display: Cormorant Garamond (300, 400) — editorial luxury, high contrast
- Body: Golos Text (400, 500) — designed for Cyrillic by Paratype; renders Mongolian Cyrillic (Ү, Ө) correctly
- Utility: Space Mono (400) — specs, prices, data tables
- All three: Google Fonts `cyrillic-ext` subset confirmed available

### Signature Visual Element (locked)
Oversized ghost section numbers in Cormorant Garamond 300, `rgba(42,39,36,0.04)`, `clamp(12rem, 28vw, 22rem)`, bleeding off the bottom-right of each section container. Architectural/editorial feel. Not on hero or tour section.

### Stitch Workflow (locked)
Approach C: write `design.md` → `upload_design_md` → `create_project` → `generate_screen_from_text` per screen → review/iterate. Shared components generated first, then screens in dependency order. Final handoff reference sheet produced after all screens are approved (not a generation step).

## Full Design System
See `docs/design.md` — canonical source of truth for all tokens, components, screen specs, states, accessibility rules, and Stitch workflow.

## Screens
1. Home (`/`) — hero, scroll-scrub tour, section previews, booking CTA
2. Residences (`/residences`) — unit type card grid
3. Residence Detail (`/residences/[typeId]`) — floor plan, gallery, features, available units
4. Availability (`/availability`) — filterable unit table
5. Location (`/location`) — map, amenities, neighborhood
6. About (`/about`) — developer story, values, track record
7. Contact (`/contact`) — booking form
8. Shared components — nav, footer, buttons, inputs, badges, cards, section wrapper

## Stack
Next.js App Router + TypeScript strict + Tailwind + Lenis + GSAP/ScrollTrigger + Vercel
