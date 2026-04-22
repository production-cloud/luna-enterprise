

# Luna x Hospital — Content, Insights & Dark Mode

## 1. Rename + sample patients
- Sidebar: "Luna x Motherhood" → **"Luna x Hospital"**
- Patients in `data.ts`: Priya/Ananya/Deepa/Riya → **"Jane Doe 1/2/3/4"** (keep ages, sync info, alert states; update initials to "J1"/"J2"/etc. on avatars)
- Update all PDF headers, breadcrumbs, file names (`Luna_JaneDoe1_Summary.pdf`)

## 2. Remove all Omega-3 / fish-oil references
- **Blood panel** (`data.ts`): drop the Omega-3 Index marker row + `bloodWarning` referencing it for every patient
- **Supplements** (`data.ts`): remove Fish Oil / Omega-3 entries
- **Insights**: replace any omega-3 driven insight with the new creatine/sleep-latency one (see §6)
- **PDF generator**: nothing special — it reads from data, will follow

## 3. Cycle & Temperature — add start/end dates to phase distribution
In `Cycle.tsx` `PhaseBars`, each cycle row (C1–C4) currently shows just the label. Add the cycle's start–end date next to the label, pulled from existing per-cycle metadata (e.g. "C1 · Oct 12 – Nov 8"). Add `start` and `end` strings per cycle in `data.ts` for all patients. No layout overhaul — just append a small slate-400 mono date string after the label.

## 4. Biomarkers — remove sparkline, redesign 90/60/30d
In `Biomarkers.tsx` `MetricCard`:
- Delete the Recharts `LineChart` block entirely
- Replace the existing 3-column 90d/60d/30d row with a cleaner version: same 3 columns, but with subtle delta arrows (↑/↓/→) under each value in the metric's accent color, and a thin horizontal divider above. Same card chrome, fonts, spacing — just no chart.

## 5. AI Insights — rewrite all copy (factual, soft, non-prescriptive)
Apply this principle everywhere insights appear (Overview alerts, Insights page alerts + pattern cards, Health Clone strengths/concerns, footer notes, PDF):

**Rules**
- Use hedged language: "could be", "appears to", "tends to", "observed"
- No imperatives, no "flag for review", no "may impact X regulation"
- Strip exact percentage/point claims when they sound like a verdict; keep numbers when they're descriptive
- Keep the 3 "good" examples as-is

**Specific rewrites**
- "Sleep debt 3.2h sustained over 14 days — flag for endocrine review" → **"Sleep averaging ~3h below target across the last 14 nights"**
- "Stress down 21% over 90 days, Ashwagandha at 3pm correlating" → **"Stress trending lower over the last 90 days; Ashwagandha taken mid-afternoon on most of those days"**
- "Caffeine after 3pm linked to reduced deep sleep" → **"Caffeine after 3pm could be linked to reduced deep sleep on the same night"**
- "Protein-first breakfasts raise Peak Score 7.2 pts" → **"Mornings starting with a protein-first meal tend to coincide with higher Readiness Scores later that day"**
- Omega-3 insight (any phrasing) → **"On days creatine was taken, sleep latency appeared a few minutes longer than baseline"**
- Audit every other insight string in `data.ts` (per patient: `insights[]`, `insightsAlerts[]`, `strengths[]`, `concerns[]`, Overview `alertStrip`) and apply the same softening pass. Keep the trio:
  - "HRV recovers 2 days faster with magnesium on travel days"
  - "Biphasic shift regular across all 4 cycles, consistent progesterone pattern"
  - "Walking 6x/week strongest HRV correlator, −6ms on rest days"

## 6. "Peak Score" → "Readiness Score"
Global rename across `data.ts`, `Overview.tsx`, `Insights.tsx`, PDF generator, and any tooltip/legend strings.

## 7. Dark mode toggle (bottom of sidebar)
- Add a small footer block inside `Sidebar.tsx` (below nav, above bottom edge) with a sun/moon icon + the existing shadcn `Switch`. Label "Dark mode" only when sidebar is expanded.
- State managed by a tiny `useTheme` hook: reads `localStorage.luna.theme` (default `'light'`), toggles `document.documentElement.classList` for `.dark`.
- Add dark-mode CSS variables in `index.css` for the existing token names (bg, card, sidebar stays dark, text, borders) so all current Tailwind/`C` usages adapt. Cards, top bar, tables, alerts get dark equivalents (`#0B1220` bg, `#111827` cards, slate-200 text, slate-700 borders). Recharts strokes/fills already use the `C` tokens — adjust those tokens via CSS variables read in JS, OR add a `useTheme()` returned palette object passed to charts.
- Sidebar itself stays dark in both modes (already `#0F172A`).
- Default = light, so existing users see no change until they flip the switch.

## Files touched
- `src/luna/data.ts` — rename patients, drop Omega-3 + Fish Oil, add cycle start/end dates, rewrite all insight strings, Peak→Readiness
- `src/luna/Sidebar.tsx` — title rename, dark mode toggle footer
- `src/luna/TopBar.tsx` — patient initials/avatar update
- `src/luna/pages/Overview.tsx` — Readiness rename, softened alert strip copy
- `src/luna/pages/Cycle.tsx` — phase distribution date labels
- `src/luna/pages/Biomarkers.tsx` — remove sparkline, redesign 90/60/30d row
- `src/luna/pages/Insights.tsx` — softened copy (data-driven, mostly auto)
- `src/luna/pages/Lifestyle.tsx` — drop Fish Oil row (auto via data)
- `src/luna/pdf.ts` — Luna x Hospital header, JaneDoe filenames, Readiness rename
- `src/luna/hooks/useTheme.ts` — new
- `src/index.css` — dark-mode CSS variables

No structural UI changes beyond removing the sparkline and adding the dark mode toggle.

