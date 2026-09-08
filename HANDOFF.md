# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-08 (attorneys band approved and committed on `hp_attorneys`; not yet pushed, not yet modelled)

## ⚠️ Read this before writing any code

The client's standing instruction, given 2026-09-08 and now rule one under
AGENTS.md → Conventions:

> *"I'm noticing that you are trying to do too much. A lot of fields are being added that
> are unnecessary. Simple is better than complicated. Try to just implement what I ask for.
> If I need more I will ask for it. I'd rather ask for an extra feature than have to go
> through Sanity and turn things off or remove items I never asked for."*

**Build what was asked and nothing beside it. Suggest extras in a sentence; do not build
them and explain afterwards.** It bit again this session, smaller: the attorney card got a
"2:47" duration label under its play button — carried over from the reviews band, on no
artboard, requested by nobody — and it came straight back out along with the Wistia lookup
behind it. Cheap to undo at ten minutes old. The reviews collection's five unrequested
fields were not.

**And a second lesson, new on 2026-09-08: AN APPROVED ARTBOARD IS NOT ALWAYS A GOOD
DESIGN.** The attorneys band was built exactly as drawn, and the client's verdict was
*"Not in love with how this is turning out. Not your fault. I don't think the section was
designed well by the designer."* Four elements the board draws — the pull quote, the script
signature, the card blurb and the six-attorney row — are now cut. So when a section is
built faithfully and still reads badly, say so and show it; that is what the
build-it-then-approve-it order is FOR. The cost of finding out at the artboard stage is one
conversation. It is not a reason to deviate from a board unasked — only to expect the
conversation.

## Where things stand

**Nine of the homepage's fifteen sections exist. EIGHT are finished** — hero, stats band,
case results, "Our goals", the fee explainer, practice areas, the New York deadlines band
and testimonials, all built, modelled, seeded and wired.

**The ninth, the attorneys band, is APPROVED BUT NOT MODELLED**, which is the process
working rather than a gap: AGENTS.md → "build it, approve it, then wire it". It was built as
the artboard draws it, rejected on the design, and rebuilt over three rounds — all before a
single field went into Sanity, which is exactly the cost the order exists to avoid. It still
renders from `src/data/homeAttorneys.ts` plus a temporary query. **Modelling it is the next
task.**

