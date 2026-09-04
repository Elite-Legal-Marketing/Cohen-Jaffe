# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-04 (Phase C merged to master as PR #13)

## Where things stand

Six of the homepage's fifteen sections are built, modelled in Sanity and wired: hero, stats
band, case results, "Our goals", the fee explainer, and now **practice areas** — Phase C is
done. Underneath it the **practice areas collection is done end to end** (47 documents), and
it finally has a consumer.

**All of this is on `master`.** `hp_practice_areas` merged as PR #13 (`a213d68`) and
**nothing is in flight** — the working tree is clean and the next section starts from a fresh
branch off `master`. The four commits it carried, oldest first: `Working commit` (the
collection and the hardcoded section, from the previous session), the scroll-jump fix, the
"Long Island" label change, and Phase C. The old three-PR plan is spent — the first two
landed inside `Working commit` before anyone split them.

Gates: `npm run build` green, `npm run check:types` **0 errors (65 files)**, `npm run typegen`
**2 queries, 37 schema types**, `npx sanity documents validate --yes` clean at **119 documents,
0 errors, 0 warnings**. All 47 practice areas and the whole seeded section read through the
PUBLIC API with no token — the only check that catches the dotted-id trap and a dangling ref.

## What Phase C actually did

The section moved from a hardcoded constant to Sanity, and **the built HTML did not change by
one byte**. That was verified, not assumed: the pre-swap tree was rebuilt from HEAD and the
two `dist/index.html` files diffed. The only differences were the seven CTA labels changed
deliberately in the same session — every image URL, `srcset`, hotspot `object-position`,
sub-link and the entire all-areas card were identical.

| File | What |
| --- | --- |
| `src/sanity/schemaTypes/objects/practiceAreasSection.ts` | The band — groups Copy / Tabs / All areas card |
| `src/sanity/schemaTypes/objects/practiceAreaTab.ts` | One tab: an `area` reference plus the homepage's pitch |
| `src/sanity/schemaTypes/objects/textLink.ts` | **New shared type** — a link rendered as TEXT |
| `src/sanity/schemaTypes/hrefRule.ts` | `validateHref`, shared by `ctaLink` and `textLink` |
| `scripts/seed-home-practice-areas.ts` | The seed — **and the provenance record** |
| `scripts/patch-practice-area-link-labels.ts` | One-shot: stripped "Long Island" from 8 documents |

`src/data/homePracticeAreas.ts` is **deleted**. `PracticeAreas.astro` now takes a `section`
prop typed `NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>["practiceAreas"]>`, and
`index.astro` guards it like every other section.

⚠️ **The provenance moved into the seed script, and that is where it lives now.** Which of the
seven callouts are statements of New York law, which were checked against the firm's own
pages, and which four were corrected (construction, slip & fall, medical malpractice, wrongful
death) is the docblock of `scripts/seed-home-practice-areas.ts`. For a section stating law
that is the part that matters — do not treat that file as a throwaway script.

### Two things the old plan got wrong

- **Typegen lands at 37 schema types, not the predicted 35.** Two came from the new section
  types, one from `textLink`, and one is `practiceArea.reference` — Sanity auto-emits a
  `<type>.reference` companion the first time any reference to a document type exists, and
  until Phase C nothing referenced `practiceArea`. Now in AGENTS.md.
- **The sub-links are `textLink`, not `ctaLink`.** The plan said `ctaLink`. Seeding proved it
  wrong: 13 of the 21 approved sub-link labels are longer than `ctaLink`'s 28-character
  button cap, so every publish raised 13 warnings claiming approved copy would "wrap the
  button", about things that are not buttons. A nested type's validation cannot be overridden
  per usage, so the fix was a second link type. `ctaLink` is now titled "Button" and says so;
  both share `validateHref` so they cannot drift on the trailing-slash rule. `allLink` is a
  `textLink` too — it renders as an underlined link, not a button. Rule 10 in AGENTS.md.

