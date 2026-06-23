# CLAUDE.md

Guidance for Claude Code on this repo. Read this before any task.

## Project
Cinematic, scroll-driven, **multi-page** apartment-sales website for Mongolian real estate developers. One reusable, **config-driven** template, re-skinned per client. (Same engine later extends to resort / амралтын газар sites — keep everything generic, not apartment-only.)

## Stack
- Next.js (App Router) + TypeScript (**strict**)
- Tailwind CSS
- **Lenis** (smooth scroll) + **GSAP + ScrollTrigger** (scroll mechanics)
- Vercel (hosting)

## Commands
- `npm run dev` — local dev
- `npm run build` — production build
- `npm run lint` — lint
*(Update to match package.json once scaffolded.)*

## Architecture — non-negotiable
- **Config-driven. NO hardcoded client data anywhere.** Building name, logo, theme, copy, contact, assets, units — all live in `client.config.ts` (typed via `ClientConfig`).
- **Two data layers:** `unitTypes` (distinct layouts — id, name, rooms, sizeRange, priceFrom, floorPlanImage, gallery, features, blurb, optional `tour`) and `units` (individual apartments — id, typeId, floor, sizeM2, orientation, price, status). One type → many units.
- **Data adapter** in `/lib/data` exposes `getUnitTypes()`, `getUnits()`, `getUnitsByType(typeId)`. Source switches via `DATA_SOURCE` env (`config | sheet | airtable | supabase`) **without changing any page**. Pages must NEVER read the config or a data source directly — always go through the adapter.
- **Components:** one section per component; pages compose sections. Shared: nav, footer, buttons, cards, form inputs, section wrapper.
- **Routing (multi-page):** `/`, `/residences`, `/residences/[typeId]`, `/availability`, `/location`, `/about`, `/contact`, `/admin` (Premium only).

## Design
- **Source of truth = Stitch (connected via MCP).** Use the Stitch MCP to generate/fetch the approved design, and derive design tokens (palette, type pairing, type scale, spacing, radius, shadow) from it. **Do NOT invent the visual design** — implement what Stitch defines.
- **21st.dev MCP — icons + reference only, never the aesthetic driver.** Use its free Icon Search for clean SVG logos/icons. Its free Inspiration Search may be used as reference for *standard* components (nav, cards, tables, forms, footer) — but every result MUST be restyled to our Japandi tokens before use; never ship its default look as-is. Do **not** use the paid Magic Generate tier — it produces generic, shadcn-flavored output that works against our "distinctive, not templated" requirement. 21st.dev never touches the signature scroll-scrub tour — that stays hand-built with GSAP/Lenis per the rules below.
- Implement with the **production-ui-design** skill (UX: states, spacing, touch targets, hierarchy) and the **frontend-design** skill (distinctive aesthetic, deliberate type pairing, a clear signature element).
- **Aesthetic:** warm Japandi — cream `#FAF6EF`, beige `#EDE4D3`, oak `#B8946A`, sage `#97A988`, charcoal `#2A2724`, muted `#6B655C`. Light theme, Apple-page smooth. Distinctive — avoid the generic AI cream-serif default.
- **Signature = the scroll-scrub cinematic tour.** A pinned ScrollTrigger section synced to Lenis; scroll position maps to the frame index of an ordered image sequence drawn to a `<canvas>` (continuous camera motion). It is **never** a click-next slideshow/carousel.

## Quality floor — every screen
- **Mobile-first** (~90% of users on phones). Verify mobile before desktop.
- **Loading + empty + error states** on every screen. No dead ends.
- **Accessibility:** visible keyboard focus, alt text, semantic HTML, respect `prefers-reduced-motion` (skip the scrub; show key stills).
- **Performance:** `next/image`, lazy-load below-the-fold + galleries, code-split heavy tour code; target 60fps scroll and mobile Lighthouse 90+.
- TypeScript strict, no `any`, clean and modular.

## Assets
- Per client: `/public/assets/[client-slug]/` → `logo`, `hero/`, `tour/`, `types/[type]/` (floorplan + gallery), `location/`.
- **Tour frames: consistent aspect ratio + numbered in walk order** (`01-`, `02-`…). Scroll maps to order — wrong order = broken scrub.

## Workflow
- Build **one phase at a time** (see the Build Prompts doc). Finish, summarize what you built + how to verify, then **STOP and wait for confirmation** before the next phase.
- Do not relitigate the locked decisions below.
- Don't over-build: the Supabase admin dashboard is **Premium-only** — build it only when a client pays.

## Locked decisions (don't re-propose alternatives)
- One shared cinematic tour per client (shared finish/feel). Per-type tours = optional paid upsell via `unitType.tour`.
- Every type always gets its own floor plan + gallery.
- The tour is a scroll-scrub frame sequence, never a slideshow.
- Data: `config` default (demo needs no backend) → sheet/Airtable → Supabase, all behind the adapter.
- Serve **both** audiences: the developer (leads, control, premium brand) and apartment seekers (feel the space, find their unit, book easily).

## Never
- Hardcode client-specific data outside `ClientConfig`.
- Read config or data sources directly in pages — use the adapter.
- Use `localStorage` / `sessionStorage`.
- Expose secrets (Telegram/email/API keys) to the client — server routes/actions only.
- Build a click-next carousel for the tour.
## Skill scoping (design authority)
- **Home page (cinematic journey):** use `design-taste-frontend-v1` as the aesthetic
  driver — high motion, high layout variance, anti-generic. This page is the sales weapon.
- **All other pages (Residences, Residence detail, Availability, Location, About, Contact):**
  use `production-ui-design` as the authority — consistent, conversion-focused, predictable.
  Do NOT apply taste-skill's high-variance rules here.
- Both pages obey the palette tokens in REFERENCE.md. Tokens override any skill's default colors.