`hp_attorneys` branched clean off `master` (`d3b1cfb`, PR #15) and carries **one commit**.
**It has not been pushed and there is no PR.**

Gates: `npm run build` green, `npm run check:types` **0 errors (79 files)**, `npm run
typegen` **3 queries, 44 schema types** (the third is the temporary one), `npx sanity
documents validate --yes` clean at **144 documents, 0 errors, 0 warnings**. All six
attorneys read back through the PUBLIC API with no token.

## The attorneys band

`src/components/Attorneys.astro`, rendered after testimonials. A sand strip: centred head,
then a static row of three white cards — square portrait, name, role, "Full profile →".
That is the whole card.

| File | What |
| --- | --- |
| `src/components/Attorneys.astro` | The section. No script — there is nothing to script |
| `src/data/homeAttorneys.ts` | ⚠️ The hardcoded stage — **delete when modelled** |
| `src/lib/queries.ts` → `HOME_ATTORNEYS_QUERY` | ⚠️ Temporary — **delete when modelled** |
| `src/sanity/schemaTypes/documents/attorney.ts` | `summary` removed, `wistiaId` added |
| `scripts/unset-attorney-summary.ts` | One-shot, **has run**, idempotent |
| `scripts/patch-attorney-portraits.ts` | Portrait framing + the DEMO video, **has run** |

### ⚠️ THIS SECTION IS A REWORK. THE ARTBOARD IS NO LONGER ITS REFERENCE.

The ATTORNEYS band of `Cohen & Jaffe Homepage v1.dc.html` (lines 511–579) was built as
drawn and **rejected on the design** on 2026-09-08 — the client's words: *"I don't think
the section was designed well by the designer."* Five things the board does are now
deliberately absent, and **none of them should be restored from the artboard**:

1. **No script signature.** The board sets the attorney's name in Mrs Saint Delafield under
   the quote; it is cut. `.signature` in `global.css` now has no consumer on the site. The
   QUOTE went with it and was later restored — see below.
2. **No card blurb, and no field behind it.** `attorney.summary` ("Card blurb") was
   `.required()`, fed that one paragraph and nothing else, and is out of the schema and
   unset on all six documents.
3. **No carousel.** There was one for one iteration — four across over all six attorneys,
   with the reviews band's track, arrows and script. All of it is gone.
4. **Three partners, not six attorneys** — Cohen, Jaffe, Tiger.
5. **No staff portraits in the banner, no line, and no hairline** — just the button.

Four things are ours rather than the board's, all on the client's instruction:

- **The card is a PANEL** — `var(--white)` with a `1px solid var(--border)` hairline and the
  standard radius, on the sand strip. The board's card is borderless and transparent.
- **The role and the bio link SHARE ONE LINE**, held apart — role left, "View Profile →"
  right. The board stacks a "Full profile →" link under a paragraph of blurb. ⚠️ The link
  was a full-width ghost BUTTON for one iteration and was cut back as *"overwhelming"*: on a
  card holding nothing but a portrait, a name and a role, a 48px bordered control outweighed
  everything it sat under. It is `.link-arrow`, the site-wide text-link convention.
- **The closing banner is ONE CENTRED BUTTON with no rule above it** — "Meet the Full Team",
  solid green. The board holds that button against three circular staff portraits and the
  line "Six attorneys and a support staff of more than twenty, including…", ruled off with a
  hairline. The portraits went, then the line, then the hairline — which had been fencing
  off a single centred control. It is the band's ONLY route to `/about/attorneys/`.
- **The heading drops the board's "three"** — "The people who will actually work your
  case." It has been both ways twice; this is a choice, not arithmetic. Do not restore it.

### The three who are not shown are not missing

McNaughton, Sawicki and Parnell are simply not selected. **There is no `featured` flag on
`attorney` and there must not be one** — which people a section shows is a property of the
SECTION (rule 7), so the choice lives in `HOME_ATTORNEYS.order` and moves into
`attorneysSection.attorneys[]` when the section is modelled. All six still appear on
`/about/attorneys/` when that page is built.

### The roles are settled, and they were settled in the Studio

**Founding Partner · Managing Partner · Partner** — edited by hand in the Studio on
2026-09-08, and consistent as a set. The other three attorneys still carry the seeded long
form ("Managing Attorney · Personal Injury Attorney"), which wraps to two lines on a card;
they are not on the homepage, so it shows nowhere yet.

⚠️ **THIS IS WHY `seed-attorneys.ts` MUST NEVER BE RE-RUN.** It is `createOrReplace` and
would silently revert all three titles to "Partner · Personal Injury Attorney" with nothing
to show that it had. Every change to an attorney document since the seed has been a targeted
`patch` for exactly that reason — `scripts/unset-attorney-summary.ts` and
`scripts/patch-attorney-portraits.ts` are the two worked examples.

### The card quotes: confirmed real, and one of them still prints twice

The quote was cut from the card and then restored on the client's instruction. It renders
`attorney.quote` at `--fs-19` between the name and the meta row.

**The three quotes are the artboard's wording, and the firm has CONFIRMED them as real**
(2026-09-08). Worth writing down, because the repo argued the other way:
`scripts/seed-attorneys.ts` seeded `attorney.quote` from the live site instead, reasoning
that the board's versions were unsourced. All three were replaced in the Studio, and the
firm has since said these are the quotes they are using. **That makes the seed stale on this
field — and on `role` — so it must never be re-run;** its docblock now says so in full.

⚠️ **Jaffe's card and the "Our goals" band carry the same sentence.** That band prints
*"I worked ambulances before I practiced law, so I know what a serious injury does to a
family. We handle these cases personally."*; his card prints the same line without its last
clause. Both are approved copy, so this is repetition on one page rather than an accuracy
problem — but it is exactly what `attorneyQuote.text` and `attorney.quote` are separate
fields to prevent, and nothing in the model can stop the same words being typed into both.
**Raised 2026-09-08 and still open: one of the two bands should give it up.**

One knock-on if the seeded quotes are ever restored: Cohen's live-site line is **verbatim**
the fee explainer's quote — he has exactly one published quote anywhere, so the fee band was
seeded with the only thing there was. Putting them back brings that duplicate with them.

### ⚠️ TWO ATTORNEYS NOW CARRY A PLACEHOLDER VIDEO

**Cohen and Jaffe both have `wistiaId: "c6b0eghb5r"`** — Cohen set in the Studio, Jaffe by
`scripts/patch-attorney-portraits.ts` — so the play button and the lightbox can be seen and
clicked. **NEITHER IS THEIR VIDEO.** It is the firm's single Wistia upload, a general
attorney explainer, and it is ALREADY standing in on the first case-result card, the
"Our goals" video card and all four video reviews.

**Unset both before launch, or replace them with the attorneys' own films.** A play button
over a named attorney's portrait is a promise that the video is of that attorney — a
stronger claim than any of the other four placeholders make. Nothing in the dataset marks
it; this file and the script's docblock are the whole record. Tiger has none, which is what
the empty state looks like.

### ⚠️ The portraits needed FRAMING, and the fix was data, not CSS

The heads were cut off, and the cause was upstream of the component: all six portraits are
one studio shoot at **720x1280**, the card crops them SQUARE, and `seed-attorneys.ts`
uploads with **no hotspot and no crop** — so Sanity defaulted to the image centre, which on
a 9:16 frame is chest height. The square taken around it ran y≈280–1000 and clipped every
head, which starts near y≈200.

Cohen and Parnell had been framed by hand in the Studio, which is exactly why Cohen looked
right while Tiger did not. `scripts/patch-attorney-portraits.ts` gives Jaffe and Tiger the
same treatment and **never touches those two**.

**Both a crop AND a hotspot, and the crop is the non-obvious half.** A hotspot only
positions the square; it cannot zoom. Setting one alone fixed the cut heads and left Jaffe
and Tiger visibly further away than Cohen, whose hand-set crop trims the frame to 675x1018
so every square from it is 675px rather than 720px — a ~7% tighter shot. Three portraits at
two magnifications read as a mistake even when each is fine alone. All three now deliver
`675x675`.

⚠️ **Do not tighten that crop to the square.** `attorney.portrait` is one photograph feeding
every ratio on the site — 1:1 here, 4:5 on a listing card, 3:4 on the bio hero — and baking
this card's ratio into the document breaks the others.

⚠️ **McNaughton and Sawicki still have neither**, and the same square will cut them the day
`/about/attorneys/` is built.

### Layout notes worth keeping

- **The play button is conditional**, and Tiger is the empty state. Bottom-right and white —
  the board's badge, NOT the reviews band's centred gold one, because a portrait is a face
  and dead centre is where a badge must not go.
- ⚠️ **`.atty__meta` IS PINNED WITH `margin-block-start: auto`, and the quote carries the
  FLOOR of the gap above it.** Auto collapses to zero once the copy fills the column, so on
  the longest quote the last line would sit on the role; flex margins do not collapse, so
  the quote's `margin-block-end` and the auto add up — 24px minimum, plus whatever slack the
  card has. Measured: 24px on the tallest card, 54px on the other two. Same pattern as
  `.review__prose`.
- **Pinning that row only became correct WHEN THE QUOTE CAME BACK.** While the role sat
  directly under the name it belonged to it, and pinning stranded it mid-card as soon as one
  name wrapped to two lines and its neighbours did not. With a quote between them the row is
  a footer — title and action — so pinning is what keeps the links level while three quotes
  of different lengths run above them. If the quote is ever cut again, unpin it again.
- **The quote is `--fs-19`, not the board's 21px, and the card it was measured against no
  longer exists.** The board sets 21 over a 32px name, a script signature and a blurb — four
  things sharing the card. Everything but the name is gone, so 21px italic would have read
  as a second heading under a 32px one.
- ⚠️ **`flex-wrap` ON `.atty__meta` IS LOAD-BEARING.** The role and the link together want
  ~235px and the card has 165px of usable width at the 768 breakpoint, so below roughly
  900px the link DROPS to its own line — landing at the start of it, because
  `space-between` on a single item resolves to flex-start. Without the wrap the two collide.
- ⚠️ **`.atty__meta` IS NOT PINNED TO THE FOOT OF THE CARD, deliberately.** The button that
  used to sit there was, so the row of buttons stayed level whatever the copy did. A ROLE
  cannot be: it belongs to the name directly above it, and pinning the row would strand it
  mid-card the moment one name wrapped to two lines and its neighbours did not — which
  happens at ~820px. The cards still finish level because the grid stretches them, so what
  varies is white space at the foot of a card, which is invisible.
- ⚠️ **`.btn--wide` IS A FIXED 250px, and global.css only relaxes it to 100% at 768px and
  below.** It was briefly the card link's class, and between 768 and ~900px — where the row
  is still three across and the card is 230px at an 800px viewport — it hung out over the
  card's own border. **Any fixed-width button dropped inside a multi-column card has this
  bug.** The banner's lone button keeps `--wide`, which is safe because it is alone on a
  full-width row.
- **The banner's button is `--green`, the cards' are ghost**, and that is a hierarchy rather
  than an inconsistency: three peers and a conclusion. The board sets this button solid green
  at exactly this size.
- ⚠️ **THERE IS NO TWO-UP BREAKPOINT, AND THAT IS DELIBERATE.** There was one at 1024, and
  with exactly three cards it stranded the third alone on a second row beside a card's worth
  of empty space — worse than the narrow columns it avoided. **Three items divide by three
  or by one.** It is three across down to 700px and one below that, and what makes that hold
  is the emptied card: a portrait, a name and a role are comfortable at ~220px where the
  earlier version's 21px serif quote was not. If a quote or a blurb ever returns, re-measure
  — and the answer is one-up sooner, never two-up.
- **The gap is `--space-32`, wider than the reviews band's `--space-20`**, because these
  cards are bordered: two hairlines 20px apart read as one banded strip rather than three
  cards. The board's 80px was drawn for borderless cards and is far too much for panels.
- **The portrait srcset asks the CDN for a SQUARE** (`.width(w).height(w)`), not `srcSet()`
  from `lib/image`, which sets a width only. A width alone ships the source's own 9:16 frame
  and lets CSS discard two thirds of the bytes — and it ignores the hotspot. With a square
  requested the CDN crops around the hotspot, so `object-fit: cover` is a safety net rather
  than the framing, and the board's `object-position: 50% 6%` is deliberately **not**
  carried over: against a hotspot crop it would fight the hotspot.

### What modelling it will take

An `attorneysSection` object — `eyebrow`, `heading`, and `attorneys[]->` an ordered array of
`attorney` references. Then delete `src/data/homeAttorneys.ts` and `HOME_ATTORNEYS_QUERY`,
and fold the projection into `HOME_PAGE_QUERY`. **The component's prop shape is already the
shape that projection produces**, so wiring is a swap, not a rewrite. Expect typegen to
report **+2** schema types — the object plus the auto-generated `attorney.reference`, which
does not exist yet because nothing references `attorney` as an array member today.

## The testimonials band

`src/components/Reviews.astro`, after the deadlines band. A cream strip: centred head, then
a row of four cards of two shapes — a video review with a 16:9 cover and a serif pull quote,
and a written review with five gold stars and the client's own prose.

`src/sanity/schemaTypes/documents/review.ts` and `videoReview.ts`,
`objects/reviewsSection.ts`, `src/lib/wistia.ts`, `scripts/seed-home-reviews.ts` +
`reviews.json` (**the provenance record**), `src/assets/icons/reviews/`.

Desk: **Collections → Reviews → { Video Reviews, Reviews }**, nested like Case Results. Both
type names are in `LISTED` in `structure.ts`, or each would appear twice.

**The written type is named `review`, not `googleReview`, deliberately** — `_type` is
immutable, and a name baking in one provider would need a migration the first time a review
comes from anywhere else.

⚠️ **`caseType` is on both types and NOTHING RENDERS IT.** It is for the unbuilt
`/about/testimonials/` page. Kept on the client's instruction — do not "tidy" it away.

### ⚠️ 22 of the 25 seeded reviews are placeholder copy

Seeded from `CJ - Testimonials.dc.html` on the client's instruction to populate the
collection while real reviews are gathered. **21 written + 4 video.**

**Three are real:** Howard, Menache R. and Patty R., **verbatim from the live site** — not
the artboard's version, which lightly rewrites their words and adds towns that appear in no
source. Those towns are dropped and `location` is empty on all three.

**Everything else is illustrative**, including all four video reviews, and **nothing in the
dataset distinguishes it** — a `verified` flag existed for exactly that job and was removed
on the client's instruction, so this file and `scripts/seed-home-reviews.ts` are the whole
record. All four video reviews point at `c6b0eghb5r`, so every video card shows the same
2:47. **A review with no name is "Client", not "Anonymous"** — the client's wording, applied
to 14 of the 21.

### ⚠️ Reviews will eventually be pulled from Google — the schema is ready, the access is not

- **The Places API cannot do it** — five reviews maximum, no choice of which, and the Maps
  terms forbid storing them. The firm has ~462 at 4.9.
- **The Business Profile API can.** `accounts.locations.reviews.list` returns all of them.
  It needs the **firm's own OAuth** plus Google's **manual approval** — base quota is zero
  until then, typically 3–10 business days. **A client action; nobody has started it.**
- **The firm already pays for Trustindex** (widget `418ef2720a76619cd906535dd85`). No API,
  but its dashboard exports CSV — the fastest bridge to real content.
- **A live pull could not power this band anyway.** It is a hand-picked, ordered mix; sync
  must write INTO these documents, not replace them.
- Identifiers, from the live homepage: `cid=67117899491750775`,
  FID `0x89c28828d81f75af:0xee735fbd46b377`.

⚠️ **A sync needs a stable per-review handle to upsert on, and there is no field for one.**
`externalId` was built for it and removed as unrequested. Adding it back is step one —
mention it before building it.

### Five things in it are ours

- **The control row has two states.** The board centres a lone button and has no arrows.
  When everything fits the arrows are absent and the button keeps its centred position; when
  the track overflows the arrows appear right and the button steps left. **One measurement
  drives both**, so the button can never sit off-centre with dead space beside it.
- **No rating figure.** The board's "4.9 ★ · 462 reviews" and "Read all 462 reviews" both
  lost their numbers on the client's call — a count hardcoded into a page goes stale the
  week after it ships. **`firmDetails` was therefore not touched.**
- **The duration is read from the video, not typed.**
- **`.btn--ghost` is a new global variant**, gold hairline filling gold on hover, in Oswald.
  `.btn--outline` is NOT it. ⚠️ `PracticeAreas` ships the same shape as a local `.pa__cta`
  in Roboto Condensed; folding it onto the variant would change an approved section.
- **16px body copy is `--lh-body`, not the board's 28px.**

### ⚠️ There is no line-clamp, and there is a height cap. They are different things.

A 12-line clamp was written as a "never fires on real copy" backstop and **fired on the
shortest real review the firm has**. It is gone: a review is a legal testimonial, an
arbitrary cut can turn a qualified sentence into an unqualified one, and `line-clamp` hides
text visually while leaving it in the accessible tree.

What replaced it: **`max-height: calc(var(--lh-body) * 13 * 1em)` with `overflow-y: auto`**.
Thirteen lines is where the four approved cards already sat, and it is expressed in lines
because `--lh-body` is unitless and `em` resolves against the element's own size.

⚠️ **The cap is lifted below 700px, deliberately.** At one-up there is no row to protect,
and keeping it would nest a vertical scroller inside the page's own vertical scroll.

### ⚠️ The band has no disclaimer, and the FOOTER is what covers it

NY Rule 7.1(e)(3) requires "Prior results do not guarantee a similar outcome", in those
words, on any advertisement carrying a client testimonial. One was built here and removed on
the client's call because the sentence already printed three times on the homepage.

What makes that safe is the **footer** instance specifically — `site-footer__disclaimer` is
site-wide and unconditional, so it travels with this band wherever the band is reused, which
the case-results band's own disclaimer does not.

**If the footer disclaimer is ever made conditional, shortened, or dropped from a page
carrying reviews, this band needs its own again.**

## Case results — unchanged, and still the launch blocker

Two types: **`featuredCaseResult`** (4, the homepage cards) and **`caseResult`** (60, the
ledger for the unbuilt `/case-results/` page).

⚠️ **The four featured case results are fabricated** — the artboard's illustrative copy,
seeded on the client's instruction. **Replace with genuine client stories before launch.**

**The 60 ledger entries are real**, but their ten categories in `caseResultCategories.ts`
were derived from page titles. **Now that `practiceArea` has a proven reference pattern,
`category` should become a `reference` to it** — a 64-document migration, its own task. The
old URLs are redirected by one wildcard in `vercel.json` (`/case-results/:slug` →
`/case-results/`), which will swallow a detail page if one is ever built.
`migrate-case-results.ts` is one-shot and refuses to run while any `caseResult` exists.

## The practice areas collection

**`practiceArea`**, 47 documents from `scripts/seed-practice-areas.ts` (idempotent,
`createOrReplace` — so re-running it discards Studio edits; prefer a targeted patch). Desk:
**Collections → Practice Areas**, row subtitle `<group> · /<path>/`.

**Card-level fields only.** **Only name, slug and group are required**; 10 of 47 have an icon
and photograph, 6 a blurb, 8 a link label. Empty renders nothing (rule 6). The Car Accidents
detail template is NOT modelled until that page is built and approved.

**Slugs are the LIVE paths, slash included** — `long-island-car-accident-lawyer`,
`birth-injury/cerebral-palsy`. No `options.source` (default slugify eats the `/`), and the
document id replaces `/` with `-`.

**Seven areas have no page in the mirror** but are in the live `/site-map/`:
defective-product, catastrophic-injury, erbs-palsy, failure-to-diagnose, surgical-error,
failure-to-diagnose-heart-attack, medical-device-lawyer. **Confirm they resolve before
launch.**

**Icons are code, not Sanity** — a document stores a key, the SVGs live in
`src/assets/icons/` with every fill and stroke `currentColor`.

**Premises Liability's photograph is only 1000px wide.** Fine for a card, replace before any
full-bleed use.

## The homepage practice areas section

`src/components/PracticeAreas.astro`. Three things are ours and all three load-bearing:

- **The tabs are radio buttons and there is no JavaScript.** `:checked + label + pane`
  reveals the pane by CSS adjacency alone.
- **The hidden radios are `position: fixed; top: 0; left: 0`, and that is not cosmetic.** As
  `absolute` with no offsets they all resolved to one point, and clicking the sixth tab threw
  the page up by 440px.
- **Below 1024px it is an accordion**, and below 768px the pane stacks. `scrollTop` still
  shifts when a pane above collapses — Chrome's scroll anchoring. Not a bug.

⚠️ **The seven callouts are statements of New York law**; provenance in
`scripts/seed-home-practice-areas.ts`. **The artboard's seven pull quotes are NOT on the page
and `practiceAreaTab` has no field for them** — every one was invented and credited to Jaffe.

**The three sub-links per tab point at pages that do not exist yet**, so each links to the
area's own page. They become anchors when the detail pages are built — a Studio edit.

## The deadlines band

`src/components/Deadlines.astro`. A gold-ruled dark strip: kicker, heading and lead left with
the CTA held right, then a hairline and three big gold figures — 30 days, 3 years, 90 days.

⚠️ **Every word is a statement of New York law, and the provenance lives in the docblock of
`scripts/seed-home-deadlines.ts`.** 30 days is 11 NYCRR § 65-1.1 (no-fault WRITTEN NOTICE,
not the NF-2 form — DFS OGC Opinion 08-06-01); 3 years is CPLR § 214(5); 90 days is GML
§ 50-e(1)(a). All three re-verified against nysenate.gov and dfs.ny.gov on 2026-09-04.

⚠️ **This band has no disclaimer and leans on the practice-areas band directly above it.**
Reordering those two leaves bare legal deadlines with nothing qualifying them.

**The heading is a knowing generalisation** — "The clock started the day of your accident" is
untrue of wrongful death, medical malpractice and toxic exposure. It is approved copy. **Do
not "tighten" the figures to agree with it.**

**The figure's `line-height` is 0.8**, the only sub-`--lh-flat` value on the site.
**`--gradient-forest-night` exists for this band alone.**

## Site Settings, "Our goals", the fee explainer, attorneys

`firmDetails` is a singleton under **Site Settings**, read everywhere through **`getFirm()`**
(`src/lib/firm.ts`), memoised for the build. **The bar for a field is "appears in more than
one place."** Phone numbers are stored in DISPLAY form only; `telHref()` / `smsHref()` derive
the link. `advertisingLabel` is its own required field — Rule 7.1 requires those two words.

`aboutSection` and `feesSection` both quote an attorney through the shared **`attorneyQuote`**
object whose `attorney` is a reference. **`RichText.astro` is the only way Portable Text is
rendered**; it always emits `.prose`.

**`attorney`** is six documents, ONE type, no `featured` / `order` / `group`. **Only five of
its eighteen fields are required** — name, slug, role, portrait, biography.
**None of the attorney content is invented.** Three of six have no quote. Both of Garrett
Parnell's live-page bugs (his `og:url` and badge point at McNaughton's) matter for the
redirect/SEO pass.