### The shape, for when it needs changing

`practiceAreasSection`: `eyebrow`, `heading` (required), `subheading`, `tabs[]` of
`practiceAreaTab`, `disclaimer` (required), `allHeading`, `allLink` (`textLink`), `allAreas[]`
references (`.unique()`, max 16 warning). `tabs` is capped at **7 with `.warning()`**, not
`.error()` — an eighth tab makes a taller rail, which is ugly, not broken, unlike the fifth
case-result card. Duplicate areas are caught by a **`.custom()`**, because `.unique()` on an
array of objects compares whole objects and two tabs pointing at the same area differ in
`_key` and copy, so it would never fire.

`practiceAreaTab`: `area` reference (**the one required field**), `headline`, `callout`,
`links[]` of `textLink` max 3 warning. **There is deliberately no `quote` field** — see below.

## Seeding and re-seeding

`npx sanity exec scripts/seed-home-practice-areas.ts --with-user-token`

It writes ONE field on the `homePage` singleton — `createIfNotExists` then `patch().set()`,
**never `createOrReplace`**, which would take the other five sections with it. Three guards:
it aborts unless the collection counts 47, aborts if any referenced area is missing (a
dangling `_ref` publishes fine and then dereferences to null at build time, killing the
build), and **refuses to run at all if the section already exists** — `.set()` replaces the
whole section, and an editor's tuning would go with it. `SEED_OVERWRITE=1` forces it.

`scripts/patch-practice-area-link-labels.ts` is the same idea at document level and is now
**spent** — it stripped "Long Island " from the 8 `practiceArea.linkLabel` values so the CTAs
read "Car accident lawyers". It asserts each stored value before writing and reports drift
rather than overwriting a hand-edit. Once nothing else needs it, delete it.

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

⚠️ **The "Our goals" video card is a placeholder** — the test id `c6b0eghb5r`, the same one on
the first case-result card. Id, title and duration all need replacing after the Wistia uploads.

**The "What you can expect" rows map their four olive glyphs BY POSITION**, with no Sanity
field — reordering rows in the Studio moves the words, not the pictures.

## The homepage practice areas section on the page

`src/components/PracticeAreas.astro`, rendered after the fee band. Three things in it are ours
rather than the artboard's, and all three are load-bearing:

- **The tabs are radio buttons and there is no JavaScript.** `input` → `label` → `article`, so
  `:checked + label + pane` reveals the pane by CSS adjacency alone. All seven panes are in
  the DOM for crawlers, the first is active with no script, and the radio group gives
  arrow-key selection and one tab stop for free. Adjacency rather than `:has()` so it works
  for any number of tabs.
- **The hidden radios are `position: fixed; top: 0; left: 0`, and that is not cosmetic.** As
  `position: absolute` with no offsets they all resolved to the grid container's padding edge
  — one point at the top of the rail — and since clicking a label focuses its input, and
  focusing scrolls it into view, clicking the sixth tab threw the page back up by 440px.
  Measured 0px of on-screen movement after the fix at 1440 / 900 / 375. The offsets are
  required: with `top`/`left` auto a fixed box sits at its static position and the jump
  returns. Now a gotcha in AGENTS.md.
- **Below 1024px it is an accordion**, and below 768px the pane stacks. In accordion mode
  `scrollTop` still shifts when a pane above collapses — that is Chrome's scroll anchoring
  keeping the tapped tab where it is, confirmed by reproducing it with no focus at all. Not a
  bug; do not "fix" it.

**The tabs never grow or shrink; only the pane sizes to its content** — `repeat(7, 96px)` plus
a trailing `auto` row that absorbs a taller pane, and `align-self: start` so a shorter one ends
early. The one cost is a single row-gap under the rail when that row is empty.

**The ghost button is local**, not `.btn--outline`. It gets a global variant only when the
listing page becomes a second consumer.

### ⚠️ What in this section's copy is real, and what is not

