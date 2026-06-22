# Design System — Mongolian Apartment Demo
*Cinematic, scroll-driven, multi-page real estate website. Light theme, warm Japandi, mobile-first.*

---

## 1. Palette

| Token | Value | Usage |
|---|---|---|
| `--color-surface` | `#FAF6EF` | Page background |
| `--color-surface-raised` | `#EDE4D3` | Cards, panels, nav background |
| `--color-border` | `rgba(42,39,36,0.10)` | Dividers, input borders, nav bottom border |
| `--color-oak` | `#B8946A` | Primary CTA fill, price text, oak hairlines, focus rings |
| `--color-sage` | `#97A988` | Available status badge, secondary accent |
| `--color-text` | `#2A2724` | All headings and body text |
| `--color-muted` | `#6B655C` | Captions, secondary text, labels, scroll hint |
| `--color-on-oak` | `#FAF6EF` | Text rendered on oak-filled buttons |
| `--color-error` | `#C0574A` | Form field error border and error message text |
| `--color-number` | `rgba(42,39,36,0.04)` | Oversized ghost section numbers |

---

## 2. Typography

### Faces
- **Display:** Cormorant Garamond — weights 300, 400. Google Fonts `cyrillic-ext` subset.
- **Body:** Golos Text — weights 400, 500. Designed for Cyrillic by Paratype. Google Fonts `cyrillic-ext` subset. Renders Mongolian Cyrillic characters (Ү, Ө) correctly.
- **Utility:** Space Mono — weight 400. Google Fonts `cyrillic-ext` subset.

### Type Scale

| Token | Face | Weight | Mobile size | Desktop size | Line height | Usage |
|---|---|---|---|---|---|---|
| `--text-number` | Cormorant Garamond | 300 | `clamp(12rem, 28vw, 22rem)` | — | 1 | Ghost section numbers |
| `--text-hero` | Cormorant Garamond | 300 | 52px | 88px | 1.05 | Hero building name |
| `--text-h1` | Cormorant Garamond | 400 | 38px | 56px | 1.1 | Page titles |
| `--text-h2` | Cormorant Garamond | 400 | 28px | 40px | 1.2 | Section headings |
| `--text-h3` | Cormorant Garamond | 400 | 22px | 30px | 1.3 | Card headings |
| `--text-lead` | Golos Text | 400 | 18px | 20px | 1.6 | Intro paragraphs |
| `--text-body` | Golos Text | 400 | 16px | 16px | 1.7 | Body copy |
| `--text-sm` | Golos Text | 400 | 14px | 14px | 1.6 | Secondary text, captions |
| `--text-label` | Space Mono | 400 | 11px | 12px | 1.5 | Tags, unit specs, prices, data cells |

---

## 3. Spacing

Base-8 scale. Use these values only — no arbitrary pixel values.

`4px · 8px · 12px · 16px · 24px · 32px · 48px · 64px · 96px · 128px`

- Section vertical padding: `96px` mobile · `128px` desktop
- Content max-width: `1200px`
- Reading column max-width: `680px`
- Nav height: `64px`

---

## 4. Radius

Japandi principle: near-zero. Flat surfaces, no rounded softness on containers.

| Token | Value | Usage |
|---|---|---|
| `--radius-none` | `0px` | All image containers, table rows, flush panels |
| `--radius-sm` | `2px` | Status badges, tags |
| `--radius-md` | `4px` | Inputs, buttons, unit cards |
| `--radius-full` | `9999px` | Pill buttons only (nav CTA, booking CTAs) |

---

## 5. Shadows

