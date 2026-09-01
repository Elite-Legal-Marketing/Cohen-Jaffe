# Cohen & Jaffe — agent guide

> **Read `HANDOFF.md` first.** This file holds the durable rules; `HANDOFF.md` holds the
> current state (branch, what's in flight, open questions). `HANDOFF.md` is NOT
> auto-loaded into a session, so open it explicitly before doing anything.

Marketing site for the law firm **Cohen & Jaffe**, built by Elite Legal Marketing.
Migrating off WordPress.

## Stack

- **Astro 7** (`output: "static"`), TypeScript strict.
- **Sanity 6** headless CMS, **embedded** in the Astro app — the Studio is served at
  `/admin` via `studioBasePath`. There is no separate Studio project: ONE `npm run dev`
  runs both the site and the Studio.
- **React** is installed only to host the embedded Studio. Prefer `.astro` components
  for site UI; reach for React only when a component genuinely needs client state.
- **Vercel** for hosting. **No Vercel adapter** — the default static build is correct,
  and the embedded Studio prerenders fine as a static SPA. Only add `@astrojs/vercel`
  if the site later moves to SSR.

## Commands

```bash
npm run dev          # site + Studio on http://localhost:4321  (Studio at /admin/ — slash required)
npm run build        # production build — a gate; must be green before pushing
npm run check:types  # astro check; the OTHER gate — astro build does NOT typecheck
npm run typegen      # regenerate sanity.types.ts after any schema change
npm run preview      # serve the built dist/
```

Both gates must pass. They catch different things, and neither catches the Studio actually
rendering — for that, load `/admin/` in a browser. See "URLs: trailing slash" for why
that slash matters locally.

## Where things live

| Path | What |
| --- | --- |
| `astro.config.mjs` | Astro + Sanity + React integrations, `inlineStylesheets` |
| `sanity.config.ts` | Studio config: title, brand icon, theme, schema, plugins |
| `sanity.cli.ts` | Sanity CLI config — powers `typegen` and `npx sanity exec` |
| `src/sanity/sanity.types.ts` | **Generated** by `npm run typegen` — never hand-edit |
| `src/sanity/schema.json` | **Generated** schema snapshot — never hand-edit |
| `vercel.json` | Framework pin (`astro`) + `trailingSlash` |
| `src/sanity/schemaTypes/index.ts` | The schema array — **currently empty** |
| `src/sanity/theme.ts` | Elite brand theme, locked to light |
| `src/sanity/eliteTheme.js` | Generated Themer palette (do not hand-edit) |
| `src/sanity/eliteTheme.d.ts` | Precise types for the above — why it's narrow is in the file |
| `src/sanity/components/EliteMark.tsx` | ELITE emblem + login-card CSS |
| `src/pages/` | Routes |
| `.claude/launch.json` | Dev-server config for the preview tooling |

## Where designs and content come from

Both live outside the repo, in `~/Downloads/Cohen & Jaffe/` (a configured additional
working directory):

- **`Claude Files/`** — the approved page designs as `.dc.html` design-canvas artboards
  (`CJ - About.dc.html`, `Cohen & Jaffe Homepage v1.dc.html`, shared `CJNav` / `CJFooter`
  / `CJContactForm`, plus `assets/`, `screens/`, `screenshots/`). These are the source of
  truth for layout — build pages from them, don't invent layouts.
- **`Claude Files/CLAUDE.md`** — firm-specific content notes (e.g. the community
  involvement list). Reference it; do not copy it wholesale into pages, and note that it
  marks some content as "do NOT add unless asked".
- **`Sitesucker/`** — a full local mirror of the current WordPress site (~217 URL
  folders). This is the content and URL source for the migration: it's where existing
  copy, page inventory, and the live URL structure come from. Preserve those URLs, or
  plan redirects, when the new site goes up.

## URLs: trailing slash — ALWAYS

Settled 2026-09-01 from evidence, not preference: all 2262 unique `og:url` values in the
WordPress mirror end in `/`, and the live site 301s the unslashed form to the slashed one.
Match what is already indexed.

Three layers must agree, and they are already set:
- `astro.config.mjs` → `trailingSlash: "always"`
- `vercel.json` → `"trailingSlash": true`
- `canonicalize()` in the SEO layer, when `/new-seo-setup` adds it

Keep the **comparison** form (nav active-state) separate from the **canonical** form. On a
sibling site, normalising for display changed what links matched and silently removed
`aria-current` from every nav item on every page, with no error anywhere.

⚠️ **In dev, `localhost:4321/admin` now 404s — use `localhost:4321/admin/`.** Astro's dev
server does not redirect the unslashed form; it just 404s. Production is fine because
Vercel's `trailingSlash: true` issues a 301. This catches everyone once: a 404 on `/admin`
locally is almost always the missing slash, not a broken Studio.

Also applies to any form `action`: a POST to a path missing its slash earns a 308 that
**re-sends the whole body**.

## Design tokens, breakpoints, layout grid

**Not established yet** — the site is a blank scaffold with no layout or styling. When the
first real page is built from the designs, define the tokens/breakpoints/grid once, record
them in this section, and have every later page use them rather than one-off values.

## Conventions

- **Start blank, add on request.** No shared layout, no example schema types, no extra
  pages until asked. When a layout is wanted, build `src/layouts/Layout.astro` (nav +
  footer + `<head>`; props `title`, optional `description`; a `<slot/>`; scoped styles)
  and have pages wrap it.
- **Schema**: follow `defineType` / `defineField` from the `sanity-best-practices` skill.
  Every type gets an `icon` and a `preview` — no row should read "Untitled".
- **Validation**: on design-coupled short strings use `.max(N).warning(...)`, **never
  `.error()`** — publishing fires the deploy hook, and a blocking error over a nitpick
  stops the whole rebuild.
- **Data fetching**: `sanityClient` from `sanity:client` + `defineQuery` from `groq`.
  Portable Text via `astro-portabletext`; images via `@sanity/image-url`.
- **Env**: `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` in `.env` (gitignored).
  Same two must exist in Vercel for all environments **before the first deploy**.

## Gotchas that have already cost time

- **`@sanity/ui` must be pinned at v4 in our own `dependencies`.** `sanity@6.11` needs
  `@sanity/ui@^4` (it imports `@sanity/ui/toast`), but `@sanity/astro` pulls in
  `@sanity/visual-editing`, which depends on `@sanity/ui@3`. npm can hoist the v3 copy to
  the top level, and Vite's dev-time `optimizeDeps` resolves against the hoisted copy —
  which has no `./toast` export. Symptom: **`npm run build` passes but `/admin` is a blank
  black page in dev**, with `504 (Outdated Optimize Dep)` in the console and
  `"./toast" is not exported ... from @sanity/ui` in the dev-server log. The production
  build hides it because it resolves per-importer. Fix: keep the explicit
  `"@sanity/ui": "^4"` dependency, and after any dependency change that reshuffles the
  tree, `rm -rf node_modules/.vite .astro` and restart. Verify with
  `npm ls @sanity/ui` — the top-level entry must be v4.
- **`.env` is gitignored**, so a Vercel build with missing env vars fails while
  prerendering `/admin` with `Error: Configuration must contain 'projectId'` — and because
  that fails the whole build, **every route 404s**, not just `/admin`. Env-var changes
  alone don't rebuild; trigger a redeploy.
- **Deployed `/admin` stuck on an endless spinner = missing Sanity CORS origin**, not a
  build problem. The Studio ships fine and the page is served; it just can't call
  `https://<projectId>.api.sanity.io/.../users/me` from an origin Sanity doesn't allow.
  The console says so explicitly (`blocked by CORS policy`). Fix in the Sanity dashboard →
  **API → CORS origins** → add the exact origin **with credentials**. Every new
  origin needs its own entry: localhost, the `.vercel.app` URL, and the eventual custom
  domain. Don't go hunting through the build logs for this one.
- **`npx tsc --noEmit` reports ~8 errors** (`Cannot find name 'process'`, `string |
  undefined` on `projectId`/`dataset`, two in `theme.ts`). These are pre-existing and
  shared with the other Elite sites; `astro build` does not run `tsc`, so they are not a
  gate. Don't "fix" them by diverging from the shared brand files. **`npm run build` is
  the gate.**
- **Studio branding uses a scoped CSS hook into Sanity's internal DOM** (in
  `EliteMark.tsx`). It's cosmetic and fails gracefully — the login card reverts to
  Sanity's default inline header if the markup changes. Re-check after major Sanity
  upgrades.