The header copy, the seven thesis headlines, the sub-link labels and the twelve "all areas"
labels are the artboard's. **The seven callouts are statements of New York law** — full
provenance in the seed script's docblock. Car, truck and premises stand as drawn; construction,
slip & fall, medical malpractice and wrongful death were corrected against the statute and the
firm's own pages.

**The artboard's seven pull quotes are NOT on the page, and `practiceAreaTab` has no field for
them.** One per tab, every one credited to "Richard S. Jaffe · Managing Partner", every one
invented — two of them operational claims the site does not support. Built, then cut whole on
the client's call. **Do not add a `quote` field back** without real, sourced quotes.

**The three sub-links per tab point at pages that do not exist yet**, so each links to the
area's own page. They become anchors when the detail pages are built — now an edit in the
Studio, not a code change.

Two small things nobody has ruled on: on a phone a long sub-link can wrap its arrow onto a line
of its own, and the tab rail is 520px at 1660 but 440px from 1400px down, a step the artboard
does not have.

## What is wired

`hero` / `stat` / `ctaLink` → `homePage` → `HOME_PAGE_QUERY` → `Hero.astro`, `Stats.astro`.
`caseResultsSection` → `results[]->` `featuredCaseResult` (capped at **four with a hard
`.error()`**, the deliberate exception) → `CaseResults.astro`. `aboutSection` / `feesSection` →
`About.astro` / `Fees.astro`. **`practiceAreasSection` → `tabs[].area->` and `allAreas[]->`
`practiceArea` → `PracticeAreas.astro`.** `firmDetails` → `FIRM_DETAILS_QUERY` → `getFirm()` →
`Layout.astro` → `Nav`, `MobileNav`, `Footer`; `Fees.astro` calls `getFirm()` directly.

Desk shape: **Pages → { Homepage }**, then **Collections → { Case Results → { Featured Case
Results, Case Results }, Attorneys, Practice Areas }**, then **Site Settings → { Firm Details }**.
Two rules in `structure.ts` and neither fails loudly: anything listed explicitly must also be in
`LISTED`, or the Studio shows it twice; any singleton must be in `SINGLETONS`, or the Studio
offers a "create new" beside it.

## Videos — pulled, not yet uploaded

All 81 YouTube videos are in `~/Downloads/Cohen & Jaffe/Videos/` (3.6 GB) with a manifest and an
empty `wistia_id` column. They are moving to **Wistia**; the `video` type will carry both ids.
10 are 360p at source, 17 vertical, 7 square, 3 unlisted. `c6b0eghb5r` is a test id on the
first case-result card AND the "Our goals" video card.

## Open questions / waiting on the user

1. **The "Our goals" pull quote is invented**, credited to Jaffe. Confirm or replace.
2. **Attorney roles** — Jaffe's is "Managing Partner" in the dataset; the live site says
   "Partner". Whoever edited it should confirm the firm has.
3. **Case results needs REAL client names, quotes, photographs and insurer-offer figures.**
4. **The rewritten "What you can expect" copy** needs the firm's blessing.
5. **The client-story videos in the artboards do not exist** on the site or the channel.
6. **The hero's video card is deliberately not built.**
7. **The Spanish section is deferred** — background in `navigation.ts`.
8. **Nine practice-area URLs need confirming live** — the seven missing from the mirror above,
   plus `/personal-injury-lawyer-nassau-county/` and `/medical-device-lawyer-long-island/`
   from the nav.
9. **The firm's wrongful-death page lists "grief" as recoverable**, which New York does not
   allow and the homepage headline says the opposite. The firm should pick one.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with credentials.

## What's next

1. **The homepage attorneys section** — "The three people who will actually work your case."
   **Do not let it repeat whichever quote "Our goals" is using.**
2. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — both artboards approved. The bio
   sidebar can now `reference` `practiceArea`.
