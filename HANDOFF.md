# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-02

## Where things stand

Three of the homepage's fifteen sections are done end to end — **hero**, **stats band**
and **case results** — plus, as of this session, the **attorneys collection**, which is a
collection with no page consuming it yet. `origin/master` is at `fa77acf` (PR #9). Current
branch is **`attorneys_collection`** and it now carries the attorney work, uncommitted.

Gates after every change: `npm run build` green, `npm run check:types` **0 errors**,
`npx sanity documents validate --yes` clean. All three are green right now — 71 documents,
0 errors, 0 warnings.

## The attorneys collection — one type, six documents

**`attorney`**, in `src/sanity/schemaTypes/documents/attorney.ts`. Six documents, seeded
into `production` from `scripts/seed-attorneys.ts` (idempotent).

The featured-versus-full question that case results raised is **settled here in the
opposite direction, on the user's call**: ONE type, and a section picks who appears with an
ordered array of references. Case results needed two types because a featured card is
different *content* — a client interview, a portrait, a quote, an insurer's offer the
ledger never had. An attorney is the same person on every page; the homepage band, the
listing and the bio page just read different fields. So there is **no `featured` flag, no
second type, and nothing to drift**. Ordering and the partners/associates split are
properties of the *section*, not of the person — which is why `attorney` has no `order` or
`group` field.

That is now rule 7 in `AGENTS.md` → "Sanity conventions".

The field list is the union of what three approved artboards read: the homepage's OUR
ATTORNEYS band, `CJ - Attorneys.dc.html` (partner + associate cards) and
`CJ - Attorney Bio.dc.html` (which reads nearly all of it). Seventeen fields in four groups —
Profile, Biography, Credentials, Contact.

**Slugs match `src/data/navigation.ts` exactly** — `stephen-cohen`, `richard-jaffe`,
`stephen-tiger`, `caitlin-mcnaughton`, `katherine-sawicki`, `garrett-parnell`. Those are
the live, indexed paths under `/about/attorneys/`. Changing one is a redirect to write.

**Only six of seventeen fields are required** — name, slug, role, portrait, summary,
biography. This is the deliberate corrective to `featuredCaseResult`, where every field is
required and the cost is permanent: the 60 real ledger results can never be promoted
without someone inventing four fields each. Bar admissions, honors and quotes are simply
absent from the live site for most of the six attorneys, so an empty credentials card is
the correct output. Now rule 6 in `AGENTS.md`.

### Three blocks the bio artboard draws are deliberately NOT modelled

Each needs a document type that is already planned. Modelling them as loose strings now
would only have to be unpicked — the same parallel-taxonomy problem the case-result
categories already have.

- **The video card** (thumbnail, "Watch · 2:14", title) → waits on the `video` type. No
  attorney video exists yet anyway.
- **The practice-areas sidebar** → becomes `reference` to `practiceArea`.
- **The award badge row** → firm-level imagery the homepage's Recognition section needs
  too. Model it once, there.

`representativeCases` is the one that deliberately *is* free text
(`objects/representativeCase.ts`), not a reference to `caseResult`: the ledger publishes no
attorney attribution, so nothing links a result to who tried it. Tiger's seven come from
his own bio page.

## ⚠️ Unlike the case results, NONE of this content is invented

That is the point. Every word came from the six live bio pages in the mirror at
`Sitesucker/about/attorneys/`; biographies are that copy sub-edited the way the approved
artboard sub-edits Jaffe's, and headlines, blurbs and pull quotes are phrases lifted from
the same pages. Three consequences the client has to resolve:

1. **Three of the six have no quote, and `quote` is empty for them.** McNaughton, Sawicki
   and Parnell are not quoted anywhere on the live site. The homepage artboard's quotes for
   the three partners were ignored in favour of the real ones those three have given — the
   artboard's "I worked ambulances before I practiced law" for Jaffe is invented, and its
   "still works a weekly shift as a volunteer medic in Brentwood" actually *contradicts* his
   bio, which puts the EMT and firefighter work in the past.
2. **Roles are the live site's, not the artboards'.** The live site titles Cohen, Jaffe and
   Tiger identically — "Partner". The artboards say "Founding Partner", "Managing Partner ·
   Lead Trial Lawyer" and "Partner". Cohen founding the practice is well evidenced;
   Jaffe as *managing* partner is not evidenced anywhere. These are claims about a real
   person's position at a real firm, so the firm confirms them, not us. McNaughton's
   "Managing Attorney" **is** live and is used.
3. **Most credential lists are empty.** Bar admissions beyond New York, honors, and any
   education a bio does not name are absent from the source. McNaughton has none at all —
   her bio says she is "licensed in three states" and holds an LL.M., but names neither the
   states nor the school. The Attorneys artboard's "3 States — NY, NJ, and D.C." is
   presented as a firm-wide stat and is most likely hers; unconfirmed either way.

One knowing edit: Tiger's notable-case list on the live site reads "2.75 for an injured
construction worker" — a missing "$" and "million" that every other line in the list has.
Seeded as "$2.75 million".

## Two live-site bugs found in the mirror

Both on **Garrett Parnell's** page, and both look like a WordPress duplicate of Caitlin
McNaughton's:

- His `og:url` is `https://www.cohenjaffe.com/about/attorneys/caitlin-mcnaughton/` — the
  wrong canonical. Worth telling the client; it is also why his page is the one exception
  to the "every href checked against that page's own `og:url`" rule used for the nav.
- His badge row renders `mybadge-Caitlin-McNaughton.png`.

Neither affects the new site. Both matter for the redirect/SEO pass.

## Portraits

`src/assets/atty-{cohen,jaffe,tiger,mcnaughton,sawicki,parnell}.png` — 720×1280, the
artboards' own files, uploaded to Sanity by the seed script. **They are the firm's real
headshots with the background replaced** (verified against the WordPress originals: same
person, same suit, same tie). Not stock, not generated.

One photograph per attorney serves every crop — 1:1 on the homepage, 4:5 on an associate
card, 3:4 on the bio hero, and a 62px circle beside the pull quote — so `portrait` has a
hotspot and there is no second image field. (`cohen-headshot.png` and `jaffe-headshot.png`
in the design assets are byte-identical to `atty-cohen.png` / `atty-jaffe.png`; the artboard
just crops them round.)

Per `AGENTS.md` rule 5 these belong in Sanity, not `astro:assets` — an editor swaps an
attorney portrait as content. The repo copies are the seed script's source.

## What is wired

`hero` / `stat` / `ctaLink` objects → `homePage` singleton → `src/sanity/structure.ts`
(which is what actually enforces the singleton) → `defineQuery` in `src/lib/queries.ts` →
`HOME_PAGE_QUERY_RESULT` → `Hero.astro` and `Stats.astro`.

`caseResultsSection` object → `caseResults` on `homePage` → `results[]->` dereferenced to
`featuredCaseResult` documents → `CaseResults.astro`. The featured array is capped at
**four with a hard `.error()`** — the deliberate exception to the "`.warning()`, never
`.error()`" rule, which is about string lengths. Four across, four carousel pages, nowhere
for a fifth.

**`attorney` is wired to nothing yet, on purpose.** No page consumes it, so there is no
`ATTORNEYS_QUERY` — an unused query would be dead code. The homepage's attorneys section
adds one when it is built.

Desk shape: **Collections → { Case Results → { Featured Case Results, Case Results },
Attorneys }**. Anything listed explicitly in `structure.ts` must also appear in `LISTED`,
or the Studio shows it twice.

## Case results — unchanged, and still the launch blocker

Two types, deliberately: **`featuredCaseResult`** (4 documents, the homepage cards) and
**`caseResult`** (60 documents, the ledger for the unbuilt `/case-results/` page). A result
is NOT in both by being flagged; featuring one means entering it twice and the two then
drift. Accepted trade.

⚠️ **The four featured case results are fabricated** — Danny R., Carol M., Andre W.,
Marisol T., with their offers and recoveries, are the artboard's illustrative copy seeded on
the client's instruction. The live site's 60 results carry only a recovery figure, a case
type and a narrative: no client name, no quote, no photograph, no insurer-offer figure.
**Replace them with genuine client stories before launch.** Re-seed with
`npx sanity exec scripts/seed-case-results.ts --with-user-token`.

**The 60 migrated ledger entries are real.** Their categories are derived, though — the
live site publishes no structured category, so the ten values in
`caseResultCategories.ts` were read off the 60 page titles and want a review pass:

```
25 Auto Accident        5 Slip & Fall             1 Construction Accident
 8 Pedestrian Accident  5 Motorcycle Accident     1 Medical Malpractice
 6 Traumatic Brain Inj. 4 Truck Accident
 3 Personal Injury      2 Premises Liability
```

Two values are editorial rather than parsed: **"Policy Limits"** and **"Confidential"**.
These categories are effectively a subset of the practice areas — when those become their
own type, make the category a reference rather than a second parallel taxonomy.

**The old URLs are redirected by a single wildcard** in `vercel.json`:
`/case-results/:slug` → `/case-results/`. Verified against the real `path-to-regexp`
Vercel compiles with — it matches all 60 known paths, slashed and unslashed, and does NOT
match `/case-results/` itself, so there is no loop. ⚠️ **It matches one segment, so it will
swallow a case-result DETAIL page if one is ever built.** The 60 explicit paths are in
`scripts/case-results.json` if it has to go back to a list.

`migrate-case-results.ts` is **one-shot** — the `sourcePath` field it matched on has been
removed, so it refuses to run while any `caseResult` exists rather than create 60
duplicates.

## Videos — pulled, not yet uploaded

All **81** of the firm's YouTube videos are in `~/Downloads/Cohen & Jaffe/Videos/` (3.6 GB,
outside the repo) with `manifest.csv` / `manifest.json` carrying titles, descriptions,
durations, upload dates, view counts, where each appears on the current site, and an empty
`wistia_id` column to fill in after upload.

