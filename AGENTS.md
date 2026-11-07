<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# hireloop

Next.js 16.4.4 App Router job board with React 19, Tailwind CSS v4 (PostCSS), Better Auth, and MongoDB. npm is the package manager (`package-lock.json` only).

## Commands

- `npm run dev`, `npm run build`, `npm start`.
- Verify with `npm run lint` and `npm run typecheck`. There is no test suite or CI workflow; `npx eslint <path>` checks a single file.
- `npm run format` runs Prettier on `*.ts`/`*.tsx` only (no semicolons, double quotes, LF, Tailwind class sorting). It does not format CSS or JSON.

## Routes and wiring

- `@/*` maps to the repo root, not `src/`.
- Implemented routes: `/` (`app/page.tsx` renders `Hero`), `/sign-in` and `/sign-up` (route group `app/(auth)/`), plus `app/api/auth/[...all]/route.ts` (Better Auth GET/POST via `toNextJsHandler`).
- `app/layout.tsx` renders `Navbar` and the Sonner `Toaster` on every route, including the auth pages.
- Navbar links to `/jobs`, `/company`, and `/pricing`; auth pages link to `/forgot-password`, `/terms`, and `/privacy`. None of these routes exist yet.
- The auth pages are hand-written client components, not shadcn forms. Their Google buttons only log to the console (`TODO`); email/password calls go through `authClient`.

## UI conventions

- shadcn is configured as `base-nova` and uses Base UI (`@base-ui/react`), not Radix. Compose triggers with `render={<Component />}`; there is no `asChild` prop.
- Add components with `npx shadcn@latest add <name>`; files land in `components/ui/`.
- `cn` comes from the npm `cn` package. `lib/utils.ts` re-exports it, while generated UI files import from `"cn"` directly. Don't introduce `clsx`/`tailwind-merge`.
- `app/globals.css` contains only `@import "tailwindcss"`. The shadcn theme layer (`shadcn/tailwind.css`, `tw-animate-css`, `:root`/`.dark` tokens) is absent, so semantic classes used by `components/ui/*` (`bg-background`, `border-border`, `bg-popover`, `text-muted-foreground`, and variants like `data-horizontal:`) have no definitions. The custom pages mostly use literal colors and can look correct while shadcn components render unstyled.
- `next-themes` is wired with `defaultTheme="system"`; pressing `d` outside an input toggles light/dark.

## Auth and environment

- `.env` is gitignored and there is no `.env.example`. Required keys: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URL`.
- `lib/auth.ts` reads `MONGODB_URL` and hardcodes the database name `hireloopdb`. The local `.env` points `MONGODB_URL` at a remote Atlas cluster, not localhost, so auth test writes go to that remote database. A missing `MONGODB_URL` fails at auth module import.
- Google OAuth needs `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; neither is set. The Google buttons are stubs.
- `lib/auth-client.ts` hardcodes `baseURL: "http://localhost:3000"`. Keep it and `BETTER_AUTH_URL` in sync if the dev host/port changes.
