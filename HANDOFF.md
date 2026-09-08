# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-08 (testimonials built, modelled and seeded on `hp_reviews`, uncommitted)

## ⚠️ Read this before writing any code

The client's standing instruction, given 2026-09-08 and now rule one under
AGENTS.md → Conventions:

> *"I'm noticing that you are trying to do too much. A lot of fields are being added that
> are unnecessary. Simple is better than complicated. Try to just implement what I ask for.
> If I need more I will ask for it. I'd rather ask for an extra feature than have to go
> through Sanity and turn things off or remove items I never asked for."*

**Build what was asked and nothing beside it. Suggest extras in a sentence; do not build
them and explain afterwards.** This session shipped the reviews collection with `rating`,
`verified`, `reviewedAt`, `sourceUrl` and `externalId` fields nobody requested — plus a ⚠️
marker on 22 of 25 Studio rows — and every one came back out. That is the cost: real work,
then real work undoing it, and an editor-facing form full of things to ignore in between.

It outranks being thorough. A field is not free — it is permanent, visible to every editor,
and someone has to decide what to do with it.

## Where things stand

Eight of the homepage's fifteen sections are built, modelled and wired: hero, stats band,
case results, "Our goals", the fee explainer, practice areas, the New York deadlines band,
and now **testimonials**.

**`hp_reviews` is level with `master` and everything is UNCOMMITTED** — ten modified files,
nine new ones, no commit and no branch on the remote. `master` is at `ab7f3dc`.

Gates: `npm run build` green, `npm run check:types` **0 errors (76 files)**, `npm run typegen`
**2 queries, 44 schema types**, `npx sanity documents validate --yes` clean at **144
documents, 0 errors, 0 warnings**. The section reads back through the PUBLIC API with no
token — the only check that catches the dotted-id trap.

## The testimonials band

`src/components/Reviews.astro`, rendered after the deadlines band. A cream strip: centred
head, then a row of four cards of two shapes — a video review with a 16:9 cover and a serif
pull quote, and a written review with five gold stars and the client's own prose.

| File | What |
| --- | --- |
| `src/sanity/schemaTypes/documents/review.ts` | A written review — `author`, `quote`, `location`, `caseType` |
| `src/sanity/schemaTypes/documents/videoReview.ts` | A filmed one — plus `wistiaId` and `poster` |
| `src/sanity/schemaTypes/objects/reviewsSection.ts` | The band |
| `src/components/Reviews.astro` | The section, its carousel and its arrows |
| `src/lib/wistia.ts` | Video durations, read from the video |
| `scripts/seed-home-reviews.ts` + `scripts/reviews.json` | The seed — **and the provenance record** |
| `src/assets/icons/reviews/` | `star.svg` (currentColor) and `google-g.svg` (stays four-colour) |

`src/data/homeReviews.ts` was the hardcoded stage and is **deleted**. The swap to Sanity was
verified, not assumed: `dist/index.html` was saved before and diffed after, and the two
differ **on exactly one line** — the video cover `<img>`, which had to move from a repo asset
to the Sanity CDN. Every other byte is identical.

Typegen landed at **44 schema types, +5**: three new types plus the two auto-generated
`<type>.reference` companions for `review` and `videoReview`.

### The collection

**Collections → Reviews → { Video Reviews, Reviews }**, nested exactly like Case Results.
Both type names are in `LISTED` in `structure.ts`, or each would appear twice in the desk.

Two types rather than one with a flag, on rule 7 — they are different content. A written
review is words. A video review is a film with a cover frame and a Wistia id. Neither
type's fields are a subset of the other's.

**The written type is named `review`, not `googleReview`, deliberately.** `_type` is
immutable, so a name baking in one provider would need a migration the first time a review
comes from anywhere else.

⚠️ **`caseType` is on both types and NOTHING RENDERS IT.** It is for the unbuilt
`/about/testimonials/` page, where the mockup shows it under each review. Kept on the
client's instruction after being offered for removal — do not "tidy" it away.

### ⚠️ 22 of the 25 seeded reviews are placeholder copy

Seeded from `CJ - Testimonials.dc.html` on the client's instruction (2026-09-08) to populate
the collection while real reviews are gathered. **21 written + 4 video.**