⚠️ **The "Our goals" pull quote is the artboard's INVENTED line, attributed to Richard Jaffe**,
restored on the client's instruction; his real, sourced quote is on his `attorney` document.
**Confirm or replace before launch.** ⚠️ The attorneys band prints Jaffe's card quote,
which is this same sentence less its last clause — see that section.

⚠️ **The "Our goals" video card is a placeholder** — `c6b0eghb5r`, the same explainer the
four video reviews use. Id, title and cover all need replacing after the Wistia uploads.

**The "What you can expect" rows map their four olive glyphs BY POSITION**, with no Sanity
field — reordering rows in the Studio moves the words, not the pictures.

## What is wired

`hero` / `stat` / `ctaLink` → `homePage` → `HOME_PAGE_QUERY` → `Hero.astro`, `Stats.astro`.
`caseResultsSection` → `results[]->` `featuredCaseResult` (capped at **four with a hard
`.error()`**, the deliberate exception) → `CaseResults.astro`. `aboutSection` / `feesSection` →
`About.astro` / `Fees.astro`. `practiceAreasSection` → `tabs[].area->` and `allAreas[]->`
`practiceArea` → `PracticeAreas.astro`. `deadlinesSection` → `deadlines[]` of `deadlineFigure`
→ `Deadlines.astro`. `reviewsSection` → `reviews[]->` a MIXED array of `videoReview` and
`review` → `Reviews.astro` — the only reference array accepting two document types.
`firmDetails` → `FIRM_DETAILS_QUERY` → `getFirm()` → `Layout.astro` → `Nav`, `MobileNav`,
`Footer`; `Fees.astro` calls `getFirm()` directly.

