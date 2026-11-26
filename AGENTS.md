# AGENTS.md

Taski is an offline-first todo/calendar SPA with **all user data in browser IndexedDB via Dexie**. There is no backend or API — `/login` only writes a local profile.

> **Migration in progress.** The target is React 19 + kitty (pinned `git+https`), wouter, zustand, Dexie schema v2 and a responsive AppShell. The current code is still React 18 + react-router-dom with the in-repo UI copy. Read `docs/REFACTOR_PLAN.md` before touching routes, storage, theme or UI components, and read `.opencode/skills/taski/SKILL.md` for the working rules.

## Refactor status

- **Blocked on:** pushing kitty's 5 local commits and pinning the full SHA in `package.json`.
- **Phase 0:** React 19 + Vite 6 + TypeScript, kitty `git+` pin, `typecheck`/`test` scripts, React dedupe.
- **Phase 1:** Dexie schema v2, range queries + day grouping, profile upsert, per-category conflicts, theme hues in `localStorage`, `versionchange`/`blocked`/`persist()` guards, storage tests.
- **Phase 2:** kitty providers and component swaps, delete the in-repo copies, migrate SCSS imports to `kitty/scss/*`, remove the `/app` demo.
- **Phase 3:** wouter routing, zustand stores (preferences, task dialog, active panel), 3-tier responsive AppShell (rail on desktop/tablet, bottom nav + overlay panels on phone).
- **Phase 4:** ACell grid refactor — one range query, straight month-cell counts, split month vs day/week, apply the same pattern to ScheduleView, DatePicker badges and SearchBar.
- **Phase 5:** fix the Jalali/Gregorian picker bug, all-day normalization, invalid URL dates, dead-code/console cleanup, QA matrix.
- **Feature roadmap:** P1 data safety (export/import, undo, recurring, category CRUD, search), P2 reminders/PWA, P3 calendar polish/i18n, P4 events/ICS/sync. Details in `docs/REFACTOR_PLAN.md`.

Locked decisions: harden IndexedDB broadly; conflicts are per category; theme hues in `localStorage` and dark mode in the kitty cookie; kitty is a pinned `git+https` snapshot; keep the custom rail/logo but make it responsive; wouter owns URL state; zustand only for UI/preferences; replace every component kitty already exports.

## Commands

Run from `packages/taski` unless noted.

