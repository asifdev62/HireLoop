<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# hireloop

Job-board app built with Next.js 16 App Router, React 19, and Tailwind CSS v4 (PostCSS).

## Commands

- `npm run dev`, `npm run build`, `npm start`.
- Verify with `npm run lint` and `npm run typecheck`. There is no test suite or CI workflow.
- `npm run format` runs Prettier on `*.ts`/`*.tsx` only (no semicolons, double quotes, LF, Tailwind class sorting).

## Structure

- No monorepo. Routes live in `app/`, shared UI in `components/`, auth and utilities in `lib/`.
- `@/*` maps to the repo root, not `src/`.
- `app/page.tsx` is the only page: `Navbar` plus `Hero`. Navbar links to `/jobs`, `/company`, `/pricing`, `/sign-in`, and `/sign-up`, which do not exist yet.
- The only API route is `app/api/auth/[...all]/route.ts`, the Better Auth GET/POST handler.

## UI conventions

- shadcn is configured as `base-nova` and uses Base UI (`@base-ui/react`), not Radix. Compose triggers with `render={<Component />}`; there is no `asChild` prop.
- Add components with `npx shadcn@latest add <name>`; generated files go in `components/ui/`.
- `lib/utils.ts` re-exports `cn` from the `cn` package; some UI files import `cn` from `"cn"` directly.
- `app/globals.css` in the working tree currently imports only `tailwindcss`. shadcn components need the full theme layer from the committed file (`tw-animate-css`, `shadcn/tailwind.css`, and the `:root`/`.dark` token definitions) for classes such as `bg-background` and `border-border` to resolve.

## Auth and environment

- `lib/auth.ts` hardcodes MongoDB at `mongodb://localhost:27017/hireloopdb`. Start local MongoDB before exercising auth.
- Google OAuth reads `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; neither is present in the current `.env`.
- `lib/auth-client.ts` hardcodes `baseURL: "http://localhost:3000"`. Update it if the dev server uses another host or port.
- `.env*` is gitignored. The local `.env` already sets `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.