They are moving to **Wistia** (the client's marketing firm hosts there). The YouTube
channel stays, because the Video Center's "More videos on YouTube" button links to the
originals — so the `video` type will carry **both** ids.

Things that will bite:
- **10 of the 81 are 360p at source.** Nothing better exists on YouTube; they are the
  oldest uploads. Masters are the only route.
- **17 are vertical (1080×1920) and 7 are square.** One, `uJzfvaZ3J-0`, sits in a 16:9 slot
  on the current Video Center. Mixed aspect ratios need a decision.
- **3 of the 10 videos on the current site are unlisted** — a channel-only pull drops them.
- yt-dlp goes stale fast. A 403, or only 360p offered, means upgrade it first.

`c6b0eghb5r` is wired to the first case-result card as a live end-to-end test.

## Open questions / waiting on the user

1. **Attorney roles need the firm's confirmation** — see the numbered list above. This is
   the only thing in the attorney data that is a judgment call rather than a copy.
2. **Case results needs REAL client names, quotes, photographs and insurer-offer figures.**
   The four in `production` are fabricated. This is the item that has to close before the
   site can go public.
3. **The Studio's desk has still not been seen signed-in.** `/admin/` itself is now
   confirmed rendering — the branded Elite login card comes up clean in dev — but the
   **Pages** folder, the **stats fieldset** accordion and the new **Collections →
   Attorneys** list are all behind a sign-in only the user can do. Load
   `localhost:4321/admin/` (trailing slash required) and eyeball them.
4. **The client-story videos in the artboards do not exist.** The Video Center artboard
   shows three testimonial videos (Maria R. · Hempstead, and two more) that are on neither
   the site nor the channel. Filmed, planned, or aspirational?
5. **The hero's video card is deliberately not built** (440×264, bottom-right in the
   artboard). Unblocked now the lightbox exists, but it needs its own fields.
