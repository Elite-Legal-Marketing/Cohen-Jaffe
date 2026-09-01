# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-01

## Where things stand

Scaffolded, deployed, and now fully tooled — with **no site built yet**. The plumbing
works, the Studio is branded and reachable, both quality gates pass, and the two gaps that
existed this morning are closed. The site itself is still one blank home page, by design.

The next session builds the actual site. Everything it needs is in place.

- **Branch: `design_system`** — created off `master`, **no upstream yet**, and now carrying
  uncommitted work (below). `AGENTS.md` says "work on `master` unless asked otherwise";
  that is overtaken — `design_system` is current.
- `origin/master` is at `09bcdfe`. Everything since is **uncommitted on this branch**.
- Verified after every change: `npm run build` green, `npm run check:types` **0 errors**,
  `npm run typegen` clean, production `/` and `/admin` both 200, both CORS origins live.

## Uncommitted on `design_system`

Two pieces of work, both finished and verified:

**1. Trailing slash decided and wired.** Settled from evidence: all **2262** unique
`og:url` values in the WordPress mirror end in `/`, and `www.cohenjaffe.com` 301s the
unslashed form to the slashed one. So: `astro.config.mjs` → `trailingSlash: "always"`,
`vercel.json` → `"trailingSlash": true`. Recorded in `AGENTS.md` with the reasoning.

**2. The missing tooling added:** `sanity.cli.ts`, `npm run typegen`, `npm run check:types`
(+ `@astrojs/check`, `typescript`, `@types/node`), and the generated
`src/sanity/{schema.json,sanity.types.ts}`.

Getting `check:types` to actually pass took three real fixes, all worth keeping:
- `@types/node` + `/// <reference types="node" />` in `src/env.d.ts` — the two config files
  use `process`.
- `sanity.config.ts` now uses a `required()` guard that **throws naming the variable and
  the file**, instead of passing `undefined` through to `@sanity/client`'s
  `Configuration must contain \`projectId\``, which names nothing and fails the whole build.
- `src/sanity/eliteTheme.d.ts` replaced with the precise declaration from Dormer Harpring.
  This is the important one: it fixes the two `theme.ts` type errors **at the declaration**,
  so `theme.ts` stays byte-identical across all four Elite sites. Do not "fix" `theme.ts`
  itself — that would fork the shared brand layer.

## Decisions made, and why

- **`@sanity/ui` pinned to `^4`** — load-bearing, do not remove. `sanity@6.11` imports
  `@sanity/ui/toast`; `@sanity/astro → @sanity/visual-editing` pulls `@sanity/ui@3`, which
  npm hoists; Vite's dev-only `optimizeDeps` then resolves against v3 and `/admin` renders
  blank **while `npm run build` stays green**. Full diagnosis in `AGENTS.md` → Gotchas.
- **`vercel.json` pins `framework: "astro"`** — the Vercel project was created before this
  code existed, so it saved preset "Other", under which the output directory resolves to
  `public/` and Vercel would serve the favicons instead of `dist/`.
- **`typegen.enabled` is deliberately omitted** from `sanity.cli.ts`. It only fires on
  `sanity dev` / `sanity build`, which an *embedded* Studio never runs — setting it true
  would be a claim that doesn't hold. `npm run typegen` is the real path.
- **Generated artifacts live in `src/sanity/`**, not the repo root, and typegen's `path`
  globs exclude `*.d.ts`, `eliteTheme.js` and its own output — without those exclusions
  typegen prints a parse error on every run.
- **No Vercel adapter** — the static build is correct for this site.

## Open questions / waiting on the user

**None.** Both Sanity CORS origins are configured with credentials and verified by
preflight; env vars are set for all three environments; trailing slash is decided.

A new CORS origin **will** be needed for the eventual custom domain — with credentials, or
that origin's `/admin` hangs on a spinner.

## What's next

1. Build the first page from the designs, and define the design tokens / breakpoints at the
   same time — `AGENTS.md` has a placeholder section waiting for them.
2. Build `src/layouts/Layout.astro` when that first page needs it.
3. Add content types to `src/sanity/schemaTypes/index.ts` (empty today), then run
   `npm run typegen`.

Designs are `.dc.html` artboards in `~/Downloads/Cohen & Jaffe/Claude Files/` (including
shared `CJNav`, `CJFooter`, `CJContactForm` and a `Pages Index`); the old WordPress site is
mirrored in `.../Sitesucker/`. See `AGENTS.md` → "Where designs and content come from".

## Things that would surprise someone

- **`localhost:4321/admin` now 404s — use `localhost:4321/admin/`.** Consequence of
  `trailingSlash: "always"`: Astro's dev server does not redirect the unslashed form, it
  404s. This looks exactly like a broken Studio and isn't.

  ⚠️ **The Vercel-side redirect is configured but NOT yet verified.** `vercel.json` sets
  `"trailingSlash": true`, which should make Vercel 301 the unslashed form — but that is
  reasoning, not evidence. The `design_system` preview deploy sits behind Vercel
  Deployment Protection (every request 302s to `vercel.com/sso-api`), and `master` doesn't
  carry the setting yet, so neither environment could confirm it. **Check
  `curl -sI https://cohen-jaffe.vercel.app/admin` returns a 301 to `/admin/` once this
  branch merges to `master`.** If it doesn't, the unslashed form 404s in production too.
- **A dev server is already running on port 4321** and it is the user's, from their IDE.
  Use it; don't start a second.
- **The global slash commands were rewritten this session** (`~/.claude/commands/`, outside
  this repo, not version-controlled). `/new-site` now automates both CORS origins via
  `npx sanity cors add`, checks the Vercel framework preset, ships `sanity.cli.ts` +
  `typegen` + `check:types`, and asks the trailing-slash question at init — plus the
  `/admin/` dev-404 warning discovered here. `/new-seo-setup`, `/studio-polish` and
  `/page-speed` also changed. Originals are backed up in the session scratchpad.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- After any dependency change, `rm -rf node_modules/.vite .astro` and restart the dev
  server, or you'll chase a stale `504 (Outdated Optimize Dep)` that looks like a real bug.
- The Studio login card leans on a **scoped CSS hook into Sanity's internal DOM** (in
  `EliteMark.tsx`). Cosmetic, degrades gracefully, worth a glance after a major Sanity
  upgrade.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**
  to near-launch — they audit real pages and content.
