# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-04 (deadlines band committed on `hp_time`, not pushed, no PR)

## Where things stand

Seven of the homepage's fifteen sections are built, modelled in Sanity and wired: hero,
stats band, case results, "Our goals", the fee explainer, practice areas, and now **the
New York deadlines band**.

**`hp_time` is one commit ahead of `master` and has not been pushed** — no branch on the
remote, no PR. It branched off `f3102ae` and carries the whole deadlines section in a single
commit: four new files plus the schema, query, page, tokens and both docs. The working tree
is clean. Note `src/data/homeDeadlines.ts` was created and deleted inside that one commit,
so the hardcoded stage leaves no trace in the diff.

Gates: `npm run build` green, `npm run check:types` **0 errors (69 files)**, `npm run typegen`
**2 queries, 39 schema types**, `npx sanity documents validate --yes` clean at **119 documents,
0 errors, 0 warnings**. The section reads back through the PUBLIC API with no token — the
only check that catches the dotted-id trap.

## The deadlines band

`src/components/Deadlines.astro`, rendered after practice areas. A gold-ruled dark strip
between two light sections: kicker, heading and lead on the left with the CTA held right,
then a hairline and three big gold figures — 30 days, 3 years, 90 days.

| File | What |
| --- | --- |
| `src/sanity/schemaTypes/objects/deadlinesSection.ts` | The band |
| `src/sanity/schemaTypes/objects/deadlineFigure.ts` | One figure: `figure` + `unit` + `body`, all required |
| `src/components/Deadlines.astro` | The section |
| `scripts/seed-home-deadlines.ts` | The seed — **and the provenance record** |
| `src/styles/global.css` | `--forest-1100` and `--gradient-forest-night` |

`src/data/homeDeadlines.ts` was the hardcoded stage and is **deleted**. The swap to Sanity
was verified, not assumed: `dist/index.html` was saved before the swap and diffed after, and
the two files are **byte-identical at 229,195 bytes**. (The 30-day card was corrected after
that diff, so `dist/` no longer matches those bytes — the diff proved the WIRING, not the
current copy.)

Typegen landed at **39 schema types, exactly the predicted +2** — no `<type>.reference`
companion this time, because nothing new references a document type.

### ⚠️ The provenance lives in the seed script, and that is where it stays

Every word of this section is a statement of New York law, and a reader who believes a
number here and acts on it loses their claim. The statute behind each figure is in the
docblock of `scripts/seed-home-deadlines.ts`:

- **30 days** — 11 NYCRR § 65-1.1, no-fault written notice. Most people get this wrong
  because it was 90 days until the 2002 revision.
- **3 years** — CPLR § 214(5).
- **90 days** — GML § 50-e(1)(a), notice of claim against a public corporation. Transit
  authorities come in by their own enabling acts (e.g. Public Authorities Law § 1212), which
  is why the card names them separately. The statute runs the 90 days from when the CLAIM
  ARISES — and in a wrongful death case from the appointment of the estate's representative.

All three were re-verified against the primary source on 2026-09-04: nysenate.gov for the
statutes, dfs.ny.gov for Regulation 68.

**Three** lines of the artboard were **corrected**:

- **The lead contradicted its own first card.** It read "the shortest deadline applies when
  a bus, a town, or a school district was involved" — but 30 days is shorter, and applies to
  every crash. Only the superlative was replaced: "the window shortens sharply". The point it
  was reaching for is true (90 days' notice, then one year and ninety days to sue, GML § 50-i)
  and now survives the card next to it.
- **"Less for malpractice"** → **"medical malpractice"**. Unqualified it is wrong in the
  client's favour: legal malpractice is three years, CPLR § 214(6). Medical malpractice is
  two and a half, CPLR § 214-a.
- **"To file your no-fault application"** → **"to give your insurer written notice of a
  no-fault claim"**, caught on a re-check after the section was already seeded. The artboard
  hangs the 30 days on the wrong document. § 65-1.1 puts it on WRITTEN NOTICE; the NF-2
  "Application for Motor Vehicle No-Fault Benefits" is a different filing, which the insurer
  must mail out within five business days of receiving that notice (§ 65-3.4(b)) and which
  the claimant returns on its own clock. DFS **OGC Opinion 08-06-01** is explicit that a late
  NF-2 does not defeat a claim where timely written notice was given some other way — an
  MV-104 police report will do. The original misleads both ways: someone waiting for a form
  to arrive can blow the notice deadline, and someone whose form arrives late can believe
  they have lost a claim they still have.

**The heading is a generalisation and was deliberately left alone.** "The clock started the
day of your accident" is true of ordinary negligence and not of wrongful death (runs from
death), medical malpractice (act, or end of continuous treatment) or toxic exposure
(discovery). It is approved copy. **Do not "tighten" the figures to agree with it.**

