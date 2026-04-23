

# Add a gated login page (no real auth, hashed credentials)

## Goal
Block access to the dashboard until the user enters:
- Email: `test@lunazone.com`
- Password: `lunahealth321`

The plain credentials must NOT appear in the shipped JS bundle (no inspect-element leak).

## Approach: hash check, not plaintext compare

The credentials will never exist as strings in the source code. Instead, the source contains only the **SHA-256 hashes** of the expected email and password. On submit, we hash what the user typed using the browser's built-in `crypto.subtle.digest('SHA-256', …)` and compare to the stored hashes.

This means:
- Viewing source / inspect element only reveals two opaque 64-char hex strings.
- Reverse-engineering the password from a SHA-256 hash is not feasible for a strong string, and `lunahealth321` is reasonable enough for this demo gate. (Note: this is obfuscation, not real security — for true security we'd need a backend. The user explicitly said "doesn't need any auth", so this is the right level.)

## New files

### `src/luna/auth.ts`
- Exports `EXPECTED_EMAIL_HASH` and `EXPECTED_PASSWORD_HASH` constants (precomputed SHA-256 hex of `test@lunazone.com` and `lunahealth321`, lowercased/trimmed).
- Exports `sha256Hex(input: string): Promise<string>` using `window.crypto.subtle`.
- Exports `verifyCredentials(email, password): Promise<boolean>`.
- Exports `isLoggedIn()` / `setLoggedIn()` / `logout()` helpers backed by `sessionStorage` (key `luna.session`, value is itself a hash so it can't be hand-forged easily).

### `src/luna/pages/Login.tsx`
- Centered card on the existing `C.bg` background, matching Luna's visual language (same fonts, soft border, rounded, subtle shadow).
- "Luna x Hospital" wordmark at top.
- Email + password inputs (shadcn `Input`, `Label`), "Sign in" button (shadcn `Button`).
- Inline error: "Invalid email or password" on bad submit (no hint about which field).
- On success: `setLoggedIn()` then `navigate('/', { replace: true })`.
- Respects dark mode (uses existing tokens, no hardcoded text colors that break in dark).
- No "demo credentials" text shown anywhere.

### `src/luna/RequireAuth.tsx`
- Wrapper component: if `isLoggedIn()` → render `<Outlet />`; else `<Navigate to="/login" replace />`.

## Modified files

### `src/App.tsx`
- Add `/login` route (public).
- Wrap the existing `LunaLayout` route in `<RequireAuth>` so `/`, `/cycle`, `/biomarkers`, `/lifestyle`, `/insights`, `/partner` all require login.
- `NotFound` route stays public.

### `src/luna/Sidebar.tsx`
- Add a small "Sign out" action at the bottom (next to the existing dark-mode toggle from earlier work). Clicking it calls `logout()` and navigates to `/login`.
- Keep existing layout/spacing; just one extra icon button.

## Session behavior
- Login persists for the browser tab session (`sessionStorage`), so refresh keeps the user in but closing the tab signs them out. This is appropriate for a demo gate and avoids stale logins on shared machines.
- No "remember me" checkbox (keeps surface minimal and avoids long-lived plaintext-ish flags in `localStorage`).

## What an attacker sees in DevTools
- Two SHA-256 hex strings in the bundle.
- A `sessionStorage` entry like `luna.session = <hash>` after login.
- No plaintext email, no plaintext password, no `if (email === "test@…")` check.

## Out of scope
- No Supabase / Lovable Cloud auth (user said not needed).
- No password reset, no signup.
- No rate limiting (purely client-side gate).
- No copy or layout changes to existing dashboard pages.

## Files touched
- `src/luna/auth.ts` — new (hashed credentials + helpers)
- `src/luna/pages/Login.tsx` — new (login UI)
- `src/luna/RequireAuth.tsx` — new (route guard)
- `src/App.tsx` — add `/login` route, wrap dashboard routes in guard
- `src/luna/Sidebar.tsx` — add "Sign out" button

