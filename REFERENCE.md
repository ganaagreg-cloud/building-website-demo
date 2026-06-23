# REFERENCE.md — Home Page Build Spec (Five Star Residence Demo)

> Purpose: Build the **Home page** as a cinematic, scroll-driven journey whose STRUCTURE
> is adapted from climanovaquebec.com, but with OUR palette, OUR motion polish, and
> Five Star Residence content. This is the developer's "sales weapon" — the page the
> cold-outreach link opens to.
>
> Scope: **Home page only.** The functional pages (Residences, Residence detail,
> Availability, Location, About, Contact) are separate, governed by `production-ui-design`,
> and are NOT part of this file. Do not build them here.
>
> We are adapting structure and interaction patterns, NOT copying ClimaNova's copy,
> code, colors, or assets. Everything below is re-skinned to our system.

---

## PALETTE TOKENS (authoritative — override any skill's default colors)

```css
:root {
  --bg-light:    #FAFAF8;  /* clean warm near-white — main background */
  --bg-pure:     #FFFFFF;  /* pure white — cards, lifted surfaces */
  --text:        #1C1A17;  /* warm near-black — headlines */
  --text-soft:   #6B6457;  /* warm gray — body copy */
  --bg-dark:     #2A241E;  /* warm espresso — dark sections (NOT navy) */
  --bg-dark-2:   #3A332B;  /* lifted dark — dark-section cards/lines */
  --accent:      #7C8B6F;  /* sage — primary accent, active states */
  --accent-warm: #B8A687;  /* oak/clay — secondary accent */
  --line:        #ECEAE4;  /* hairline borders on light */
  --line-dark:   #4A4239;  /* hairline borders on dark */
}
```

Rules:
- Light sections dominate. Use `--bg-light` as the page base; lift cards onto `--bg-pure`
  with a hairline `--line` border + a whisper shadow `0 2px 12px rgba(28,26,23,0.05)`.
- Dark sections are WARM espresso `--bg-dark`, never cold navy/teal.
- Primary accent is `--accent` (sage). Secondary is `--accent-warm` (oak).
  ClimaNova's teal/lime are BANNED.
- Contrast is the premium signal: clean whites against warm espresso darks.
  Do not make everything mid-tone gray — that reads cheap.

## TYPOGRAPHY

- Display/headlines: a clean grotesk (e.g. "Neue Haas Grotesk", "Inter Tight", or system
  grotesk fallback). Large, tight tracking, weight 600–700.
- Body: same family, weight 400, `--text-soft`.
- No serif. We are deliberately avoiding the generic AI cream-serif look.

## MOTION STACK (already in our locked stack)

- Lenis (smooth scroll) + GSAP 3.x + ScrollTrigger.
- Apple-product-video smoothness: long ease, no bounce, no snappy springs.
  Default ease `power2.out`, scroll-driven sections use `scrub: true`.
- Respect `prefers-reduced-motion`: disable scrubbed/parallax motion, keep content visible.

---

## SECTION MAP (ClimaNova → Five Star Home)

Build each section as a self-contained, config-toggled component. The Home page renders
an ORDERED LIST of enabled sections from config — so per future client we enable only the
sections their assets support. For THIS demo, the `enabled` flags below are the v1 set.

Config shape (conceptual — implement in our config layer, not hardcoded in JSX):
```ts
type HomeSection =
  | { kind: "hero"; enabled: boolean; ... }
  | { kind: "scrollVideo"; enabled: boolean; ... }
  | { kind: "manifesto"; enabled: boolean; ... }
  | ...
HomeConfig = { sections: HomeSection[] }
```

