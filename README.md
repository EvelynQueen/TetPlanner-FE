# 🧧 TetPlanner – Frontend

A React-based frontend for Vietnamese Tết (Lunar New Year) preparation, powered by a **Spring Boot** backend. Manage tasks, shopping lists, budgets, and occasions with a festive, themed UI — all counting down to Tết 2026.

## Tech Stack

**Frontend:** React 19 · Vite 7 · Tailwind CSS 4 · React Router 7 · Axios · GSAP · Lucide Icons · react-hook-form · react-toastify · lunar-javascript · xlsx
**Backend:** Spring Boot (separate repository)

## Features

| Module | Capabilities |
|---|---|
| **Authentication** | Email/password sign-up, OTP email verification, login, Google Sign-In, forgot/reset password |
| **Dashboard** | Tết countdown timer, task/shopping/budget progress cards, daily breakdown by occasion |
| **Tasks** | CRUD with category & occasion assignment, priority levels (LOW/MEDIUM/HIGH), status tracking (TODO/IN_PROGRESS/DONE), optimistic updates with 5-second undo |
| **Shopping** | Shopping items grouped by category, per-budget item tracking, check/uncheck progress |
| **Budgets** | Create & manage budgets linked to occasions, spending progress visualization |
| **Occasions** | CRUD for Tết-related occasions (dates/events), date-range queries for calendar view |
| **Calendar** | Monthly calendar with lunar date display, occasion & task overlay |
| **Theming** | Multiple color themes with falling-flower animation, persisted in localStorage |

## State Structure

State is managed via **React Context + custom hooks** — no external state library.

```
BrowserRouter
 └─ AuthProvider          → token, user, userName, auth actions
     └─ ThemeProvider     → theme, flowerIcon, changeTheme()
         └─ App
             ├─ (unauthenticated) → Login / SignUp / Verify / Reset routes
             └─ (authenticated)   → nested data providers ↓
                 DashboardProvider → tetDate, taskStats, shoppingPercent, budgetLabel, dailyBreakdown
                  └─ OccasionProvider    → occasions[], CRUD actions
                   └─ BudgetProvider     → budgets[], summary, progress, CRUD actions
                    └─ ShoppingCategoryProvider → categories[], CRUD actions
                     └─ ShoppingItemProvider    → item CRUD actions
                      └─ TaskCategoryProvider   → categories[], CRUD actions
                       └─ TaskProvider          → tasks[], categories[], occasions[], deferred-undo actions
```

Each provider follows the same pattern: **local `useState` + async API calls + error/loading flags**, exposed through a context-specific custom hook (e.g. `useAuth`, `useBudget`, `useTask`).

## Getting Started

```bash
npm install
npm run dev          # → http://localhost:5173
```

Set `VITE_API_URL` in a `.env` file to point to your backend (default: `http://localhost:8080/api`).

## Known Limitations

- **No token refresh** — when the JWT expires the user is silently logged out; no refresh-token flow is implemented.
- **Single-budget dashboard** — progress cards reflect only the currently selected budget, not an aggregate across all budgets.
- **No offline support** — all data requires a live backend connection; there is no service worker or local cache layer.
- **Console log noise** — the Axios interceptor logs every outgoing token to the console (`console.log("Token found:", …)`)
- **No unit/integration tests** — the project has no test suite; correctness relies on manual QA.

## License

MIT