**`Attorneys.astro` is the exception and is NOT wired to `homePage`** — see above.

Desk shape: **Pages → { Homepage }**, then **Collections → { Case Results → { Featured Case
Results, Case Results }, Reviews → { Video Reviews, Reviews }, Attorneys, Practice Areas }**,
then **Site Settings → { Firm Details }**. Two rules in `structure.ts` and neither fails
loudly: anything listed explicitly must also be in `LISTED`, or the Studio shows it twice; any
singleton must be in `SINGLETONS`, or the Studio offers a "create new" beside it.

**The reviews collection's desk has still not been seen signed in.** `/admin/` renders its
login card (healthy), but the desk is only visible to a signed-in session — check that
**Reviews** nests under Collections and appears **once**.

## Videos — pulled, not yet uploaded

All 81 YouTube videos are in `~/Downloads/Cohen & Jaffe/Videos/` (3.6 GB) with a manifest and
an empty `wistia_id` column. They are moving to **Wistia**; the `video` type will carry both
ids. 10 are 360p at source, 17 vertical, 7 square, 3 unlisted.

**There is no client testimonial video** — all 81 are attorney explainers, which is why all
four `videoReview` documents are placeholders. `c6b0eghb5r` is the one thing on Wistia and it
is an explainer, used on the first case-result card and the "Our goals" card.

