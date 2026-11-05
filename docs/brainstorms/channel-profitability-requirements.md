# Where the Money Comes From — Requirements
**Date:** 2026-05-26
**Status:** Approved — ready for planning

---

## Problem

CFOs and CEOs at $25M specialty food brands misallocate growth capital because
every report they see ranks channels by revenue, not contribution. Walmart
generates 35% of revenue, so the board concludes: invest in more Walmart SKUs.
The conclusion is wrong. After slotting fees, chargebacks, trade spend,
distributor cuts, swell allowances, and OTIF penalties, Walmart's per-unit
contribution is often 5–10× lower than DTC's. The board is optimizing the
wrong number, and nobody is producing the analysis that would change the
conclusion.

This piece makes that argument — with Cinderhaven's actual data — in a form a
skeptical CFO can explore, verify, and bring into a board conversation.

---

## Users

**Primary:** CFO or CEO of a $25M–$50M specialty food brand. Marketing-skeptical.
Data-literate but not analytical by training. Receives this as a link from Shawn
before or after a conversation. Spends 5–10 minutes with it.

**Secondary:** Shawn. The piece makes the case for hiring him. The CFO who
finishes this piece should think: "I want this analysis for my actual numbers."

---

## Framing

**Methodology + challenge.** Not a Cinderhaven case study (too passive). Not a
scroll story the CFO reads (too linear). A piece that challenges their current
thinking and then shows the methodology that proves the challenge correct.

The voice: direct, declarative, no hedging. Sober Economist style. The data
speaks. The prose frames the data.

The piece does not say "kill Walmart." It says: the next dollar of growth
investment probably earns more in DTC than in retail. Here is the math.

**No CTA.** This is a conversation starter, not a funnel. No email gates, no
download buttons, no contact form. Shawn sends this before a call. The piece
does the priming.

---

## Story Structure

Five chapters. Chapter 5 (Subscription Overlay) is deferred to v2 — the
subscription data does not exist in the Cinderhaven platform yet.

### Chapter 1 — The Revenue Illusion

Three charts in sequence. Same Cinderhaven data, three views:

1. Revenue by channel — Walmart dominates. This is the chart boards see.
2. Contribution dollars by channel — Walmart shrinks. DTC grows.
3. Contribution margin % by channel — the ranking inverts almost completely.

The CFO can toggle between the three views. This is the eye-trick: same data,
three framings, three different strategic conclusions.

### Chapter 2 — The Per-Unit Showdown

A single ranked bar chart: contribution per unit shipped, by channel. Walmart
to the left (lowest). DTC to the right (highest). The gap is the story.

Representative Cinderhaven figures:

| Channel          | Per-Unit Contribution |
|------------------|-----------------------|
| National mass retailer | $0.42                 |
| Distributor B    | $0.78                 |
| Food service     | $0.60                 |
| Club retailer    | $0.85                 |
| Distributor A / natural grocer | $0.92               |
| DTC (one-off)    | $4.20                 |

This is the piece's primary shareable image. The chart the CFO screenshots
and brings to a board meeting.

### Chapter 3 — The Hidden Tax of Retail

Each retail channel as a tax structure. A waterfall chart per channel:

`Gross revenue → slotting → chargebacks → trade spend → swell → net revenue →
COGS → contribution`

DTC's waterfall for comparison: `Gross → CAC → fulfillment → payment
processing → returns → net → COGS → contribution`

The waterfall shows why retail's per-unit contribution is so low — it's not
COGS, it's the deduction stack. Retail's tax structure is more regressive
than DTC's at this revenue stage.

### Chapter 4 — The Scale Trap

A line chart: marginal contribution per Walmart unit as a function of total
Walmart volume. The curve flattens and bends down. Above some volume threshold,
additional Walmart units destroy contribution because trade spend and chargebacks
scale superlinearly.

The point: more Walmart volume does not automatically mean more contribution.
There is a scale trap. Many brands at $25M–$50M are already in it.

### Chapter 6 — The Capital Allocation Question

Forward-looking. Not "close retail accounts" — "rebalance investment."

Two scenarios: $1M invested in more retail SKUs vs. $1M invested in DTC
infrastructure (Shopify, subscription, email, retention). Projected incremental
contribution for each.

Closing frame: the decision is about where the next dollar earns the most. The
math points to DTC for most brands at this stage. The piece shows why.

---

## Interaction Model

The CFO "plays around with it." Moderate interactivity — not a passive read,
not a heavy dashboard.

**Chapter navigation:** The CFO moves through chapters at their own pace.
Not scroll-triggered. A chapter nav or explicit next/previous controls.
Each chapter is a distinct view, not a continuous page.

**Chart exploration:**
- Hover on any bar or point → tooltip with exact value and channel name
- Click a channel bar → that channel's deduction breakdown expands inline;
  non-selected channels dim to ~25% opacity
- Click again (or click elsewhere) → selection clears, all channels return
  to full opacity

**Chapter 1 toggle:** Three explicit view buttons — "Revenue," "Contribution $,"
"Contribution %." Clicking switches the chart with a short transition (200ms
opacity fade, respects `prefers-reduced-motion`). All three views use the same
chart scale structure so the ranking shift is visually legible.

**No form inputs, no sliders, no "plug in your numbers" in v1.** The scenario
modeling in Chapter 6 uses Cinderhaven's figures. The CFO observes the
methodology; they do not configure it.

---

## Technical Requirements

### Stack
- **Frontend:** React 18 + Vite + TypeScript
- **Charts:** Observable Plot (SVG, not canvas)
- **Styling:** CSS with Lailara Design System v2 tokens (see `~/projects/active/CLAUDE.md`)
- **Fonts:** Self-hosted Playfair Display + Source Sans 3 (woff2, served from
  the project — no Google Fonts CDN)
- **Data pipeline:** Python (psycopg2 + pandas) → JSON files → bundled into
  the Vite build as static imports

### Data architecture
All data is generated at build time. The Python pipeline runs once against the
Cinderhaven Postgres instance, transforms the data into the shape the charts
need, and writes JSON files to `src/data/`. Vite imports these as modules.
No runtime network requests. No async data loading. All charts render on first
paint.

**Consequence:** the piece works offline once loaded. No spinner. No waiting.
The CFO opens the URL and the data is already there.

### Hosting
Static site. Deploys to Netlify or GitHub Pages. The build output is a folder
of static assets with no server dependencies. Can also be distributed as a
folder and opened locally in a browser.

### Design
Lailara Design System v2 throughout:
- Canvas: `#f5f3ee`
- Chart palette: Hong Kong sequential teal for ranked/magnitude data; Chicago
  navy as the primary accent
