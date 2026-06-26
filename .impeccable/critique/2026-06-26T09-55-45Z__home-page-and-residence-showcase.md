---
target: home page and residence showcase
total_score: 31
p0_count: 2
p1_count: 1
timestamp: 2026-06-26T09-55-45Z
slug: home-page-and-residence-showcase
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2/4 | No loading/success/error feedback on contact form; scroll tour gives excellent progress cues |
| 2 | Match System / Real World | 4/4 | Mongolian copy throughout, familiar real-estate conventions, natural reading order |
| 3 | User Control and Freedom | 3/4 | Back breadcrumb on detail pages ✓, native browser back works; no undo on form |
| 4 | Consistency and Standards | 4/4 | Japandi token system applied uniformly, CTA pattern now consistent across types |
| 5 | Error Prevention | 3/4 | No destructive actions exist; CTA layout prevents misclicks; contact form has zero validation |
| 6 | Recognition Rather Than Recall | 4/4 | Labeled nav, labeled CTAs, price + size visible at a glance |
| 7 | Flexibility and Efficiency | 3/4 | Scroll scrub can't be skipped by repeat visitors; no keyboard shortcuts |
| 8 | Aesthetic and Minimalist Design | 4/4 | Strong Japandi hierarchy; minimal clutter; purposeful color use throughout |
| 9 | Error Recovery | 1/4 | Contact form: no field-level errors, no success confirmation, silent failure possible |
| 10 | Help and Documentation | 3/4 | CTAs are self-explanatory; price shown inline; no contextual FAQ or unit comparison |
| **Total** | | **31/40** | **Good — address weak areas, solid foundation** |

---

## Anti-Patterns Verdict

**LLM Assessment — CLEAR PASS.** This does not read as AI-generated. The Japandi palette is applied with restraint rather than defaulting to the "cream-and-serif" AI template. The scroll-scrub dollhouse reveal is a genuinely differentiated signature element. Typography pairs display (editorial headings) with utility (functional labels) correctly. The alternating left-right showcase grid avoids the identical-card-grid trap. No gradient text, no glassmorphism, no hero-metric template. The eyebrow kicker appears once in the residences intro — not reflexively on every section.

**Deterministic scan — 0 findings** in `app/` and `components/`. Eight findings were returned in an extended scan but all resolved to the detector's own source files (false positives from the tool scanning itself). The production codebase is clean against all detector rules.

**Browser overlays** — not injected in this run. No live overlay data to report.

---

## Overall Impression

The site's cinematic identity is strong and distinctive — a rare outcome for AI-assisted work. The critical weakness is entirely concentrated in one place: **the contact form has no states at all**. A prospect who fills out the form has no idea if their inquiry was received. On a real estate sales site, that silent failure kills the only conversion that matters. Fix the form, and this site is close to shippable.

---

## What's Working

**1. The scroll-scrub dollhouse reveal.** Pinned ScrollTrigger + clip-path expansion is technically clean and emotionally compelling. It answers "what does this apartment look like inside?" in a way no static image grid can. This is the feature that will close developers on the product.

**2. Typography and hierarchy.** The display/utility font pairing at `clamp()` scales reads confidently at every viewport. The ResidenceShowcase redesign — large editorial heading, blurb, numbered features, price, then two distinct CTAs — gives the eye a clear path and converts discovery intent into action intent.

**3. Config-driven architecture.** Five unit types, each independently configurable with their own dollhouse image, depth map, gallery, pricing, and features, with zero hardcoded values in any component. Swapping a client requires only `client.config.ts`. That's the right foundation.

---

## Priority Issues

**[P0] Contact form has no validation, no success state, no error handling**
- **Why it matters**: This is the primary conversion path — a prospect inquiring about a unit. If the form submits silently, fails silently, or accepts blank fields, the developer loses leads and the prospect feels ignored.
- **Fix**: Add inline field validation (name required, phone/email required + format check), a visible success state ("Таны хүсэлт хүлээн авлаа. Бид удахгүй холбоо барина."), and an error state if submission fails. Disable the submit button during in-flight request and re-enable on failure.
- **Suggested command**: `/impeccable harden`

