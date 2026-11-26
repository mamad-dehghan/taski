# Taski refactor plan

Status: **preparing** — documentation only. Package upgrades and code changes start after the kitty commits are pushed to GitHub.

Decisions locked:

- Harden IndexedDB broadly (no single reported repro).
- Task conflicts are rejected **per category**.
- Theme hues live in `localStorage`; dark mode stays in the kitty `darkMode` cookie.
- kitty is consumed as a **pinned `git+https` commit**; kitty itself is not edited from this repo.
- Keep the custom dashboard identity (rail + taski logo), but make it responsive in three tiers.
- Use **wouter** for routing and **zustand** only for UI/preferences.
- Replace every in-repo component that kitty already provides; keep only components kitty does not have.

## Kitty dependency

kitty repo: `https://github.com/mamad-dehghan/kitty.git`

Required kitty state (already committed locally, **5 commits ahead of `origin/main`**):

- `f560ef8` — clean `tsc` + export `useTheme`.
- Earlier commits: Toast API, NavBar rail action, TabBar scroll modes.

Steps before taski work:

1. Push kitty `main` to GitHub.
2. Pin the full commit SHA in taski:
   ```json
   { "dependencies": { "kitty": "git+https://github.com/mamad-dehghan/kitty.git#<sha>" } }
   ```
3. `bun install`, commit `package.json` + `bun.lock`.

Rules:

- Bun only. `npm install` in taski previously modified the linked kitty checkout; never use npm here.
- The git install is a copy in `node_modules`; installing taski cannot modify `packages/kitty`.
- Keep `resolve.dedupe: ["react", "react-dom"]`.
- Offline fallback: `bun pm pack` in kitty and depend on `file:./vendor/kitty-<version>.tgz`.
- Snapshot semantics: kitty changes require a new push/pack + reinstall; there is no live kitty HMR in taski.

## Phase 0 — toolchain baseline

Goal: a modern, reproducible build before any feature work.