### ⚠️ This section has no disclaimer, and it leans on the one above it

`deadlinesSection` has **no `disclaimer` field**. The practice-areas band directly above
closes with "Information on this page is general and is not legal advice about your case.
New York deadlines and rules vary by claim type" — this section's disclaimer, one band away,
naming deadlines specifically. A second would be the same sentence twice in a screen.

**Reordering those two bands, or removing the practice-areas one, leaves a section of bare
legal deadlines with nothing qualifying it.** The warning is on the field in `homePage.ts`
and in `deadlinesSection.ts`; it is the single most breakable thing about this section.

### Four things in it are ours, not the artboard's

- **The heading does not `white-space: nowrap`.** Same fixed-1660px trick the fee band had —
  it would force a horizontal scrollbar under ~1150px.
- **The CTA is Oswald**, not the board's Roboto Condensed. The geometry is the board's
  exactly (48 × 250 = `.btn--sm.btn--wide`); this is the only button on the board asking for a
  third typeface, and taking it would leave the page's four gold CTAs in two voices.
- **The head's bottom margin is `--space-section`, not the artboard's 32px.** That is the
  SAME token `.section` uses for its own padding, and deliberately so: what sits below the
  grid is the section's bottom padding, so borrowing the token frames the grid with equal
  space above and below at every width instead of matching at one measured viewport. At 1440
  it is 73px each side; the artboard's 32px left the hairline crowding the lead with 80px of
  air under the last line. Confirmed with the user 2026-09-04 against the alternative (equal
  air around the FIGURES rather than the grid box) — the two cannot both be equal, because
  the hairline is the grid's own top border, so space added above the box moves the rule away
  from the lead but not from the figures.
- **`--gradient-forest-night` exists for this band alone.** The board's darkest fade, used
  once. Three forest gradients already run down this page and the one section saying a clock
  is running should not read as a fourth. Its first stop is snapped onto `--forest-900` — the
  board's `#22291a` is off by one in two channels — so the scale keeps one value.

**The figure's `line-height` is 0.8**, the only sub-`--lh-flat` value on the site, and it is
explained both in the component and now in AGENTS.md.

**Below 768px the button goes full width because of a GLOBAL `.btn--wide` rule**, not
anything this section does. A local rule duplicating it was written and then removed.

Two things nobody has ruled on: at 1660 the lead runs to a single ~1100px line, well past the
readable measure the design system sets elsewhere (the board draws it that way and
`CaseResults` set the no-cap precedent, so both were followed); and the CTA label promises a
checker that does not exist — it goes to `/contact/`, matching the hero and the fee band,
because the only honest way to check a deadline is to have a lawyer look at the facts.

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
  the sixth tab threw the page up by 440px. Now a gotcha in AGENTS.md.
- **Below 1024px it is an accordion**, and below 768px the pane stacks. In accordion mode
  `scrollTop` still shifts when a pane above collapses — Chrome's scroll anchoring keeping the
  tapped tab in place. Not a bug; do not "fix" it.

⚠️ **The seven callouts are statements of New York law**; full provenance in
`scripts/seed-home-practice-areas.ts`. **The artboard's seven pull quotes are NOT on the page
and `practiceAreaTab` has no field for them** — every one was invented and credited to Jaffe.
Do not add a `quote` field back without real, sourced quotes.

**The three sub-links per tab point at pages that do not exist yet**, so each links to the
area's own page. They become anchors when the detail pages are built — a Studio edit now.

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

## What is wired

`hero` / `stat` / `ctaLink` → `homePage` → `HOME_PAGE_QUERY` → `Hero.astro`, `Stats.astro`.
`caseResultsSection` → `results[]->` `featuredCaseResult` (capped at **four with a hard
`.error()`**, the deliberate exception) → `CaseResults.astro`. `aboutSection` / `feesSection` →
`About.astro` / `Fees.astro`. `practiceAreasSection` → `tabs[].area->` and `allAreas[]->`
`practiceArea` → `PracticeAreas.astro`. **`deadlinesSection` → `deadlines[]` of
`deadlineFigure` → `Deadlines.astro`** — no references, the only section so far with none.
`firmDetails` → `FIRM_DETAILS_QUERY` → `getFirm()` → `Layout.astro` → `Nav`, `MobileNav`,
`Footer`; `Fees.astro` calls `getFirm()` directly.

