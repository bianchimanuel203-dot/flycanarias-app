# Product requirements: FlyCanarias app

## Client
demo, no aplica

## Goal
A mobile-first concept of an inter-island flight booking app for the Canary Islands; a demo project (README.md:3; package.json:5).

## Users
- Guest traveller: browses home and search, opens flight details, without an account (src/FlyCanarias.jsx:2346-2349).
- Signed-in traveller: signs in or registers with email and password (the code also has a Google button, but the Google provider is not set up), books a flight, views bookings and the boarding pass, does check-in, edits the profile (src/FlyCanarias.jsx:387, :402-431, :2350).
- Visitor with a question: uses the FAQ and the help chat, which gives canned replies (src/FlyCanarias.jsx:2102, :2129-2142).

## Features
Ordered by value; the first is the first vertical slice.
1. Flight search: pick origin and destination from 8 airports; done when a search returns flights from the hard-coded list. Status: implemented. When no exact match exists, it shows other flights (src/FlyCanarias.jsx:131-150, :898-911).
2. Booking stepper: details, seat, extras, payment, confirmation; done when a confirmed booking appears in "Mis reservas". Status: implemented. Confirming needs a session (src/FlyCanarias.jsx:1052, :1076-1096, :1341).
3. Simulated payment: done when the payment step is labelled as simulated and no payment is sent anywhere. Status: simulated (src/FlyCanarias.jsx:1863, :1076-1096).
4. Bookings and boarding pass: done when a booking shows a boarding pass with a QR image. Status: implemented, bookings are kept in the browser (src/FlyCanarias.jsx:1356, :1419-1421).
5. Check-in: done when a booking can be checked in and shows as done. Status: simulated; the done flags are not saved (src/FlyCanarias.jsx:1358, :1470).
6. Flight status: done when a flight shows its status. Status: mock; it picks a flight by route or falls back to the first one (src/FlyCanarias.jsx:1544, :1552).
7. Auth: done when a user can sign in, sign up and sign out. Status: implemented with Supabase Auth for email and password; signing out clears the data saved in the browser (src/FlyCanarias.jsx:112-120); the Google button is in the code but the Google provider is not set up (answer from Manuel, 2026-11-03; src/FlyCanarias.jsx:402-431, :2338).
8. Profile data: personal data, payment methods, notifications, favourite destinations; done when each one saves and is still there after reload. Status: implemented, kept in the browser (src/FlyCanarias.jsx:1702, :1800, :1904, :1934).
9. Security screen: done when password change and "sign out everywhere" work. Status: implemented with real Supabase calls (src/FlyCanarias.jsx:1986-2010). The last button, "Cerrar sesión y borrar mis datos", signs out and clears the data saved in this browser; it does not delete the Supabase account (src/FlyCanarias.jsx:2012-2015, :2071).
10. Settings: done when dark mode changes every screen. Status: dark mode implemented; language, currency, units and push toggles are stored and not used elsewhere (src/FlyCanarias.jsx:2228, :2242, :2278, :2342).

## Non-goals
- Real payments: no payment code in the repo (README.md:84; src/FlyCanarias.jsx, no payment SDK).
- Real flight data, prices or seat availability: all mock (src/FlyCanarias.jsx:131-157).
- Backend tables or server-side bookings: no database calls in src/ (grep for `.from(` and `.rpc(`: 0 matches).
- Tests (package.json:8-12).
- PWA and push notifications (README.md:85-86).
- A working loyalty programme: "Club Isleño" is one static label (src/FlyCanarias.jsx:1649).

## Success criteria
demo, no aplica

## Deadline
demo, no aplica

## Open questions
- Sign-in is email and password through Supabase Auth; the Google provider is not set up (answer from Manuel, 2026-11-03; code in src/FlyCanarias.jsx:398-410, 416).
- To check: do sign-up and sign-in work end to end today, and is email confirmation required after sign-up? Not yet tested.
- Is the live demo URL still responding? Yes: HTTP 200 on 2026-11-03 (checked by JARVIS).
- README says App.jsx is the auth gate; App.jsx only renders the main component, the gate is in src/FlyCanarias.jsx:2350-2357 (README.md:39; src/App.jsx:1-5).
- README says there is no external CSS dependency; the repo has index.css and Google Fonts (README.md:29; src/index.css; index.html:12-15).
- README lists push notifications and PWA as pending; Settings shows a push toggle that is only stored (README.md:85-86; src/FlyCanarias.jsx:2278).
- README calls "Club Isleño" a loyalty programme; the code has one static label (README.md:19; src/FlyCanarias.jsx:1649).
- README lists Stripe as pending; there is no Stripe code (README.md:84; src/FlyCanarias.jsx).
- README lists Google OAuth among the features; the Google provider is not set up, so only email and password sign-in is available (README.md:23-30; answer from Manuel, 2026-11-03).