3. **`/practice-areas/`** — `CJ - Practice Areas.dc.html`: featured six cards (reads `image`,
   `icon`, `blurb`, `linkLabel`), then five group cards from `PRACTICE_AREA_GROUPS` with the
   dash-prefixed link lists. Per-group order is a section decision — an ordered reference array
   or `order(name asc)` — not a document field.
4. **`/case-results/`** — the 60 ledger entries have no page yet.
5. Then New York Deadlines, a **`video`** type once the Wistia uploads exist, and **set `site`
   in `astro.config.mjs`** so `Layout.astro` emits a canonical link.

## Things that would surprise someone

- **A visually-hidden radio must be `position: fixed` with explicit offsets.** Focusing an
  input scrolls it into view, so wherever it sits is where the page jumps. Full story in
  AGENTS.md; the practice-area tabs are the case that proved it.
- **A nested type's validation cannot be overridden per usage** — which is why `ctaLink`
  (button, 28) and `textLink` (text, 48) are two types sharing one `validateHref`.
- **Typegen counts an auto-generated `<type>.reference` per referenced document type**, so
  adding two object types can raise the count by three.
- **Astro's scoped styles do not reach a class you pass INTO a child component** — including
  an SVG component. Own a wrapper element and use `:global()`. Third time.
- **A `cd` in one Bash call leaks into parallel calls in the same shell.** Use absolute paths.
- **GROQ `match "*/*"` matches everything** — `match` tokenises on non-word characters, so it
  is not the way to find a slug with a slash in it. Filter in the projection instead.
- **`sips -Z 2400` writes ~400–1100 KB JPEGs at quality 82** from 5–20 MB camera originals.
- **The vendor icon SVGs carry `<defs>` with full-canvas clipPaths and `id`s on every group.**
  Inlined seven times on one page those ids collide; they clip nothing, so strip both.
- **`interpolate-size: allow-keywords` is set on `:root`** — the "What you can expect"
  disclosures depend on it.
- **A running dev server can serve a STALE scoped-CSS module** while `curl` shows the new
  rule. `touch` the component and reload. **`npm run check:types` re-optimises Vite's deps
  under a running dev server, leaving `504 (Outdated Optimize Dep)` in the browser console —
  a reload clears it.** A Studio that renders its login card is healthy; a BLANK one is not.
- **Every hover underline on the site is declared at rest in `transparent`** and fades by
  animating `text-decoration-color`.
- **The published design canvas has moved on from the local `.dc.html` copies** — it stamps
  `data-om-id` now. Ask for the section by name, or for a fresh export.
- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`. An `EPERM` is
  macOS blocking `~/Downloads`; Full Disk Access fixes it after an app restart.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.** The desk is only visible
  signed in, so a desk change is verified from the user's own session.
- **A dev server is usually already running on port 4321 and it is the user's.** Only 4321 and
  the Vercel URL are registered Sanity CORS origins.
- **In a hidden browser pane the page cannot scroll at all** — `scrollTop` reads back 0 and
  real input times out. A NESTED `overflow: auto` container still works, which is how the
  scroll-jacking fix was A/B tested. Transitions also do not advance and `rAF` never fires.
- **The recovered figure is sized by a CONTAINER query**; **a carousel dot is a PAGE**;
  **`.arrow` is a site-wide convention**; **the lightbox tears down synchronously**;
  **`Layout.astro` has a `videoEmbed` prop** without which every `[data-video-id]` is inert.
- **`_type` is immutable**; a strong reference blocks a delete.
- **A Sanity document id must NEVER contain a dot** (non-public) **or a slash** (invalid).
- **`options: { collapsible }` does not exist on array fields** — use a fieldset.
- **The Sanity CLI has no `patch`**; `client.patch(id).set({…})` through `npx sanity exec` is
  how a section is added to the homepage singleton without disturbing the others.
- **`unset(["path.array[].field"])` silently matches nothing** — use an explicit `_key` path.
- **Never put a `//` comment inside a `defineQuery` template.** Typegen currently reports
  **2 queries and 37 schema types**; if the query count drops, this is why.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**.