Warm-tinted (charcoal base, not cool grey).

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 3px rgba(42,39,36,0.06)` | Default card lift, scrolled nav |
| `--shadow-md` | `0 4px 16px rgba(42,39,36,0.08)` | Card hover state |
| `--shadow-lg` | `0 16px 48px rgba(42,39,36,0.10)` | Hero elements, lightbox |

---

## 6. Signature Element — Section Numbers

Every named section on the site displays an oversized ghost numeral that bleeds off the bottom-right edge of its container.

- **Font:** Cormorant Garamond, weight 300
- **Color:** `var(--color-number)` — `rgba(42,39,36,0.04)` — pressure rather than presence
- **Size:** `clamp(12rem, 28vw, 22rem)` — fluid across breakpoints
- **Position:** `position: absolute; bottom: -0.2em; right: -0.05em`
- **Section container:** `position: relative; overflow: hidden`
- **Format:** Zero-padded two digits — `01`, `02`, `03`…
- **Exceptions:** The hero and the scroll-scrub tour section carry no section number. The tour is the cinematic signature; the number would compete with it.
- **Accessibility:** `aria-hidden="true"`, `pointer-events: none`, `user-select: none`

---

## 7. Shared Components

### 7.1 Navigation

- Sticky, `64px` height, `var(--color-surface)` bg
- Border: `1px solid var(--color-border)` on bottom edge only
- Default: no shadow
- Scrolled (>80px): `var(--shadow-sm)` added
- Left: building name, Cormorant Garamond 400, `--text-sm` size
- Right: ghost links in Golos Text sm + "Үзлэг захиалах" pill button (oak fill)
- Active page link: `2px solid var(--color-oak)` underline, not bold
- Mobile: hamburger icon (right) → full-screen overlay, `surface-raised` bg, links centered in Cormorant Garamond h2 size, fade-in `200ms`. Close on backdrop tap or ESC.

### 7.2 Footer

- Background: `var(--color-surface-raised)`
- Two columns on desktop (mobile: stacked, `gap: 48px`)
- Left column: building name (Cormorant Garamond h3) + tagline (Golos Text sm, muted)
- Right column: nav links (Golos Text sm) + contact details (Space Mono xs, muted)
- Bottom strip: `1px solid var(--color-border)` top, Space Mono xs muted — developer credit and legal text
- No radius anywhere in footer

### 7.3 Buttons

**Primary (oak fill)**
- Default: `var(--color-oak)` bg, `var(--color-on-oak)` text, `--radius-md`
- Hover: `#A07E5A` bg (10% darker oak), `--shadow-sm`
- Active: `#8D6D4C` bg, shadow removed
- Disabled: `rgba(42,39,36,0.20)` bg, muted text, `cursor: not-allowed`
- Loading: oak bg preserved, text replaced with 16px CSS spinner (cream, `border-radius: 50%`, `600ms linear infinite`)
- Focus-visible: `2px solid var(--color-oak)` outline, `2px offset`
- Min-height: `48px`. Min-width: `120px`.

**Ghost**
- Default: transparent bg, `1px solid rgba(42,39,36,0.20)`, charcoal text, `--radius-md`
- Hover: border `rgba(42,39,36,0.40)`
- Active: bg `rgba(42,39,36,0.06)`, border `rgba(42,39,36,0.40)`
- Disabled: same border at `rgba(42,39,36,0.20)`, muted text, `cursor: not-allowed`
- Loading: ghost bg preserved, spinner in charcoal
- Focus-visible: `2px solid var(--color-oak)` outline, `2px offset`

**Pill variant:** `--radius-full`, otherwise identical to Primary. Used only in nav CTA and final booking CTAs.

### 7.4 Form Inputs

- Background: `var(--color-surface-raised)`
- Border: `1px solid var(--color-border)`, `--radius-md`
- Font: Golos Text body (`16px`)
- Min-height: `48px` (textarea excepted)
- Label: static, always above the field, never floating. Golos Text sm, `var(--color-muted)`, `margin-bottom: 6px`.

| State | Treatment |
|---|---|
| Default | `surface-raised` bg, `1px solid var(--color-border)` |
| Focus | Border becomes `1px solid var(--color-oak)`. No shadow, no glow. Label does not move. |
| Error | Border `1px solid var(--color-error)`. Error message below field in Space Mono xs, `var(--color-error)`. |
| Disabled | `opacity: 0.50`, `cursor: not-allowed` |
| Filled/valid | Returns to default border — no green confirmation state |

Textarea (нэмэлт мэдэгдэл): same styles, `4` rows minimum, `resize: vertical` only.

### 7.5 Status Badges

