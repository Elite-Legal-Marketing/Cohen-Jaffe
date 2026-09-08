# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-08 ("Why Cohen & Jaffe" band built on `hp_why_us`, awaiting sign-off; uncommitted)

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

**Ten of the homepage's fifteen sections exist. NINE are finished** — hero, stats band, case
results, "Our goals", the fee explainer, practice areas, the New York deadlines band,
testimonials and the attorneys band, all built, modelled, seeded and wired.

**The tenth, "Why Cohen & Jaffe", is BUILT AND AWAITING SIGN-OFF** — the hardcoded stage, per
AGENTS.md → "build it, approve it, then wire it". It renders from `src/data/homeWhyUs.ts`.
Nothing about it is in Sanity yet and nothing should be until it is approved.

The attorneys band was merged to `master` (`0162890`, PR #16) still unmodelled, which was
the one loose end left open rather than a decision. It is closed: the band reads from
`homePage.attorneys` like every other section, and the staged constant and temporary query
that fed it are deleted.

**Two branches are in flight and `hp_why_us` STACKS ON TOP OF `hp_attorneys_sanity`, not on
master.** `hp_attorneys_sanity` (`7ad30fd`, off `95b165a`) holds the attorneys modelling,
committed and **not pushed — there is no PR**. `hp_why_us` was re-pointed at that commit and
carries the why-us band **uncommitted**. Merge the attorneys PR first, or the why-us diff
will look like it contains both.

Gates, all run after the seed: `npm run build` green, `npm run check:types` **0 errors (81
files)**, `npm run typegen` **2 queries, 45 schema types**, `npx sanity documents validate
--yes` clean at **145 documents, 0 errors, 0 warnings**. The band reads back through the
PUBLIC API with no token — the build uses the unauthenticated client and renders all three
cards.

**The rendered homepage is BYTE-IDENTICAL before and after the modelling** — `dist/index.html`
built from `master` and from this branch differ by zero bytes. That is the proof that moving
the copy into Sanity changed nothing on the page, and it is worth re-running as the last step
of any wiring swap: build, stash, rebuild, `diff`.

## The "Why Cohen & Jaffe" band — BUILT, NOT YET APPROVED

`src/components/WhyUs.astro`, rendered after the attorneys band. A full-bleed team
photograph on the forest ground: eyebrow, 62px heading and a one-line lead held left over it,
then four reasons ruled off in gold along the foot.

| File | What |
| --- | --- |
| `src/components/WhyUs.astro` | The section. No script |
| `src/data/homeWhyUs.ts` | ⚠️ The hardcoded stage — **delete when modelled**. Holds the full provenance |
| `src/assets/why-team-wide.png` | The board's `team-why.png`, 2048x1152. Desktop only (≥1024px) |
| `src/assets/why-team-narrow.png` | A tighter crop of the same shoot, 1196x776. Tablet and phone |
| `src/assets/icons/why/` | Four icons, hand-cut from the board's inline paths, `currentColor` |

Built from `Cohen & Jaffe Homepage v1.dc.html` markup 579-618. **The icons are 34px against
the board's 26**, on the client's instruction (2026-09-08) — the stroke scales with them, so
they read heavier as well as larger.

⚠️ **THE BOARD'S "MID CTA BAR" (line 576) IS AN EMPTY COMMENT.** There is no markup under it,
so nothing was built and nothing was invented to fill it. A mid-page CTA is a new request, not
a missing implementation. Do not "restore" one from the board.

### One factual line was CORRECTED, and one is still unsourced

Four of the five copy blocks make a claim of fact about the firm or a named person, so each
was checked against the WordPress mirror. Three hold up verbatim — "six attorneys and a
support staff of more than 20" and "more than 100 years of combined experience" are both
`/about/`, and the 24-hour/cell-phone promise is near-verbatim from the live homepage
(generalised to "a partner's" so it survives the day it is somebody else's number).

⚠️ **The board writes that Richard Jaffe "STILL WORKS A WEEKLY SHIFT as a volunteer medic".
Nothing supports a present tense or a frequency** — `/about/` says only "He has experience as
a firefighter, certified EMT ... Volunteering as a medic in Brentwood, he gained firsthand
knowledge". "Still" and "a weekly shift" are invented about a real, named person on a page
that is legal advertising, so the line now says what the source says. Same treatment the
deadlines band's three corrected lines got. **Do not restore the board's wording.**

⚠️ **"A caseload we keep small on purpose" is UNSOURCED** and was left in as approved artboard
copy. Nothing in the mirror says it; only the firm can confirm it. **Raised 2026-09-08.**

### TWO photographs, not two crops of one

The same answer the hero reaches for, and on the client's instruction (2026-09-08). A
`<picture>` swaps them at `(min-width: 1024px)`: the wide 16:9 shot has the group small
against the trees and is framed for a band far wider than it is tall; below 1024px the band is
either a tall box (tablet) or a stacked strip (phone) and the wide frame loses the people. The
narrow file is a tighter crop in which the six of them fill the frame.

⚠️ **THE TWO HAVE DIFFERENT ASPECT RATIOS — 1.78 wide, 1.54 narrow — and the stacked layout's
height is derived from the NARROW one.** Replace either file and that number is re-derived.

⚠️ **The `<picture>` wrapper is sized in CSS, not just the `<img>`.** `<picture>` is
auto-height, so `height: 100%` on the image inside has nothing to resolve against and the
photograph stops short, leaving a bar of the section's own gradient along the bottom.

⚠️ **Verifying which file the browser picked needs a CLEAN LOAD.** `<source media>` resolves
once, so reading `img.currentSrc` after the preview pane's viewport emulation is applied
reports the file chosen at the PREVIOUS width. It read "wide" at 768px and looked like a
broken media query; a reload at the emulated size read "narrow" correctly.

### The three layouts

| Width | Photograph | Layout | Reasons |
| --- | --- | --- | --- |
| ≥ 1024px | wide, overlaid | copy held left over the picture | four across |
| 640-1023px | narrow, **stacked** | picture on top, copy beneath | two across |
| ≤ 639px | narrow, **stacked** | picture on top, copy beneath | one up |

⚠️ **THE BAND STACKS BELOW 1024px, NOT BELOW 640.** The stack went in for phones first and was
extended up to tablet on the client's instruction (2026-09-08), which is also when the second
photograph arrived. The reason is worth keeping, because the obvious-looking alternative was
shipped for an afternoon and was wrong: a wash heavy enough to hold copy over the picture
buries the picture completely, so the tighter crop added *for these very widths* painted
nothing at all. Lightening it instead puts the heading back across faces that the narrow file
makes BIGGER than the wide one did. Stacking is the only option where both the words and the
photograph survive.

**So the overlay now exists only at 1024px and up**, and everything below it is the hero's
arrangement at a different breakpoint.

### The scrim is not a constant, and that is the whole responsive story

The board's 90deg side wash clears at 54%, which is exactly where its 560px copy column ends
on a 1660px board. Hold that stop while the viewport shrinks and the copy walks out onto the
photograph: at 768px the heading crossed the team's faces and the lead sat over someone's
head. So the wash **widens as the band narrows**, and goes flat below 1024px where the copy
uses the full column and there is no clear side left to fade to.

The widened wash therefore covers **1024-1279px only** — the last range in which the band
overlays at all, and where the copy column is still narrower than the band so there is a clear
side to fade to.

Four things about the stack below 1024 are load-bearing:

- **The picture is faded out with a `mask-image`, not a scrim.** A foot scrim needs an end
  colour, and the ground here is a 165deg gradient — any fixed value is right at exactly one
  point down the band and visibly wrong above and below it. A mask has nothing to match, so
  the picture dissolves into the section's own gradient at any position.
- **`height: min(65vw, 40vh)`, and 65 is derived, not chosen.** `why-team-narrow.png` is
  1196x776 and 776/1196 = 64.9%, so at 65vw the box is the photograph's own ratio and NOTHING
  is cropped. It read 56vw while the band had a single 16:9 photograph; the tighter crop
  changed the number. **Re-derive it if either file is replaced** — an inherited value here
  silently starts taking a person off one end. (56vw against the narrow file would; 64vw
  against the wide one clipped the woman on the right, which is how this was found.)
- **NOT `aspect-ratio` with `max-height`** — the documented trap: once the height clamps the
  ratio pulls the width in and the picture stops being full-bleed.
- **`object-position: center top` when stacked, against the desktop rule's `center 30%`.** On a
  TABLET the 40vh guard makes the box wider than the photograph, so the crop turns vertical and
  30% would shave the tops of their heads. Anchored top, the crop comes off the bottom instead
  — cropping at the shins is fine, which is the hero's reasoning too. On a phone the box is the
  photograph's own ratio, nothing is cropped, and the value does nothing.

### Layout notes worth keeping

- **The heading is `--fs-62`, not the board's 64.** 64 is not a step on the ramp and 62 is the
  nearest; it also keeps this h2 one size BELOW the hero's 66px h1 rather than level with it.
- **The lead and the reason bodies are both `--on-dark-80`.** `.on-dark` sets `--color-text` to
  62% for copy on a flat dark panel, which is too faint over a photograph. The board runs the
  lead at 0.82 and the bodies at 0.88 — the board making its BODY brighter than its LEAD is not
  a hierarchy worth reproducing at two hundredths of an alpha.
- **The column rule is a local `rgba(217, 185, 120, 0.42)`,** a GOLD hairline rather than the
  neutral `--border` that `.on-dark` supplies. Same local form the deadlines and fee bands use.
- **The dividers are `border-inline-start` with the first of each ROW switched off,** so the
  nth-child rule changes with the column count — 4n+1 at four across, odd at two across, and
  all of them off at one. Change the columns without changing that rule and a rule reappears
  down the left edge.
- **Four reasons divide by four, two and one.** Same arithmetic as the attorneys band's three:
  a fifth would strand itself.
- **The icons match the reasons BY POSITION**, the way the "What you can expect" glyphs do.
  There is no icon field and a fifth reason would wrap back to the first.
- **Height is content-driven with a floor** (`min-height: clamp(0px, 62vh, 700px)` on the
  inner), not the board's fixed `height: 65vh; min-height: 820px` — which on a phone would
  either crop the four reasons off or leave a chasm under them.

### What modelling it will take

A `whyUsSection` object — `eyebrow`, `heading`, `lead`, and `reasons[]` of a small object with
`title` and `body`. No icon field. Then delete `src/data/homeWhyUs.ts` and fold a `whyUs{…}`
projection into `HOME_PAGE_QUERY`. **The component's prop shape is already the shape that
projection produces.** Check `schema.json` before predicting a typegen count — see the
attorneys band's note on `<type>.reference`.

## The attorneys band

`src/components/Attorneys.astro`, rendered after testimonials, wired to
`homePage.attorneys`. A sand strip: centred head, then a static row of three white cards —
square portrait, name, quote, and a footer row holding the role against "View Profile →" —
closed by one centred button to the full team.

| File | What |
| --- | --- |
| `src/components/Attorneys.astro` | The section. No script — there is nothing to script |
| `src/sanity/schemaTypes/objects/attorneysSection.ts` | The model — `eyebrow`, `heading`, `cta`, `attorneys[]->` |
| `src/lib/queries.ts` → `HOME_PAGE_QUERY` | The `attorneys{…}` projection, folded in with the rest |
| `scripts/seed-home-attorneys.ts` | Seeds the section, **has run**, guarded against re-running |
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
SECTION (rule 7), so the choice lives in `homePage.attorneys.attorneys[]` — an ordered array
of references an editor can reorder or swap. All six still appear on `/about/attorneys/` when
that page is built.

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

### How it is modelled

`attorneysSection` holds **four fields and no more** — `eyebrow`, `heading`, `cta`
(a `ctaLink`) and `attorneys[]->`. Three things are deliberately absent, and each is a field
somebody will otherwise propose adding back:

- **No `summary` / card blurb.** It was on `attorney`, was `.required()`, fed that one
  paragraph and nothing else on the site, and is gone from the schema and unset on all six.
- **No `footNote`.** The board's "Six attorneys and a support staff of more than twenty,
  including…" went with the staff portraits beside it.
- **No quote field.** The card quote is `attorney.quote` — the line that represents that
  person site-wide — not copy this section owns. That is rule 8, and it is also why
  `attorneyQuote` is NOT used here: this band quotes three people in passing rather than
  putting one person's words in the section's mouth.

`cta` is OPTIONAL, matching `reviewsSection` and `deadlinesSection`, and the component guards
it. ⚠️ **That means an editor can delete the band's only route to `/about/attorneys/` and see
no error** — the field description says so in the Studio, and that description is the whole
safeguard. Make it `.required()` if that ever proves not to be enough.

⚠️ **`attorneys[]` is `.required().length(3)` AT ERROR SEVERITY — exactly three, no more
and no less**, on the client's instruction (2026-09-08: *"No more no less. We can adjust
later if needed"*). This is the second deliberate exception to AGENTS.md's "use `.warning()`,
never `.error()`", alongside `caseResultsSection.results`; that rule is about design-coupled
string LENGTHS, and three here is structural — the grid is `repeat(3, …)` down to 700px and
one-up below, with no two-up breakpoint. `.required()` is what makes it "no less": a rule
does not fire on an absent value, so `.length(3)` alone would pass on an empty band.

**The rule earned itself within the minute.** A FOURTH reference — Katherine Sawicki — had
been added in the Studio after the seed, and the homepage was building four cards with the
fourth stranded alone on a second row beside two empty columns. Nothing had reported it. The
fourth was removed by a targeted `unset` on the client's instruction and the band is back to
Cohen · Jaffe · Tiger. ⚠️ **Removing an ARRAY ITEM needs an explicit `_key` in the unset
path** — `unset(['attorneys.attorneys[_key=="…"]'])`; the bare `[]` form silently matches
nothing.

References are STRONG, matching `reviewsSection` and `practiceAreasSection`; the cost is the
usual one, that an attorney document cannot be deleted while the homepage points at it.

⚠️ **Typegen reported +1 schema type, not the +2 the previous handoff predicted**, and the
reason is worth keeping: `attorney.reference` ALREADY EXISTED, emitted for `attorneyQuote.attorney`,
which the "Our goals" and fee bands both use. The auto-generated `<type>.reference` appears
once per referenced document type, not once per reference — so before predicting a count,
check `schema.json` for the `.reference` entry rather than assuming a new array reference
mints one.

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
`attorneysSection` → `attorneys[]->` `attorney` (an ordered array of three) → `Attorneys.astro`.
`firmDetails` → `FIRM_DETAILS_QUERY` → `getFirm()` → `Layout.astro` → `Nav`, `MobileNav`,
`Footer`; `Fees.astro` calls `getFirm()` directly.

**Every homepage section now reads from `homePage` through `HOME_PAGE_QUERY`. There are no
exceptions and no temporary queries left** — `HOME_PAGE_QUERY` and `FIRM_DETAILS_QUERY` are
the site's only two.

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

1. **The attorneys band is finished — two CONTENT items on it remain before launch.**
   **Jaffe's card repeats the "Our goals" pull quote** (one of the two bands should give it
   up), and the **placeholder video sits on Cohen and Jaffe**. Neither is a code change.
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
11. **"A caseload we keep small on purpose"** in the why-us band is unsourced — the firm's to
    confirm. So is the corrected Jaffe medic line, which now says only what `/about/` says.
12. **Nothing outstanding on the why-us LAYOUT** — the band is built at all three widths and
    awaiting design sign-off. The two open items on it are the content lines above.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with credentials.

## What's next

1. **Push `hp_attorneys_sanity` and open its PR** — committed at `7ad30fd`, green, unpushed.
   `hp_why_us` sits on top of it, so merge that one first.
2. **Get the "Why Cohen & Jaffe" band approved, then model it** — `whyUsSection`, delete
   `src/data/homeWhyUs.ts`, fold the projection into `HOME_PAGE_QUERY`. Two content answers
   are wanted with the design: the unsourced "caseload we keep small" line, and whether the
   firm confirms the corrected Jaffe medic line.
3. **`/about/testimonials/`** — the "Read all reviews" destination, already in
   `navigation.ts:111` and `:241` and already indexed. `CJ - Testimonials.dc.html` is
   approved: a video-reviews band, a written-reviews band with a load-more button, and a
   "leave a review" panel. `caseType` exists for it. Its Google button uses
   `https://www.google.com/maps?cid=67117899491750775`.
4. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — both artboards approved, and
   the homepage band's "View Profile →" links already point at the second. The bio sidebar
   can now `reference` `practiceArea`.
5. **`/practice-areas/`** — `CJ - Practice Areas.dc.html`: featured six cards, then five
   group cards from `PRACTICE_AREA_GROUPS`.
6. **`/case-results/`** — the 60 ledger entries have no page yet.
7. Then a **`video`** type once the Wistia uploads exist, and **set `site` in
   `astro.config.mjs`** so `Layout.astro` emits a canonical link.

## Things that would surprise someone

- **A `createOrReplace` seed is a LOADED GUN once the Studio has been used.** The three
  partners' roles have been edited there; re-running `seed-attorneys.ts` would revert all
  three with no warning. To drop a field from live documents prefer a targeted `unset`
  patch — `scripts/unset-attorney-summary.ts` is the worked example.
- **`unset` takes a TOP-LEVEL field name fine**; it is the array form
  `unset(["path.array[].field"])` that silently matches nothing and needs an explicit `_key`.
  To drop a whole array ITEM the same applies: `unset(['a.b[_key=="…"]'])`.
- **`srcSet()` in `lib/image` sets a WIDTH ONLY.** For anything drawn in a fixed aspect
  ratio that ships the source's own frame and lets CSS discard the difference — and ignores
  the hotspot. Ask the CDN for both dimensions; `Attorneys.astro` has the local helper.
- **`reviews[]->[filter]` is NOT an array filter in GROQ.** It returns `[null, null, …]` and
  the build dies on `Cannot read properties of null`. Filter the REFERENCE array before
  dereferencing: `reviews[@->rating == 5]->{…}`.
- **GROQ's `in` returns dataset order, not the order of the array you gave it**, so a
  caller-supplied running order has to be restored after the fetch. **A dereferenced
  reference array (`refs[]->`) does NOT have this problem** — it comes back in the array's own
  order, which is why modelling the attorneys band deleted the by-index restore that used to
  sit in `index.astro`. Reach for a reference array rather than an `in` whenever the order
  matters.
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
- **A full-bleed photo band's scrim cannot be a fixed gradient.** The stop that clears the
  copy column on a 1660px board sits in the middle of the copy at 768px, and the text ends up
  over faces. The scrim has to widen as the band narrows — and below some width it stops being
  a scrim problem at all and the band has to stack. `WhyUs.astro` is the worked example.
- **A scrim heavy enough to hold copy over a photograph HIDES THE PHOTOGRAPH.** The two goals
  are in direct opposition and there is no setting that serves both; the why-us band burned an
  afternoon proving it, and a second, tighter photograph added for tablet painted nothing at
  all until the band was stacked there. Stack, or accept a dark ground — there is no third
  answer.
- **A `<picture>` swap needs a CLEAN LOAD to verify.** `<source media>` resolves once, so
  reading `img.currentSrc` after the preview pane changes its emulated viewport reports the
  file chosen at the PREVIOUS width — which reads as a broken media query.
- **To fade an image into a GRADIENT ground, mask it — do not scrim it.** A scrim needs an end
  colour and a gradient has a different one at every point, so a fixed value is right once and
  wrong everywhere else. `mask-image` has nothing to match.
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
  **2 queries and 45 schema types**; if the query count drops, this is why.
- **Typegen's `<type>.reference` is emitted once per REFERENCED DOCUMENT TYPE, not once per
  reference.** Adding the attorneys band's `attorney[]->` array raised the count by one, not
  two, because `attorney.reference` already existed for `attorneyQuote.attorney`. Check
  `schema.json` before predicting a count.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**.
