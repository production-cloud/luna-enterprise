

# Fix left panel sizing + replace logo with uploaded mark

The current login left panel (46% width) is cramping content at the user's 995px viewport — the tagline wraps awkwardly and the gradient ring SVG doesn't match the brand. Reference image shows a wider, more breathable left panel and a rounded-square app-icon style logo.

## Changes — `src/luna/pages/Login.tsx` only

### 1. Rebalance the split
- Left panel: `md:w-[46%]` → `md:w-1/2` (50%)
- Right panel: `md:w-[54%]` → `md:w-1/2` (50%)
- Increase left padding from `40px 36px` to `48px 56px` so text breathes like the reference
- Increase right padding to `48px 56px` to match
- Keep the form's `max-w-[400px]` wrapper so the form itself doesn't stretch

### 2. Ensure left text is fully visible
- Tagline `font-size` stays `22px` but allow it to wrap naturally (remove the hard `<br />` so it reflows based on container width — matches the reference where it wraps after "intelligence")
- Subtitle: keep at 13px, allow natural wrapping
- Feature row titles: bump `color` from `#E2E8F0` to `#F1F5F9` for stronger contrast against `#0F172A`
- Feature descriptions: bump from `#475569` (too dim, currently illegible) to `#94A3B8` to match the reference's readable muted gray
- Footer strip color: bump from `#334155` to `#64748B` so "HIPAA-aligned…" is actually visible

### 3. Replace gradient ring SVG with uploaded app-icon logo
- Copy `user-uploads://pasted-1776767608059-0_Background_Removed.png` → `src/assets/luna-logo.png`
- Import as ES6 module: `import lunaLogo from '@/assets/luna-logo.png'`
- Replace the inline `<RingLogo />` SVG component with `<img src={lunaLogo} alt="Luna" width={36} height={36} style={{ borderRadius: 8 }} />`
- Remove the now-unused `RingLogo` component definition
- Keep the "Luna x Hospital" + "CLINICAL" text block to the right of the logo unchanged

### 4. Mobile (unchanged behavior)
- Below `md`: panels still stack vertically; left panel content remains visible with the new padding

## Files touched
- `src/luna/pages/Login.tsx` — resize panels, improve text contrast, swap logo
- `src/assets/luna-logo.png` — new asset (copied from upload)

## Out of scope
- No changes to authentication logic, routing, or any other page
- No changes to the right panel form fields, button styling, or copy

