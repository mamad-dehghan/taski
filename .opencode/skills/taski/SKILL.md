---
name: Taski App
description: Work on the Taski offline-first todo/calendar PWA in packages/taski — features, Dexie storage, Jalali calendar, kitty UI, routing/state, responsive dashboard, tests and refactors
---

# Taski App

Offline-first todo/calendar PWA. All user data lives in browser IndexedDB; there is no backend. Visible calendar is Jalali, URLs stay Gregorian.

Read first:

- `README.md` — product overview, commands, images.
- `docs/REFACTOR_PLAN.md` — authoritative migration plan and decisions.
- `AGENTS.md` — current-state rules.

## Migration status

The repo is mid-refactor. Check `package.json` before assuming:

- **Current code:** React 18, react-router-dom, in-repo `src/components/UI/*`, Dexie schema v1, theme in `profile.preference`, top-level await in `ThemeProvider`.
- **Target:** React 19, kitty via pinned `git+https` commit, wouter, zustand (UI/preferences only), Dexie schema v2, responsive AppShell, theme hues in `localStorage`.

Do not half-migrate: if a change touches a target area, either finish that slice or follow the plan phase.

## Commands

Run in `packages/taski`:

```bash
bun install
bun run dev        # Vite :9119, opens /
bun run build      # vite build only, no typecheck
bun run preview
bunx tsc --noEmit -p tsconfig.json
bun test           # added in Phase 0
```

- Use **Bun only**. Never run `npm install` here; it previously modified the linked kitty checkout.
- `npx tsc` resolves the wrong package; use `bunx`.
- The current typecheck baseline fails because TS 4.9 cannot parse modern `@types/node`. Phase 0 fixes this; don't treat it as a feature regression.
- There is no lint script wired up.

## Source map

- `src/main.tsx` — dayjs + `jalaliday`, providers, router mount.
- `src/app_router.tsx` — routes (`/login`, `/dashboard/calendar/:mode/:day`, `/dashboard/setting`, catch-all).
- `src/pages/` — `login`, `calendar`, `setting`.
- `src/components/cell/ACell.tsx` — day/week/month grid; replaced by the Phase 4 grid.
- `src/components/schedule/ScheduleView.tsx` — monthly agenda.
- `src/components/datePicker|timePicker|DateAndTimePicker/` — app-specific pickers; keep after kitty migration.
- `src/components/dialogs/` — add/edit/show task dialogs + `TaskDialogHost`.
- `src/utils/database/` — Dexie setup and CRUD.
- `src/utils/dataModels/` — task, profile, category; event/reminder/user are reserved.
- `src/utils/calendar/` — day/week/month builders and route date parsing.
- `src/providers/layout/` — header, sidebar, panels, search.

## Data rules (Dexie)

- DB: `TodoDB` in `src/utils/database/database.ts`; tables `tasks`, `profile`, `category`.
- Persisted task times are epoch milliseconds; convert at the boundary with `convertToTaskModel` / `convertToDexieTaskModel`.
- Reads use `useLiveQuery`; writes go through helpers in `src/utils/database/*`.
- Schema v1 → v2 (Phase 1): `tasks` indexed by `startTime`, `endTime`, `categoryId`; `profile` keyed by fixed `1`. Keep table names.
- Range queries must include tasks that **started earlier and overlap** the range; multi-day tasks appear on every overlapping day.
- One live query per visible range. Don't query per day in a loop.
- Conflicts: per non-null `categoryId`, timed tasks only; all-day and uncategorized never conflict; enforce on create **and** update.
- Seed with awaited `bulkAdd`; never `forEach(async …)`.
- Profile is a singleton (`put` key `1`), never auto-increment.
- Theme hues go to `localStorage`; dark mode is the `darkMode` cookie (kitty owns it). Don't put UI preferences back into IndexedDB.
- Do not remove `navigator.storage.persist()`, `versionchange`/`blocked` handling once added.

## Calendar and date rules

