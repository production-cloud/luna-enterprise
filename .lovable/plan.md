# Redesign Login Page — Split-screen clinical layout

Replace the current centered card login with a full-viewport split-screen design matching the reference. No functional changes to authentication — the existing SHA-256 hashed credential check, `setLoggedIn()`, and redirect to `/` all stay intact. SSO and "Forgot password" / "Request access" are visual-only (non-functional placeholders, since user explicitly said no real auth).

## File touched

- `src/luna/pages/Login.tsx` — full visual rewrite

## Layout

```text
┌─────────────────────────┬───────────────────────────┐
│  LEFT 46%  #0F172A      │  RIGHT 54%  #FAFAF8       │
│                         │                           │
│  ◯ Luna x Hospital      │  LUNA X HOSPITAL          │
│    CLINICAL             │  Welcome back             │
│                         │  Sign in to your…         │
│  Fertility intelligence │                           │
│  for your clinic        │  Email                    │
│  AI-powered patient…    │  [doctor@hospital.com]    │
│                         │                           │
│  ▰▰▰▰ phase bar         │  Password                 │
│  Menstrual Foll OV Lut  │  [••••••••]               │
│                         │              Forgot pw?   │
│  ▣ Continuous biometric │                           │
│  ▣ Cycle & AI insights  │  [  Sign in  ]            │
│  ▣ Shareable reports    │  ──────────────           │
│                         │  [ 🔒 Continue with SSO ] │
└─────────────────────────┴───────────────────────────┘
```

- Root: `min-h-screen flex` (stacks to column under `md:` breakpoint so mobile still works)
- Left: `md:w-[46%]` `bg-[#0F172A]` `p-[40px_36px]` flex column `justify-between`
- Right: `md:w-[54%]` `bg-[#FAFAF8]` `p-[40px_44px]` flex column `justify-center`
- Whole page wrapped with `style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}`

## Left panel content

1. **Logo row** — gradient ring SVG (28px) + "Luna LifeOS" (15px/700/#fff) stacked over "CLINICAL" eyebrow (9px/700/uppercase/#475569)
2. **Tagline block** — "Fertility intelligence / for your clinic" (22px/700/#fff) + subtitle (13px/#64748B)
3. **Cycle phase bar** — single 5px-tall flex bar with 4 colored segments (17/30/3/flex-1) using `#F4A7B9 / #C4B5FD / #FCD34D / #5EEAD4`, plus 4 small labels below in matching colors (9.5px/600)
4. **Three feature rows** — each with 30×30 `#1E293B` rounded icon box (ECG / clock / document SVGs, stroke `#5B4FCF`), title (12.5px/600/#E2E8F0), desc (11.5px/#475569)

## Right panel content

- Wrapper: `max-w-[400px] w-full mx-auto` so form doesn't stretch on wide screens
- Eyebrow "LUNA X HOSPITAL" (10px/700/uppercase/#94A3B8)
- Heading "Welcome back" (24px/700/#0F172A)
- Subheading "Sign in to your clinical dashboard" (13px/#64748B)
- Email + Password inputs: custom-styled native `<input>` (42px tall, 1px `#E2E8F0` border, 10px radius, focus ring `#5B4FCF` with `0 0 0 3px rgba(91,79,207,0.08)`) — implemented inline with Tailwind + a small focus style (not shadcn `Input`, to match spec exactly)
- Placeholders: `doctor@hospital.com` and `••••••••••`
- "Forgot password?" link right-aligned (12px/#5B4FCF/500) — `<a href="#"` with `onClick={(e) => e.preventDefault()}` (non-functional)
- Sign-in button: 44px gradient `linear-gradient(135deg,#5B4FCF,#8B5CF6)`, white text, calls existing `verifyCredentials` → `setLoggedIn` → `nav('/', { replace: true })`. Inline error message stays (red text under password).
- Divider 1px `#F1F5F9` with `24px` vertical margin
- SSO button: 40px outlined, lock SVG + "Continue with SSO", `onClick={(e) => e.preventDefault()}` (non-functional placeholder)
- Footer: "New to Luna? Request access →" centered (12px/#94A3B8, link in `#5B4FCF`)

## Functional behavior preserved

- Same `verifyCredentials(email, password)` async hash check from `src/luna/auth.ts`
- Same `setLoggedIn()` + `nav('/', { replace: true })` on success
- Same inline "Invalid email or password" error
- `busy` state disables the sign-in button and shows "Signing in…"
- No new dependencies, no new files, no auth.ts changes
- `LunaLogo` import is dropped (replaced by inline gradient ring SVG per spec)

## Responsiveness

- Below `md` (≤768px): panels stack vertically (left on top, right below). Left panel keeps all content but with reduced top/bottom padding so it stays usable on mobile. The form panel remains centered.

## Out of scope

- Actually wiring "Forgot password", "Request access", or "Continue with SSO" — they are visual-only per the demo-gate scope established earlier
- Importing DM Sans / JetBrains Mono fonts (assumed already loaded for the app; if not present, a separate small change to `index.html` would be needed — flagging but not changing here unless you ask)