6. **The Spanish section is deferred.** `/es/` is 17 pages with a translated menu whose
   links all point at *English* pages, and machine-translated place names. Needs a client
   decision. Background is a comment in `navigation.ts`.
7. **Two live-nav links point at pages absent from the mirror** —
   `/medical-device-lawyer-long-island/` and `/personal-injury-lawyer-nassau-county/`.
   Verify before launch.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with
credentials, or that origin's `/admin` hangs on a spinner.

## What's next

The attorneys collection exists but nothing renders it. In rough order:

1. **The homepage attorneys section** — "The three people who will actually work your
   case." An `attorneysSection` object on `homePage`: heading, lead, an ordered array of
   `attorney` references for the three large cards, a second array for the three
   thumbnails in the "six attorneys and a support staff of more than twenty" line, and a
   `ctaLink`. Design is at line 511 of `Cohen & Jaffe Homepage v1.dc.html`.
2. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — the listing splits partners
   (large horizontal cards) from associates (a three-up grid); the bio page reads nearly
   every field. Both artboards are approved and the URLs are already in the nav.
3. Build **`/case-results/`** — the 60 ledger entries have no page, and the homepage's
   "See all results" link already points there.
4. Section 4: **Fee Explainer**, then Practice Areas, then New York Deadlines. Order is in
   the homepage artboard.
