# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-04 (after the client's review notes)

## Where things stand

Six of the homepage's fifteen sections are built: hero, stats band, case results, "Our goals",
the fee explainer — all five modelled in Sanity and wired — and now **Practice areas**, which is
**built hardcoded, reviewed by the client with their six notes applied, and ready to be
modelled** (Phase C, spec below). Underneath it, the **practice areas collection is done end to
end**: schema, desk entry, 47 documents seeded into `production`, verified through the public
API. The review also brought the **"Our goals" row icons back** — glyphs on the page, no field.

Branch **`hp_practice_areas`**, off `origin/master` at `e6c3b61` (PR #12). **Nothing on it is
committed yet** — the whole working tree below is uncommitted. The intended shape is three PRs:
the collection, the hardcoded section, the modelling. Commit only when asked.

Gates at the time of writing: `npm run build` green, `npm run check:types` **0 errors**,
`npm run typegen` **2 queries, 33 schema types**, `npx sanity documents validate --yes` clean at
**119 documents, 0 errors, 0 warnings**. All 47 practice areas readable through the PUBLIC API
with no token — the only check that catches the dotted-id trap.

## The practice areas collection — done

**`practiceArea`**, in `src/sanity/schemaTypes/documents/practiceArea.ts`. Forty-seven
documents, seeded from `scripts/seed-practice-areas.ts` (idempotent; re-run with
`npx sanity exec scripts/seed-practice-areas.ts --with-user-token`). Desk: **Collections →
Practice Areas**, a flat list whose row subtitle is `<group> · /<path>/`.

| File | What |
| --- | --- |
| `src/sanity/schemaTypes/documents/practiceArea.ts` | The type — seven fields, three required |
| `src/sanity/schemaTypes/practiceAreaGroups.ts` | The five groups (value, title, note), hub order |
| `src/sanity/schemaTypes/practiceAreaIcons.ts` | The ten icon keys — one source for schema AND component |
| `src/assets/icons/practice-areas/*.svg` | The vendor icons, converted to `currentColor` |
| `src/assets/icons/expect/*.svg` | The four "What you can expect" glyphs, same treatment |
| `src/assets/practice-areas/pa-*.jpg` | Ten card photographs, downscaled to 2400px (6.2 MB) |
| `src/components/PracticeAreaIcon.astro` | Key → inlined SVG, typed against the key list |
| `src/lib/practiceAreas.ts` | `practiceAreaHref(slug)` — the one place `/${slug}/` is built |
| `scripts/seed-practice-areas.ts` | The 47 seeds, with the provenance of every name and blurb |

**Card-level fields only** — name, slug, group, icon, image, blurb, linkLabel. The Car Accidents
detail template (`CJ - Car Accidents.dc.html`) has twenty-odd bespoke sections and is NOT
modelled until that page is built and approved.

**Only name, slug and group are required.** Ten of 47 have an icon and a photograph, six a
blurb, seven a link label. Empty renders nothing (rule 6).

**Scope is the live `/practice-areas/` hub's taxonomy plus what the artboards need.** The hub
lists 39 in five groups; two are not practice areas and were dropped ("Types of Injuries", a
mis-targeted link, and "Abogado de Accidente", the deferred Spanish section); ten were added
because an artboard, the nav or the footer names them and each has a live page — including
**Medical Malpractice itself, which the hub oddly omits**, and Motorcycle Accidents. The seed
array is in hub order, group by group; there is no `order` field, so that array is where the
order is recoverable from.

**Slugs are the LIVE paths, slash included.** `long-island-car-accident-lawyer`,
`birth-injury/cerebral-palsy`. The pages sit at the WordPress root, not under
`/practice-areas/`, and those are the indexed URLs. The slug field has no Generate button on
purpose (default slugify would eat the `/`), and the id replaces `/` with `-`. Rule is now in
AGENTS.md → Sanity conventions.

**Names: artboard wording → nav → hub**, decided with the client. So "Slip & Fall" (homepage
tab, footer) over the hub's "Slip and Fall Accidents", "Workers' Compensation" over "Workplace
Accidents", "Hair Relaxer Cancer Lawsuit" (nav) over "Chemical Hair Relaxer Lawsuit", and the
homepage's "Brain & Spinal Injury" is the site's Traumatic Brain Injury page — the one that
exists.

**Seven areas have no page in the mirror** but are in the live `/site-map/`, linked absolutely
(how SiteSucker leaves a page it never fetched): defective-product, catastrophic-injury,
erbs-palsy, failure-to-diagnose, surgical-error, failure-to-diagnose-heart-attack, and
medical-device-lawyer (the one the nav already flags). Seeded with name, group and path only.
**Confirm they resolve before launch.**

**Photographs.** Nine are the artboards' `pa-*.jpg` originals (5–20 MB camera files, the `-new`
suffixed ones are byte-identical duplicates), downscaled with `sips -Z 2400`. Slip & Fall is
`pa-slip-fall.jpg` — the wet-floor sign; the homepage artboard's `firm-video-cover.png` was a
mislink. **Premises Liability had no photograph** (the artboard reuses the dog-bite shot); on
the client's call it uses the snow-covered stairway from the live site's own uploads, which is
**only 1000px wide — fine for a card, replace before any full-bleed use.**

