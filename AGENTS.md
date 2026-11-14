# AGENTS.md

Taski is an offline-first todo/calendar SPA: React 18 + TypeScript + Vite, with **all user data in browser IndexedDB via Dexie**. There is no backend or API — `/login` only writes a local profile.

## Commands

Run from `packages/taski` unless noted.

- Install: `bun install` in this package. It has its own `bun.lock`; when used from the parent workspace, `bun install` at `C:\Code\root` also works. Do not add yarn/npm lockfiles.
- Dev server: `bun run dev` — Vite on port **9119**, and `vite.config.ts` auto-opens `/dashboard/setting`.
- Build: `bun run build` — this only runs `vite build`; it does **not** type-check.
- Typecheck: `bunx tsc --noEmit -p tsconfig.json`. `npx tsc` resolves the wrong "tsc" package here.
- Baseline typecheck is already failing with 3 unrelated errors (`FocusTrap` JSX typing in `Dialog.tsx`/`SinglePopup.tsx`, `NodeJS` namespace in `toast_provider.tsx`). Don't report these as new regressions; do fix errors introduced in files you touch.
- There is no test runner or lint script in this package. Don't invent `npm test`/`npm run lint`; the root `eslint.config.txt` is not wired up for this package.

## App structure

- `src/main.tsx`: registers `jalaliday` on dayjs, then mounts the provider stack (Theme → Toast → Tooltip → Popup → Dialog → BrowserRouter → Calendar) and `src/app_router.tsx`.
- Real app: `/dashboard/calendar/:mode/:day`, where `mode` is `day | week | month | schedule` and `day` is **Gregorian** `YYYY-MM-DD`. Also `/dashboard/setting` and `/login`.
- `*` redirects to today's day view. `/app` renders `src/App.tsx`, which is a demo harness, not the product calendar.
- Calendar flow: `pages/calendar/Calendar.tsx` → `components/cell/ACell.tsx` for day/week/month, and `components/schedule/ScheduleView.tsx` for the monthly agenda.
- Task dialogs share `components/dialogs/TaskDialogHost.tsx`; task writes go through `utils/database/task.ts`.
- `src/providers/*` holds context/provider/hook triples; `src/components/UI/*` reusable controls; `src/components/dialogs/*` task add/show/edit; `src/utils/{database,dataModels,calendar}` domain and persistence.

## IndexedDB / Dexie

- Single DB named **`TodoDB`**, defined in `src/utils/database/database.ts` (tables `tasks`, `profile`, `category`; schema version 1).
- Task times are stored as epoch milliseconds (`DexieTaskModel`), not `Date`. Convert at the DB boundary with `convertToTaskModel` / `convertToDexieTaskModel` in `src/utils/database/task.ts`.
- Task queries depend on the compound index `[startTime+endTime]`; don't change it without updating those queries.
- `db.on("populate")` seeds sample profile/categories/tasks on first run. To reset during development, delete the `TodoDB` database in DevTools → Application → IndexedDB. Schema changes need `this.version(n).stores(...)` plus migration logic.
- UI reads use Dexie's `useLiveQuery`; writes go through helpers in `src/utils/database/*` so the UI updates reactively.
- Dark mode is persisted in the `darkMode` cookie, while theme hues are stored in the `profile.preference` JSON string. Both matter when changing settings/theme behavior.
- `ThemeProvider` reads IndexedDB with **top-level await**; `vite.config.ts` explicitly enables top-level await. Don't remove that setting.

## Reserved domain models

- `src/utils/dataModels/event.ts`, `reminder.ts`, `user.ts`, and `test.json` are intentional scaffolding for planned Events, Reminders, and user sync. Do not delete them as dead code.
- Login/sync across browsers is deferred. When implementing those features, first normalize the models to the Dexie conventions (`id`, epoch-millisecond persisted timestamps, consistent tags) and plan stable IDs for sync.
- Reminder delivery is planned for foreground OS notifications while the PWA is open; no notification backend exists.

## Calendar/date gotchas

- The displayed calendar is Jalali/Persian: `isJalali = true` in `providers/calendarContext/CalendarProvider.tsx`, and `main.tsx` extends dayjs with `jalaliday`. Use the context's `dayjsLocal(dayjs(...))` for display/formatting.
- URL date params are always Gregorian. When navigating or building links, format with `.calendar("gregory").locale("en").format("YYYY-MM-DD")` (see `providers/layout/app_header.tsx`). Formatting a localized dayjs directly into a URL produces wrong routes.
- `TaskModel` uses real `Date` objects; only the Dexie model uses numbers.

## Conventions

- Components are folders with a PascalCase `.tsx` and a matching `.scss`, imported as a side effect (`import "./x.scss"`). Most exports are named.
- Styling uses theme CSS variables (`hsl(var(--...))`) and the `fillOptions`/`colorOptions` enums in `src/providers/theme/types.ts`. Follow existing UI component props (`fill`, `color`, `enable`, ...) instead of hard-coded colors.
- TypeScript is strict. `baseUrl: "src"` exists, but the code uses relative imports; keep that style.
- `dev-dist/` is generated PWA dev output and is ignored. Don't hand-edit it or commit it. `dist/` is also ignored.
- Deployment is static Vercel output; `vercel.json` rewrites every path to `/` for SPA routing, and the PWA `start_url` is `/dashboard`.
