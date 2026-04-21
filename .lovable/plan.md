

# Luna LifeOS — Patient data, fixes & PDF export

## 1. Per-patient realistic data
Restructure `data.ts` so all clinical data (sleep, temp, cycles, blood, supps, habits, insights, partner, gaps, alerts, biomarker snapshot) is keyed by patient ID. Add a `getPatientData(id)` helper. Each of the 4 patients gets a distinct, internally consistent profile:

- **Priya Sharma (31, amber)** — current dataset (mild sleep debt, low omega-3, 4 regular cycles)
- **Ananya Mehta (28, red)** — irregular cycles (32–38d), low ferritin + vit D, elevated stress, poor HRV trend
- **Deepa Nair (35, green)** — clean panel, regular 28d cycles, strong HRV, no flags
- **Riya Kapoor (33, green)** — slightly long luteal phase, optimal bloods, good adherence

All pages (Overview, Cycle, Biomarkers, Lifestyle, Insights, Partner) read from the active patient via the existing `useOutletContext` so switching patients in the TopBar updates every view.

## 2. Logo stays full-size when sidebar collapses
In `Sidebar.tsx`, keep the `LunaLogo` always rendered at its current 26px. Only the text block ("Luna LifeOS / Clinical") fades with `expanded`. Logo container keeps fixed width so it doesn't shift.

## 3. Cycle & Temperature interactivity
- **C1–C4 tabs change the chart**: add per-cycle `TEMP_30` arrays (4 variants per patient) and per-cycle metadata (length, ovulation day, date label). Selecting C1/C2/C3/C4 swaps the AreaChart data, the title ("Cycle Cx · Nd"), the OV ReferenceLine x-position + label, and the clinical note.
- **Phase distribution hover**: each colored segment in `PhaseBars` becomes hoverable. On hover, show a small tooltip ("Follicular · 9 days") and slightly lift opacity of other segments. Implemented with a local `hovered` state + absolutely positioned tooltip (no extra deps).

## 4. Remove all Kindbody mentions
- `Partner.tsx` info strip → "Partner health data is supplementary and optional."
- Partner panel subtitle → just the date (e.g. "Feb 3, 2026 · External lab")
- Search the whole codebase for "Kindbody" and remove every occurrence.

## 5. Download PDF actually downloads a patient summary
Add `jspdf` (lightweight, client-side). Create `src/luna/pdf.ts` exporting `downloadPatientSummary(patient)` that builds a multi-section PDF:

- Header: Luna LifeOS · Clinical Summary, patient name/age, sync date
- Active alerts list
- Cycle summary (last 4 cycles table + averages)
- Latest blood panel (markers, results, range, status)
- Supplements & adherence
- AI insights (top correlations)
- Footer: generated date

Wire it up in three places (all currently inert):
- TopBar "Download PDF" button
- Overview FooterStrip "Download PDF Report →" link
- Any other inert PDF/download triggers

## 6. Remove "Share with patient"
Delete the outlined button in `TopBar.tsx`.

## 7 & 8. Remove Help and Settings icons
Delete the entire bottom nav block (Settings + Help) in `Sidebar.tsx`. Also drop the now-unused `IconSettings` / `IconHelp` exports.

## Make all remaining buttons functional
Audit and wire small actions (no UI changes):
- Biomarker snapshot 30/60/90d toggle → already swaps state; ensure values shift per range (add 3 value sets per patient)
- Cycle C1–C4 tabs → see #3
- Biomarkers "+ Upload new panel" → toast "Upload coming soon"
- Partner "Request" buttons → toast `Requested: {gap title}`
- TopBar patient selector → already works, keep

Use the existing `sonner` toaster (already wired in `App.tsx`) for placeholder actions so nothing is dead.

## Files touched
- `src/luna/data.ts` — restructure to per-patient
- `src/luna/Layout.tsx` — pass patient down (already does via context)
- `src/luna/Sidebar.tsx` — full-size logo, remove Settings/Help
- `src/luna/TopBar.tsx` — remove Share, wire Download PDF
- `src/luna/pages/*.tsx` — read from active patient, Cycle interactivity, Partner Kindbody removal, wire buttons
- `src/luna/pdf.ts` — new, jsPDF summary generator
- `package.json` — add `jspdf`

No other UI/visual changes.

