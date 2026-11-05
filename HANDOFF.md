# Where the Money Comes From — Handoff Log

Session-by-session state. Updated by /log mid-session and /wrap at
session end.

For durable choices, see DECISIONS.md.
For the current work arc, see PLAN.md.
For things that didn't work, see FAILURES.md.

---

## 2026-05-26 — Project initialized

**Started from:** New project setup.

**Did:** Created repo, set up CLAUDE.md/DECISIONS.md/HANDOFF.md/PLAN.md/
FAILURES.md, configured slash commands, ran 95% confidence prompt
in chat.

**State:** Foundation in place. PLAN.md arc defined. Ready to begin
work.

**Next:** Fill in CLAUDE.md bracketed sections, then define first arc in PLAN.md.

---

## 2026-05-26 13:41

**What changed:** Completed /clarify + /ce:brainstorm — requirements doc written, stack and architecture decided

**Why:** Needed to resolve open questions (format, interaction model, data pipeline, toolset) before any code is written. All decisions now documented.

**State:** Requirements doc at `docs/brainstorms/channel-profitability-requirements.md`. PLAN.md updated with full arc definition. No code yet — blank slate.

**Next:** Run `/ce:plan` to produce the implementation plan — Python pipeline queries, React component structure, Observable Plot chart specs, build/deploy setup.

---

## 2026-05-26 13:45

**Started from:** New project, workflow files only, no code, no decisions.

**Did:** Ran /clarify + /ce:brainstorm. Reframed from brief's scroll-story assumptions to methodology+challenge interactive piece. Decided stack (React+Vite+TS+Observable Plot), data architecture (Python→JSON baked into Vite build, offline-capable, instant), framing (no CTA, conversation starter), and confirmed Chapter 5 deferred to v2. Wrote full requirements doc.

**State:** No code. Requirements documented. Stack and architecture decided. PLAN.md arc defined. Ready to plan.

**Next:** Run `/ce:plan` working from `docs/brainstorms/channel-profitability-requirements.md`. Verify five open questions against Cinderhaven Postgres before pipeline build (especially: does `dim_channels` exist? Does deduction taxonomy cover slotting/MCB/swell/OTIF for Ch. 3 waterfalls?).

---

## 2026-05-26 ~17:00

**Started from:** U10 (polish/accessibility/deploy) was the last implementation unit. All 5 chapters existed with snapshot/placeholder data.