**Three are real:** Howard, Menache R. and Patty R. are the reviews the live WordPress
homepage publishes, and their text is **verbatim from the live site** — not the artboard's
version. The artboard keeps their real names but lightly rewrites their words and adds towns
("New Hyde Park", "Great Neck", "Mineola") that appear in no source. Those towns are dropped
and `location` is empty on all three.

**Everything else is illustrative**, including all four video reviews. **Nothing in the
dataset distinguishes it** — a `verified` flag existed for exactly that job and was removed
on the client's instruction, so this file and `scripts/seed-home-reviews.ts` are the whole
record. Same standing problem as the four invented `featuredCaseResult` documents.

All four video reviews point at `c6b0eghb5r`, the only thing the firm has on Wistia and an
attorney explainer rather than a client story, so every video card shows the same 2:47.

**A review with no name is "Client", not "Anonymous"** — the client's wording, applied to 14
of the 21.

### ⚠️ Reviews will eventually be pulled from Google — the schema is ready, the access is not

Today every review is transcribed by hand. The intent is to sync them from the firm's own
Google Business Profile. What that needs, and why it cannot be done yet:

- **The Places API cannot do it.** It returns a **maximum of five reviews**, you cannot
  choose which, and the Maps Platform terms forbid storing them — so it can back neither a
  curated carousel nor an all-reviews page. The firm has ~462 reviews at 4.9.
- **The Business Profile API can.** `accounts.locations.reviews.list` returns all of them
  with pagination. It needs the **firm's own OAuth** on their verified profile plus Google's
  **manual approval** — base quota is zero until then, typically 3–10 business days. **This
  is a client action and nobody has started it.**
- **The firm already pays for Trustindex** (widget `418ef2720a76619cd906535dd85`, on the live
  `/about/testimonials/` page). It has **no API**, but its dashboard exports CSV — the
  fastest bridge to real content without waiting on Google.
- **A live pull could not power this band anyway.** The section is a hand-picked, ordered mix
  of video and written reviews; you cannot curate from a feed you do not store. Sync must
  write INTO these documents, not replace them.
- The place identifiers are already known, from the live homepage:
  `cid=67117899491750775`, FID `0x89c28828d81f75af:0xee735fbd46b377`.

⚠️ **A sync needs a stable per-review handle to upsert on, and there is no field for one.**
`externalId` was built for exactly this and removed as unrequested. Adding it back is the
first step of the sync work — mention it before building it.

### Five things in it are ours, not the artboard's

- **The control row has two states.** The board centres a lone "Read all 462 reviews" button
  and has no arrows anywhere. When everything fits there is nothing to scroll, so the arrows
  are absent and the button keeps the board's centred position; when the track overflows the
  arrows appear right and the button steps left. **One measurement drives both**, so the
  button can never sit off-centre with dead space beside it.
- **No rating figure.** The board's eyebrow reads "4.9 ★ · 462 reviews" and its button "Read
  all 462 reviews". Both numbers were dropped on the client's call — a count hardcoded into a
  page goes stale the week after it ships. **`firmDetails` was therefore not touched.**
- **The duration is read from the video, not typed** — see below.
- **`.btn--ghost` is a new global variant**, gold hairline filling gold on hover, set in
  Oswald like every other `.btn`. `.btn--outline` is NOT it — that one is a neutral ink
  outline. ⚠️ `PracticeAreas` ships the same shape as a local `.pa__cta` in Roboto Condensed;
  folding it onto the variant would change an approved section's output, so it is a separate
  commit.
- **16px body copy is `--lh-body`, not the board's 28px.** That leading was measured,
  rejected and replaced when the design system was built. Same reason the pull quote is
  `--fs-24` and not the board's 25px, which maps to no step.

### ⚠️ There is no line-clamp, and there is a height cap. They are different things.

A 12-line clamp was written as a "never fires on real copy" backstop and **fired on the
shortest real review the firm has** — at 1440px the card is 305px and Howard's 370 characters
need thirteen lines, cutting him at "…the staff was". It is gone. A review is a legal
testimonial, an arbitrary cut can turn a qualified sentence into an unqualified one, and
`line-clamp` hides text visually while leaving it in the accessible tree — a screen reader
would hear a different advertisement from the one on screen.

What replaced it: **`max-height: calc(var(--lh-body) * 13 * 1em)` with `overflow-y: auto`**,
so a long review scrolls inside its card instead of growing the row. Thirteen lines is where
the four approved cards already sat. Expressed in lines because `--lh-body` is unitless and
`em` resolves against the element's own size, so it is exactly thirteen line boxes at any
width. Verified: a 648-character review scrolls and the cards stay at 493px.

