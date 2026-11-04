# Architecture: FlyCanarias app

## Stack
- Browser app: React 18.3.1 with JSX, built with Vite 5.4.21 (package-lock.json:1680, :1827; src/main.jsx:1-10).
- Auth client: @supabase/supabase-js 2.116.0 (package-lock.json:1230).
- Icons: lucide-react 0.383.0 (package-lock.json:1599).
- Backend: none. No server code and no database tables; no `.from(` or `.rpc(` calls in src/.
- Node version: none declared (no engines field or .nvmrc in the repo); Vercel's default applies (answer from Manuel, 2026-11-03).

## Hosting
- Vercel, with continuous deploy from GitHub, per README (README.md:30). Live demo URL in README (README.md:6).
- Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in the Vercel project flycanarias-app (answer from Manuel, 2026-11-03). Names only; see .env.example.
- No vercel.json in the repo.
- Build output goes to dist, which is git-ignored (.gitignore:2).
- The live URL answered HTTP 200 on 2026-11-03 (checked by JARVIS).

## Data
All app data is hard-coded in the source or kept in browser storage. Nothing is read from or written to a database.
- Airports: 8, hard-coded (src/FlyCanarias.jsx:131-140).
- Flights: 7, hard-coded, with price, times, seat count and aircraft (src/FlyCanarias.jsx:142-150).
- Promotions: 4, hard-coded (src/FlyCanarias.jsx:152-157).
- Seat map: 24 seats generated in the browser when the seat step opens; not saved (src/FlyCanarias.jsx:1062-1069).
- Extras: luggage, insurance and seat options with prices (src/FlyCanarias.jsx:208-221).
- Booking object: id, from, to, date, dep, arr, gate, seat, luggage, insurance, premiumSeat, extrasTotal, total, status (src/FlyCanarias.jsx:1077-1092).
- Booking reference: `FC-2026-` plus a 4-digit number, made in the browser (src/FlyCanarias.jsx:1078).
- Browser storage keys (src/FlyCanarias.jsx:86-94; read and written at :1704-1937 and :2306-2327):
  - fc_bookings: list of bookings; starts with one demo seed booking (src/FlyCanarias.jsx:159-171).
  - fc_settings: language, currency, dark mode, units, push toggle (src/FlyCanarias.jsx:2228).
  - fc_personal_data: personal data form values, including a profile photo (src/FlyCanarias.jsx:1702-1718).
  - fc_payment_methods: saved payment method summary, without the full card number (src/FlyCanarias.jsx:1800-1808).
  - fc_notifications: notification toggles (src/FlyCanarias.jsx:1904-1907).
  - fc_favorite_destinations: favourite destinations (src/FlyCanarias.jsx:1934-1937).
  - fc_dark_mode: defined but not read anywhere in the app (src/FlyCanarias.jsx:87).
- Sign-out: signing out (profile, "sign out everywhere", and the "Cerrar sesión y borrar mis datos" button) removes fc_bookings, fc_personal_data, fc_payment_methods, fc_notifications and fc_favorite_destinations from this browser and reloads the page; fc_settings stays (src/FlyCanarias.jsx:112-120, :2009, :2014, :2339).
- Not saved, React state only: check-in done flags and help chat messages (src/FlyCanarias.jsx:1358, :1470, :2131).
- Mock or simulated: flights, prices, seats, bookings, flight status, check-in, card payment, help chat (src/FlyCanarias.jsx:1863, :2134-2142).

## Integrations
- Supabase Auth: sign up, sign in, sign out, session read, auth state listener, password change (src/FlyCanarias.jsx:427-430, :1992-1994, :2007, :2311-2315).
- Google sign-in button: the code calls Supabase OAuth (src/FlyCanarias.jsx:402-405), but the Google provider is not set up (answer from Manuel, 2026-11-03).
- Supabase keys: env var names VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, kept in `.env.local`, which is git-ignored (src/lib/supabaseClient.js:3-4; .env.example:1-2; .gitignore:4).
- Unsplash: destination photos as CSS background images (src/FlyCanarias.jsx:123-128, :1953).
- api.qrserver.com: QR image on the boarding pass, URL built from the boarding-pass data (src/FlyCanarias.jsx:179-180, :1419-1420).
- Google Fonts: Inter, weights 400-800 (index.html:10-15).

## Security
- Secrets only in environment variables. `.env` and `.env.local` are git-ignored (.gitignore:3-4).
- Auth: Supabase email and password; a Google OAuth button exists in the code but the provider is not set up (src/FlyCanarias.jsx:402-431).
- Screens that need a session: bookings, check-in, profile and its sub-screens (src/FlyCanarias.jsx:2350-2357).
- Known issues and hardening items for this project are kept outside this repo (JARVIS vault note for the project), not here.

## Diagram
```
+-----------------------------+      +----------------------------+
| Browser: FlyCanarias (SPA)  | ---> | Supabase Auth              |
| React + Vite                |      | (email and password)       |
|                             |      +----------------------------+
|   localStorage (fc_*)       |
|                             | ---> Unsplash (photos)
|                             | ---> api.qrserver.com (QR image)
|                             | ---> Google Fonts (Inter)
+-----------------------------+
```

## Decisions
Dated from git history. The commit messages record what changed, not always why.
- 2026-09-15 (4b40b9d): React + Vite app created.
- 2026-09-15 (f30070b): v2 redesign, Supabase auth and Unsplash photos added.
- 2026-09-16 (51f1fd9): Google sign-in added; fixes to bookings, seats and totals.
- 2026-09-16 (b83f1c3): sign-in deferred until a booking; simulated check-in; help and contact added.
- 2026-09-16 (090088a): README revised.
- 2026-09-16 (12f1309): visual redesign in a Binter-style layout with FlyCanarias brand.
- 2026-09-16 (c1f2abc): OAuth redirect URL fixed; flight detail open without sign-in.
- 2026-09-16 (1a81429): Extras step and confirmation screen added to the booking flow.
- 2026-09-16 (d997d72): Profile > personal data screen.
- 2026-09-16 (3533ca0): Profile > payment methods screen.
- 2026-09-16 (07ef2b9): Profile > notifications screen.
- 2026-09-16 (7b9abd7): Profile > favourite destinations screen.
- 2026-09-16 (5c3962f): Profile > security screen.
- 2026-09-16 (98052a8): Profile > help screen.
- 2026-09-16 (2ec62f2): Profile > settings screen, global dark mode, navigation.
- 2026-11-04 (94e9694): sign-out clears the data saved in the browser; the "Eliminar cuenta" button became "Cerrar sesión y borrar mis datos".