**No attorney video exists either**, which is why every attorney card is currently
badge-less.

## Open questions / waiting on the user

1. **The attorneys band is approved and committed; it still needs MODELLING.** It went
   through one design rejection and three rounds of revision, and the roles, the missing
   listing link and the card quotes are all now settled. Two content items remain before
   launch: **Jaffe's card repeats the "Our goals" pull quote**, and the **placeholder video
   sits on Cohen and Jaffe**.
2. **Google Business Profile API access** — a client action, 3–10 business days. Nothing has
   started.
3. **Real reviews** to replace the 22 placeholders, and **real client videos** to replace all
   four video reviews.
4. **The "Our goals" pull quote is invented**, credited to Jaffe. Confirm or replace.
5. **Case results needs REAL client names, quotes, photographs and insurer-offer figures.**
6. **The rewritten "What you can expect" copy** needs the firm's blessing.
7. **The hero's video card is deliberately not built.**
8. **The Spanish section is deferred** — background in `navigation.ts`.
9. **Nine practice-area URLs need confirming live** — the seven missing from the mirror,
   plus `/personal-injury-lawyer-nassau-county/` and `/medical-device-lawyer-long-island/`.
10. **The firm's wrongful-death page lists "grief" as recoverable**, which New York does not
    allow and the practice-areas headline says the opposite. The firm should pick one.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with credentials.