⚠️ **The cap is lifted below 700px, deliberately.** At one-up there is no row to protect, and
keeping it would nest a vertical scroller inside the page's own vertical scroll — a swipe
over the card would scroll the review instead of the page. The horizontal track has no such
conflict; different axis.

### Video durations are read from Wistia at build time

`src/lib/wistia.ts`. The public oEmbed endpoint — no key, nothing in `.env`. **This was a
global change:** `videoCard.eyebrow` held the literal string "Watch · 2 min" and the reviews
band had a `duration` field, both wrong about a video that runs **2:47**, with no way for
whoever typed them to know. **There is no duration field anywhere now**, and `videoCard`
carries a validation warning if anyone types one back in.

`scripts/patch-video-card-eyebrow.ts` trimmed the seeded eyebrow to "Watch". It has run.

- It **rounds** rather than floors — flooring gives 2:46, which disagrees with YouTube and
  with the firm's own video manifest.
- ⚠️ It **must never throw**. A build that dies because a third party timed out is far worse
  than a card missing three characters, so every failure path returns `null`, the card
  renders no duration, and the request carries its own 5s timeout because `fetch` has none.

### ⚠️ The band has no disclaimer, and the FOOTER is what covers it

NY Rule 7.1(e)(3) requires "Prior results do not guarantee a similar outcome", in those
words, on any advertisement carrying a client testimonial. One was built here and removed on
the client's call because the exact sentence already printed three times on the homepage.

What makes that safe is the **footer** instance specifically — `site-footer__disclaimer` is
site-wide and unconditional, so it travels with this band wherever the band is reused, which
the case-results band's own disclaimer does not.

**If the footer disclaimer is ever made conditional, shortened, or dropped from a page
carrying reviews, this band needs its own again.**

## Case results — unchanged, and still the launch blocker

Two types, deliberately: **`featuredCaseResult`** (4, the homepage cards) and **`caseResult`**
(60, the ledger for the unbuilt `/case-results/` page).

⚠️ **The four featured case results are fabricated** — the artboard's illustrative copy, seeded
on the client's instruction. **Replace with genuine client stories before launch.**

**The 60 ledger entries are real**, but their ten categories in `caseResultCategories.ts` were
derived from page titles. **Now that `practiceArea` has a proven reference pattern, `category`
should become a `reference` to it** rather than a parallel taxonomy — a 64-document migration,
its own task. The old URLs are redirected by one wildcard in `vercel.json`
(`/case-results/:slug` → `/case-results/`), which will swallow a detail page if one is ever
built. `migrate-case-results.ts` is one-shot and refuses to run while any `caseResult` exists.

## The practice areas collection

**`practiceArea`**, 47 documents from `scripts/seed-practice-areas.ts` (idempotent,
`createOrReplace` — so re-running it discards Studio edits; prefer a targeted patch). Desk:
**Collections → Practice Areas**, row subtitle `<group> · /<path>/`.

**Card-level fields only** — name, slug, group, icon, image, blurb, linkLabel. **Only name,
slug and group are required**; 10 of 47 have an icon and photograph, 6 a blurb, 8 a link
label. Empty renders nothing (rule 6). The Car Accidents detail template has twenty-odd
bespoke sections and is NOT modelled until that page is built and approved.

**Slugs are the LIVE paths, slash included** — `long-island-car-accident-lawyer`,
`birth-injury/cerebral-palsy`. The pages sit at the WordPress root, not under
`/practice-areas/`. No `options.source` (default slugify eats the `/`), and the document id
replaces `/` with `-`.

**Seven areas have no page in the mirror** but are in the live `/site-map/`: defective-product,
catastrophic-injury, erbs-palsy, failure-to-diagnose, surgical-error,
failure-to-diagnose-heart-attack, medical-device-lawyer. Seeded with name, group and path
only. **Confirm they resolve before launch.**

**Icons are code, not Sanity** — a document stores a key, the SVGs live in `src/assets/icons/`
with every fill and stroke `currentColor`, so olive→gold on a tab is one `color` transition.

**Premises Liability's photograph is only 1000px wide** (the live site's own upload; the
artboard reused the dog-bite shot). Fine for a card, replace before any full-bleed use.