- Install: `bun install` in this package. Each package owns its `bun.lock`; there is no root workspace, so don't install from `C:\Code\root`. Use Bun only — never run `npm install` here (it previously modified the linked kitty checkout). Do not add yarn/npm lockfiles.
- Dev server: `bun run dev` — Vite on port **9119**, opens `/` (the app redirects to today's day view).
- Build: `bun run build` — this only runs `vite build`; it does **not** type-check.
- Typecheck: `bunx tsc --noEmit -p tsconfig.json`. `npx tsc` resolves the wrong "tsc" package here.
- Current typecheck baseline fails on modern `@types/node` syntax because TypeScript 4.9 is too old. Phase 0 upgrades TypeScript; don't treat this as a feature regression.
- There is no test runner or lint script yet. Phase 0 adds `bun test` + `fake-indexeddb`. Don't invent `npm test`/`npm run lint`; the root `eslint.config.txt` is not wired up for this package.

## App structure

- `src/main.tsx`: registers `jalaliday` on dayjs, then mounts the provider stack (Theme → Toast → Tooltip → Popup → Dialog → BrowserRouter → Calendar) and `src/app_router.tsx`. Target: kitty providers + wouter; see `docs/REFACTOR_PLAN.md`.
- Real app: `/dashboard/calendar/:mode/:day`, where `mode` is `day | week | month | schedule` and `day` is **Gregorian** `YYYY-MM-DD`. Also `/dashboard/setting` and `/login`.
- `*` redirects to today's day view. `/app` renders `src/App.tsx`, which is a demo harness; it will be removed in the refactor.
- Calendar flow: `pages/calendar/Calendar.tsx` → `components/cell/ACell.tsx` for day/week/month, and `components/schedule/ScheduleView.tsx` for the monthly agenda. `ACell` is the next grid refactor; don't add more logic to its current wrapper markup.
- Task dialogs share `components/dialogs/TaskDialogHost.tsx`; task writes go through `utils/database/task.ts`.
- `src/providers/*` holds context/provider/hook triples; `src/components/UI/*` reusable controls; `src/components/dialogs/*` task add/show/edit; `src/utils/{database,dataModels,calendar}` domain and persistence.

## IndexedDB / Dexie

- Single DB named **`TodoDB`**, defined in `src/utils/database/database.ts` (tables `tasks`, `profile`, `category`; schema version 1). Target schema v2: `tasks` indexed by `startTime`, `endTime`, `categoryId`; `profile` keyed by fixed `1`; keep table names.
- Task times are stored as epoch milliseconds (`DexieTaskModel`), not `Date`. Convert at the DB boundary with `convertToTaskModel` / `convertToDexieTaskModel` in `src/utils/database/task.ts`.
- Current task queries depend on the compound index `[startTime+endTime]`; it misses tasks that started before the queried day. Phase 1 replaces these queries with `readTasksInRange` + day grouping, so don't extend the compound-index pattern.
- `db.on("populate")` seeds sample profile/categories/tasks on first run. The current seed uses `forEach(async …)`; Phase 1 makes it awaited and idempotent. To reset during development, delete the `TodoDB` database in DevTools → Application → IndexedDB. Schema changes need `this.version(n).stores(...)` plus migration tests.
- UI reads use Dexie's `useLiveQuery`; writes go through helpers in `src/utils/database/*` so the UI updates reactively. One live query per visible range; don't add per-day query loops.
- Current theme storage: dark mode in the `darkMode` cookie, hues in the `profile.preference` JSON string. Target: hues in `localStorage`, dark mode cookie owned by kitty. Don't add new preferences to `profile.preference`.
- `ThemeProvider` currently reads IndexedDB with **top-level await**; `vite.config.ts` enables top-level await. Both are scheduled for removal — don't add new top-level-await usage.

## Reserved domain models

- `src/utils/dataModels/event.ts`, `reminder.ts`, `user.ts`, and `test.json` are intentional scaffolding for planned Events, Reminders, and user sync. Do not delete them as dead code.
- Login/sync across browsers is deferred. When implementing those features, first normalize the models to the Dexie conventions (`id`, epoch-millisecond persisted timestamps, consistent tags) and plan stable IDs for sync.
- Reminder delivery is planned for foreground OS notifications while the PWA is open; no notification backend exists.

## Calendar/date gotchas

- The displayed calendar is Jalali/Persian: `isJalali = true` in `providers/calendarContext/CalendarProvider.tsx`, and `main.tsx` extends dayjs with `jalaliday`. Use the context's `dayjsLocal(dayjs(...))` for display/formatting.
- URL date params are always Gregorian. When navigating or building links, format with `.calendar("gregory").locale("en").format("YYYY-MM-DD")` (see `providers/layout/app_header.tsx`). Formatting a localized dayjs directly into a URL produces wrong routes.
- `TaskModel` uses real `Date` objects; only the Dexie model uses numbers.

## Kitty dependency

- Target: `"kitty": "git+https://github.com/mamad-dehghan/kitty.git#<commit-sha>"`. It is not wired yet; wait for the kitty push and then pin the full SHA.
- kitty is installed as a copy in `node_modules`; this package must never modify `../kitty`.
- Use Bun only. Never run `npm install` here.
- Keep `resolve.dedupe: ["react", "react-dom"]` in `vite.config.ts`.
- Once kitty is wired: delete any in-repo component that kitty exports (Button, Input, Select, Menu, Modal, Tooltip, providers, etc.) and use kitty instead. Keep only what kitty lacks: date/time pickers, Label, thin popup on `AppLayer`/`PlaceFinder`, calendar grid/layout, task dialogs.
- Offline fallback: `bun pm pack` in kitty, then depend on `file:./vendor/kitty-<version>.tgz`.

## Conventions

- Components are folders with a PascalCase `.tsx` and a matching `.scss`, imported as a side effect (`import "./x.scss"`). Most exports are named.
- Current styling uses theme CSS variables (`hsl(var(--...))`) and the `fillOptions`/`colorOptions` enums in `src/providers/theme/types.ts`. After the kitty migration use `kitty/scss/<module>` and kitty's enums (`colorMode`, `fill`, `size`) instead of the local copies.
- TypeScript is strict. `baseUrl: "src"` exists, but the code uses relative imports; keep that style.
- Target routing/state: wouter for URLs (selected day/mode stays in the URL) and zustand only for preferences, the task dialog and the active side panel. Don't put Dexie data in zustand.
- Target shell: keep the custom rail + taski logo on desktop/tablet; phone uses a bottom nav and overlay panels. Breakpoints are app-owned: phone `<600px`, tablet `600–1023px`, desktop `≥1024px`.
- `dev-dist/` is generated PWA dev output and is ignored. Don't hand-edit it or commit it. `dist/` is also ignored.
- Deployment is static Vercel output; `vercel.json` rewrites every path to `/` for SPA routing, and the PWA `start_url` is `/dashboard`.

## Documentation

- `README.md` — product overview, commands, dependency workflow.
- `docs/REFACTOR_PLAN.md` — authoritative phases, decisions, schema v2, responsive shell, ACell refactor, roadmap.
- `.opencode/skills/taski/SKILL.md` — working rules and source map for agents.