## What's next

1. **Get the reworked attorneys band approved, then model it** — `attorneysSection`, delete
   the two temporary files, fold the projection into `HOME_PAGE_QUERY`. Then commit
   `hp_attorneys`, push, open a PR. Nothing is committed.
2. **`/about/testimonials/`** — the "Read all reviews" destination, already in
   `navigation.ts:111` and `:241` and already indexed. `CJ - Testimonials.dc.html` is
   approved: a video-reviews band, a written-reviews band with a load-more button, and a
   "leave a review" panel. `caseType` exists for it. Its Google button uses
   `https://www.google.com/maps?cid=67117899491750775`.
3. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — both artboards approved, and
   the homepage band's "Full profile →" links already point at the second. The bio sidebar
   can now `reference` `practiceArea`.
4. **`/practice-areas/`** — `CJ - Practice Areas.dc.html`: featured six cards, then five
   group cards from `PRACTICE_AREA_GROUPS`.
5. **`/case-results/`** — the 60 ledger entries have no page yet.
6. Then a **`video`** type once the Wistia uploads exist, and **set `site` in
   `astro.config.mjs`** so `Layout.astro` emits a canonical link.

## Things that would surprise someone

- **A `createOrReplace` seed is a LOADED GUN once the Studio has been used.** The three
  partners' roles have been edited there; re-running `seed-attorneys.ts` would revert all
  three with no warning. To drop a field from live documents prefer a targeted `unset`
  patch — `scripts/unset-attorney-summary.ts` is the worked example.