## The homepage practice areas section

`src/components/PracticeAreas.astro`. Three things in it are ours rather than the artboard's,
and all three are load-bearing:

- **The tabs are radio buttons and there is no JavaScript.** `input` → `label` → `article`, so
  `:checked + label + pane` reveals the pane by CSS adjacency alone. All seven panes are in
  the DOM for crawlers, the first is active with no script, and the radio group gives
  arrow-key selection and one tab stop for free.
- **The hidden radios are `position: fixed; top: 0; left: 0`, and that is not cosmetic.** As
  `position: absolute` with no offsets they all resolved to one point at the top of the rail,
  and since clicking a label focuses its input — and focusing scrolls it into view — clicking
  the sixth tab threw the page up by 440px.
- **Below 1024px it is an accordion**, and below 768px the pane stacks. In accordion mode
  `scrollTop` still shifts when a pane above collapses — Chrome's scroll anchoring keeping the
  tapped tab in place. Not a bug; do not "fix" it.

⚠️ **The seven callouts are statements of New York law**; full provenance in
`scripts/seed-home-practice-areas.ts`. **The artboard's seven pull quotes are NOT on the page
and `practiceAreaTab` has no field for them** — every one was invented and credited to Jaffe.
Do not add a `quote` field back without real, sourced quotes.

**The three sub-links per tab point at pages that do not exist yet**, so each links to the
area's own page. They become anchors when the detail pages are built — a Studio edit now.

## The deadlines band

`src/components/Deadlines.astro`. A gold-ruled dark strip between two light sections: kicker,
heading and lead left with the CTA held right, then a hairline and three big gold figures —
30 days, 3 years, 90 days.

⚠️ **Every word is a statement of New York law, and the provenance lives in the docblock of
`scripts/seed-home-deadlines.ts`.** 30 days is 11 NYCRR § 65-1.1 (no-fault WRITTEN NOTICE,
not the NF-2 form — DFS OGC Opinion 08-06-01); 3 years is CPLR § 214(5); 90 days is GML
§ 50-e(1)(a), with transit authorities coming in by their own enabling acts. All three
re-verified against nysenate.gov and dfs.ny.gov on 2026-09-04.

⚠️ **This band has no disclaimer and leans on the practice-areas band directly above it.**
Reordering those two, or removing the practice-areas one, leaves bare legal deadlines with
nothing qualifying them.

**The heading is a knowing generalisation** — "The clock started the day of your accident" is
untrue of wrongful death, medical malpractice and toxic exposure. It is approved copy. **Do
not "tighten" the figures to agree with it.**

**The figure's `line-height` is 0.8**, the only sub-`--lh-flat` value on the site.
**`--gradient-forest-night` exists for this band alone.** The head's bottom margin is
`--space-section`, not the artboard's 32px, so the grid is framed equally at every width.

## Site Settings, "Our goals", the fee explainer, attorneys

`firmDetails` is a singleton under **Site Settings**, read everywhere through **`getFirm()`**
(`src/lib/firm.ts`), memoised for the build. **The bar for a field is "appears in more than
one place."** Phone numbers are stored in DISPLAY form only; `telHref()` / `smsHref()` derive
the link. `advertisingLabel` is its own required field — New York Rule 7.1 requires those two
words specifically.

`aboutSection` and `feesSection` both quote an attorney through the shared **`attorneyQuote`**
object whose `attorney` is a reference. **`RichText.astro` is the only way Portable Text is
rendered**; it always emits `.prose`.

**`attorney`** is six documents, ONE type, no `featured` / `order` / `group` — a section picks
who appears with an ordered array of references (rule 7). Only 6 of 17 fields are required.
**None of the attorney content is invented.** Three of six have no quote. Both of Garrett
Parnell's live-page bugs (his `og:url` and badge point at McNaughton's) matter for the
redirect/SEO pass.

⚠️ **The "Our goals" pull quote is the artboard's INVENTED line, attributed to Richard Jaffe**,
restored on the client's instruction; his real, sourced quote is on his `attorney` document.
**Confirm or replace before launch.** The ATTORNEYS band must not print both.

⚠️ **The "Our goals" video card is a placeholder** — `c6b0eghb5r`, the same explainer the four
video reviews use. Id, title and cover all need replacing after the Wistia uploads. Its
duration is now correct because it is read from the video.