Desk shape: **Pages → { Homepage }**, then **Collections → { Case Results → { Featured Case
Results, Case Results }, Attorneys, Practice Areas }**, then **Site Settings → { Firm Details }**.
Two rules in `structure.ts` and neither fails loudly: anything listed explicitly must also be in
`LISTED`, or the Studio shows it twice; any singleton must be in `SINGLETONS`, or the Studio
offers a "create new" beside it.

**The new section's Studio form has not been seen signed in.** `/admin/` renders its login card
(healthy), but the desk is only visible to a signed-in session — check the collapsed "New York
deadlines" field once.

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
   plus `/personal-injury-lawyer-nassau-county/` and `/medical-device-lawyer-long-island/`.
9. **The firm's wrongful-death page lists "grief" as recoverable**, which New York does not
   allow and the practice-areas headline says the opposite. The firm should pick one.
10. **The deadlines lead's measure**, and whether "Check my deadline" should keep pointing at
    `/contact/` or get a real deadline page. Both flagged above.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with credentials.

## What's next

1. **Push `hp_time` and open a PR.** One commit, nothing on the remote yet.
2. **Testimonials** — the next band down the artboard (line 440).
3. **The homepage attorneys section** — "The three people who will actually work your case."
   **Do not let it repeat whichever quote "Our goals" is using.**
4. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — both artboards approved. The bio
   sidebar can now `reference` `practiceArea`.
5. **`/practice-areas/`** — `CJ - Practice Areas.dc.html`: featured six cards, then five group
   cards from `PRACTICE_AREA_GROUPS`. Per-group order is a section decision, not a document field.
6. **`/case-results/`** — the 60 ledger entries have no page yet.
7. Then a **`video`** type once the Wistia uploads exist, and **set `site` in
   `astro.config.mjs`** so `Layout.astro` emits a canonical link.

## Things that would surprise someone

- **`--lh-flat: 1` is the token ramp's floor, not the site's.** A display numeral
  baseline-aligned beside a small label goes under it; the deadlines figure is `0.8` and says
  why. Do not make it a token.
- **A visually-hidden radio must be `position: fixed` with explicit offsets.** Focusing an
  input scrolls it into view, so wherever it sits is where the page jumps.
- **A nested type's validation cannot be overridden per usage** — which is why `ctaLink`
  (button, 28) and `textLink` (text, 48) are two types sharing one `validateHref`.
- **Typegen counts an auto-generated `<type>.reference` per referenced document type**, so
  adding two object types can raise the count by three — or, as here, by exactly two when the
  new types reference nothing.
- **Astro's scoped styles do not reach a class you pass INTO a child component** — including
  an SVG component. Own a wrapper element and use `:global()`.
- **A `cd` in one Bash call leaks into parallel calls in the same shell.** Use absolute paths.
- **GROQ `match "*/*"` matches everything** — `match` tokenises on non-word characters.
- **`sips -Z 2400` writes ~400–1100 KB JPEGs at quality 82** from 5–20 MB camera originals.
- **The vendor icon SVGs carry `<defs>` with full-canvas clipPaths and `id`s on every group.**
  Inlined seven times on one page those ids collide; strip both.
- **`interpolate-size: allow-keywords` is set on `:root`** — the "What you can expect"
  disclosures depend on it.
- **A running dev server can serve a STALE scoped-CSS module** while `curl` shows the new
  rule. `touch` the component and reload. **`npm run check:types` re-optimises Vite's deps
  under a running dev server, leaving `504 (Outdated Optimize Dep)` in the browser console.**
  The one that survives a cache wipe and a restart is
  `astro/runtime/client/dev-toolbar/entrypoint.js` — Astro's own dev toolbar, dev-only, and it
  touches neither the site nor the build. A Studio that renders its login card is healthy; a
  BLANK one is not.
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
  real input times out. The way round it is to `display: none` the other sections and
  screenshot what is left; that is how this band was checked at every breakpoint. Transitions
  also do not advance and `rAF` never fires.
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
  **2 queries and 39 schema types**; if the query count drops, this is why.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**.
