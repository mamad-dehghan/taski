# Taski

An offline-first **todo / calendar** app. Everything — profile, categories and tasks — lives in **IndexedDB**, so there is no backend, no account and no network needed after the first load. The visible calendar is Persian (Jalali), while URLs stay Gregorian.

> **Refactor in progress.** The app is being migrated to the stack below, including the [kitty design system](https://github.com/mamad-dehghan/kitty). Migration details live in [AGENTS.md](AGENTS.md) and [docs/REFACTOR_PLAN.md](docs/REFACTOR_PLAN.md).

## Features

- **Calendar views:** day, week, month and a monthly agenda (schedule) view.
- **Persian calendar:** Jalali calendar via `jalaliday`; URLs keep Gregorian `YYYY-MM-DD` dates.
- **Task management:** add, edit and show task dialogs, categories, start/end date-time, all-day tasks and tags.
- **Date picker:** single-day and range select, Persian or Gregorian calendar, controlled or uncontrolled.
- **Settings:** profile details, categories and appearance preferences.
- **Theming:** light/dark mode plus customizable hues.
- **Offline & installable:** PWA built with `vite-plugin-pwa`, auto-updating service worker, static-host friendly.
- **Accessibility-minded UI:** focus handling in overlays, keyboard support and ARIA attributes.

## Tech stack

| Area | Stack |
| --- | --- |
| UI | React + kitty design system |
| Build | Vite + TypeScript |
| Routing | wouter |
| State | zustand (UI/preferences) + Dexie (data) |
| Calendar | dayjs + `jalaliday` |
| Forms | formik + yup |
| PWA | `vite-plugin-pwa` |

## Development

The project uses [Bun](https://bun.sh) as its package manager.

```bash
bun install
bun run dev
```

The dev server runs at [http://localhost:9119](http://localhost:9119) and opens `/`.

Production build and local preview:

```bash
bun run build     # vite build (does not type-check)
bun run preview
```

Type-checking is separate:

```bash
bunx tsc --noEmit -p tsconfig.json
```

> `npx tsc` resolves a different `tsc` package here, so use `bunx`.

## Routes

| Route | Description |
| --- | --- |
| `/login` | Create a local profile. Writes only to IndexedDB — no server call. |
| `/dashboard/calendar/:mode/:day` | Main calendar. `mode` is `day`, `week`, `month` or `schedule`; `day` is **Gregorian** `YYYY-MM-DD`. |
| `/dashboard/setting` | Profile, categories and appearance settings. |
| `*` | Redirects to today's day view. |

## Data & storage

- A single IndexedDB database, **`TodoDB`**, is defined in `src/utils/database/database.ts` with three tables: `tasks`, `profile` and `category`.
- On first run the database is seeded with a sample profile, categories and tasks. To reset, delete `TodoDB` in DevTools → Application → IndexedDB.
- Task times are persisted as epoch milliseconds; conversions to/from the `Date`-based app model happen in `src/utils/database/task.ts`.
- UI reads use Dexie's `useLiveQuery`; writes go through helpers in `src/utils/database/*` so views update reactively.

## Project structure

```
src/
├─ main.tsx                 # providers, jalaliday registration
├─ app_router.tsx           # routes
├─ pages/                   # login, calendar, settings
├─ components/
│  ├─ UI/                   # reusable controls
│  ├─ cell/                 # day/week/month calendar grid
│  ├─ datePicker/           # Jalali/Gregorian date picker
│  ├─ timePicker/           # time picker
│  ├─ dialogs/              # add / edit / show task dialogs
│  ├─ schedule/             # monthly agenda view
│  └─ tagInput/             # tag input
├─ providers/               # layout, calendar, theme/toast/tooltip
└─ utils/
   ├─ database/             # Dexie setup and CRUD helpers
   ├─ dataModels/           # task, profile, category + reserved event/reminder/user
   └─ calendar/             # calendar/date utilities
```

Components are folders containing a PascalCase `.tsx` file and a matching `.scss` file, imported for its side effect.

## Deployment

The app is static output and can be hosted anywhere. `vercel.json` rewrites every path to `/` so SPA routing works, and the PWA manifest sets `start_url` to `/dashboard`.

## Images

### App

![week mode](https://ik.imagekit.io/zdldazk95/taski/Group%2053_1nYZCZ-Bu.png?updatedAt=1710415741598)

![month mode](https://ik.imagekit.io/zdldazk95/taski/Group%2052_2aYYlriCr.png?updatedAt=1709930020800)

![schedule mode](https://ik.imagekit.io/zdldazk95/taski/Group%2051_lBciG3Gqm.png?updatedAt=1709930017495)

![add task modal](https://ik.imagekit.io/zdldazk95/taski/Group%2050_SzoGpROcy.png?updatedAt=1709930023132)

### Selected components

#### Time Picker

![Time Picker](https://ik.imagekit.io/zdldazk95/taski/Group%2034_U66OhutYD.png?updatedAt=1709930022612)

#### Date Picker

dark mode / light mode - day select / range select - persian / georgian calendar - accessabilty

![Date Picker](https://ik.imagekit.io/zdldazk95/taski/Group%2045_c_aHSXSvT.png?updatedAt=1709930021120)

today - day with task - month & year select - controled / uncontroled mode

![Date Picker - 2](https://ik.imagekit.io/zdldazk95/taski/Group%2046_w5LJdTidU.png?updatedAt=1709930021340)
