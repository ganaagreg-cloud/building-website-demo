# DECISIONS.md

Locked decisions for this project, with the reasoning. Don't relitigate these unless something material changes. (Mirror the short version in CLAUDE.md and the chat Project Context.)

Status legend: ✅ Accepted

---

### 1. Productized, config-driven template ✅
**Decision:** One Next.js codebase, re-skinned per client via `ClientConfig` + an asset folder. No per-client forks.
**Why:** A new client must be hours of work, not a rebuild. This is the whole business model — speed of replication.

### 2. The tour is a scroll-scrub, never a slideshow ✅
**Decision:** The cinematic tour is a pinned ScrollTrigger section synced to Lenis, where scroll position maps to the frame index of an ordered image sequence (continuous camera motion).
**Why:** A click-next carousel is trivial — anyone can do it. The scroll-scrub is the differentiation and the reason we can charge premium. This is non-negotiable.

### 3. One shared cinematic tour by default; per-type tours = paid upsell ✅
**Decision:** Each client gets one shared tour of the building's overall finish/materials/feel. Per-type tours are optional, via `unitType.tour`, sold as an upsell.
**Why:** The finish is shared across layouts, so one tour fits every buyer with no mismatch. Per-type tours need assets that usually don't exist and multiply build cost — so they're priced separately.

### 4. Every type always gets its own floor plan + gallery ✅
**Decision:** Regardless of tours, each unit type has its own floor plan and render gallery.
**Why:** Buyers must see *their* unit. This covers "show me mine" without a per-type tour.

### 5. Two data layers: `unitTypes` vs `units` ✅
**Decision:** `unitTypes` = distinct layouts (one shared). `units` = individual sellable apartments referencing a `typeId`. One type → many units.
**Why:** Normalized, no duplication, scales cleanly across clients.

### 6. One data adapter; source is swappable ✅
**Decision:** All unit data flows through `/lib/data` (getUnitTypes/getUnits/getUnitsByType). Source switches via `DATA_SOURCE` (config → sheet/Airtable → Supabase) without touching pages.
**Why:** Start light (config, so the demo needs no backend), upgrade per client with zero frontend rewrite. No architectural debt.

### 7. Backend is tiered, not default ✅
**Decision:** Availability handling = concierge (we update) → self-serve sheet/Airtable → Premium custom admin dashboard (Supabase). Build the dashboard only when a client pays.
**Why:** The demo needs no backend; most clients don't need a custom panel. Don't build a SaaS before the first sale.

### 8. Warm Japandi, light theme, distinctive ✅
**Decision:** Cream/oak/sage palette, light, Apple-page smooth. Avoid the generic AI cream-serif default; have a clear signature (the tour).
**Why:** Buyers are families — dark/neon repels them. "Future feel" comes from motion + polish, not flashy visuals.

### 9. Tech stack ✅
**Decision:** Next.js (App Router) + TypeScript (strict) + Tailwind + Lenis + GSAP/ScrollTrigger; Stitch (via MCP) as the design source; Vercel hosting.
**Why:** Proven, fast, dependency-light; Stitch removes the manual design→code bridge.

### 10. Multi-page, not a single landing ✅
**Decision:** Home, Residences, per-type detail, Availability, Location, About, Contact, plus a Premium admin.
**Why:** Serves both audiences — seekers navigate to what they want; developers get a complete, professional site.

### 11. Pricing tiers + flagship first client ✅
**Decision:** Essential 1.5–2M / Pro 3–4M / Premium 5–8M+, recurring 200–350K/mo, add-ons à la carte. First 1–2 clients at flagship 1–1.5M for a testimonial + showcase rights.
**Why:** Anchor high (rare product); the recurring revenue is the debt-killer; the flagship breaks the no-proof wall.

### 12. Demo-first cold outreach ✅
**Decision:** Build the demo on the target's actual building first (their renders, logo), send the live unlisted link, let it sell the gap.
**Why:** Removes imagination, triggers endowment/loss-aversion, proves capability instantly.

### 13. Personal voice + light brand ✅
**Decision:** Reach out as a real person/founder; operate under a light brand (name + clean domain + one-page portfolio); skip the empty Facebook business page for now.
**Why:** At zero portfolio, a real person beats a faceless 3-follower "studio." The domain is the highest credibility-per-tugrik buy.

### 14. Resorts (амралтын газар) = Phase 2 vertical ✅
**Decision:** The same engine extends to resort sites (room/cabin types, date-based booking, activities/dining sections). Pursue it only after the real-estate playbook is proven. Name the brand broadly, not real-estate-specific.
**Why:** Same product, new market = leverage, not scatter — but don't split focus before the first win.

### 15. Focus discipline ✅
**Decision:** This is THE project until the 19M bank loan (2.2%/mo) is cleared. No new unrelated projects. Freelance Power BI/SQL gigs run only as the parallel income floor.
**Why:** Spreading thin is what keeps the debt alive. Speed to recurring income is the metric.

### 16. 21st.dev MCP scope: icons + reference only, never the aesthetic driver ✅
**Decision:** Connect 21st.dev in Claude Code, but restrict it to its free tools — Icon Search (use directly) and Inspiration Search (reference for standard components only, always restyled to our Japandi tokens before shipping). Do not subscribe to the paid Magic Generate tier. It never touches the signature scroll-scrub tour.
**Why:** Stitch is the design source of truth; introducing a second aesthetic input risks drift toward generic, shadcn-flavored output — exactly what undermines our "distinctive, not templated" positioning. The free tools (icons, reference search) are genuinely useful and carry no such risk once restyled. The paid tier adds recurring cost we don't need while we're focused on debt payoff, for output we'd have to fight against anyway.