- **`unset` takes a TOP-LEVEL field name fine**; it is the array form
  `unset(["path.array[].field"])` that silently matches nothing and needs an explicit `_key`.
- **`srcSet()` in `lib/image` sets a WIDTH ONLY.** For anything drawn in a fixed aspect
  ratio that ships the source's own frame and lets CSS discard the difference — and ignores
  the hotspot. Ask the CDN for both dimensions; `Attorneys.astro` has the local helper.
- **`reviews[]->[filter]` is NOT an array filter in GROQ.** It returns `[null, null, …]` and
  the build dies on `Cannot read properties of null`. Filter the REFERENCE array before
  dereferencing: `reviews[@->rating == 5]->{…}`.
- **GROQ's `in` returns dataset order, not the order of the array you gave it.** A
  caller-supplied running order has to be restored after the fetch — `index.astro` does it
  by index for the attorneys band.
- **`--measure` NO LONGER EXISTS.** The 600px `.prose` cap was removed on the client's call.
  AGENTS.md still describes it. Use `--container-prose` (790px).
- **A typed duration is always wrong eventually.** Read it from the video.
- **`--lh-flat: 1` is the token ramp's floor, not the site's.** The deadlines figure is
  `0.8`; the script signature is `1.2`, because Mrs Saint Delafield has deep descenders and
  a long name can wrap.