**Icons are code, not Sanity.** The "Our goals" decision applied again: a document stores a key,
the SVGs live in the repo. Every fill and stroke is `currentColor`, so one file serves the olive
and gold colourways and the tab's olive→gold is a single `color` transition. The vendor files'
`<defs>` held only full-canvas clipPaths, removed along with every `id`, so seven inlined icons
carry nothing to collide.

**Blurbs and group notes were checked against the mirror** because they are claims about how
the firm works. Car and truck stand as drawn. Rewritten: slip & fall ("we move fast to preserve
… camera footage" is nowhere on the site → the page's own claim about notice and evidence),
motorcycle ("we rebuild what happened" → the page's "counter the anti-motorcycle bias"),
malpractice and the malpractice group note ("reviewed by a physician before we ever file" →
"investigated with independent medical experts", which the page says), construction
("protections almost no other state does" is a comparative claim supported nowhere → Labor Law
claims beyond workers' compensation, against contractors, owners and equipment makers).

## The homepage practice areas section — built and reviewed, not yet modelled

`src/components/PracticeAreas.astro`, content in **`src/data/homePracticeAreas.ts`**, rendered
in `index.astro` immediately after the fee band — the artboard's own order (homepage artboard
lines 327–401, data `const PAS` 960–1046).

The constant is shaped exactly as the `practiceAreas` projection of `HOME_PAGE_QUERY` will be,
down to the **real `image.asset._ref` values** of the seeded documents, so `urlFor()` runs and
the image code is identical before and after wiring. Wiring is a swap from the constant to a
prop.

Verified at 1660 / 900 / 375 in the browser: seven fixed 96px tabs beside a pane sized by its
own content, icons computing gold on the active tab and olive elsewhere, the first pane open
with no JavaScript, click and arrow keys switching panes, every href a real slashed path, no
horizontal scroll at 375.

**The client's review notes (2026-09-04), all applied:**

- **A centred eyebrow has no dash** — now a site-wide rule, `.eyebrow--center` in
  `global.css` and in AGENTS.md. The dash is drawn to the left of the text, so centred it
  read as a stray mark.
- **The tabs never grow or shrink; only the pane sizes to its content.** The rows are a fixed
  `repeat(7, 96px)` plus a trailing `auto` row that absorbs a pane taller than the rail, and
  the pane is `align-self: start` so a shorter one ends early. The one cost is a single
  row-gap under the rail when that extra row is empty.
- **Icons a third smaller** — 40px, 32px on phones.
- **The pull quote is gone from the pane entirely** — markup, CSS and data. That also
  removes the seven invented Jaffe quotes and the open question they carried. Do NOT model
  a `quote` on `practiceAreaTab`.
- **In the accordion the selected tab shows no arrow** — the pane is below it, not beside.
- **On phones the "See all practice areas" link leaves the card's head row** and renders a
  second time under the twelve links, above a hairline. Same `allLink` field both places;
  desktop never shows both.

Three things in it are ours rather than the artboard's:

- **The tabs are radio buttons and there is no JavaScript.** Each tab is an `<input
  type="radio">`, its `<label>`, then its `<article>` pane, in that order, so
  `:checked + label + pane` reveals the pane by CSS adjacency alone. All seven panes are in
  the DOM for crawlers, the first is active without a script, and the radio group gives
  arrow-key selection and a single tab stop for free. Adjacency rather than `:has()` because
  it works for any number of tabs. Same reasoning as the `<details>` rows in "Our goals".
- **Below 1024px it is an accordion**, decided with the client. Because the DOM already
  interleaves tab and pane, collapsing the grid to one column puts each open pane directly
  under its own tab — the tapped thing stays in view — for the cost of a media query. Below
  768px the pane stacks, photograph as a 240px strip above the copy. The 96px tabs become 80.
- **The ghost button is local**, not `.btn--outline`, which is ink-on-cream with an ink hover
  fill. The artboard's is a gold hairline, gold text, gold fill on hover, in Roboto Condensed.
  It gets a global variant only when the listing page becomes a second consumer.

**A class passed INTO a child component is not reached by scoped styles** — the icon's
colour silently did not apply on the first build. The icon and the check mark each sit in a
`<span>` this template owns, sized with `:global(svg)`. Third time this has cost time; it is
in "Things that would surprise someone" below.

Two small things nobody has ruled on: on a phone a long sub-link can wrap its arrow onto a
line of its own ("The serious injury threshold explained →"), and the tab rail is 520px at
1660 but 440px from 1400px down, which is a step the artboard does not have.

### ⚠️ What in this section's copy is real, and what is not

The header copy, the seven thesis headlines, the sub-link labels and the twelve "all areas"
labels are the artboard's. The **seven callouts are statements of New York law**, so every
clause was checked against the firm's own pages and, where the site is silent, the statute.
Car, truck and premises stand as drawn. Corrected:

1. **Construction** — "strictly liable" dropped. Labor Law § 240(1) is absolute liability;
   § 241(6) is not. The firm's page says the two "offer additional avenues".
2. **Slip & fall** — "Comparative fault can reduce but rarely eliminates recovery" → "does not
   bar one". New York is pure comparative (CPLR 1411); the firm's own geo pages say so.
3. **Medical malpractice** — "require a physician expert to certify the departure before
   filing" → the certificate of merit as it works (CPLR 3012-a: the attorney certifies having
   consulted a physician; the firm's pages describe it). "court-set schedule" → "set by New
   York law" (Judiciary Law § 474-a, which the fee band already cites).
4. **Wrongful death** — "Both usually run on a two-year clock" split: the wrongful death claim
   is two years (EPTL 5-4.1, and the page); the survival claim follows the injury's own period.
   Note the firm's live wrongful-death page lists "grief" among recoverable damages, which the
   headline (rightly, for New York) contradicts — one for the firm.

**The artboard's seven pull quotes are NOT on the page.** One per tab, every one credited to
"Richard S. Jaffe · Managing Partner", every one invented — two of them operational claims the
site does not support. Built, then cut whole on the client's call. Nothing in the pane is
attributed to anyone, and there is nothing here to confirm before launch. (Jaffe's `role` in the
dataset is now "Managing Partner"; the last handoff recorded "Partner". Someone has edited it.)

**The three sub-links per tab point at pages that do not exist yet.** The detail template has
sections for each ("What no-fault actually covers", …), so every one currently links to the
area's own page; they become anchors when those pages are built. Modelled as `ctaLink[]` so the
hrefs are edited in the Studio, not the code.

### What Phase C is — the next piece of work

Model it as **`practiceAreasSection`** on `homePage` (groups copy · tabs · all): `eyebrow`,
`heading` (required), `subheading`, `tabs[]` of a new **`practiceAreaTab`** object (`area`
reference — the one required field — `headline`, `callout`, `links[]` of `ctaLink` max 3
warning; **no quote field**), `disclaimer` (required), `allHeading`, `allLink`
(`ctaLink`), `allAreas[]` references (`.unique()`, max 16 warning). `tabs` is `.max(7)
.warning()`, not `.error()` — an eighth tab is ugly, not broken, unlike the fifth case-result
card. Warn on two tabs sharing an `area._ref` with `.custom()`, because `.unique()` on objects
compares whole objects.

Then: the projection appended to `HOME_PAGE_QUERY` (no `//` inside it), `scripts/seed-home-
practice-areas.ts` patching the singleton (`createIfNotExists` then `client.patch("homePage")
.set({…})` — never `createOrReplace`; every array member with `_type` and `_key`; refs
`practice-area-<slug>`; abort unless the collection counts 47),
swap the constant for `section` prop typed `NonNullable<NonNullable<HOME_PAGE_QUERY_RESULT>
["practiceAreas"]>`, delete `src/data/homePracticeAreas.ts`. Expect typegen at **2 queries,
35 types**, validate at 119 / 0 / 0. Then rewrite this file. The above is enough to execute
from without the original plan.

## Site Settings → Firm Details

A singleton, `firmDetails`, under **Site Settings** in the desk: the firm's legal and short
name, the footer blurb, the main phone and text numbers, both offices, and the
attorney-advertising notice. **The bar for a field here is "appears in more than one place."**
Everything reads it through **`getFirm()`** in `src/lib/firm.ts`, memoised for the whole build.

**Phone numbers are stored in DISPLAY form only**; `telHref()` / `smsHref()` in
`src/lib/phone.ts` derive the link. **`advertisingLabel` is its own required field** — New York
Rule 7.1 requires those two words specifically. Not in it, deliberately: navigation (indexed IA,
stays in `src/data/navigation.ts`), SEO defaults (the planned Global SEO Settings singleton), and
anything with one consumer. Offices are nested, not a collection.

## "Our goals" and the fee explainer — modelled and wired

Both live on `homePage` (`aboutSection`, `feesSection`), both quote an attorney through the
shared **`attorneyQuote`** object whose `attorney` is a reference — name, role and portrait come
from the attorney document, so a homepage quote can never carry a title the bio page has since
corrected.

**`RichText.astro` is the only way Portable Text is rendered**; it always emits `.prose`.
`.prose` no longer caps the measure and `--measure` is gone from the tokens, on the client's
call; `.container--prose` (790px) is for a page that genuinely wants a narrow column.

⚠️ **The "Our goals" pull quote is the artboard's INVENTED line, attributed to Richard Jaffe**,
restored on the client's instruction; his real, sourced quote is on his `attorney` document.
**Confirm or replace before launch.** The ATTORNEYS band must not print both.

⚠️ **The "Our goals" video card is a placeholder** — wired to the test id `c6b0eghb5r`, the same
one on the first case-result card. Id, title and duration all need replacing after the Wistia
uploads. The card takes its cover photograph's aspect ratio, not the artboard's 520px height.

**The fee band is the homepage's version of the firm's "No Fee Promise"** page
(`about/no-fee-promise/` in the mirror), and every clause was checked against it. Two did not
survive ("another lawyer may review it first", "depositions" in the costs list). The load-bearing
claim — the firm absorbs advanced costs on a loss — IS on the firm's own site. The malpractice
sliding-scale disclaimer is accurate (Judiciary Law § 474-a) and must not be dropped.

**Three fields were cut after review, on the client's call** — `attorneyQuote.accent`,
`feesSection.phoneLabel`, `expectation.icon`. Not oversights.

**The eyebrow is one component.** The gold dash is part of `.eyebrow` itself; `.eyebrow--bare`
where a dash does not belong, `.eyebrow--center` over a centred heading (no dash either). The
case-result cards' micro-labels are deliberately not in this family.

**The "What you can expect" rows have their olive glyphs back — with NO Sanity field.** The
client's original note meant "remove the field", not the icons. So `About.astro` maps the four
brand SVGs (`src/assets/icons/expect/`, converted to `currentColor` and inlined) to rows **by
position**: first row, first icon. Reordering rows in the Studio moves the words, not the
pictures; a fifth row wraps to the first icon. If that ever bites, the fix is the field this
replaced — a `string` with a `list` of the four keys. The detail paragraph is aligned under the
title again, clear of the icon column, and the row reflows at 500px as before.

## The attorneys collection — one type, six documents

**`attorney`**, six documents seeded from `scripts/seed-attorneys.ts`. ONE type; a section picks
who appears with an ordered array of references — no `featured` flag, no `order`, no `group`
(rule 7). Only six of seventeen fields are required (rule 6). Slugs match `navigation.ts` —
the live, indexed paths under `/about/attorneys/`.

**None of the attorney content is invented.** Three of six have no quote; roles were the live
site's "Partner" for the three partners — **Jaffe's has since been edited to "Managing Partner"
in the dataset**, which is what the fee band now prints for him. McNaughton has no credentials the bio names. Tiger's "2.75" was seeded as "$2.75 million".

Three blocks the bio artboard draws are deliberately NOT modelled: the video card (→ `video`),
the **practice-areas sidebar (→ now can become `reference` to `practiceArea` — a follow-up)**,
and the award badge row. Both of Garrett Parnell's live-page bugs (his `og:url` and badge point
at McNaughton's) matter for the redirect/SEO pass.

Portraits: `src/assets/atty-*.png`, the firm's real headshots with the background replaced.
One photograph per attorney with a hotspot; a standing portrait needs `object-position: 50% 14%`
in a circle or it frames a tie.

## What is wired

`hero` / `stat` / `ctaLink` → `homePage` → `HOME_PAGE_QUERY` → `Hero.astro`, `Stats.astro`.
`caseResultsSection` → `results[]->` `featuredCaseResult` (capped at **four with a hard
`.error()`**, the deliberate exception) → `CaseResults.astro`. `aboutSection` / `feesSection` →
`About.astro` / `Fees.astro`, both dereferencing an `attorney` through `attorneyQuote`.
`firmDetails` → `FIRM_DETAILS_QUERY` → `getFirm()` → `Layout.astro` → `Nav`, `MobileNav`,
`Footer`; `Fees.astro` calls `getFirm()` directly.

**Not wired: `PracticeAreas.astro`** reads `src/data/homePracticeAreas.ts`. **`practiceArea`
documents have no consumer yet** except through that constant's mirrored refs.

Desk shape: **Pages → { Homepage }**, then **Collections → { Case Results → { Featured Case
Results, Case Results }, Attorneys, Practice Areas }**, then **Site Settings → { Firm Details }**.
Two rules in `structure.ts` and neither fails loudly: anything listed explicitly must also be in
`LISTED`, or the Studio shows it twice; any singleton must be in `SINGLETONS`, or the Studio
offers a "create new" beside it.

## Case results — unchanged, and still the launch blocker

Two types, deliberately: **`featuredCaseResult`** (4, the homepage cards) and **`caseResult`**
(60, the ledger for the unbuilt `/case-results/` page).

⚠️ **The four featured case results are fabricated** — the artboard's illustrative copy, seeded
on the client's instruction. **Replace with genuine client stories before launch.**

**The 60 ledger entries are real**, but their ten categories in `caseResultCategories.ts` were
derived from page titles. **Now that `practiceArea` exists, `category` should become a
`reference` to it** rather than a parallel taxonomy — a 64-document migration, its own task.
The old URLs are redirected by one wildcard in `vercel.json` (`/case-results/:slug` →
`/case-results/`), which will swallow a detail page if one is ever built.
`migrate-case-results.ts` is one-shot and refuses to run while any `caseResult` exists.

## Videos — pulled, not yet uploaded

All 81 YouTube videos are in `~/Downloads/Cohen & Jaffe/Videos/` (3.6 GB) with a manifest and an
empty `wistia_id` column. They are moving to **Wistia**; the `video` type will carry both ids.
10 are 360p at source, 17 vertical, 7 square, 3 unlisted. `c6b0eghb5r` is a test id on the
first case-result card AND the "Our goals" video card.

## Open questions / waiting on the user

1. **Phase C** — the practice areas section is signed off with notes applied; model and wire
   it next (spec above).
2. **The "Our goals" pull quote is invented**, credited to Jaffe. Confirm or replace.
3. **Attorney roles** — Jaffe's is now "Managing Partner" in the dataset; the live site says
   "Partner". Whoever edited it should confirm the firm has.
4. **Case results needs REAL client names, quotes, photographs and insurer-offer figures.**
5. **The rewritten "What you can expect" copy** needs the firm's blessing.
6. **The client-story videos in the artboards do not exist** on the site or the channel.
7. **The hero's video card is deliberately not built.**
8. **The Spanish section is deferred** — background in `navigation.ts`.
9. **Nine practice-area URLs need confirming live** — the seven missing from the mirror above,
    plus `/personal-injury-lawyer-nassau-county/` from the nav.
10. **The firm's wrongful-death page lists "grief" as recoverable**, which New York does not
    allow and the homepage headline says the opposite. The firm should pick one.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with credentials.

## What's next

1. **Phase C** — model and wire the practice areas section (spec above). Third PR.
2. **The homepage attorneys section** — "The three people who will actually work your case."
   **Do not let it repeat whichever quote "Our goals" is using.**
3. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — both artboards approved. The bio
   sidebar can now reference `practiceArea`.
4. **`/practice-areas/`** — `CJ - Practice Areas.dc.html`: featured six cards (reads `image`,
   `icon`, `blurb`, `linkLabel`), then five group cards from `PRACTICE_AREA_GROUPS` with the
   dash-prefixed link lists. Per-group order is a section decision — an ordered reference array
   or `order(name asc)` — not a document field.
5. **`/case-results/`** — the 60 ledger entries have no page yet.
6. Then New York Deadlines, a **`video`** type once the Wistia uploads exist, and **set `site`
   in `astro.config.mjs`** so `Layout.astro` emits a canonical link.

## Things that would surprise someone

- **Astro's scoped styles do not reach a class you pass INTO a child component** — including
  an SVG component. `<PracticeAreaIcon class="pa__icon" />` silently styled nothing, exactly
  as `<RichText class="about__body" />` did before it. Own a wrapper element and use
  `:global()` for what is inside it. Third time.
- **A `cd` in one Bash call leaks into parallel calls in the same shell.** `mkdir -p
  src/assets/…` ran under `node_modules/@sanity/icons/` because a sibling command had `cd`ed
  there. Use absolute paths, or `cd` back explicitly.
- **GROQ `match "*/*"` matches everything** — `match` tokenises on non-word characters, so it
  is not the way to find a slug with a slash in it. Filter in the projection instead.
- **`sips -Z 2400` writes ~400–1100 KB JPEGs at quality 82** from 5–20 MB camera originals;
  the ten practice-area photographs are 6.2 MB in the repo, same policy as the portraits.
- **The vendor icon SVGs carry `<defs>` with full-canvas clipPaths and `id`s on every group.**
  Inlined seven times on one page those ids collide; they clip nothing, so strip both.
- **`interpolate-size: allow-keywords` is set on `:root`** — the "What you can expect"
  disclosures depend on it.
- **A running dev server can serve a STALE scoped-CSS module** while `curl` shows the new
  rule. `touch` the component and reload. `npm run check:types` re-optimises Vite's deps
  under a running dev server, leaving `504 (Outdated Optimize Dep)` in its console.
- **Every hover underline on the site is declared at rest in `transparent`** and fades by
  animating `text-decoration-color`.
- **The published design canvas has moved on from the local `.dc.html` copies** — it stamps
  `data-om-id` now, which does not map onto the old `data-dc-tpl` counter. Ask for the section
  by name, or for a fresh export.
- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`. An `EPERM` is
  macOS blocking `~/Downloads`; Full Disk Access fixes it after an app restart.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.** The Studio's desk is only
  visible signed in; the login card is what an unauthenticated browser sees, so a desk change
  is verified from the user's own session.
- **A blank black `/admin` with `504 (Outdated Optimize Dep)` is a stale Vite cache.**
  `rm -rf node_modules/.vite .astro` and restart; `npm ls @sanity/ui` must show v4 at the top.
- **A dev server is usually already running on port 4321** and it is the user's. Only 4321 and
  the Vercel URL are registered Sanity CORS origins.
- **In a hidden browser pane, screenshots after a scroll come back blank**, CSS transitions
  do not advance, and `requestAnimationFrame` never fires. Hide the sections above the one
  under test, `scrollTo(0,0)`, and shift `main` with a negative margin to see further down.
  Measure a transitioned property with `transition: none` injected. A two-tone screenshot of a
  hover state is a frozen transition, not a bug.
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
  **2 queries and 33 schema types**; if the query count drops, this is why.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**.
