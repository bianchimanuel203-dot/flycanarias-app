# FlyCanarias app

Instructions for any coding agent working in this project. Keep this file short: a rule stays only if the agent gets it wrong without it.

Context: docs/PRODUCT_REQUIREMENTS.md (what and why), docs/DESIGN_SYSTEM.md (how it looks), docs/ARCHITECTURE.md (how it is built). Read the one you need, not all.

## Stack
React 18.3.1 with JSX, Vite 5.4.21, @supabase/supabase-js 2.116.0 (auth only), lucide-react 0.383.0, inline CSS-in-JS, no backend, no router (package-lock.json:1230, :1599, :1680, :1827; src/FlyCanarias.jsx:2293). Hosting: Vercel per README (README.md:30).

## Commands
- Install: `npm install` (README.md:60)
- Dev: `npm run dev` (package.json:9)
- Test: none, there is no test script (package.json:8-12)
- Build: `npm run build` (package.json:10)
- Preview: `npm run preview` (package.json:11)
- Env: copy `.env.example` to `.env.local` and set the names VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (.env.example:1-2; README.md:61-62). Never print or copy values.

## Conventions
- Screens switch by a `screen` string in state, not a router (src/FlyCanarias.jsx:2293, :2355-2378).
- Colour tokens: `LIGHT` and `DARK` objects read through `ThemeContext` (src/FlyCanarias.jsx:40-83).
- localStorage keys all start with `fc_` (src/FlyCanarias.jsx:86-94).
- Almost all app code is in one 2384-line file: grep for a function name to get its line, then read only that range.
- UI copy is Spanish (index.html:2; src/FlyCanarias.jsx).

## Rules
- Work on a `jarvis/<short-task>` branch; never on main. No push, deploy or deletion without Manuel's OK.
- Build in vertical slices; verify each one (build, screenshot) before the next. There are no tests.
- Never invent client data, copy or numbers: leave a double-brace placeholder and say what is missing.
- Demo project, no client. Keep it a demo: flights, prices, seats, bookings, payments and check-in are simulated in the browser. Do not add a router, a backend or real payments without asking.
- Never print `.env` values or write them into code or docs.
- Do not read src/FlyCanarias.jsx whole; grep by function name with line numbers, then read that range.
- House rule: do not write known issues, security findings or personal data into this repo, whatever its visibility (see docs/ARCHITECTURE.md, Security).

## Agents
Specialised agents this project uses (names from ~/jarvis-work/.claude/agents):
- web-builder: builds screens and components in src/.
- reviewer-auditor: reviews a diff before Manuel merges it.
- researcher: read-only fact finding about the code.
- docs-writer: writes and updates the files in docs/ from the code.
