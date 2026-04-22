

# Bring back biomarker line graph (clearer) + fix dark-mode invisible text

## 1. Biomarker line graph — restored, but actually meaningful

In `src/luna/pages/Biomarkers.tsx` `MetricCard`, re-add a small chart on each card, but redesign it so the line *means* something at a glance:

- Use Recharts `AreaChart` (not LineChart) with the metric's accent color (`m.stroke`) as both the line and a soft 12% fill gradient — gives shape to the trend.
- X axis: 9 points labeled `90d → 60d → 30d → today` (only show 4 ticks: 90d, 60d, 30d, now).
- Y axis: hidden, but `domain` set to `[min - pad, max + pad]` (computed from `m.line`) so the line uses the full vertical space and small changes are actually visible.
- Show **first** and **last** value labels directly on the chart (small mono text at the line's start/end points) so the doctor immediately sees "went from 40 → 48".
- Add a subtle horizontal reference line at the *baseline value* (first point) so the direction of change is obvious — line above baseline = improving (or worsening, depending on metric, colored via `m.stroke`).
- Tooltip on hover: "{period}: {value}".
- Height: fixed 70px wrapper div before `ResponsiveContainer`.

Keep the existing 90/60/30d column row and arrows below the chart — they complement the line by giving exact numbers. The card chrome, fonts, badge, and spacing all stay identical.

The blood panel table itself stays unchanged (it's tabular data, a chart wouldn't help).

## 2. Dark mode — fix invisible text

Root cause: alert/insight/info strips use hardcoded light pastel backgrounds (`#FEF2F2`, `#FFFBEB`, `#F1F5F9`, `#ECFDF5`) with `text-slate-700`/`text-slate-800` text. In dark mode our global rule recolors slate text to near-white (`#F1F5F9`), which then disappears against those same light pastel backgrounds.

Fix in `src/index.css`, scoped to `.dark`, without touching individual components:

- Add overrides that re-darken text **only inside light pastel-background containers**. Easiest path: target inline-style backgrounds via attribute selectors:
  ```css
  .dark [style*="#FEF2F2"], .dark [style*="#FFFBEB"],
  .dark [style*="#ECFDF5"], .dark [style*="#EEF2FF"],
  .dark [style*="#F1F5F9"], .dark [style*="rgb(241 245 249"],
  .dark [style*="rgb(238 242 255"], .dark [style*="rgb(236 253 245"],
  .dark [style*="rgb(254 243 199"] {
    color: #1E293B !important;
  }
  .dark [style*="#FEF2F2"] *, .dark [style*="#FFFBEB"] *,
  .dark [style*="#ECFDF5"] *, .dark [style*="#EEF2FF"] *,
  .dark [style*="#F1F5F9"] *, .dark [style*="rgb(241 245 249"] *,
  .dark [style*="rgb(238 242 255"] *, .dark [style*="rgb(236 253 245"] *,
  .dark [style*="rgb(254 243 199"] * {
    color: inherit !important;
  }
  ```
  This makes text inside Active Alerts (Overview), AI Insights alert rows, Pattern insight cards, Strengths/Concerns, Partner info strip, and the blood-panel warning all readable again, without affecting the rest of the dark UI.

- Bump the breadcrumb / TopBar separator and "Patients / Jane Doe 1 / Overview" text contrast by adding `.dark .luna-topbar { color: #E2E8F0; }` (or directly raising `text-slate-500` in dark mode — already partially done; verify the TopBar uses one of the slate utilities).

- The "AI-generated correlational observations…" strip uses `rgb(241 245 249 / 0.7)` which the new selector covers.

- The Partner "Partner health data is supplementary…" strip — same selector covers it.

No component files need editing for the dark-mode fix; it's a pure CSS patch in `index.css`.

## Files touched
- `src/luna/pages/Biomarkers.tsx` — add `AreaChart` (with gradient, baseline reference, endpoint labels) above the existing 90/60/30d row in `MetricCard`
- `src/index.css` — add `.dark` color overrides for light-pastel-background containers

No layout, spacing, or typographic changes elsewhere. No data changes.

