# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-01

## Where things stand

Two of the homepage's fifteen sections are done end to end — **hero** and **stats band** —
each with schema, Studio structure, a typed query, a component, and real content in the
production dataset. The design system, shell, nav and footer sit under them, merged.

- `origin/master` is at `2992212` (PR #5). The stats work is **one commit on `hp_stats`**,
  branched cleanly off it and **not pushed**. One branch per section from here.
- Gates after every change: `npm run build` green, `npm run check:types` **0 errors**, and
  every internal link in the built page slash-terminated.
- The production dataset holds **one document and no assets**;
  `npx sanity documents validate --yes` reports 0 errors, 0 warnings.

## The workflow: build it, approve it, then wire it

Build the section with its content hardcoded, get the design signed off, **then** model it
in Sanity. Modelling a section that is still moving means reshaping the schema and
re-seeding for every visual change. Write the hardcoded content as one constant shaped the
way the query will project it, so wiring is a swap to a prop rather than a rewrite.

Each section is finished before the next begins, so modelling problems surface at section
one rather than section twelve. Recorded in `AGENTS.md` → "Building sections".

Content is authored **straight into the `production` dataset** (client's call), so
`AGENTS.md`'s "never publish test content" note is relaxed for this phase — real migrated
copy only, never throwaway text. After ANY schema change: `npm run typegen`, then
`npx sanity documents validate --yes`.

**Five Sanity conventions are settled** and recorded in `AGENTS.md` → "Sanity conventions —
apply these without asking": Pages folder, collapsed section accordions, Portable Text past
one paragraph, buttons as arrays, images in code unless someone interacts with them. Apply
them without asking.

## What is wired

`hero` / `stat` / `ctaLink` objects → `homePage` singleton → `src/sanity/structure.ts`
(which is what actually enforces the singleton, by pinning the document id and hiding the
type from the generic lists) → `defineQuery` in `src/lib/queries.ts` →
`HOME_PAGE_QUERY_RESULT` → `Hero.astro` and `Stats.astro`.

The hero carries **two photographs, not two crops**, both in `src/assets/` rather than
Sanity — large decorative art nobody interacts with. Through `astro:assets` they went from
2.87 MB PNGs to ~102 KB WebP with a build-time srcset. The wide shot loses its subjects at
phone widths, so a squarer frame takes over below 900px, where the hero **stacks** —
picture above, copy below — so text is never laid over anyone's face.

## Open questions / waiting on the user

1. **`/admin/` has still not been seen rendering.** Outstanding since the first schema
   landed. The dev server on 4321 throws `504 (Outdated Optimize Dep)` because new imports
   reshuffled Vite's dep graph; the fix is a restart, and that server is the user's.
   `npm run build` prerenders `/admin` fine and the Sanity CLI loads the workspace and
   schema cleanly, but per `AGENTS.md` neither proves the Studio *renders*. **Restart the
   dev server and load `/admin/`** — there are now two structure changes to eyeball: the
   **Pages** folder with Homepage pinned inside it, and whether the **stats fieldset**
   renders as a collapsed accordion.
2. **The hero's video card is deliberately not built** (440×264, bottom-right in the
   artboard). Needs its own fields and a player decision — modal vs link-out. "Watch Our
   Video" currently points at `/video-center/`.
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

1. Section 3: **Case Results**. Then Fee Explainer, Practice Areas, New York Deadlines —
   the artboard's order is in `Cohen & Jaffe Homepage v1.dc.html`.
2. Collections that recur across pages (attorneys, practice areas, case results,
   testimonials, FAQs) become their own document types that sections reference, rather than
   copies nested in `homePage`. Case Results is the first section where this bites.
3. **Set `site` in `astro.config.mjs`.** `Layout.astro` already emits a canonical link, but
   only when `Astro.site` is configured — it currently is not, so none is written.

## Things that would surprise someone

- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`, and macOS
  blocks `~/Downloads` and `~/Documents` from this process. Full Disk Access fixes it but
  **only takes effect after the app restarts** — mid-session grants do nothing. If the
  artboards suddenly read as `EPERM`, that is why.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.** Production is confirmed
  fine: `/admin` returns a **308** to `/admin/`.
- **A dev server is usually already running on port 4321** and it is the user's. Use it;
  don't start a second. `astro preview --port <other>` checks a production build, but
  **only 4321 and the Vercel URL are registered Sanity CORS origins**, so the Studio will
  not authenticate on any other port.
- **`options: { collapsible }` does not exist on array fields** — only `ObjectOptions`. An
  array section needs a document **fieldset** to get the same accordion.
- **The Sanity CLI has no `patch`**, and `documents create --replace` overwrites the whole
  document. To add a section, fetch the document, merge, then upsert — otherwise the
  earlier sections are silently dropped.
- **Never put a `//` comment inside a `defineQuery` template.** Typegen does not error; it
  silently regenerates with `0 queries` and leaves stale result types behind.
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