- URL params are **Gregorian** `YYYY-MM-DD`; display/format through the Jalali calendar.
- Build URLs with `.calendar("gregory").locale("en").format("YYYY-MM-DD")`.
- `isJalali` is currently hardcoded in `providers/calendarContext/CalendarProvider.tsx`.
- Never mix calendar instances: don't read Jalali `year/month/date` and set them on a plain `dayjs`. The date/time picker currently has this bug; Phase 5 fixes it. Prefer deriving from `Date` components or a single calendar-aware instance.
- All-day tasks: normalize to start-of-day / end-of-day and require `end > start`.

## kitty rules

- kitty is a React 19 design system consumed as a pinned git commit:
  `git+https://github.com/mamad-dehghan/kitty.git#<sha>`.
- Do not edit `../kitty` from this repo. Request changes in kitty, push, then bump the pin.
- Never run `npm install`; Bun installs a copy into `node_modules`.
- Keep `resolve.dedupe: ["react", "react-dom"]`.
- If kitty exports it, delete the taski copy and use kitty (Button, IconButton, FAB, Input, Select, Switch, Checkbox, Chip, Menu, Modal, Divider, Badge, Tooltip, Collapse, MultiItemInput, providers/hooks).
- Keep only what kitty lacks: date/time pickers, Label, thin anchored Popup (built on `AppLayer` + `PlaceFinder`), calendar grid, layout, task dialogs.
- Import SCSS via `@use "kitty/scss/<module>"`; use HSL role tokens (`hsl(var(--primary))`), not hardcoded colors.
- Overlays portal into `#theme-provider`; mount `useHistoryLockAbility()` once in the router.

## Routing and state (target)

- wouter: `Switch`, `Route`, `Redirect`, `useLocation`, `useRoute`.
- Layout uses a catch-all route with `AppLayout` as children wrapper; no `<Outlet>`.
- `useCalendarRoute()` reads `:mode/:day`; invalid params redirect to today.
- URL params are the source of truth for the selected day/mode.
- zustand only for:
  - `usePreferencesStore` (persisted): theme hues, calendar system, week start.
  - `useTaskDialogStore`: current task + show/edit mode; one dialog host in `AppLayout`.
  - `useUiStore`: active side panel.
- Do not move tasks/categories/profile into zustand.

## Responsive shell

- phone `<600px`, tablet `600–1023px`, desktop `≥1024px`.
- Keep the custom rail + taski logo on desktop/tablet; hide the rail on phones and use a bottom nav.
- Panels: inline on desktop, kitty `Drawer` on tablet, `BottomSheet` on phone; never squeeze the calendar column.
- Month cells on phones: date + count badge; tap opens the day.
- PWA: `100dvh`, safe-area insets, 44px targets, no hover-only tooltips on touch.

## Calendar grid (target)

- Data-first: `readTasksInRange` → `groupTasksByDay` → render.
- `MonthGrid`/`MonthCell`: CSS grid; at most two task titles + one `+N`; no `reduceRight`, `Wrap`, or per-task "and N other" strings.
- `TimeGrid`/`DayColumn`/`TaskBlock`: positions via `--start`/`--duration`; fix the old 10-day divisor to 24h.
- Never index into a stale task matrix; `tasksByDay.get(day) ?? []`.
- Apply the same one-query pattern to ScheduleView, DatePicker badges, CalendarPanel and SearchBar.

## Reserved

`src/utils/dataModels/event.ts`, `reminder.ts`, `user.ts`, `test.json` are intentional scaffolding for Events, Reminders and sync. Don't delete them. Normalize them to Dexie conventions before implementing.

## Verification

- `bun run build` succeeds.
- `bun run typecheck` is 0 (after Phase 0/kitty pin).
- `bun test` covers storage/date changes.
- Manual matrix: 4 views × Jalali/Gregorian × light/dark × add/edit/delete/all-day/multi-day × phone/tablet/desktop.
- Update README/AGENTS/plan when behavior or public structure changes.
