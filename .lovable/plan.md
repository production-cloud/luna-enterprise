
# Fix dark-mode readability in Overview alerts and AI Insights

## 1. Replace brittle global selector approach
The current dark-mode fix in `src/index.css` relies on `[style*="..."]` attribute selectors to detect pastel backgrounds. That is too fragile for mixed inline styles, nested text utilities, and future copy changes.

Replace it with explicit semantic classes for light pastel surfaces:
- `.luna-soft-panel`
- `.luna-soft-panel-danger`
- `.luna-soft-panel-warn`
- `.luna-soft-panel-info`
- `.luna-soft-panel-success`
- `.luna-soft-panel-title`
- `.luna-soft-panel-meta`

These classes will define both background and text color together in light mode and dark mode, so readability is guaranteed instead of inferred.

## 2. Apply the new classes to the affected UI
Update the components where the unreadable text appears:

### `src/luna/pages/Overview.tsx`
- Active Alerts cards
- Biomarker snapshot callout
- Sleep callout

### `src/luna/pages/Insights.tsx`
- Top info strip
- “Action required” alert rows
- Pattern insight cards
- Strengths / Concerns boxes

Use the semantic classes above instead of depending on `text-slate-*` inside pastel-background containers.

## 3. Keep severity accents, but separate them from body text
For alert chips, left borders, dots, and confidence bars:
- Keep the existing clinical accent colors (`C.flag`, `C.low`, `C.normal`, `C.indigo`)
- Do not use those accent colors as the main body text color
- Body copy, headings, and metadata should use dedicated readable text tokens from the new classes

This preserves the current visual language while fixing contrast.

## 4. Make dark mode intentional, not inherited
In `src/index.css`:
- Keep the existing global `.dark .text-slate-*` overrides for standard dark UI
- Remove the pastel-surface readability logic based on `[style*="..."]`
- Add explicit dark-mode styles for the new semantic classes, for example:
  - pastel panel backgrounds can stay softly tinted
  - panel body text becomes dark slate when background is light
  - or, if needed per surface, use darker tinted backgrounds with light text for better contrast consistency

Preferred approach: keep the pastel surfaces and force readable dark-slate text inside them.

## 5. Normalize repeated pastel UI patterns
Also apply the same class system to the other matching surfaces so the problem does not reappear elsewhere:
- `src/luna/pages/Partner.tsx` info strip and status chip
- `src/luna/pages/Biomarkers.tsx` blood warning
- `src/luna/pages/Lifestyle.tsx` adherence badge
- `src/luna/atoms.tsx` `StatusPill` and `SevPill`

This keeps all alert/status surfaces consistent across the dashboard.

## 6. No copy or layout changes
Do not change:
- wording
- spacing
- card layout
- alert counts
- confidence bar behavior

Only fix color handling and theme readability.

## Files touched
- `src/index.css` — add semantic pastel-surface classes and dark-mode variants; remove brittle attribute-selector patch
- `src/luna/pages/Overview.tsx` — apply semantic classes to alerts/callouts
- `src/luna/pages/Insights.tsx` — apply semantic classes to info strip, alerts, insight cards, strengths/concerns
- `src/luna/pages/Partner.tsx` — align info/status surfaces
- `src/luna/pages/Biomarkers.tsx` — align warning surface
- `src/luna/pages/Lifestyle.tsx` — align adherence badge
- `src/luna/atoms.tsx` — update shared status/severity pill styling to use the same semantic class system