- **A visually-hidden radio must be `position: fixed` with explicit offsets.**
- **A nested type's validation cannot be overridden per usage** — `ctaLink` (button, 28) and
  `textLink` (text, 48) are two types sharing one `validateHref`.
- **Typegen counts an auto-generated `<type>.reference` per referenced document type.**
- **Astro's scoped styles do not reach a class you pass INTO a child component.**
- **A `cd` in one Bash call leaks into parallel calls in the same shell.** Use absolute paths.
- **GROQ `match "*/*"` matches everything** — `match` tokenises on non-word characters.
- **The vendor icon SVGs carry `<defs>` with full-canvas clipPaths and `id`s on every group.**
  Inlined repeatedly on one page those ids collide; strip both. The Google "G" is the
  exception — a four-colour brand mark that must NOT be given `currentColor`.
- **`interpolate-size: allow-keywords` is set on `:root`.**
- **A running dev server can serve a STALE scoped-CSS module** while `curl` shows the new
  rule. `touch` the component and reload. **`npm run check:types` re-optimises Vite's deps
  under a running dev server, leaving `504 (Outdated Optimize Dep)` in the browser console.**
  A Studio that renders its login card is healthy; a BLANK one is not.
- **Every hover underline on the site is declared at rest in `transparent`.**
- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`. An `EPERM` is
  macOS blocking `~/Downloads`; Full Disk Access fixes it after an app restart.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.**
- **A dev server is usually already running on port 4321 and it is the user's.** Only 4321
  and the Vercel URL are registered Sanity CORS origins, so do NOT move the port to free it.
- ⚠️ **IN A HIDDEN BROWSER PANE: the page cannot scroll, `requestAnimationFrame` never fires,
  `ResizeObserver` never delivers, and a `scrollTo({behavior:"smooth"})` NEVER LANDS.** All
  four are silent. The last one makes the reviews carousel read as broken arrows when it is
  fine — `behavior: "auto"` in the same pane scrolls correctly, so testing a second scroller
  against it is how you tell the environment from the bug. A
  `requestAnimationFrame` inside an injected script will also hang the tool for 45s. Use
  `setTimeout`, and `display: none` the other sections and screenshot what is left.
- **Three grid items divide by three or by one.** A two-up breakpoint on a row of three
  strands the third beside a whole empty column, which looks worse than the narrow columns
  it was avoiding. The attorneys band had one and it was removed.
- **`.signature` in `global.css` currently has NO consumer.** It was written for the
  attorneys card and the card's script signature was cut. Leave it — the bio and attorneys
  pages are both drawn with one.
- **Lazy images do not paint before the first screenshot in that pane.** Two captures, or
  set `loading = "eager"` first, or a photograph reads as a blank grey box.
- **`_type` is immutable**; a strong reference blocks a delete.
- **A Sanity document id must NEVER contain a dot** (non-public) **or a slash** (invalid).
- **`options: { collapsible }` does not exist on array fields** — use a fieldset.
- **The Sanity CLI has no `patch`**; `client.patch(id).set({…})` through `npx sanity exec` is
  how a section is added to the homepage singleton without disturbing the others.
  `sanity documents delete` needs `--dataset production` before the id.
- **Never put a `//` comment inside a `defineQuery` template.** Typegen currently reports
  **3 queries and 44 schema types**; if the query count drops, this is why.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**.