- **`buildLegacyTheme`, `studio.components.logo`, and `studio.components.navbar` are all
  dead ends** for branding in Studio 6. The workspace `icon` + modern `theme` is the path.
  `studio.components.layout` does not wrap the login screen.
- Writing through the `CLAUDE.md` symlink is refused — **edit `AGENTS.md`**.

## How to verify

1. `npm run build` — must be green. This is the real gate.
2. `npm run dev`, then check the pages you touched at `localhost:4321`.
3. For Studio changes, reload `/admin` and look at the **login card** — the theme, title,
   workspace icon and card layout all render **pre-auth**, so branding is verifiable
   without signing in.
4. **Never publish test content to the production dataset** — it fires the deploy hook.

## Git

- Work on `master` unless asked otherwise; branch before committing if the change is
  substantial.
- Commit and push **only when asked**.
- Deploys: prefer `vercel redeploy <production-url>` over `vercel deploy --prod` —
  redeploy rebuilds from the same git commit, while `deploy --prod` ships the local
  working tree and can silently put uncommitted state into production.

## Maintaining these two docs

> Before pushing — and at the end of a session, even with nothing pushed — rewrite
> `HANDOFF.md`. Rewrite it whole; never append. Update `AGENTS.md` when a *rule* changes,
> not on a schedule.

`HANDOFF.md` is the present, not a changelog — `git log` already covers what happened. A
stale line in it is a wrong line. What earns a place is what the next session would
otherwise get wrong.

## Deferred launch-prep commands

Run these near launch, once real pages and content exist — they intentionally do nothing
useful against a blank scaffold:

- **`/new-seo-setup`** — per-page meta fields, Global SEO Settings singleton with a crawl
  switch, JSON-LD, `sitemap.xml`, `robots.txt`.
- **`/studio-polish ux`** — desk grouping into Pages / Collections / Site Settings, unique
  icons, length caps, preview fixes. (The Elite *branding* half is already applied.)
- **`/page-speed`** — get above 90 on mobile + desktop PageSpeed against a real deploy.