5. A **`video` document type** once the Wistia uploads exist.
6. **Set `site` in `astro.config.mjs`.** `Layout.astro` emits a canonical link only when
   `Astro.site` is configured — it is not, so none is written.

## Things that would surprise someone

- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`. If they
  suddenly read as `EPERM`, that is macOS blocking `~/Downloads`; Full Disk Access fixes it
  but **only after the app restarts**.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.** Production returns a 308.
- **A blank black `/admin` in dev with a `504 (Outdated Optimize Dep)` in the console is a
  stale Vite cache, not a broken Studio.** Hit it again this session.
  `rm -rf node_modules/.vite .astro` and restart; `npm ls @sanity/ui` must show v4 at the
  top level. Full write-up in `AGENTS.md`.
- **A dev server is usually already running on port 4321** and it is the user's. Use it.
  Only 4321 and the Vercel URL are registered Sanity CORS origins.
- **The recovered figure is sized by a CONTAINER query, not the viewport.** Card width falls
  faster than viewport width, because `.container` spends up to 100px a side on a gutter the
  artboard's zero-gutter board does not have.
- **A carousel dot is a PAGE, not a card.** With two cards in view the scroller runs out of
  travel after the third, so one dot per card leaves the last permanently unreachable.
- **`.arrow` is a site-wide convention** — lifted `-0.0625em` onto the text's optical centre
  and owning its own gap. Use it for any new link ending in an arrow.
- **The lightbox tears down synchronously**, not on the dialog's `close` event, which is a
  queued task and can lag the dialog disappearing by long enough to keep hearing audio.
- **`Layout.astro` has a `videoEmbed` prop.** WITHOUT IT every `[data-video-id]` trigger on
  the page is inert — the thing that will waste an hour when a second section gets a video.
- **A `<dialog>` using `showModal()` can live anywhere in the DOM** — the top layer escapes
  stacking contexts. This does NOT contradict the mobile drawer having to be a sibling of
  `<header>`; that one is `position: fixed`, which does not escape.
- **`_type` is immutable.** `createOrReplace` cannot change a document's type. A strong
  reference also blocks a delete, so an unset has to come first.
- **A Sanity document id must NEVER contain a dot.** A dotted `_id` is non-public: readable
  with a token, invisible without one. The Studio, the CLI and `documents validate` all
  show healthy documents while the site's client dereferences every reference to `null` and
  the build dies on `Cannot read properties of null`. Diagnose by querying the public API
  with no token. Full write-up in `AGENTS.md`.
- **`options: { collapsible }` does not exist on array fields** — only `ObjectOptions`. An
  array section needs a document **fieldset** for the same accordion.
- **The Sanity CLI has no `patch`**, and `documents create --replace` overwrites the whole
  document. To add a section: fetch, merge, upsert — or earlier sections are dropped.
- **Never put a `//` comment inside a `defineQuery` template.** Typegen does not error; it
  silently regenerates with `0 queries` and leaves stale result types behind. `npm run
  typegen` currently reports **1 query and 23 schema types** — if the query count drops,
  this is why.
- **In a hidden browser pane, CSS transitions do not advance, `requestAnimationFrame` never
  fires, and queued tasks may never arrive.** Verify by measuring the DOM.
- **`--gutter-header` is smaller than `--gutter` on purpose**, and `.nav { flex: none }`
  makes a future overflow break visibly instead of silently overlapping.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**
  to near-launch.