**The "What you can expect" rows map their four olive glyphs BY POSITION**, with no Sanity
field — reordering rows in the Studio moves the words, not the pictures.

## What is wired

`hero` / `stat` / `ctaLink` → `homePage` → `HOME_PAGE_QUERY` → `Hero.astro`, `Stats.astro`.
`caseResultsSection` → `results[]->` `featuredCaseResult` (capped at **four with a hard
`.error()`**, the deliberate exception) → `CaseResults.astro`. `aboutSection` / `feesSection` →
`About.astro` / `Fees.astro`. `practiceAreasSection` → `tabs[].area->` and `allAreas[]->`
`practiceArea` → `PracticeAreas.astro`. `deadlinesSection` → `deadlines[]` of `deadlineFigure`
→ `Deadlines.astro`. **`reviewsSection` → `reviews[]->` a MIXED array of `videoReview` and
`review` → `Reviews.astro`** — the first section whose reference array accepts two document
types. `firmDetails` → `FIRM_DETAILS_QUERY` → `getFirm()` → `Layout.astro` → `Nav`,
`MobileNav`, `Footer`; `Fees.astro` calls `getFirm()` directly.

Desk shape: **Pages → { Homepage }**, then **Collections → { Case Results → { Featured Case
Results, Case Results }, Reviews → { Video Reviews, Reviews }, Attorneys, Practice Areas }**,
then **Site Settings → { Firm Details }**. Two rules in `structure.ts` and neither fails
loudly: anything listed explicitly must also be in `LISTED`, or the Studio shows it twice; any
singleton must be in `SINGLETONS`, or the Studio offers a "create new" beside it.

**The new collection's desk has not been seen signed in.** `/admin/` renders its login card
(healthy), but the desk is only visible to a signed-in session — check that **Reviews** nests
under Collections and appears **once**.

## Videos — pulled, not yet uploaded

All 81 YouTube videos are in `~/Downloads/Cohen & Jaffe/Videos/` (3.6 GB) with a manifest and an
empty `wistia_id` column. They are moving to **Wistia**; the `video` type will carry both ids.
10 are 360p at source, 17 vertical, 7 square, 3 unlisted.

**There is no client testimonial video** — all 81 are attorney explainers, which is why all
four `videoReview` documents are placeholders. `c6b0eghb5r` is the one thing on Wistia and it
is an explainer, used on the first case-result card, the "Our goals" card and all four video
reviews.

## Open questions / waiting on the user

1. **Google Business Profile API access** — a client action, 3–10 business days for Google's
   approval. Nothing has started. See the sync section above.
2. **Real reviews** to replace the 22 placeholders, and **real client videos** to replace all
   four video reviews.
3. **The "Our goals" pull quote is invented**, credited to Jaffe. Confirm or replace.
4. **Attorney roles** — Jaffe's is "Managing Partner" in the dataset; the live site says
   "Partner". Whoever edited it should confirm the firm has.
5. **Case results needs REAL client names, quotes, photographs and insurer-offer figures.**
6. **The rewritten "What you can expect" copy** needs the firm's blessing.
7. **The hero's video card is deliberately not built.**
8. **The Spanish section is deferred** — background in `navigation.ts`.
9. **Nine practice-area URLs need confirming live** — the seven missing from the mirror above,
   plus `/personal-injury-lawyer-nassau-county/` and `/medical-device-lawyer-long-island/`.
10. **The firm's wrongful-death page lists "grief" as recoverable**, which New York does not
    allow and the practice-areas headline says the opposite. The firm should pick one.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with credentials.

## What's next

1. **Commit `hp_reviews`, push, open a PR.** Nothing is committed.
2. **The homepage attorneys section** — "The three people who will actually work your case."
   **Do not let it repeat whichever quote "Our goals" is using.**
3. **`/about/testimonials/`** — the "Read all reviews" destination, already in
   `navigation.ts:111` and `:241` and already indexed. `CJ - Testimonials.dc.html` is
   approved: a video-reviews band, a written-reviews band with a load-more button, and a
   "leave a review" panel. `caseType` exists for it. Its Google button uses
   `https://www.google.com/maps?cid=67117899491750775`.
4. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — both artboards approved. The bio
   sidebar can now `reference` `practiceArea`.
5. **`/practice-areas/`** — `CJ - Practice Areas.dc.html`: featured six cards, then five group
   cards from `PRACTICE_AREA_GROUPS`.