Space Mono xs, `--radius-sm`, inline-flex, `padding: 2px 8px`.

| Status | Mongolian | Text color | Border |
|---|---|---|---|
| Available | Боломжтой | `var(--color-sage)` | `1px solid var(--color-sage)` |
| Reserved | Захиалагдсан | `var(--color-muted)` | `1px solid rgba(42,39,36,0.20)` |
| Sold | Зарагдсан | `rgba(42,39,36,0.40)` | No badge — strikethrough on price instead |

### 7.6 Filter Pills

`--radius-full`, Golos Text sm, `padding: 8px 16px`.

| State | Treatment |
|---|---|
| Inactive | Transparent bg, `1px solid rgba(42,39,36,0.20)`, charcoal text |
| Inactive hover | Border `rgba(42,39,36,0.40)`, transition `150ms ease` |
| Active | `surface-raised` bg, `1px solid rgba(42,39,36,0.40)`, Golos Text sm medium |
| Focus-visible | `2px solid var(--color-oak)` outline, `2px offset` |

Multiple pills may be active simultaneously (type filter and status filter are independent groups).

### 7.7 Unit Type Card

- Background: `var(--color-surface-raised)`, `--radius-md`, `--shadow-sm`
- Image: top, `aspect-ratio: 16/9`, `object-fit: cover`, `--radius-none`
- Card body padding: `24px`
- Type name: Cormorant Garamond h3
- Room count: Golos Text sm, muted
- Size range + price-from: Space Mono xs, `var(--color-oak)`
- Link: "Дэлгэрэнгүй →" Ghost text link, Golos Text sm
- Hover: `--shadow-md`, `transform: translateY(-2px)`, transition `200ms ease`
- Focus-visible: `2px solid var(--color-oak)` outline

### 7.8 Section Wrapper

Every named content section uses this container pattern:

```
position: relative
overflow: hidden
padding-block: var(--section-padding)  /* 96px mobile / 128px desktop */
```

The ghost section number is a direct child:

```
position: absolute
bottom: -0.2em
right: -0.05em
font: Cormorant Garamond 300
font-size: clamp(12rem, 28vw, 22rem)
color: var(--color-number)
line-height: 1
pointer-events: none
user-select: none
aria-hidden: true
```

---

## 8. Screen Specs

### 8.1 Home (`/`)

**Hero**
Full-bleed building exterior photograph. Cream-tinted overlay (not dark — preserves light theme).
Building name: `--text-hero`, Cormorant Garamond 300, `var(--color-text)`, centered or left-aligned.
Tagline: `--text-lead`, Golos Text 400, `var(--color-muted)`.
CTA: "Аялалд орох" pill button, oak fill.
No section number on hero.

**Scroll-Scrub Tour**
Pinned `<canvas>` section driven by Lenis + GSAP ScrollTrigger. Pin duration: 200–300vh.
Frame loading: preload all frames before pin engages. Loading indicator: `1px solid var(--color-oak)` progress bar, full width, top edge of canvas container, grows `0%` → `100%`, removed from DOM on completion.
Scroll hint: "Гүйлгэж үзнэ үү ↓", Space Mono xs, `var(--color-muted)`, centered below canvas. Fades to `opacity: 0` after first 10% of pin progress.
`prefers-reduced-motion`: skip canvas and pin. Render a static 3-up grid of three key frames (first, middle, last), `aspect-ratio: 16/9`, `object-fit: cover`, `--radius-none`. Cormorant Garamond caption below. No animation.
No section number on tour section.

**Residences Preview** — section `01`
Heading "Орон сууц" (h2) + one-line blurb (lead, muted).
Unit type card grid: 1 col mobile / 2 col desktop.
"Бүгдийг харах →" ghost text link below grid.

**Availability Teaser** — section `02`
3-row preview of available units. Same columns as Availability page table (floor, type, size, price, status). Space Mono xs data.
"Бүтэн жагсаалт →" ghost text link.

**Location Teaser** — section `03`
Split layout: copy + 3 neighborhood highlights (Space Mono xs label + Golos Text sm) left column; map thumbnail right column. Mobile: stacked.

