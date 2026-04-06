# Lock Room — Frontend

Web client for the Lock Room project — an encrypted credentials vault manager.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Meta-framework | TanStack Start |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| Forms | TanStack Form |
| Styling | Tailwind CSS v4 |
| HTTP client | ky |
| Language | TypeScript (strict) |
| Package manager | pnpm |
| Build tool | Vite |
| Testing | Vitest + Testing Library |

## Prerequisites

- [Node.js](https://nodejs.org) >= 20
- [pnpm](https://pnpm.io) >= 9

## Setup

```bash
cp .env.example .env
# fill in your environment variables
```

## Running locally

```bash
pnpm install
pnpm dev
```

App starts at `http://localhost:3000`.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests with Vitest |
| `pnpm lint` | Lint with ESLint |
| `pnpm format` | Check formatting with Prettier |
| `pnpm check` | Format + lint fix in one pass |

## Project structure

```
src/
├── routes/           # File-based routes (TanStack Router)
│   ├── __root.tsx
│   ├── index.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── recover.tsx
│   └── dashboard.tsx
├── components/
│   ├── ui/           # Generic components (Button, Input, Modal...)
│   └── [feature]/    # Feature-specific components
├── hooks/            # Reusable custom hooks
├── services/         # HTTP call functions (no React imports)
├── queries/          # Query keys and query/mutation factories (TanStack Query)
├── stores/           # Global state (if needed)
├── lib/              # Pure helpers, utilities, HTTP client
├── types/            # Global types and interfaces
└── styles.css        # Global CSS
```

## Layer responsibilities

| Layer | Responsibility |
|---|---|
| `routes/` | Layout composition, loaders, `<Outlet />` |
| `components/` | Rendering and local UX only |
| `hooks/` | Reusable logic, side effects, derived state |
| `queries/` | Query/mutation definitions (TanStack Query) |
| `services/` | HTTP calls — no UI logic |
| `lib/` | Pure functions, no React dependency |

## Docker

To run via Docker Compose (from the project root):

```bash
docker compose up
```
