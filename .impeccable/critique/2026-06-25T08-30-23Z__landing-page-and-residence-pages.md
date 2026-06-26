---
timestamp: 2026-06-25T08-30-23Z
slug: landing-page-and-residence-pages
---
## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3/4 | Manifesto FOUC — lines hidden by JS can flash visible before hydration |
| 2 | Performance | 3/4 | 4 ResidenceShowcase images load eagerly with no `loading="lazy"` |
| 3 | Theming | 2/4 | Dual token system + old cream rgba(250,246,239) still in CTAPair |
| 4 | Responsive Design | 3/4 | Alternation fixed; small text links lack 44px touch targets |
| 5 | Anti-Patterns | 3/4 | Detector clean; pill buttons (CTAPair) are mild tell; dark sections vs white narrative |
| **Total** | | **14/20** | **Good — address theming inconsistency before pitching** |

## Anti-Patterns Verdict

**LLM assessment**: No major AI slop. The typography pairing (Cormorant + Golos Text + Space Mono) is intentional and distinctive. Ken Burns hero, word-mask reveal, scroll-scrub manifesto — these are all hand-crafted signature moves that scream "not a template." The one genuine tell is CTAPair's `borderRadius: 9999px` pill buttons, which sit at odds with every other element that uses 0 or 2px radius. Secondary concern: dark sections (Manifesto, StatsBand) create a tone that clashes with the "white is premium" direction established in the palette refactor.

**Deterministic scan**: Returned `[]` — zero flagged patterns. Clean.

## Priority Issues

### [P1] Dual token system — two sources of truth
- **Location**: `app/globals.css` — both `@theme {}` and `:root {}` define overlapping concepts
- **Category**: Theming
- **Impact**: `--color-text` (Tailwind token) and `--text` (CSS var) are both `#111111` but managed separately. `--bg-dark` (`#1A1A1A`) has no `@theme` counterpart, so some components use it directly while others can't. A future palette swap requires updating two blocks.
- **Recommendation**: Consolidate. Move all `:root` vars that have a `@theme` equivalent into `@theme`, keep only the rgba-computed ones in `:root`. Add `--color-bg-dark` to `@theme` and replace `--bg-dark`.
- **Suggested command**: /impeccable harden

### [P1] Old cream rgba still in CTAPair dark-theme outline
- **Location**: `components/kit/CTAPair.tsx:21` — `rgba(250,246,239,0.3)` is the pre-refactor warm cream
- **Category**: Theming
- **Impact**: Dark-theme outline buttons (used in FinalCta, DetailHeader if ever called with dark) show a warm-cream border instead of the new neutral white. Visual artifact of the palette migration.
- **Recommendation**: Change to `rgba(255,255,255,0.3)` to match the new white-premium system.
- **Suggested command**: /impeccable colorize