**Developer Teaser** — section `04`
Developer logo + 2-sentence blurb (Golos Text body). "Бидний тухай →" ghost text link.

**Booking CTA** — section `05`
Full-width section, `surface` bg, centered. Cormorant Garamond h2 heading + oak pill button "Үзлэг захиалах".

**Footer**

---

### 8.2 Residences (`/residences`)

Section number `01`.
Page title "Орон сууц" (h1) + one-line intro (lead, muted). Max-width reading column.
Unit type card grid: 1 col mobile / 2 col desktop. Cards per 7.7.

---

### 8.3 Residence Detail (`/residences/[typeId]`)

**Header**
Type name (h1). "Who it's for" line: one sentence, Golos Text lead, muted.
Specs row: Space Mono xs, oak — хэмжээ (m²) · өрөөний тоо · үнэ эхлэх (₮).

**Floor Plan** — section `01`
Full-width flush image, `--radius-none`. Tap/click to open lightbox (full-screen, `surface` bg, close on backdrop tap or ESC).
Caption: Space Mono xs, muted, below image.

**Gallery** — section `02`
Mobile: horizontal scroll, `scroll-snap-type: x mandatory`, images `min-width: 80vw`, `aspect-ratio: 4/3`, `object-fit: cover`, `--radius-none`, `gap: 16px`.
Desktop: 2-col CSS grid, `gap: 16px`, `aspect-ratio: 4/3`.
Tap/click: full-screen lightbox with previous/next (swipe mobile, arrow keys desktop). Close on backdrop or ESC.

**Features** — section `03`
2-col grid (mobile: 1 col). Each item: oak `·` prefix, Golos Text body.

**Available Units** — section `04`
Table columns: давхар · хэмжээ (m²) · чиглэл · үнэ (₮) · статус.
Headers: Golos Text sm. Data: Space Mono xs. Status: badge per 7.5.
Mobile: one card per unit, same fields stacked, status badge top-right.
Empty state: Golos Text sm muted "Боломжтой орон сууц байхгүй байна." Booking CTA remains visible.

**Booking CTA**
"Үзлэг захиалах" oak pill button, full-width mobile, centered desktop. Links to `/contact?type=[typeId]`.

---

### 8.4 Availability (`/availability`)

Section number `01`.
Page title "Боломжтой орон сууц" (h1).

Filter strip: two pill groups (per 7.6).
- Group 1 — Type: Бүгд · Студи · 1 өрөө · 2 өрөө · 3 өрөө
- Group 2 — Status: Бүгд · Боломжтой · Захиалагдсан · Зарагдсан

Desktop table columns: давхар · төрөл · хэмжээ (m²) · чиглэл · үнэ (₮) · статус.
Headers: Golos Text sm. Data cells: Space Mono xs. Row hover: `background: rgba(42,39,36,0.03)`.
Sold rows: text `rgba(42,39,36,0.40)`, price strikethrough, no badge.

Mobile: card per unit, six fields stacked. Status badge top-right of card.

Empty state (all filtered out): Cormorant Garamond h3 "Тохирох орон сууц олдсонгүй" centered + Golos Text sm suggestion to clear filters. No illustration.

---

### 8.5 Location (`/location`)

**Map**
Full-width, flush, `--radius-none`. Static image or embedded iframe. No section number.

**Amenities** — section `01`
2-col grid mobile, 4-col desktop, `gap: 24px`.
Each item: Space Mono xs label (category + distance), Golos Text sm description below.

**Neighborhood** — section `02`
Cormorant Garamond h2 heading + Golos Text lead paragraph. Max-width reading column (680px).

---

### 8.6 About (`/about`)

**Developer Intro**
h1 heading + Golos Text lead paragraph + full-bleed developer/project image below. `--radius-none`. No section number.

**Story** — section `01`
2-col split: image left, text (h2 + body) right. Mobile: stacked, image first.

**Values** — section `02`
3-item row (mobile: stacked). Each: Space Mono xs label (all-caps) + Golos Text body.

**Track Record** — section `03`
Key stats. Each stat: Cormorant Garamond 300, `--text-h1` size + Space Mono xs label below (e.g., `12` / дууссан төслүүд). 3-col desktop, stacked mobile.

