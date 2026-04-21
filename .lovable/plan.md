
# Luna LifeOS — Clinical IVF Dashboard

A multi-page clinical dashboard for IVF doctors to review patient fertility reports compiled from wearable + lifestyle data. All data is hardcoded per spec.

## Architecture
- React Router with 6 routes under a shared layout (Sidebar + TopBar)
- Single `data.ts` file holding PATIENTS, SLEEP_14, TEMP_30, CYCLES, BLOOD, SUPPS, HABITS, INSIGHTS, PARTNER, GAPS and the `C` color tokens
- Layout owns `patient` state + sidebar hover state; current page tracked via route + persisted to `localStorage` as `luna.page`
- Fonts: DM Sans (UI) + JetBrains Mono (numerics) imported in `index.css`
- Page mount fade-in utility class (opacity + translateY, 350ms)

## Design system
- Warm white bg `#FAFAF8`, deep slate sidebar `#0F172A`, indigo→violet gradient accents
- Card style: white, radius 12px, soft shadow, hairline border
- Eyebrow labels (10px, 700, tracked uppercase) and `.mono` class for all numeric values
- Custom scrollbar (6px, slate thumb)

## Shell
**Sidebar** (fixed left, 64px → 200px on hover, smooth opacity transition on labels)
- Luna gradient ring logo (lavender→pink→yellow, no background square)
- 6 nav items with custom inline SVG icons (Overview grid, Cycle arrow, ECG wave, Clock, Sparkle, People)
- Active = indigo bg + white; bottom Settings + Help icons

**TopBar** (sticky, white, h-16)
- Breadcrumb: Patients / {name} / {page}
- Patient selector chip → 340px dropdown with gradient avatars, alert dots, sync info; outside-click overlay
- "Share with patient" outlined + "↓ Download PDF" gradient button

**Shared atoms:** StatusPill, SevPill, AlertDot, AdherenceBar

## Pages

**1. Overview**
- AlertStrip: 3 inline alerts (HIGH red + 2 MED amber) with colored left borders
- 3-col grid:
  - PhaseRing: SVG donut with 4 arcs (gaps via dasharray), Luteal active, center label, 2×2 legend
  - BiomarkerSnapshot: 30/60/90d toggle, 5 metric rows, emerald HRV trophy callout
  - SleepSummary: 14-bar Recharts chart with 7.5h target reference line, 3 stats, amber caffeine callout
- FooterStrip: pulsing green dot + monitoring summary + PDF link

**2. Cycle & Temperature**
- Skin temp AreaChart (260px) with 4 phase ReferenceAreas, ovulation ReferenceLine at D15, indigo gradient fill, custom tooltip; C1–C4 tabs (C4 active)
- Indigo clinical note callout
- Cycle history table (4 rows, C4 highlighted, flagged values amber bold, AVG row)
- Phase distribution: 4 horizontal proportional segment bars

**3. Biomarkers & Blood Panel**
- 3 trend metric cards (HRV / Resting HR / Stress) with sparkline LineCharts and 90d/60d/30d columns
- Blood panel table: 12 markers with StatusPills, "+ Upload new panel" link, amber Omega-3 warning footer

**4. Lifestyle**
- Supplements table: 6 rows, AdherenceBar coloring (green/amber/red), Melatonin "Travel only", emerald impact text, "Avg adherence 91%" pill
- Habits table: 6 rows, ✓ emerald for positive / ⚠ amber for negative impacts

**5. AI Insights**
- Slate disclaimer strip about correlational observations
- Action Required: 3 severity-colored alert cards
- Pattern Insights: 2-col grid of 6 indigo-tinted cards with 💡, text, confidence bars
- Health Clone Summary: Strengths (emerald) + Concerns (amber) two-column

**6. Partner Health**
- Info strip about Kindbody integration
- Partner hormone panel: 6 markers, "All Normal" emerald pill
- Data gaps: 3 items with SevPills + outlined "Request" buttons

## Interactions
- Sidebar hover expand/collapse with smooth label opacity
- Patient dropdown with outside-click close
- Cycle tab + biomarker range toggles (visual-only state)
- Row hover states throughout
- Page-mount fade-in on every route
- Recharts wrapped in fixed-height divs before ResponsiveContainer

No backend, no auth — pure presentation layer with hardcoded data.
