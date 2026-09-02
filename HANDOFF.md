# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-02

## Where things stand

Three of the homepage's fifteen sections are done end to end — **hero**, **stats band**
and **case results** — each with schema, Studio structure, a typed query, a component and
real content in the `production` dataset. `origin/master` is at `29e804f` (PR #8); the
case results **modelling** is committed on top of that and not yet pushed.

Case results is the first section to use **separate collections**, under a **Collections**
folder in the desk. There are two types, deliberately:

- **`featuredCaseResult`** — the homepage cards. Client story, portrait, quote, the
  insurer's offer against the recovery. Every field required except the Wistia id. **4
  documents.**
- **`caseResult`** — the ledger for the (unbuilt) `/case-results/` page. Amount, category,
  summary; all three required. **60 documents, migrated from the live site.**

⚠️ A result is NOT in both by being flagged. Featuring one means entering it as a
`featuredCaseResult` too, and the two then drift. That is the accepted trade — if it starts
to hurt, the fix is one type with a `featured` boolean and conditional fields, not a
reference between them.

Gates after every change: `npm run build` green, `npm run check:types` **0 errors**, every
internal link in the built page slash-terminated.

## The workflow: build it, approve it, then wire it

Build the section with its content hardcoded, get the design signed off, **then** model it
in Sanity. Write the hardcoded content as one constant shaped the way the query will
project it, so wiring is a swap to a prop rather than a rewrite. Recorded in `AGENTS.md` →
"Building sections".

Content is authored straight into the `production` dataset (client's call), so
`AGENTS.md`'s "never publish test content" note is relaxed — **real migrated copy only,
never throwaway text.** After ANY schema change: `npm run typegen`, then
`npx sanity documents validate --yes`.

## ⚠️ The four FEATURED case results are fabricated

Read this before showing the site to anyone outside the team.

The section's hook — *"Insurance companies made an offer. Here is what these cases were
actually worth"* — needs four fields the firm has never published. The live site's **60
case results** each carry only a recovery figure, a case type and a narrative: no client
name, no quote, no photograph, no insurer-offer figure (9 of the 60 mention an offer in
prose, none as a number).

So the four results now in `production` — Danny R., Carol M., Andre W., Marisol T., with
their offers and recoveries — are the **artboard's illustrative copy, seeded on the
client's instruction**. They are invented case outcomes on a law firm's website, which is a
different thing from placeholder body copy. **Replace them with genuine client stories
before launch**, and do not let the site go public with them in place.

Every card field is **required** in the schema except the Wistia id — also the client's
call. That has a cost worth knowing now: migrating the real 60 results will fail validation
until someone supplies a name, quote, photograph and offer figure for each one.

Re-seed the four with `npx sanity exec scripts/seed-case-results.ts --with-user-token`
(idempotent). The photographs stay in `src/assets/` as the script's source; the live ones
are in Sanity.

**The 60 migrated ledger entries are real** — figures, case types and narratives straight
from the live site. Only the four featured cards are fabricated.

## Categories are derived, and want a review pass

The live site publishes **no structured category** — only a case type inside each page
title. The taxonomy in `src/sanity/schemaTypes/caseResultCategories.ts` is ten values read
off those 60 titles, and the migration assigned each result exactly one:

```
25 Auto Accident        5 Slip & Fall             1 Construction Accident
 8 Pedestrian Accident  5 Motorcycle Accident     1 Medical Malpractice
 6 Traumatic Brain Inj. 4 Truck Accident
 3 Personal Injury      2 Premises Liability
```

That is a reasonable reading of the titles, not the firm's own classification — worth
someone checking. Two values are editorial rather than parsed: **"Policy Limits"** on
`/case-results/traumatic-brain-injury-tbi/`, whose page publishes no figure and says only
that the insurer "paid their entire policy", and **"Confidential"** on the five that say
exactly that.

These categories are effectively a subset of the practice areas. When those become their
own document type, make the category a reference rather than standing up a second parallel
taxonomy.

**The old URLs are redirected by a single wildcard.** `vercel.json` holds one permanent
redirect, `/case-results/:slug` → `/case-results/`, which covers all 60 migrated paths and
any the SiteSucker mirror missed.

Verified against the real `path-to-regexp` Vercel compiles with — it matches slashed and
unslashed slugs and all 60 known paths, and critically does NOT match `/case-results/`
or `/case-results`, so there is no redirect loop.

⚠️ **It matches one segment under `/case-results/`, so it will swallow a case-result DETAIL
page if one is ever built.** The ledger design puts all 60 on a single page, so nothing
conflicts today. Build detail pages and this redirect has to be narrowed first — the 60
explicit paths are in `scripts/case-results.json` if it needs to go back to a list.

The `sourcePath` field those came from has been **removed** from the schema and unset from
the documents, so `scripts/migrate-case-results.ts` has nothing left to match on and is now
**one-shot**: it refuses to run while any `caseResult` exists, because a second run would
create 60 duplicates. The paths themselves survive in `scripts/case-results.json`, which is
the record of what was imported and where each result used to live.

## Videos — pulled, not yet uploaded

All **81** of the firm's YouTube videos are downloaded to
`~/Downloads/Cohen & Jaffe/Videos/` (3.6 GB, outside the repo), with `manifest.csv` /
`manifest.json` carrying titles, descriptions, durations, upload dates, view counts, where
each one appears on the current site, and an **empty `wistia_id` column to fill in after
upload**.

They are moving to **Wistia** — the client's marketing firm hosts there. The YouTube
channel stays, because the Video Center's "More videos on YouTube" button links to the
originals, so the `video` type will carry **both** ids.

Things that will bite:
- **10 of the 81 are 360p at source.** Checked against YouTube's own format list — there is
  nothing better. They are the oldest uploads. Masters are the only route to better quality.
- **17 are vertical (1080×1920) and 7 are square.** One of them, `uJzfvaZ3J-0`, is on the
  current Video Center in a 16:9 slot. Mixed aspect ratios need a decision before the Video
  Center is built.
- **3 of the 10 videos on the current site are unlisted** — embedded but absent from the
  channel listing. A channel-only pull would have dropped them silently.
- yt-dlp goes stale fast. A 403, or only 360p being offered, means **upgrade it first**;
  that was the whole fix last time.

`c6b0eghb5r` is wired to the first case-result card as a live test. It is the
`/free-consultation/` video, already on Wistia, and it proves the pipeline end to end.

## What is wired

`hero` / `stat` / `ctaLink` objects → `homePage` singleton → `src/sanity/structure.ts`
(which is what actually enforces the singleton) → `defineQuery` in `src/lib/queries.ts` →
`HOME_PAGE_QUERY_RESULT` → `Hero.astro` and `Stats.astro`.

`caseResultsSection` object → `caseResults` on `homePage` → `results[]->` dereferenced to
`featuredCaseResult` documents → `CaseResults.astro`. The featured array is capped at
**four with a hard `.error()`**, not a warning — the band is a four-across grid and a
four-page carousel, so a fifth card has nowhere to go. That is the deliberate exception to
`AGENTS.md`'s "use `.warning()`, never `.error()`" rule, which is about string lengths.

Desk shape: **Collections → Case Results → { Featured Case Results, Case Results }**. Both
are listed explicitly in `structure.ts`; anything listed there must also appear in
`LISTED`, or the Studio shows it twice.

`/case-results/` is **not built** — the 60 ledger entries have no page yet. `ctaLink` on
the band points at it regardless.

**`Layout.astro` now has a `videoEmbed` prop.** It DNS-prefetches Wistia and renders
`VideoLightbox`. WITHOUT IT every `[data-video-id]` trigger on the page is inert — this is
the thing that will waste an hour when a second section gets a video.

## Open questions / waiting on the user

1. **`/admin/` has still not been seen rendering.** Outstanding since the first schema
   landed — the oldest open item. `npm run build` prerenders it and the Sanity CLI loads
   the workspace cleanly, but neither proves the Studio *renders*. Load `localhost:4321/admin/`
   (trailing slash required) and eyeball the **Pages** folder and the **stats fieldset**
   accordion.
2. **Case results needs REAL client names, quotes, photographs and insurer-offer figures.**
   What is in `production` today is fabricated — see the warning above. This is the item
   that has to close before the site can go public.
3. **The client-story videos in the artboards do not exist.** The Video Center artboard
   shows three testimonial videos (Maria R. · Hempstead, and two more) that are on neither
   the site nor the channel. Filmed, planned, or aspirational?
4. **The hero's video card is deliberately not built** (440×264, bottom-right in the
   artboard). Now unblocked — the lightbox exists — but still needs its own fields.
5. **The Spanish section is deferred.** `/es/` is 17 pages with a translated menu whose
   links all point at *English* pages, and machine-translated place names. Needs a client
   decision. Background is a comment in `navigation.ts`.
6. **Two live-nav links point at pages absent from the mirror** —
   `/medical-device-lawyer-long-island/` and `/personal-injury-lawyer-nassau-county/`.
   Verify before launch.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with
credentials, or that origin's `/admin` hangs on a spinner.

## What's next

1. Build **`/case-results/`** — the 60 migrated ledger entries have no page yet, and the
   homepage's "See all results" link already points at it.
2. Section 4: **Fee Explainer** — "No fee unless we win — here is what that actually means."
   Then Practice Areas ("What happened?"), then New York Deadlines ("The clock started the
   day of your accident"). Order is in `Cohen & Jaffe Homepage v1.dc.html`.
3. A **`video` document type** once the Wistia uploads exist.
4. **Set `site` in `astro.config.mjs`.** `Layout.astro` already emits a canonical link, but
   only when `Astro.site` is configured — it is not, so none is written.

## Things that would surprise someone

- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`. If they
  suddenly read as `EPERM`, that is macOS blocking `~/Downloads`; Full Disk Access fixes it
  but **only after the app restarts**.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.** Production is fine: it
  returns a **308**.
- **A dev server is usually already running on port 4321** and it is the user's. Use it.
  Only 4321 and the Vercel URL are registered Sanity CORS origins.
- **The recovered figure is sized by a CONTAINER query, not the viewport.** Card width falls
  faster than viewport width, because `.container` spends up to 100px a side on a gutter the
  artboard's zero-gutter board does not have. A viewport clamp read 39px while its card had
  fallen to 305px, and `$2,800,000` punched through the card edge. Four across holds to
  1280px; below that it is a scroll-snap carousel.
- **A carousel dot is a PAGE, not a card.** With two cards in view the scroller runs out of
  travel after the third, so one dot per card leaves the last permanently unreachable and
  permanently inactive.
- **`.arrow` is a site-wide convention** — lifted `-0.0625em` onto the text's optical centre
  and owning its own gap, with the offset in a custom property because hover animates X
  only. Use it for any new link ending in an arrow.
- **The lightbox tears down synchronously**, not on the dialog's `close` event. `close` is a
  queued task and can lag the dialog disappearing by long enough to keep hearing audio.
- **A `<dialog>` using `showModal()` can live anywhere in the DOM** — the top layer escapes
  stacking contexts. This does NOT contradict the mobile drawer having to be a sibling of
  `<header>`; that one is `position: fixed`, which does not escape.
- **`_type` is immutable.** `createOrReplace` cannot change a document's type — converting
  the four featured results meant unsetting the homepage's references, deleting the
  documents, and recreating them. A strong reference also blocks the delete, so the unset
  has to come first.
- **A Sanity document id must NEVER contain a dot.** A dotted `_id` is non-public: readable
  with a token, invisible without one. The Studio, the CLI and `documents validate` all
  showed four healthy documents while the site's client dereferenced every reference to
  `null` and the build died on `Cannot read properties of null`. Nothing in the error points
  at the id. Full write-up in `AGENTS.md`.
- **`options: { collapsible }` does not exist on array fields** — only `ObjectOptions`. An
  array section needs a document **fieldset** for the same accordion.
- **The Sanity CLI has no `patch`**, and `documents create --replace` overwrites the whole
  document. To add a section: fetch, merge, upsert — or the earlier sections are dropped.
- **Never put a `//` comment inside a `defineQuery` template.** Typegen does not error; it
  silently regenerates with `0 queries` and leaves stale result types behind.
- **In a hidden browser pane, CSS transitions do not advance, `requestAnimationFrame` never
  fires, and queued tasks (including a dialog's `close` event) may never arrive.** Verify by
  measuring the DOM, not by screenshotting or awaiting an event.
- **`--gutter-header` is smaller than `--gutter` on purpose**, and `.nav { flex: none }`
  makes a future overflow break visibly instead of silently overlapping.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**
  to near-launch.