- Typography: Playfair Display for all headings and chart titles; Source Sans 3
  for body, labels, axes
- Charts: horizontal-only gridlines, labeled data points, no decorative elements
- Transitions: `opacity 200ms ease-out`; snap to final value when
  `prefers-reduced-motion` is set

---

## Out of Scope (v1)

| Item | Reason |
|------|--------|
| Chapter 5 — Subscription Overlay | Subscription data does not exist in Cinderhaven platform |
| PDF boardroom export | v2 |
| Excel financial model (standalone) | Evaluate after core story is built |
| Jupyter methodology notebook | Evaluate after core story is built |
| Mobile optimization | Desktop-first; not broken on mobile but not designed for it |
| "Plug in your numbers" / scenario inputs | v2 — CFO observes methodology first |
| Email gating or lead capture | No CTA in v1 |
| Live Postgres connection | All data baked at build time |
| Subscription channel in any chart | No data; placeholder note in Chapter 6 if needed |

---

## Success Criteria

- [ ] All five chapters render with real Cinderhaven data, no placeholder values
- [ ] All charts render on first paint — no loading states visible to the user
- [ ] Offline-capable: page works after initial load with no network connection
- [ ] Channel click-to-explore works across all chart types that support it
- [ ] Chapter 1 three-way toggle works with legible visual transition
- [ ] Lailara Design System applied throughout: canvas, typography, palette, chart rules
- [ ] Fonts self-hosted (no external CDN calls)
- [ ] Hosted at a URL that can be sent in an email
- [ ] A skeptical CFO could receive this link and take it seriously

---

## Data Requirements

The Python pipeline needs to pull and shape the following from Cinderhaven Postgres:

| Data needed | Source mart(s) | Notes |
|-------------|----------------|-------|
| Revenue by channel | `fct_orders`, `dim_channels` | Chapters 1, 6 |
| Contribution dollars by channel | Derived: revenue − all deductions − COGS | Chapter 1 |
| Contribution margin % by channel | Derived | Chapter 1 |
| Per-unit contribution by channel | Contribution ÷ units shipped | Chapter 2 |
| Deduction waterfall by channel | `fct_deductions`, `fct_chargebacks` | Chapter 3 |
| Volume vs. marginal contribution (Walmart) | Derived from deduction rate schedules | Chapter 4 |
| Scenario: $1M → retail vs. DTC contribution delta | Derived from per-unit contribution + volume assumptions | Chapter 6 |

The pipeline verifies: all channel totals reconcile to platform-level revenue.
Any channel with < 5 orders or < $10K revenue is excluded from charts (noise
suppression).

---

## Open Questions

| Question | Status |
|----------|--------|
| Does `dim_channels` exist in the platform, or does channel tagging need to be inferred from retailer IDs? | Verify against Postgres before pipeline build |
| Cinderhaven channel mix percentages — do the actual platform numbers match the brief's working assumptions (Walmart 35%, Costco 15%, etc.)? | Verify in pipeline; brief figures are placeholders |
| Does the platform have the full deduction line-item taxonomy needed for Ch. 3 waterfalls (slotting amortized, trade spend, MCB, swell, OTIF)? | Verify; scope back Ch. 3 if partial |
| Domain for hosting — subdomain off portfolio, or standalone? | Decide before launch |
| Chapter 6 scenario inputs — use Cinderhaven's actual figures, or representative industry-standard assumptions? | Decide before building Ch. 6 |