---

### 8.7 Contact (`/contact`)

Section number `01`.
Page title "Үзлэг захиалах" (h1) + Golos Text lead.

Form fields (per 7.4):
- Нэр — text input
- Утасны дугаар — tel input
- Орон сууцны төрөл — select, options populated from unit types
- Нэмэлт мэдэгдэл — textarea, optional, 4 rows minimum, `resize: vertical`

Submit: "Илгээх" oak pill button. Full-width mobile, right-aligned desktop.

Form submission failure: inline banner above submit button — `surface-raised` bg, `1px solid var(--color-border)`, Space Mono xs error text. No red background on the banner itself.

Below form: building address · phone · email, each on own line, Space Mono xs, `var(--color-muted)`.

---

## 9. Interaction & States

### Page Transitions
Route change: outgoing page `opacity: 0` over `150ms`, incoming page `opacity: 0 → 1` over `200ms`. No slides, no scale transforms.
Scroll-to-section anchors: Lenis smooth scroll, `duration: 0.8`, default easing.
`prefers-reduced-motion`: all transitions become instant (`duration: 0`).

### Loading States
Data-dependent sections (availability table, unit cards): static skeleton blocks at correct dimensions, `surface-raised` bg, `opacity: 0.50`. No shimmer animation.
Image lazy-load: `next/image` with `blurDataURL`, base color `#EDE4D3`.
Tour code: dynamic import, code-split. Page is interactive before tour bundle loads.

### Error States
Data load failure: inline section-level banner — `surface-raised` bg, `1px solid var(--color-border)`, Space Mono xs error text, one oak retry link.
Form submission failure: same inline banner style above submit button.

---

## 10. Accessibility & Motion

### `prefers-reduced-motion`
- Tour: replace canvas + pin with static 3-up key-frame grid. Zero animation.
- Page transitions: `duration: 0` — instant.
- Card hover transforms (`translateY`): disabled.
- Loading spinner: replaced with static "Ачаалж байна…" text in Space Mono xs.

### Focus-Visible
All interactive elements expose `2px solid var(--color-oak)` outline with `2px offset`. Never suppressed with `outline: none` without a replacement. Applies globally via `:focus-visible`.

### Alt Text
- Building hero: describe the building and setting (not "hero image").
- Unit type renders: describe the room and key features.
- Floor plans: describe layout and room count.
- Tour key frames (reduced-motion stills): describe what is shown in the frame.
- Developer/team photos: describe the people and context.
- Decorative dividers or background textures: `alt=""`, `aria-hidden="true"`.

### Semantic HTML
- One `<h1>` per page.
- Section numbers: `<span aria-hidden="true">` inside the section wrapper, not heading elements.
- Availability table: `<table>` with `<thead>`, `<tbody>`, `<th scope="col">`. Mobile card fallback hides the table and shows card list via CSS — both are in the DOM, table gets `display: none` below breakpoint.
- Status badges: `<span>` with visible text label — not icon-only.
- Nav mobile overlay: traps focus while open. ESC closes. `aria-expanded` on hamburger button.
- Form: each input has an associated `<label>`. Required fields marked with `aria-required="true"`.

---

## 11. Stitch Generation Workflow

### Order
1. **Shared components** — nav, footer, buttons (primary, ghost, pill), form inputs (all states), status badges, filter pills, unit type card, section wrapper with ghost number
2. Home (`/`)
3. Residences (`/residences`)
4. Residence Detail (`/residences/[typeId]`)
5. Availability (`/availability`)
6. Contact (`/contact`)
7. Location (`/location`)
8. About (`/about`)

### After all screens: Handoff Reference Sheet
A single annotated view of all component variants — not a generation step. For developer reference: all button states, all input states, badge variants, filter pill states, card default/hover, section number example. Produced last, after all screens are reviewed and approved.

### Tools used
- `upload_design_md` — upload this document as the design context
- `create_project` — one project per client slug
- `generate_screen_from_text` — one call per screen, referencing the design context
- `get_screen` / `list_screens` — review output
- `edit_screens` — iterate where needed