**[P0] No skip-to-content link**
- **Why it matters**: Keyboard and screen-reader users tab through the entire nav on every page before reaching main content. WCAG 2.4.1 (Level A) requires a bypass mechanism. This is the only Level A failure in the codebase.
- **Fix**: Add `<a href="#main-content" className="sr-only focus:not-sr-only ...">Үндсэн агуулга руу орох</a>` as the first element in the root layout, and add `id="main-content"` to the `<main>` tag.
- **Suggested command**: `/impeccable audit`

**[P1] No 404 page, no empty states**
- **Why it matters**: A prospect who lands on a bad URL gets the Next.js default 404, which breaks brand trust. The availability page has no empty-state treatment when all units are sold/reserved.
- **Fix**: Add `app/not-found.tsx` with brand nav, Mongolian apology headline, and a link back to `/residences`. Add an empty-state component to the availability table.
- **Suggested command**: `/impeccable onboard`

**[P2] Kicker text at 10px violates accessible minimum**
- **Why it matters**: `ShowcaseSection.tsx` eyebrow at `fontSize: '10px'` is below the practical 11–12px accessibility minimum. At 200% browser zoom or in high-contrast mode, this becomes 0–1px.
- **Fix**: Floor all small utility text at `0.75rem` (12px). Sweep the project for `text-[10px]` and `fontSize: '10px'` instances.
- **Suggested command**: `/impeccable typeset`

**[P2] Attribution link contrast at ~2.6:1**
- **Why it matters**: CC BY attribution or footer link at `rgba(250,246,239,0.45)` on dark background ≈ 2.6:1 — below WCAG AA 4.5:1 for normal text.
- **Fix**: Raise to `rgba(255,255,255,0.55)` (≈4.7:1 on `#16140F`).
- **Suggested command**: `/impeccable audit`

---

## Persona Red Flags

**Jordan (First-Timer — apartment seeker, first purchase)**
Jordan navigates the hero, scrolls the dollhouse reveal, lands on residence types — the visual journey is clear. But clicking "Үзлэг захиалах" and filling the form collapses the experience. No field hints, no phone number format guidance, no submission confirmation. Jordan doesn't know if it worked. Sends it twice. Developer gets duplicates.

**Casey (Distracted Mobile User — 390px viewport, one-handed)**
ResidenceShowcase CTAs use `whiteSpace: nowrap` with no `flex-wrap` — at 320px (iPhone SE), buttons overflow the flex container. At 390px this is fine, but the 320px edge case remains. No thumb-zone CTA on the hero; scroll hint is visual-only with no tap target.

**Sam (Accessibility-Dependent — keyboard + screen reader)**
No skip-to-content link means tabbing through all nav on every page. The tour `<canvas>` has no `aria-label`. The 10px kicker is fine for screen readers but degrades at 200% zoom. ManifestoSection `opacity: 0` pre-animation is fine (DOM content present), but should verify GSAP hydration fires before screen reader announces visible completion.

---

## Minor Observations

- CTA mobile overflow: add `flex-wrap: wrap` to the `.flex.gap-3` container in ResidenceShowcase to prevent 320px overflow without affecting desktop.
- `prefers-reduced-motion` on pinned sections: verify the pinned DollhouseRevealSection degrades to a static block, not a non-scrolling full-height pin.
- Tour canvas: add `aria-label="Five Star Residence – тойрч харах видео дараалал"`.
- Dollhouse PNG weight: verify `/_next/image` responses for dollhouse assets don't exceed ~2MB apiece.
- `2br-large` name "2 өрөө том" in editorial heading: verify no line break at 45% column width on tablet breakpoint.

---

## Questions to Consider

- What if the contact form submitted via a server action that fired a Telegram/email notification immediately — would that alone close both P0s and remove the biggest conversion risk?
- The scroll scrub is the signature. What happens for repeat visitors who've already seen it? Could a "skip to residences" anchor on the hero serve returning prospects?
- The manifesto lines are strong copy. What if they appeared larger — a typographic moment, not a transitional fade?