**Did:** Completed U10 — sr-only DataTables on all chapters, `.sr-only` + `@media print` styles, SVG `<title>` injection on PlotChart, `netlify.toml`. Deployed to Netlify via anonymous deploy; user claimed site and renamed subdomain to `where-the-money-comes-from`. Fixed accidentally-staged `.claude/worktrees/` files. Queried real Cinderhaven database — discovered snapshot data is completely wrong (UNFI/KeHE are distributors not retailers, Whole Foods is a separate channel, Food Service doesn't exist, DTC has zero orders). Found and documented unit mismatch bug (cases vs individual units via `case_pack_qty`). User requested distributor hidden tax in Chapter 3.

**State:** Site live at https://capital.lailarallc.com with placeholder data. `channels.json` and `deductions.json` still have snapshot numbers. Python pipeline not yet updated to real DB. Chapter 3 waterfall excludes distributors.

**Next:** 
1. Update `scripts/01_extract_channel_data.py` to query `cinderhaven_deductions.db` with correct formula (`units_ordered × case_pack_qty` for individual units)
2. Regenerate `src/data/channels.json` with real 7-channel data
3. Update `src/data/deductions.json` — add UNFI/KeHE as `type: 'distributor'` with real deduction waterfall
4. Update `Ch3HiddenTax.tsx` — extend waterfall gate to include distributors (user request: "hidden tax for distribution as well")
5. Rebuild and redeploy to Netlify

---

## 2026-05-26 16:44

**What changed:** Rewrote all chapter narratives to match real Cinderhaven data; switched capital allocation story from DTC vs retail to distributor vs retailer

**Why:** Real data (distributors 90.2% margin, retailers 81.1%, DTC 82.6% tiny scale) tells a different story than the original brief. The DTC-hero framing is not supported by the numbers.

**State:** All 5 chapters updated. `scenarios.json` regenerated ($810K retail vs $902K distributor on $1M, $91K delta). Ch3 side-by-side now shows UNFI (vs retail) or Walmart (vs distributor). 61/61 tests passing, build clean, committed (731fcab).

**Next:** Deploy updated build to Netlify (`netlify deploy --prod --dir=dist` after `npm run build`).

---

## 2026-05-26 16:50

**Started from:** SQLite snapshot in place, real channel/deductions data regenerated. `scenarios.json` still had DTC-vs-retail story. Chapter narratives had not been updated.

**Did:** Regenerated `scenarios.json` (distributor $902K vs retailer $810K on $1M). Rewrote all 5 chapter narratives to match real data — distributors 90.2% margin vs retailers 81.1%. Ch3 side-by-side now shows UNFI (vs retail) or Walmart (vs distributor). Updated 4 test files; 61/61 passing, build clean.

**State:** All chapters tell the real story. Build clean. Netlify still has old build — not yet redeployed.

**Next:** `npm run build` then `netlify deploy --prod --dir=dist` to push updated narrative to live site. Optionally: run `python scripts/00_export_snapshot.py` (live flyctl mode) to populate `units_sold` and get real per-unit data into Ch2.

---

## 2026-05-26 17:06

**What changed:** Ran /ce:compound — documented the full project arc as an architecture-pattern knowledge doc in docs/solutions/

**Why:** Arc is complete and shipped; captured learnings while context is fresh so future builds benefit from the patterns.

**State:** Six learnings documented (SQLite snapshot + baked JSON pipeline, data-first narrative, CPG units mismatch, deduction waterfall, click-to-pin interaction, Observable Plot wrapper). CLAUDE.md updated to surface docs/solutions/ to future agents. All tests passing, live site up.

**Next:** Fresh session — arc is done. v2 options: subscription overlay (Ch5), PDF export, or units_sold real data via flyctl.

---

## 2026-05-26 17:15

**Started from:** Arc complete, live site up. Running /ce:compound to document the project arc.

**Did:** Full /ce:compound run — 3 parallel Phase 1 agents + session history synthesis across 3 prior sessions. Assembled 6-learning architecture-pattern doc. Phase 3 TS + simplicity reviewers applied 5 fixes (compile-error spec prop, JSON import cast, dataById guard, options.x ?? {}, Python row_factory). Added docs/solutions/ to CLAUDE.md for future discoverability.

**State:** Arc fully complete and documented. Live site up. docs/solutions/architecture-patterns/ created. All tests passing. Nothing broken.

**Next:** Start fresh session. Send live link to a real CFO/CEO for feedback, or choose v2 arc: (1) units_sold real data via flyctl, (2) subscription overlay Ch5, (3) PDF export.

---

## 2026-05-26 17:31

**Started from:** Arc 1 complete, live site up, first Sonnet session — ran /improve to audit compliance and data integrity.

**Did:** Full /improve pass — 8 findings fixed. Critical: Ch3 waterfall now includes Promo Costs + Dispute Overhead steps; Contribution matches channels.json for all 10 channels (national mass retailer was $84K off). Typography (Ch1 em dash), Ch3 footnote year FY2024→2026, Ch4 units labeled as model estimate, Ch2 color palette expanded to 8 HK stops, snapshot.db gitignored, README created, CLAUDE.md filled in.

**State:** 61/61 tests passing, tsc clean. Netlify not yet redeployed — live site still has old waterfall numbers.

**Next:** `npm run build && netlify deploy --prod --dir=dist` to push waterfall fix live. Then send https://capital.lailarallc.com to a real CFO/CEO for feedback.

---

## 2026-06-13

**Started from:** Phase 5 sweep deferred fix — export query referenced nonexistent mart columns and carried case-pack inflation bug.

**Did:** Fixed `00_export_snapshot.py`: `units_ordered` → `total_units`, removed `dim_products` FK join (no `product_id` in marts), `order_date` → `created_at` for DTC. Re-ran pipeline. channels.json now has real unit counts (were all null). scenarios.json capital allocation reversed: retail 50.8% margin > distributor 45.3%.

**State:** Pipeline output correct with current platform marts. Committed and pushed (32a4a09). Live site not redeployed — still shows old data.

**Next:** Redeploy to Netlify with corrected data (`npm run build && netlify deploy --prod --dir=dist`). Consider updating chapter narratives — capital allocation story reversed (retail now wins, was distributor). WTMCF Decision #4 (case_pack_qty multiplication) is superseded for mart queries since `total_units` already represents individual units.

---

## 2026-06-29 16:00

**Started from:** CC Fix Brief in progress — prose edits done across all chapters but 3 tests failing from stale expectations. Deploy pipeline untested.

**Did:** Fixed 3 test failures (Ch2 "dollar"→"unit", Ch5 "retail"→"distribution" x2). Committed prose rewrite + test fixes + netlify.toml deletion. Discovered GitHub Actions deploy broken (expired CF token since June 21). Deployed via local `npx wrangler pages deploy`. Fixed ScrollNav: `right: 20px` → `clamp()` anchored to content gutter. Verified at 1280/1600/1920px. Deployed again. All pushed.

**State:** Live site fully updated (retail-wins prose, correct numbers, nav inset). 49/49 tests, build clean. GitHub Actions deploy broken — using local wrangler deploys. All commits pushed.

**Next:** Rotate `CLOUDFLARE_API_TOKEN` in GitHub repo secrets to restore CI/CD, or continue local deploys. Project overdue for `/improve audit-only` (last audit: 2026-05-26).

---
