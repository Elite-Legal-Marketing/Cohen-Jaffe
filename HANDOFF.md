# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-01

## Where things stand

Scaffolded and deployed, **no site built yet**. The Astro + Sanity plumbing works, the
Studio is branded, and the project is wired to Vercel. The site itself is one blank home
page. This is deliberate — the blank-slate scaffold is the convention; pages, layout and
schema get added on request.

- Branch `master`, pushed to `Elite-Legal-Marketing/Cohen-Jaffe`.
- Sanity project `evo4n0ua`, dataset `production`.
- Vercel: `elite-legal-marketing/cohen-jaffe`, linked locally, env vars set for all three
  environments.
- `npm run build` green: 2 pages (`/`, `/admin`).
- Studio login card verified in-browser: light theme, ELITE emblem above "Elite Legal
  Marketing".

## What exists

- Astro 7 minimal, TypeScript strict, `inlineStylesheets: "always"`.
- Embedded Sanity Studio at `/admin` (no standalone Studio project).
- Elite brand: `theme.ts` (light-locked), `eliteTheme.js`, `EliteMark.tsx`,
  `public/elite-white.svg` — copied verbatim from the Cogdell Law reference project.
- `src/sanity/schemaTypes/index.ts` exports an **empty** `schemaTypes` array. The Studio
  boots fine with zero types; it just shows no documents.
- `vercel.json` pinning `"framework": "astro"` (see decisions below).

## Decisions made, and why

- **`@sanity/ui` pinned to `^4` in our own `dependencies`** — not cosmetic. `sanity@6.11`
  imports `@sanity/ui/toast`, but `@sanity/astro → @sanity/visual-editing` depends on
  `@sanity/ui@3`, and npm hoisted the v3 copy to the top level. `npm run build` passed
  while `/admin` was a blank black page in dev. Pinning v4 makes the hoisted copy the
  right one. Don't remove it. Full symptom/diagnosis in `AGENTS.md` → Gotchas.
- **`vercel.json` sets the framework explicitly.** The Vercel project was created before
  any code existed, so it was saved with Framework Preset **"Other"** — under which the
  Output Directory resolves to `public` (which exists here), so Vercel would have served
  the favicon and logo instead of `dist/`. The other Elite sites have no `framework` key
  because they auto-detected Astro at import time; this project couldn't. Repo-side was
  chosen over a dashboard toggle so the setting is versioned and visible in the code.
- **Left the ~8 `tsc --noEmit` errors alone.** Pre-existing and identical in the other
  three Elite sites; `astro build` doesn't run `tsc`. Fixing them would diverge the shared
  brand files for no build benefit. `npm run build` is the gate.
- **Adopted the reference project's dual env read** in `sanity.config.ts`
  (`import.meta.env` ?? `process.env`) at scaffold time — the Sanity CLI (`schema
  extract`, `typegen`) runs in plain Node where `import.meta.env` is empty, so this keeps
  one `.env` working for both once schemas exist.
- **No Vercel adapter**, on purpose — the static build is correct for this site.

## Open questions / waiting on the user

**None.** Both Sanity CORS origins are configured with credentials and verified by
preflight (`access-control-allow-origin` + `access-control-allow-credentials: true`):

- `http://localhost:4321` — local Studio sign-in works.
- `https://cohen-jaffe.vercel.app` — deployed Studio login card renders.

Add a new CORS origin **with credentials** for any future origin (notably the eventual
custom domain), or that origin's `/admin` will hang on a spinner.

## What's next

Nothing in flight. Natural next steps:

1. Decide the first content types and add them to `src/sanity/schemaTypes/index.ts`
   (empty today), or build the first page from the designs.
2. Build `src/layouts/Layout.astro` when the first real page needs it, and define the
   design tokens/breakpoints at the same time — `AGENTS.md` has a placeholder section
   waiting for them.
3. Designs are in `~/Downloads/Cohen & Jaffe/Claude Files/` (`.dc.html` artboards); the
   old WordPress site is mirrored in `.../Sitesucker/` for copy and URL structure. See
   `AGENTS.md` → "Where designs and content come from".

## Things that would surprise someone

- The Astro CLI could not scaffold into a non-empty directory, so it created
  `receptive-trappist/`; the files were **moved up to the project root** and the subfolder
  deleted. The original one-line `README.md` was replaced by Astro's.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** (from the Astro template). Writing through
  the symlink is refused — edit `AGENTS.md`.
- `vercel link` added `.vercel` and `.env*` to `.gitignore` and wrote a `.env.local`
  holding a real `VERCEL_OIDC_TOKEN`. Both are gitignored and were confirmed unstaged.
- After any dependency change, `rm -rf node_modules/.vite .astro` and restart the dev
  server, or you may hit stale `504 (Outdated Optimize Dep)` errors that look like
  application bugs.
- The Studio login-card layout leans on a **scoped CSS hook into Sanity's internal DOM**
  (in `EliteMark.tsx`). Cosmetic only, degrades gracefully, worth a glance after a major
  Sanity upgrade.
- `/new-seo-setup`, `/studio-polish ux`, and `/page-speed` are **deliberately deferred**
  to near-launch — they audit real pages and content, which don't exist yet.
