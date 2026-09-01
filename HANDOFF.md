# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-01

## Where things stand

The design system and shell are merged to `master` and live. On top of that, **the homepage
hero is built and wired to Sanity end to end** — schema, Studio structure, typed query,
component, and real content authored into the production dataset. It is the first section
of fifteen on the homepage.

- `origin/master` is at `3047266` (PR #3). Work since then sits on **`design_system`**,
  which was already merged once — so these newer commits need a second PR or a fresh branch
  off `master`.
- ⚠️ **Local `master` is behind.** `git checkout master && git pull` before branching.
- Gates after every change: `npm run build` green, `npm run check:types` **0 errors**, and
  every internal link in the built page slash-terminated.

## The workflow changed: build one section, then wire it

Decided this session, replacing build-everything-then-integrate. Each section is built,
modelled, seeded and verified before the next begins. It paid for itself on section one —
three defects surfaced that would otherwise have landed together much later. Recorded in
`AGENTS.md` → "Building sections: build one, then wire it".

Content is authored **straight into the `production` dataset** (client's call), so
`AGENTS.md`'s "never publish test content" note is relaxed for this phase — real migrated
copy only, never throwaway text.

After ANY schema change: `npm run typegen`, then `npx sanity documents validate --yes`.
Currently **1 document, 0 errors, 0 warnings**.

## What is wired

`hero` + `ctaLink` objects → `homePage` singleton → `src/sanity/structure.ts` (which is what
actually enforces the singleton, by pinning the document id and hiding the type from the
generic lists) → `defineQuery` in `src/lib/queries.ts` → `HOME_PAGE_QUERY_RESULT` →
`Hero.astro`.

The hero carries **two photographs, not two crops**, and both live in `src/assets/` rather
than Sanity — they are large decorative art nobody interacts with. Rendered through
`astro:assets`, they went from 2.87 MB PNGs to ~102 KB WebP with a build-time srcset. The
wide shot loses its subjects at phone widths, so a squarer frame takes over below 900px,
where the hero also **stacks** — picture above, copy below — so text is never laid over
anyone's face. A `<picture>` element does the swap.

**Five Sanity conventions are now settled** and recorded in `AGENTS.md` → "Sanity
conventions — apply these without asking": Pages folder, collapsed section accordions,
Portable Text past one paragraph, buttons as arrays, and images in code unless someone
interacts with them. Apply them without asking on every new section.

The production dataset currently holds **one document and no assets**.

## Open questions / waiting on the user

1. **`/admin/` has not been seen rendering since the schema landed.** The dev server on
   4321 is throwing `504 (Outdated Optimize Dep)` because the new imports reshuffled Vite's
   dep graph. The fix is a dev-server restart, and that server is the user's. `npm run
   build` prerenders `/admin` fine and the Sanity CLI loads the workspace and schema
   cleanly, but per `AGENTS.md` neither gate proves the Studio *renders*. **Restart the dev
   server and load `/admin/`** — "Homepage" should be pinned at the top of the desk.
2. **The hero's video card is deliberately not built** (440×264, bottom-right in the
   artboard). It needs its own fields and a player decision — modal vs link-out — so it
   belongs in its own increment. "Watch Our Video" currently points at `/video-center/`.
3. **The Spanish section is deferred.** `/es/` exists on the live site but is **not** a
   mirror: 17 pages, a fully translated menu whose links all point at *English* pages, and
   machine-translated place names ("Bahía de Ostras" for Oyster Bay, "Yo Resbalo" for
   Islip). Needs a client decision. Background is a comment in `navigation.ts`.
4. **Two live-nav links point at pages absent from the mirror** —
   `/medical-device-lawyer-long-island/` and `/personal-injury-lawyer-nassau-county/`.
   Verify before launch.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with
credentials, or that origin's `/admin` hangs on a spinner.

## What's next

1. Section 2 of the homepage: **Stats**. Then Case Results, Fee Explainer, Practice Areas —
   the artboard's order is in `Cohen & Jaffe Homepage v1.dc.html`.
2. Collections that recur across pages (attorneys, practice areas, case results,
   testimonials, FAQs) become their own document types that sections reference, rather than
   copies nested in `homePage`.
3. **Set `site` in `astro.config.mjs`.** `Layout.astro` already emits a canonical link, but
   only when `Astro.site` is configured — it currently is not, so none is written.

## Things that would surprise someone

- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.** Production is confirmed
  fine: `/admin` returns a **308** to `/admin/` (verified against the live deploy — a 308,
  not the 301 this file once predicted).
- **A dev server is usually already running on port 4321** and it is the user's. Use it;
  don't start a second. `astro preview --port <other>` is the way to check a production
  build, but note **only 4321 and the Vercel URL are registered Sanity CORS origins**, so
  the Studio will not authenticate on any other port.
- **The mobile drawer must stay a sibling of `<header>`**, and the closed drawer is
  deliberately not `visibility: hidden` — a hidden element cannot take focus.
- **`--gutter-header` is smaller than `--gutter` on purpose**, and `.nav { flex: none }`
  makes a future overflow break visibly instead of silently overlapping.
- **In a hidden browser pane, CSS transitions do not advance, `requestAnimationFrame` never
  fires, and `img.decode()` never resolves.** Reading a transitioned property or awaiting
  decode there proves nothing — and a screenshot taken mid-load looks like a missing image.
  Set `transition: none` and read target values; read `complete`/`naturalWidth` for images.
- **`naturalWidth` on a `srcset` image is density-adjusted** — an 828px file chosen for a
  375px slot reports 375. That is correct, not a broken image.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**
  to near-launch.