6. **`/case-results/`** — the 60 ledger entries have no page yet.
7. Then a **`video`** type once the Wistia uploads exist, and **set `site` in
   `astro.config.mjs`** so `Layout.astro` emits a canonical link.

## Things that would surprise someone

- **`reviews[]->[filter]` is NOT an array filter in GROQ.** It returns `[null, null, …]` and
  the build dies on `Cannot read properties of null`. So does `reviews[]->{…}[filter]`. Filter
  the REFERENCE array before dereferencing: `reviews[@->rating == 5]->{…}`. This cost a build
  failure; the fix is one character of syntax and no error points at it.
- **`--measure` NO LONGER EXISTS.** The 600px `.prose` cap was removed on the client's call.
  AGENTS.md still describes it. Use `--container-prose` (790px) for a single column of text.
- **A typed duration is always wrong eventually.** Read it from the video.
- **`--lh-flat: 1` is the token ramp's floor, not the site's.** A display numeral
  baseline-aligned beside a small label goes under it; the deadlines figure is `0.8`.
- **A visually-hidden radio must be `position: fixed` with explicit offsets.** Focusing an
  input scrolls it into view, so wherever it sits is where the page jumps.
- **A nested type's validation cannot be overridden per usage** — which is why `ctaLink`
  (button, 28) and `textLink` (text, 48) are two types sharing one `validateHref`.
- **Typegen counts an auto-generated `<type>.reference` per referenced document type**, so
  adding three types raised the count by five.
- **Astro's scoped styles do not reach a class you pass INTO a child component** — including
  an SVG component. Own a wrapper element and use `:global()`.
- **A `cd` in one Bash call leaks into parallel calls in the same shell.** Use absolute paths.
- **GROQ `match "*/*"` matches everything** — `match` tokenises on non-word characters.
- **`sips -Z 2400` writes ~400–1100 KB JPEGs at quality 82** from 5–20 MB camera originals.
- **The vendor icon SVGs carry `<defs>` with full-canvas clipPaths and `id`s on every group.**
  Inlined repeatedly on one page those ids collide; strip both. The Google "G" is the
  exception — it is a four-colour brand mark and must NOT be given `currentColor`.
- **`interpolate-size: allow-keywords` is set on `:root`** — the "What you can expect"
  disclosures depend on it.
- **A running dev server can serve a STALE scoped-CSS module** while `curl` shows the new
  rule. `touch` the component and reload. **`npm run check:types` re-optimises Vite's deps
  under a running dev server, leaving `504 (Outdated Optimize Dep)` in the browser console.**
  A Studio that renders its login card is healthy; a BLANK one is not.
- **Every hover underline on the site is declared at rest in `transparent`** and fades by
  animating `text-decoration-color`.
- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`. An `EPERM` is
  macOS blocking `~/Downloads`; Full Disk Access fixes it after an app restart.
  `seed-home-reviews.ts` reads its four cover images from there rather than committing 4.8 MB
  of placeholder photographs to `src/assets`.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.**
- **A dev server is usually already running on port 4321 and it is the user's.** Only 4321 and
  the Vercel URL are registered Sanity CORS origins, so do NOT move the port to free it.
- **In a hidden browser pane the page cannot scroll, `requestAnimationFrame` never fires and
  `ResizeObserver` never delivers** — both measured this session, both silent. Anything driven
  by them reads as broken when it is fine. `display: none` the other sections and screenshot
  what is left; that is how this band was checked at every breakpoint.
- **`_type` is immutable**; a strong reference blocks a delete.
- **A Sanity document id must NEVER contain a dot** (non-public) **or a slash** (invalid).
- **`options: { collapsible }` does not exist on array fields** — use a fieldset.
- **The Sanity CLI has no `patch`**; `client.patch(id).set({…})` through `npx sanity exec` is
  how a section is added to the homepage singleton without disturbing the others.
  `sanity documents delete` needs `--dataset production` before the id.
- **`unset(["path.array[].field"])` silently matches nothing** — use an explicit `_key` path.
  To DROP a field from existing documents, re-run a `createOrReplace` seed; it replaces the
  whole document.
- **Never put a `//` comment inside a `defineQuery` template.** Typegen currently reports
  **2 queries and 44 schema types**; if the query count drops, this is why.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**.