### [P1] ManifestoSection FOUC — text hidden by JS before hydration
- **Location**: `components/home/sections/ManifestoSection.tsx:25` — `gsap.set(lines, { opacity: 0, y: 40 })` runs in useEffect
- **Category**: Accessibility / Performance
- **Impact**: On slow connections or before React hydrates, manifesto lines render at full opacity, then snap to invisible as the effect fires, then animate back in. Users see a jarring flash. Also fails progressive enhancement — no-JS users see nothing (all lines opacity:0 set synchronously in effect, but effect doesn't fire without JS).
- **Recommendation**: Add `style={{ opacity: 0 }}` to each `<p>` in JSX so lines are hidden from first render, regardless of JS timing.
- **Suggested command**: /impeccable harden

### [P1] ResidenceShowcase — 4 below-fold images eager-loaded
- **Location**: `components/kit/ResidenceShowcase.tsx` — `<Image>` has no `loading` prop (defaults eager)
- **Category**: Performance
- **Impact**: All 4 unit type photos load immediately on page load. On mobile (~90% of users), these are all below the fold. Wastes data, delays LCP of the above-fold hero.
- **Recommendation**: Add `loading="lazy"` to the ResidenceShowcase Image.
- **Suggested command**: /impeccable optimize

### [P2] HeroSection gradient uses old warm-tinted rgba
- **Location**: `components/home/sections/HeroSection.tsx:81` — `rgba(42,36,30,X)` is warm brown (old charcoal `#2A2724`)
- **Category**: Theming
- **Impact**: The hero gradient has a warm brown tint inherited from the old cream palette. Against the new white-premium neutral system, the hero darkens to warm brown at the bottom rather than clean black, creating a subtle muddy cast.
- **Recommendation**: Replace `rgba(42,36,30,X)` with `rgba(0,0,0,X)` throughout the gradient for a neutral premium black.
- **Suggested command**: /impeccable colorize

### [P2] No back navigation on detail pages
- **Location**: `app/residences/[typeId]/page.tsx` — no breadcrumb or back link
- **Category**: User Control
- **Impact**: From `/residences/studio`, the only way back to the types list is opening the full-screen nav overlay — 2 taps for a task that should be 1. Mobile users who tap "Дэлгэрэнгүй →" have no obvious escape route.
- **Recommendation**: Add a single text breadcrumb above the hero: `← Орон сууцнууд` linking to `/residences`.
- **Suggested command**: /impeccable layout

### [P2] ResidenceShowcase text links lack 44px touch target
- **Location**: `components/kit/ResidenceShowcase.tsx:107,114` — "Дэлгэрэнгүй →" and "Үзлэг захиалах" are plain `<a>` tags with text-sm and no padding
- **Category**: Responsive / Accessibility
- **Impact**: These are the primary CTAs inside the showcase — the most common interaction. On mobile, they're likely under 30px tall. Easy to miss or mis-tap.
- **Recommendation**: Add `py-2 px-1` (or `minHeight: '44px'` + `display: flex; alignItems: center`) to each link.
- **Suggested command**: /impeccable harden

### [P2] HeroSection alt text hardcodes non-config value
- **Location**: `components/home/sections/HeroSection.tsx:67` — `alt="Five Star Residence барилга"`
- **Category**: Accessibility / Architecture
- **Impact**: Violates config-driven principle. Also: "Five Star Residence" is the demo name but won't match if this template is re-skinned for another client.
- **Recommendation**: Change to `` alt={`${clientConfig.buildingName} барилга`} `` — import `clientConfig`.
- **Suggested command**: /impeccable harden

### [P3] FeatureStepsSection uses off-palette accent colors
- **Location**: `components/home/sections/FeatureStepsSection.tsx:104,136` — `var(--accent)` (#7C8B6F) and `var(--accent-warm)` (#B8A687) not present in `@theme`
- **Category**: Theming
- **Impact**: The "Барилгын онцлог" label and large step index numbers use colors from the old sage/warm-beige system. These are different values from `--color-sage` (#97A988) in `@theme`. Creates a subtle colour drift.
- **Recommendation**: Either add these to `@theme` as named tokens or replace with `var(--color-oak)` and `var(--color-muted)`.
- **Suggested command**: /impeccable colorize

### [P3] CTAPair pill radius inconsistent with site aesthetic
- **Location**: `components/kit/CTAPair.tsx:33` — `borderRadius: '9999px'`
- **Category**: Anti-Patterns
- **Impact**: Every other interactive/card element uses 0 or 2px radius. The pill buttons are the one generic AI tell on an otherwise distinctive site.
- **Recommendation**: Reduce to `borderRadius: '2px'` (matches `--radius-sm`) for a sharper, more distinctive, Japandi-aligned button.
- **Suggested command**: /impeccable shape

## Patterns & Systemic Issues

- **Two-palette migration is 80% complete**: Most components use the new white tokens but `HeroSection`, `FeatureStepsSection`, and `CTAPair` still carry old warm-palette values. One focused colorize pass would finish the job.
- **Touch targets are inconsistently sized**: CTAPair at 48px is correct; ResidenceShowcase text links are too small; DetailHeader anchor links have no padding. A single harden pass on all interactive elements would resolve this systemically.

## Positive Findings

1. **Detector returns zero findings** — The codebase is clean of AI slop patterns. No gradient text, no glassmorphism, no hero metrics cards, no generic card grids. The site genuinely does not look AI-generated.
2. **Motion system is excellent** — `prefers-reduced-motion` is respected throughout (HeroSection, ManifestoSection, FeatureStepsSection, NavOverlay). `willChange: 'transform'` on the Ken Burns layer. GSAP timelines are properly killed on unmount.
3. **Global focus indicator is well-designed** — 2px oak outline, 2px offset, single declaration in `globals.css`. Every focusable element inherits it correctly.
4. **Config-driven architecture is solid** — Section composition, all copy, all unit data — none of it is hardcoded (except the one alt text issue above). Adding a new client means editing one file.
