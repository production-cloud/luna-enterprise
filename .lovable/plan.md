

# Three Overview Card Fixes

## 1. Phase ring — proportional, not broken
In `Overview.tsx` `PhaseRing`, the segment math uses hardcoded follicular = `ovDay - 6` and luteal = `len - 5 - (ovDay-6) - 1`, which can go negative or oversized for non-Priya patients (e.g. Ananya len=36, ovDay=21 → luteal becomes huge). Fix the proportions to clinically realistic, always-positive values:

- Menstrual = period days (from cycle data; default 5)
- Follicular = `ovDay - period` (days between period end and ovulation)
- Ovulation = 1
- Luteal = `len - ovDay`

Rebuild the dasharray loop so each arc length = `(days/total)*circ - gap` with `Math.max(..., 6)` floor so no segment collapses, and verify offsets reset cleanly. Result: visibly different proportions per phase (small Menstrual + Ovulation, larger Follicular + Luteal), no broken/overlapping arcs at the top.

## 2. Biomarker Snapshot — 30/60/90d actually swaps values
Today only a footer note changes. Restructure `snapshot` in `data.ts` so each metric carries three value/delta pairs:

```ts
snapshot: [
  { k:'Resting HR', vals:{ '30d':{v:'62 bpm',d:'stable',g:false}, '60d':{v:'63 bpm',d:'↓ −1', g:true}, '90d':{v:'64 bpm',d:'↓ −2 bpm', g:true} } },
  ...
]
```

Add realistic 30/60/90d values for all 4 patients (HR, HRV, Sleep Quality, Stress, SpO₂). The toggle reads `r.vals[range]` and re-renders. Remove the now-redundant "30-day window" footer line.

## 3. Sleep card — show avg in top right
Add `avg {X.Xh}` (mono, slate-400) to the right of the "Sleep · last 14 nights" eyebrow, mirroring the screenshot. Compute it from `ctx.data.sleep14` (`sum/14`, 1 decimal). No other layout change.

## Files touched
- `src/luna/data.ts` — restructure `snapshot` per patient with 30/60/90d values; update `Snapshot` type
- `src/luna/pages/Overview.tsx` — fix `PhaseRing` proportions, wire range toggle to `vals[range]`, add avg sleep header
- `src/luna/pdf.ts` — adjust if it reads `snapshot[i].v` directly (use `vals['30d'].v` as default)

No visual changes beyond the three fixes.