- [ ] Add kitty as pinned `git+https` dependency.
- [ ] React 19 + `react-dom` 19 + `@types/react*` 19.
- [ ] Vite 6 + `@vitejs/plugin-react-swc` 3.8 + compatible `vite-plugin-pwa`.
- [ ] TypeScript 5.9+ (or kitty's 7.x line); `moduleResolution: "Bundler"`.
- [ ] `resolve.dedupe: ["react", "react-dom"]` in `vite.config.ts`.
- [ ] Add scripts: `typecheck` and `test` (`bun test`).
- [ ] Remove `@types/node` parse failure. Current baseline fails because TS 4.9 cannot parse modern `@types/node`; the old "3 known errors" note in AGENTS.md is outdated.
- [ ] Keep the app working on the old UI; only the toolchain changes in this phase.

Acceptance: `bun run dev`, `bun run build`, `bun test` (even if empty), and `bun run typecheck` behave predictably. Kitty typecheck is already clean at `f560ef8`.

## Phase 1 — storage hardening

Goal: stop data loss, make queries correct, remove startup storage coupling.

### Schema v2 (`src/utils/database/database.ts`)

```ts
this.version(2).stores({
  tasks: "++id, startTime, endTime, categoryId",
  profile: "id",              // singleton, fixed key 1
  category: "++id, title",
});
```

- Keep table names (`category`, not `categories`) to avoid a data migration.
- Existing v1 data must survive. Add an upgrade test with a v1 fixture.
- Do not add `&title` to `category`: existing duplicates would block the upgrade. Enforce uniqueness inside a read/write transaction.
- Remove the old compound `[startTime+endTime]` dependency from code before or with the schema change.

### Queries (`src/utils/database/task.ts`)

- Add `readTasksInRange(start, end)`:
  `where("startTime").below(end).and(t => t.endTime >= start)`.
- Group results by local day in memory: `groupTasksByDay(tasks, range)`.
- Multi-day tasks appear on **every** overlapping day; clip time blocks to the visible day.
- One `useLiveQuery` per visible range. Remove per-day query loops from:
  - `components/cell/ACell.tsx`
  - `components/schedule/ScheduleView.tsx`
  - `components/datePicker/DatePicker.tsx` badges
  - `providers/layout/panels/CalendarPanel.tsx`
- Date picker badges: one range query + a `Set<"YYYY-MM-DD">` of days with tasks.

### Seed and profile

- Seed with awaited `bulkAdd`; no `forEach(async …)`.
- Profile is a singleton: `put({id: 1, ...})`, no auto-increment.
- `readProfile` returns `undefined`/the row, never `{id: 1, ...undefined}`.
- `createProfile` becomes an upsert; logging in again must not throw `ConstraintError`.
- Login profile must include `preference` or drop the field from the model; settings must not depend on it.
- Await all writes; surface errors with a toast.

### Conflict rule (per category)

- Reject when: same non-null `categoryId`, both tasks timed (`!isAllDay`), intervals overlap.
- Uncategorized tasks and all-day tasks never conflict.
- Enforce on **create and update** (exclude the current task id on update).
- Same helper used by both paths; add tests.

### Settings boundary

- Hues → `localStorage` (zustand `persist` once Phase 3 lands; interim manual key `taski-preferences`).
- Dark mode → kitty `darkMode` cookie.
- One-time migration: if `profile.preference` contains hues and `localStorage` is empty, apply and save.
- Remove top-level `await` from `src/providers/theme/theme_provider.tsx` and the top-level-await workaround in `vite.config.ts` when no longer needed.
- Profile/categories/tasks remain in IndexedDB.

### Robustness

- `navigator.storage.persist()` after the DB opens.
- `db.on("versionchange")` → close and show a reload notice.
- `db.on("blocked")` → show an update notice.
- Root error boundary around the app.
- No unhandled promise rejections from DB writes.

### Tests (`bun test` + `fake-indexeddb`)

- v1 → v2 migration keeps tasks/profile/categories.
- Seed runs once and is idempotent.
- Profile upsert and re-login.
- Multi-day overlap range query.
- Per-category conflict rules (create + update).
- All-day exclusion.
- Jalali/Gregorian date conversion regression (Phase 4 bug).

Acceptance: reload persistence, migration from an existing DB, multi-day tasks visible on every day, no duplicate/conflicting writes.

## Phase 2 — kitty wiring

### Providers and hooks (`src/main.tsx`)

```tsx
<ThemeProvider>
  <TooltipProvider>
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  </TooltipProvider>
</ThemeProvider>
```

- Mount kitty's `useHistoryLockAbility()` once in the router.
- Delete `src/providers/{theme,toast,tooltip,dialogProvider,appLayer}` and the matching hooks.
- Keep `CalendarProvider` only if it is still needed after wouter; otherwise replace with `useCalendarRoute()`.
- kitty `ThemeProvider` requires `#theme-provider` for portals; never render overlays outside it.

### Component replacement

Delete and use kitty:

- Actions: `UI/button`, `UI/iconButton`, `UI/fab`, `UI/groupButtons` → `Button`, `IconButton`, `FAB`, `FABMenu`, `GroupButton`.
- Inputs: `UI/input`, `UI/select`, `UI/switch`, `UI/checkBox`, `UI/chip` → kitty equivalents (`Select` options use `label`, `Input` has built-in `label`).
- Display: `UI/menu`, `UI/dialog`, `UI/divider`, `UI/badge`, `UI/tooltip` → `Menu`, `Modal`, `Divider`, `Badge`, `Tooltip`.
- Helpers: `UI/Shrink` → `Collapse`; `tagInput` → `MultiItemInput`.
- Unused: `UI/radio`, `UI/range` → delete (or kitty `RadioButton` if needed).

Keep:

- `datePicker`, `timePicker`, `DateAndTimePicker` (calendar domain).
- `UI/Label` (kitty has no Label).
- `UI/Popup` as a thin anchored popover; reimplement internals on kitty `AppLayer` + `PlaceFinder` instead of a second overlay system.
- Calendar grid, schedule view, task dialogs/layout (app-specific).
- `sidebarItem` unless the responsive shell replaces it.

### SCSS

- Replace `@use "../../providers/theme/*"` with `@use "kitty/scss/{palette,typography,elevation,breakpoint,animation}"`.
- Delete duplicated palette/typography/elevation/transition/index SCSS.
- Update app-specific styles to kitty tokens: `hsl(var(--primary))`, `element--*` classes, `.as-root`.
- Remove the `/app` demo route and `src/App.tsx`.

Acceptance: all four views, task dialogs, settings, dark mode, hue changes, menus and tooltips work on kitty; typecheck is 0.

## Phase 3 — wouter + zustand + responsive shell

### Wouter

```tsx
<Switch>
  <Route path="/login" component={Login} />
  <Route>
    <AppLayout>
      <Switch>
        <Route path="/dashboard/calendar/:mode/:day" component={CalendarPage} />
        <Route path="/dashboard/setting" component={Setting} />
        <Route><Redirect to={todayUrl} /></Route>
      </Switch>
    </AppLayout>
  </Route>
</Switch>
```

- Replace `BrowserRouter`, `Routes`, `Navigate`, `Outlet`, `useNavigate`, `useParams`.
- `AppLayout` takes `children`; no `Outlet`.
- `useCalendarRoute()` uses `useRoute("/dashboard/calendar/:mode/:day")`. This also fixes the duplicate `CalendarProvider` in `main.tsx`, which sat above the routes and never received params.
- Validate `:mode` and `:day`; invalid URL redirects to today.
- Keep URL params as the source of truth for the selected day and mode.

### Zustand (only where needed)

1. `usePreferencesStore` (`persist`): `themeHues`, `calendarSystem` (`jalali | gregory`), `weekStartsOn`. Feeds kitty `ThemeProvider` via `modify` / `overrideTheme`; replaces the manual theme storage wrapper. Dark mode stays kitty's cookie.
2. `useTaskDialogStore`: `task`, `mode` (`show | edit | null`), `openShow`, `openEdit`, `close`. One `<TaskDialogHost>` in `AppLayout`; delete ref plumbing and per-view hosts.
3. `useUiStore`: `activePanel` (`calendar | categories | null`), no persistence.

Do not move tasks/categories/profile into zustand; Dexie + `useLiveQuery` stays the data layer.

### Responsive AppShell

Breakpoints (app-owned): phone `< 600px`, tablet `600–1023px`, desktop `≥ 1024px`.

| | Desktop | Tablet | Phone |
| --- | --- | --- | --- |
| Rail | 72px, logo | 64px, logo | hidden |
| Logo | rail top | rail top | header |
| Panels | inline, 320–360px | kitty `Drawer` overlay | kitty `BottomSheet` |
| Navigation | rail | rail | bottom nav |
| Month cell | 2 tasks + `+N` | 2 tasks + `+N` | date + count badge; tap opens day |
| Add | kitty `FAB` | kitty `FAB` | center button in bottom nav |
| Search | inline | icon + popover | kitty `SearchInput` sheet |

- Panels must never expand/squeeze the calendar column on tablet/phone.
- `useMediaQuery` only chooses `Drawer` vs inline panel; layout stays CSS-driven.
- Bottom nav is a custom `<nav>` (kitty has no bottom nav) using kitty `IconButton`/tokens.
- PWA: `100dvh`, `env(safe-area-inset-bottom)`, 44px targets, aria-labels instead of hover tooltips on touch.
- Keep the current visual identity: rail, logo, header, FAB on desktop.

Acceptance: no overflow at 360, 390, 768, 1024 and 1440 widths; panels open/close with Back/Escape; PWA standalone looks correct.

## Phase 4 — calendar grid refactor

Goal: replace the heavy ACell markup with a data-first grid; apply the same pattern elsewhere.

### Data

```ts
const range = visibleRange(mode, day);
const tasks = useLiveQuery(() => readTasksInRange(range.start, range.end), [range.start, range.end]) ?? [];
const tasksByDay = groupTasksByDay(tasks, range);
const categories = useCategoriesById(); // one live query
```

### Components

- `MonthGrid` + `MonthCell`: CSS grid, no absolute positioning.
- `TimeGrid` + `DayColumn` + `TaskBlock`: day/week only; blocks positioned with `--start`/`--duration`.
- Split month vs day/week rendering instead of one conditional `OneDay`.

### Straight month cell

```tsx
const dayTasks = tasksByDay.get(dayKey) ?? [];
const visible = dayTasks.slice(0, 2);
const more = dayTasks.length - visible.length;
```

Render date + up to two titles + a single `+N`. No `reduceRight`, no `Wrap`, no "and N other todo(s)" per task. On phones show only the date and a count badge.

### Bugs to fix in this phase

- `dayTask[index]` can be `undefined` on view switches; always `?? []`.
- Timed task height uses `10 * 60 * 60 * 24` (10 days); use 24h.
- `SingleTodo` performs one category live query per task; pass a category map.
- `useWeekObject` / `useDayObject` have `[]` dependencies; use `[date]`.
- Mirroring live queries into state in `ACell`; return the query result directly.
- Multi-day tasks render only on the start day; render on each overlapping day.

### Same pattern elsewhere

- `ScheduleView`: one range query + grouping, no `Promise.all` per day.
- `DatePicker`: range-based badge set.
- `CalendarPanel`: `useLiveQuery` instead of manual `useEffect`.
- `SearchBar`: one query + in-memory filtering.
- `AppHeader` / navigation: wouter, no duplicated date parsing.

Acceptance: month counts match the data, multi-day tasks visible on every day, no per-day N+1 queries, no layout hacks.

## Phase 5 — stabilize and cleanup

- Fix `DateAndTimePicker` Jalali/Gregorian mix (verified: picking 21 Ordibehesht 1403 produced a Date in year 1403 AD). Add a regression test.
- Normalize all-day tasks: start-of-day/end-of-day, hide time sections, require `end > start`.
- Validate `:day` URLs; reject invalid dates.
- Remove 88 `console.log`s, commented blocks and dead files.
- Remove unused deps (`uuid`, `focus-trap-react` once popup/dialog are gone, `prop-types`, `colortranslator` if settings no longer need it).
- Loading/empty/error states for all views; toasts on every write.
- `App.tsx` demo harness removed; kitty demos are the component playground.
- Update README/AGENTS/skill once the migration lands.

QA matrix: 4 views × Jalali/Gregorian dates × light/dark × add/edit/delete/all-day/multi-day × phone/tablet/desktop.

## Feature roadmap (after the refactor)

| Priority | Features |
| --- | --- |
| P1 — data safety & core UX | JSON export/import (versioned), undo delete via toast action, recurring tasks (`daily/weekly/monthly` + interval/until), category CRUD with reassignment, search results that navigate to tasks |
| P2 — reminders & PWA | per-task reminders + foreground Notification API, install/update prompts, offline fallback page, quick-add FAB |
| P3 — calendar polish | drag/drop + resize, real day/week timeline with current-time indicator and overlap columns, fa/en i18n + RTL, Jalali/Gregorian toggle, keyboard shortcuts/a11y audit |
| P4 — bigger | separate `EventModel`, ICS import/export, stable UUIDs, optional sync/accounts (normalize reserved event/reminder/user models first) |

## Risks / open items

- Kitty must be pushed before the `git+` pin can include `useTheme` and clean types.
- Git install needs network on a clean install; use the tarball fallback if offline installs are mandatory.
- React 19 upgrade can surface peer issues in formik/dexie-react-hooks; verify early in Phase 0.
- IndexedDB migration must be tested against a real v1 database, not only a fresh one.
- kitty `Modal` uses `document.startViewTransition`; keep a fallback for unsupported browsers.
- The current app has no test runner; Phase 0 adds it before storage changes.