| # | Section | kind | v1 enabled? | Five Star content | Asset |
|---|---------|------|-------------|-------------------|-------|
| 1 | Hero | `hero` | ✅ | Flagship building isometric render, white headline over it | HAVE |
| 2 | Scroll-scrubbed video | `scrollVideo` | ❌ **STUB** | THE signature tour | NEEDS CLIP — build component, toggle OFF for v1 |
| 3 | Dark manifesto (text) | `manifesto` | ✅ | Brand story on warm-espresso bg | text only |
| 4 | Dollhouse interior reveal | `dollhouseReveal` | ✅ | Sliced-open dollhouse render, color-break moment | HAVE (strongest asset) |
| 5 | Full-bleed interior photos | `interiorPhoto` | ❌ off | — | NO interior photos yet |
| 6 | Process steps / image swap | `featureSteps` | ✅ | Building finishes & amenities, step-by-step | HAVE (dollhouse/detail renders) |
| 7 | Scarcity split story | `scarcitySplit` | ✅ | "This unit is still available" + render | HAVE |
| 8 | Unit type cards | `unitCards` | ✅ | **Studio / 1BR / 2BR cards — link into Residences** | HAVE (floor plans) |
| 9 | Dark stats | `stats` | ✅ | Location / delivery date / units sold | text only |
| 10 | Hero repeat + CTA | `heroCta` | ✅ | Second render + two CTAs | HAVE |
| 11 | Ticker / marquee | `ticker` | ✅ | Looping Mongolian phrase | text only |
| 12 | House + benefit list | `benefitList` | ✅ | Render + 3 benefit headings | HAVE |
| 13 | Off-plan feature | `offPlanFeature` | ❌ off | — | asset-dependent |
| 14 | Buying journey / process | `journey` | ✅ | Consultation → Selection → Handover | text + render |
| 15 | FAQ + pre-footer CTA | `faq` | ✅ | FAQ + "Book a viewing" link | text only |
| — | Footer | `footer` | ✅ | 5-col nav + logo + legal | text + decorative render |

### Section 2 stub requirement
Build the `scrollVideo` component fully (the GSAP-scrubbed `video.currentTime` mechanism),
but gate it behind `enabled: false` so it does not render in v1. When the clip is ready
later, we drop the file in and flip the flag — zero other changes. Leave a clear
`// TODO: scroll-video clip pending — see REFERENCE.md §2` marker.

---

## CLIENT-FACING COPY (Mongolian — Five Star)

All visible site copy is Mongolian. Placeholder copy below; refine before client send.

- **Hero headline:** "Таны мөрөөдлийн орон сууц"
- **Hero sub:** "Доош гүйлгээд төслийг бүрэн мэдрээрэй"
- **Manifesto:** "Архитектур амьдралтай уулзах цэг." / "Өрөө бүр тань зориулагдсан." / "Таны гэр энд эхэлнэ."
- **Scarcity split:** "Энэ айл одоогоор зарагдаагүй байна." + CTA "Захиалга өгөх"
- **Unit cards section header:** "Танд тохирох айлаа сонгоно уу"
- **Ticker words:** "Нарийвчлалтай" · "бүтээсэн" · "таны" · "амьдралд" · "зориулсан" · "орон" · "сууц"
- **Journey steps:** "1. Зөвлөгөө" · "2. Айл сонголт" · "3. Худалдан авалт ба хүлээлгэн өгөх"
- **Pre-footer CTA:** "Үзлэг захиалах"

(English equivalents are for your reference only — do not render English on the site.)

---

## ARCHITECTURE GUARDRAILS (non-negotiable)

- Each section = its own component under `components/home/sections/`. No god-component.
- Section order + enabled flags come from CONFIG, not hardcoded JSX ordering.
- All Five Star assets (renders) referenced via the asset config, not hardcoded `src`
  strings scattered in components — one place to swap per client.
- Unit cards (§8) link to the real `/residences` and `/residences/[type]` routes —
  this is the bridge from the cinematic hook into the lead-capture funnel. Do not
  make the cards dead decoration.
- TypeScript strict. No `any`. Mobile-first — test the scroll mechanics on a narrow
  viewport; most apartment seekers are on phones.
- `prefers-reduced-motion` honored everywhere motion exists.