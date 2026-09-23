# Where the Money Comes From — Current Work Plan

The current arc of work. Updated when the arc changes, not every
session. For session-by-session state, see HANDOFF.md.

---

## Goal

Build a complete interactive web experience that shows a CFO/CEO of a $25M specialty food brand what each channel actually pays per unit after all deductions — and why their capital allocation is probably wrong — ready to send as a link for real feedback.

## Why this arc, why now

Cinderhaven Data Platform is complete and reconciled, unblocking the full build. This is the first buyer-facing piece that makes the platform's value tangible.

## Business question this arc answers

Which channel deserves the next dollar of growth investment — and is the brand currently getting that answer wrong because they're reading revenue instead of contribution?

## Differentiation from Velocity Decision Tool

The Velocity Tool answers "how are our products performing inside retail?" (SKU × retailer, units/store/week). This piece answers "which channel deserves our growth investment?" (channel P&L, contribution per unit net of all deductions). Execution vs. strategy. No overlap.

## What we know about the piece

- **Format:** Interactive web experience, sent as a link. CFO/CEO plays with it, explores the data. Eventually repurposed as a website case study
- **Story:** Revenue by channel looks one way; contribution per unit looks completely opposite; the gap drives a capital allocation mistake most brands at this stage are making
- **Data:** Cinderhaven Postgres platform (complete). Subscription data does not exist yet — Chapter 5 (Subscription Overlay) is deferred to v2
- **Toolset:** Open — pick what best serves an interactive data story built from Postgres. Not locked to D3/Scrollama/Excel from the original brief
- **Design:** Lailara Design System v2 (see ~/projects/active/CLAUDE.md for full spec)
- **Done:** Releasable for feedback — real enough that a skeptical CFO could receive this link and take it seriously

## Tasks

All 10 implementation units completed. See git log for details.

| Unit | Description | Status |
|---|---|---|
| U1 | Project scaffolding and Lailara design tokens | ✅ |
| U2 | Python data pipeline (snapshot mode) | ✅ |
| U3 | Shared chart infrastructure (PlotChart, hooks, format utils) | ✅ |
| U4 | Chapter navigation and layout shell | ✅ |
| U5 | Chapter 1 — The Revenue Illusion | ✅ |
| U6 | Chapter 2 — The Per-Unit Showdown | ✅ |
| U7 | Chapter 3 — The Hidden Tax of Retail | ✅ |
| U8 | Chapter 4 — The Scale Trap | ✅ |
| U9 | Chapter 5 — The Capital Allocation Question | ✅ |
| U10 | Polish, accessibility, print styles, Netlify deploy | ✅ |

## Out of scope for this arc

- Chapter 5 (Subscription Overlay) — subscription data does not exist in the platform
- PDF boardroom export — v2
- Excel financial model as a standalone deliverable — evaluate after core story is built
- Jupyter methodology notebook — evaluate after core story is built

## Definition of done for this arc

- [x] All chapters 1–5 render with real Cinderhaven data
- [x] Interactive elements work (CFO can explore, not just read)
- [x] Hosted at a URL that can be sent in an email — https://capital.lailarallc.com
- [x] Lailara design system applied throughout
- [x] Loads and works on desktop without errors
- [x] A real CFO/CEO could receive this link and take it seriously

---

## Arc history

When an arc completes, archive its goal, completion date, and outcome
here. Then start a new arc above. Provides continuity without bloating
the active plan.

### 2026-05-26 — Channel Profitability Interactive Experience
- Outcome: Full 5-chapter interactive web experience shipped to Netlify. 61 tests passing, clean TypeScript build. Observable Plot charts, click-to-select interactions, Lailara Design System v2 throughout, sr-only accessibility tables, print styles.
- Live URL: https://capital.lailarallc.com
- Plan: docs/plans/2026-05-26-001-feat-channel-profitability-experience-plan.md

---

## Improvement history

Track when this project was reviewed and improved via /improve.
Each entry records what was found, what was fixed, and when to
check again.

<!-- Entries are added by /improve — don't delete this section -->

### 2026-05-26 — Improvement pass (first pass, post-ship)
- **Trigger:** User-initiated — first Sonnet session, wanted compliance audit against CLAUDE.md, Lailara spec, and data integrity check
- **What was reviewed:** All source code, Python pipeline scripts, JSON data files, design token usage, workflow docs
- **What was fixed:**
  - Waterfall "Contribution" mismatch — Ch3 waterfall now includes Promo Costs + Dispute Overhead steps; final number matches channels.json across all 10 channels (Walmart gap was $84K)
  - Chapter 1 heading `--` → `—` (em dash, matches all other chapters)
  - Chapter 3 footnote year corrected from FY2024 to FY2024–2026
  - Chapter 4 "151,000 units" now labeled as model estimate, not presented as fact
  - Chapter 2 color palette expanded from 6 to 8 HK teal stops; 4 channels no longer share the same darkest color
  - `data/snapshot.db` removed from git (generated file, now gitignored)
  - README.md created
  - CLAUDE.md template brackets filled in (project description, stack, voice)
- **Deferred:** None — all findings addressed
- **Next review:** 2026-06-25 (project active; review every 30 days)

### 2026-09-23 — Audit (health check only)
- **Findings:** 0 critical, 6 important, 5 nice-to-have
- **Top concerns:** Chapter 4 labels average contribution per unit as "marginal" (true marginal break-even is ~3.0M units/yr, not 5.3M), and contribution footnotes disagree across chapters and claim freight is subtracted when the pipeline has no freight. Local checkout sits on the merged client-mode-2026-08 branch, 2 commits behind origin/main, and HANDOFF/CLAUDE/DECISIONS/FAILURES predate the client-mode work and org-level secrets. The --seed refresh path yields null units and breaks 03_extract_scenarios.py. Tests: 49/49 vitest, 34/34 pytest, drift gate clean; security, code, and data reviews done manually.
- **Action taken:** Audit only — no fixes this session
- **Next review:** 2026-12-22
