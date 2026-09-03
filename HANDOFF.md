# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-02

## Where things stand

Four of the homepage's fifteen sections are now built — **hero**, **stats band**, **case
results** and, as of this session, **"Our goals"** (the about band). The first three are
finished end to end; the fourth is **built and awaiting design sign-off, with its content
still hardcoded**. There is also the **attorneys collection**, which no page consumes yet.

`origin/master` is at `c980d3e` (PR #10). Current branch is **`hp_about`**, which carries
the "Our goals" work, uncommitted.

Gates: `npm run build` green and `npm run check:types` **0 errors** — both verified after
the last change. `npx sanity documents validate --yes` was last clean at 71 documents and
is unaffected by this session, which added no schema.

## The "Our goals" section — built, NOT yet modelled

The two-column band immediately after the case results, and the next section in the
artboard's own order. It is `data-dc-tpl="148"` in the published canvas, line 219 of
`Cohen & Jaffe Homepage v1.dc.html`. (Those ids are not in the file — `support.js` stamps
them as a pre-order element counter at render time, so mapping one back to the source means
counting elements.)

This is AGENTS.md → "Building sections" being followed deliberately: **built with its copy
hardcoded, signed off, and only then modelled in Sanity.** Nothing is in the dataset yet.

| File | What |
| --- | --- |
| `src/components/About.astro` | The section |
| `src/data/homeAbout.ts` | **Temporary.** The copy, plus the provenance of every line |
| `src/components/RichText.astro` | **New, and general.** Portable Text → HTML |
| `src/assets/icons/expect-*.svg` | The four olive glyphs the rows draw |
| `src/assets/about-video-cover.jpg` | The video card's cover |

`homeAbout` is shaped exactly the way the GROQ projection will project `homePage.about`,
so wiring it is a swap in `src/pages/index.astro` — `homeAbout` becomes `home.about` — and
`src/data/homeAbout.ts` is deleted.

**`RichText.astro` is now the only way Portable Text should be rendered.** It always emits
`.prose` on its wrapper, which is what AGENTS.md asks for: rhythm becomes structural
instead of a class every consumer has to remember.

⚠️ **`.prose` no longer caps the measure, and `--measure` is gone from the tokens.** It
used to cap at 600px (~68 characters, the readable band). On the page that left the intro
copy stopping ~90px short of its column while the list under it ran the full width, which
read as a mistake, and it was removed on the client's call. Long-form pages that genuinely
want a narrow column should reach for `.container--prose` (790px). The `ch`-unit
calibration note that justified the old number is preserved in the comment where the rule
used to be, in case it is ever wanted back.

Three things in it are ours rather than the artboard's:

- **The expectation rows are `<details>`/`<summary>`.** The artboard uses the canvas's own
  `sc-if` state. A disclosure element gives the same behaviour with no JavaScript,
  announces its expanded state for free, and keeps the hidden paragraph in the document for
  crawlers. The whole row toggles, not just the circle.
- **The open/close is animated with `::details-content`, still without JavaScript.** That
  pseudo-element is the box the UA wraps a disclosure's content in, and it is the only way
  to animate a `<details>` in BOTH directions from CSS. Growing to `auto` needs
  **`interpolate-size: allow-keywords`, which is now set on `:root` in `global.css`** —
  without it the transition silently does not run. Browsers that lack either feature drop
  the rules and snap open, exactly as before. The `+`/`−` is **two drawn bars**, not a
  glyph: Roboto Condensed's plus sits high and thin in the em box and never looked centred,
  and `content` cannot be transitioned, so a glyph swap can only snap. The vertical bar
  rotates flat onto the horizontal one.
- **The icons are repo assets picked by key**, not Sanity images. They are a fixed brand
  set — roughly forty concepts in the design files' `assets/icon-*-olive.svg` — so an
  editor picks FROM a library rather than supplying artwork, which AGENTS.md rule 5 puts in
  code. Widen the choice by adding to `EXPECTATION_ICONS`.
- **The right-hand column owns the gap between the quote and the video card**, rather than
  the quote carrying it as trailing padding. Trailing padding looks right only at desktop,
  where the card sits beside the copy; stacked, it is the one thing holding the two apart,
  and the responsive rule that helpfully zeroed it collapsed them together. The stacked
  grid gap is `--space-xl` for the same reason — `--space-lg` bottomed out at 36px, under
  the 44px inside the column, so the section read as four loose blocks instead of two.
- **Below 500px the row becomes a grid reflow**, not a squeeze: the blurb leaves the middle
  column and takes the full width, because the icon and toggle between them ate 90px of a
  335px row and the blurb was wrapping every four words. The quote's attribution row
  reflows at the same step — the hairline above it goes, since stacked and full-bleed the
  portrait already separates it from the quote.
  **`sm` is 500px, not the 480 it was**, moved on the client's call after checking a phone;
  all three uses in the codebase moved together, and the scale in `AGENTS.md` with them.

### ⚠️ What in this section's copy is real, and what is not

The **heading and both intro paragraphs are verbatim from the live WordPress homepage.**
The artboard's only edit — dropping the SEO-stuffed "At the Law Office of Cohen & Jaffe:
Long Island Personal Injury Lawyer" — is kept.

The **four "What you can expect" rows are not on the live site.** They are the artboard's
own copy, and they are operational promises about a real law firm, so each was checked
against the mirror. Two were rewritten and one trimmed:

1. *We take the pressure off* — as drawn. A general service description, consistent with
   the live "we take a comprehensive approach to helping accident victims".
2. *You work directly with an attorney* — **rewritten.** The artboard's "Not just a
   paralegal or a secretary" is off-brand: the firm credits its paralegals by name in the
   testimonials it publishes. And nothing anywhere supports "one of our partners is
   assigned to your case". The live site's own, stronger claim is used instead — clients
   get Richard Jaffe's cell number for 24/7 accessibility.
3. *We help with the day-to-day* — **trimmed.** The lien explanation is the live site's.
   "Arranging transportation to appointments" and "dealing with your employer about time
   off" are not claimed anywhere and were dropped.
4. *Calls returned within 24 hours* — **enriched**, and every clause is now live-evidenced,
   including "we can come to you".

⚠️ **The pull quote is the artboard's INVENTED line, attributed to Richard Jaffe** — "I
worked ambulances before I practiced law…". It was built with Cohen's real, sourced quote
instead; the client asked for the artboard's back, which is their call to make and the same
one they made for the four featured case results. **It still needs confirming or replacing
before launch.** What the mirror supports: Jaffe is a certified emergency response medic
and a former firefighter. What it contradicts: his bio puts that work in the past, so the
artboard's companion line about a weekly volunteer shift in Brentwood is not used anywhere.

Jaffe's real quote lives on his `attorney` document. **The ATTORNEYS band must not print
both**, and the artboard is no guide here — it prints Jaffe's invented quote twice on the
homepage, here and there, which only works because both were made up.

**There is no "read more" link — the attorney's NAME is the link to their bio.** The
artboard draws a separate "His story →" control beside the name; it was built that way and
then cut. One consequence is worth keeping: a labelled link here would have to be a content
field rather than a hardcoded string, because the section points at whichever attorney an
editor picks and a fixed label would either assert a pronoun or name the wrong person the
moment someone swaps the reference. Linking the name sidesteps that, so `quote` has no
`linkLabel` field to model. The name is underlined in gold at rest, following `.prose a` —
a name that is quietly a link with no affordance until hover is a link nobody finds.

⚠️ **The video card is a placeholder.** No firm video exists on Wistia yet, and the
artboard's "Why we do this work · 2 min" is on neither the site nor the YouTube channel.
The card is wired to `c6b0eghb5r` — the same test id already on the first case-result card
— so it is verifiable end to end. **The id, the title and the duration all need replacing
after the Wistia uploads.**

Its cover is **`video-cover.jpg` (1321×792), not the artboard's `firm-video-cover.png`**,
and **the card takes that photograph's aspect ratio instead of the artboard's 520px
height**. The artboard's cover is only 971px wide AND a wide shot, so a 690×520 card threw
away a quarter of the frame and upscaled the rest — visibly soft. Both are frames from the
same courthouse shoot and both are Richard Jaffe, which is now also who the quote beside it
is attributed to. Still short of a true 2×; a proper still off the master is the real fix.

### Verified

At 1660 / 900 / 375: two columns collapse to one at 1024, no horizontal scroll at 375, the
icon ramps 40 → 30px, the disclosure detail aligns to the pixel with the title above it
(x=178 both), and clicking the video card opens the lightbox with the right Wistia embed
and tears the iframe down on close. Both animations measured with transitions forced off,
since a hidden browser pane never advances them: `::details-content` goes 0px → 90.19px,
and the toggle's vertical bar `rotate(90deg)` → `rotate(0)`.

Every eyebrow on the page now computes to the same thing — 0.16em tracking, 1.35
line-height, dash where it belongs: hero and section kickers 15px with the gold dash, the
"What you can expect" sub-kicker 15px with an olive one, the stats band and the video
caption dashless at 15 and 13px, the footer's column labels at 13px.

## The eyebrow is one component now

Settled this session, on the observation that kickers had drifted apart across the site.
**The homepage hero is the reference.** The gold dash is part of `.eyebrow` itself — it
used to be an opt-in `.eyebrow--rule`, which meant every new kicker was one forgotten class
away from silently not matching, and that is exactly what had happened. Use
**`.eyebrow--bare`** where a dash does not belong: it reads as "a section starts here", so
it is wrong on a caption over a photograph or a label inside a card.

Three components had restated the type by hand and drifted while doing it — the stats
band's labels and the "What you can expect" sub-kicker were on `--ls-eyebrow` (0.14em)
rather than `--ls-eyebrow-wide` (0.16em), and the footer's column labels set no
`line-height` at all, so they fell back to the body's 1.6 instead of `--lh-label`. All
three now inherit from `.eyebrow` and own only what is genuinely theirs: colour, size and
their place in the stack.

**The case-result cards' micro-labels are deliberately NOT in this family** and were left
alone. "Insurer offered", "Recovered" and the meta line are data labels, not kickers, and
each carries a documented reason for its own values — the 12px recovered label uses
`--ls-button` to buy back ~4px the figure needs on a 272px card, and the meta line is 13px
because 14 left card bottoms ragged across a row.

## The attorneys collection — one type, six documents

**`attorney`**, in `src/sanity/schemaTypes/documents/attorney.ts`. Six documents, seeded
into `production` from `scripts/seed-attorneys.ts` (idempotent). Merged in PR #10.

ONE type, and a section picks who appears with an ordered array of references. Case results
needed two types because a featured card is different *content* — a client interview, a
portrait, a quote, an insurer's offer the ledger never had. An attorney is the same person
on every page. So there is **no `featured` flag, no second type, and nothing to drift**;
ordering and the partners/associates split are properties of the *section*, not the person,
which is why `attorney` has no `order` or `group` field. That is rule 7 in `AGENTS.md`.

Seventeen fields in four groups — Profile, Biography, Credentials, Contact — the union of
what three approved artboards read.

**Slugs match `src/data/navigation.ts` exactly** — `stephen-cohen`, `richard-jaffe`,
`stephen-tiger`, `caitlin-mcnaughton`, `katherine-sawicki`, `garrett-parnell`. Those are
the live, indexed paths under `/about/attorneys/`. Changing one is a redirect to write.

**Only six of seventeen fields are required.** The deliberate corrective to
`featuredCaseResult`, where every field is required and the cost is permanent: the 60 real
ledger results can never be promoted without someone inventing four fields each. Bar
admissions, honors and quotes are simply absent from the live site for most of the six, so
an empty credentials card is the correct output. Rule 6 in `AGENTS.md`.

**`attorney` is wired to nothing yet, on purpose.** No page consumes it, so there is no
`ATTORNEYS_QUERY` — an unused query would be dead code. `About.astro` therefore holds a
temporary slug→file map for the quote portrait; wiring the section replaces the whole map
with `urlFor(quote.attorney.portrait)` off a dereferenced reference.

Three blocks the bio artboard draws are deliberately NOT modelled, each waiting on a type
that is already planned: the **video card** (→ `video`), the **practice-areas sidebar**
(→ `reference` to `practiceArea`), and the **award badge row** (firm-level, model it once
in the homepage's Recognition section). `representativeCases` deliberately *is* free text —
the ledger publishes no attorney attribution, so nothing links a result to who tried it.

### None of the attorney content is invented

Every word came from the six live bio pages in `Sitesucker/about/attorneys/`. Three
consequences the client still has to resolve:

1. **Three of the six have no quote, and `quote` is empty for them.** McNaughton, Sawicki
   and Parnell are not quoted anywhere on the live site.
2. **Roles are the live site's, not the artboards'.** The live site titles Cohen, Jaffe and
   Tiger identically — "Partner". The artboards say "Founding Partner", "Managing Partner ·
   Lead Trial Lawyer" and "Partner". These are claims about real people's positions at a
   real firm, so the firm confirms them. McNaughton's "Managing Attorney" **is** live and is
   used. (Note one live page does call Jaffe a *founding* partner in passing — which still
   is not the artboard's *managing* partner.)
3. **Most credential lists are empty.** McNaughton has none at all — her bio says she is
   "licensed in three states" and holds an LL.M., but names neither the states nor the
   school.

One knowing edit: Tiger's live notable-case list reads "2.75 for an injured construction
worker", missing the "$" and "million" every other line has. Seeded as "$2.75 million".

### Two live-site bugs found in the mirror

Both on **Garrett Parnell's** page, and both look like a WordPress duplicate of Caitlin
McNaughton's: his `og:url` points at *her* page, and his badge row renders
`mybadge-Caitlin-McNaughton.png`. Neither affects the new site; both matter for the
redirect/SEO pass. The bad canonical is also why his page is the one exception to the
"every href checked against that page's own `og:url`" rule used for the nav.

## Portraits

`src/assets/atty-{cohen,jaffe,tiger,mcnaughton,sawicki,parnell}.png` — 720×1280, the
artboards' own files, uploaded to Sanity by the seed script. **They are the firm's real
headshots with the background replaced** (verified against the WordPress originals: same
person, same suit, same tie). Not stock, not generated.

One photograph per attorney serves every crop — 1:1 on the homepage, 4:5 on an associate
card, 3:4 on the bio hero, and the 72px circle beside the "Our goals" pull quote — so
`portrait` has a hotspot and there is no second image field. A standing 720×1280 portrait
needs `object-position: 50% 14%` in a circle or it frames a tie.

## What is wired

`hero` / `stat` / `ctaLink` objects → `homePage` singleton → `src/sanity/structure.ts`
(which is what actually enforces the singleton) → `defineQuery` in `src/lib/queries.ts` →
`HOME_PAGE_QUERY_RESULT` → `Hero.astro` and `Stats.astro`.

`caseResultsSection` object → `caseResults` on `homePage` → `results[]->` dereferenced to
`featuredCaseResult` documents → `CaseResults.astro`. The featured array is capped at
**four with a hard `.error()`** — the deliberate exception to the "`.warning()`, never
`.error()`" rule, which is about string lengths. Four across, four carousel pages, nowhere
for a fifth.

`About.astro` is wired to **`src/data/homeAbout.ts`**, not to Sanity.

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
  on the current Video Center. Mixed aspect ratios need a decision. That video —
  "Cohen & Jaffe: Different Kind of NY Personal Injury Lawyer", 0:35 — is the closest thing
  the channel has to the "Our goals" card's "Why we do this work", and it is vertical.
- **3 of the 10 videos on the current site are unlisted** — a channel-only pull drops them.
- yt-dlp goes stale fast. A 403, or only 360p offered, means upgrade it first.

`c6b0eghb5r` is a test id, wired to the first case-result card AND to the "Our goals" video
card.

## Open questions / waiting on the user

1. **Sign off the "Our goals" design**, so it can be modelled. Load `localhost:4321/` and
   scroll past the case results.
2. **The rewritten expectation copy needs the firm's blessing** — see the numbered list
   above. Three of the four rows are now the live site's own claims rather than the
   artboard's; if the firm actually does assign a partner per case, the artboard's stronger
   version can go back in.
3. **The "Our goals" pull quote is invented and attributed to Richard Jaffe.** Restored
   from the artboard on the client's instruction. Confirm it or replace it before launch —
   his real, sourced quote is already on his `attorney` document.
4. **Attorney roles need the firm's confirmation** — "Partner" (live) versus the artboards'
   "Founding Partner" and "Managing Partner · Lead Trial Lawyer".
5. **Case results needs REAL client names, quotes, photographs and insurer-offer figures.**
   The four in `production` are fabricated. This is the item that has to close before the
   site can go public.
6. **The client-story videos in the artboards do not exist.** The Video Center artboard
   shows three testimonial videos (Maria R. · Hempstead, and two more) that are on neither
   the site nor the channel. Filmed, planned, or aspirational?
7. **The hero's video card is deliberately not built** (440×264, bottom-right in the
   artboard). Unblocked now the lightbox exists, but it needs its own fields — and, like
   the "Our goals" card, a real video.
8. **The Spanish section is deferred.** `/es/` is 17 pages with a translated menu whose
   links all point at *English* pages, and machine-translated place names. Needs a client
   decision. Background is a comment in `navigation.ts`.
9. **Two live-nav links point at pages absent from the mirror** —
   `/medical-device-lawyer-long-island/` and `/personal-injury-lawyer-nassau-county/`.
   Verify before launch.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with
credentials, or that origin's `/admin` hangs on a spinner.

## What's next

1. **Model "Our goals" in Sanity** once it is approved — an `aboutSection` object on
   `homePage`: `eyebrow`, `heading`, `body` (`richText`), `expectationsLabel`, an array of
   an `expectation` object (icon key as a `string` with a `list`, title, blurb, optional
   detail), a `quote` object (text, accent, `reference` to `attorney` — no link label, the
   name IS the link), and an optional `video` object. Then `npm run typegen`, extend `HOME_PAGE_QUERY`, delete
   `src/data/homeAbout.ts`, and drop the temporary `PORTRAITS` map in `About.astro`.
2. **The homepage attorneys section** — "The three people who will actually work your
   case." An `attorneysSection` object on `homePage`: heading, lead, an ordered array of
   `attorney` references for the three large cards, a second array for the three
   thumbnails, and a `ctaLink`. Design is at line 511 of the homepage artboard. **Do not
   let it repeat whichever quote "Our goals" is using.**
3. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — the listing splits partners
   (large horizontal cards) from associates (a three-up grid); the bio page reads nearly
   every field. Both artboards are approved and the URLs are already in the nav.
4. Build **`/case-results/`** — the 60 ledger entries have no page, and the homepage's
   "See all results" link already points there.
5. Then **Fee Explainer**, Practice Areas, New York Deadlines. Order is in the artboard.
6. A **`video` document type** once the Wistia uploads exist.
7. **Set `site` in `astro.config.mjs`.** `Layout.astro` emits a canonical link only when
   `Astro.site` is configured — it is not, so none is written.

## Things that would surprise someone

- **Astro's scoped styles do not reach a class you pass INTO a child component.** Scoping
  stamps `data-astro-cid-*` onto the elements in a component's own template, so
  `<RichText class="about__body" />` produced a `.about__body` selector that matched
  nothing and margins that silently did nothing. Own the wrapper element yourself and use
  `:global()` for what is inside it. Cost the first fifteen minutes of the "Our goals"
  build.
- **`interpolate-size: allow-keywords` is set on `:root`.** It is what lets a size animate
  to or from a keyword, and without it a `height: 0` → `height: auto` transition does not
  run at all rather than failing loudly. The "What you can expect" disclosures depend on
  it. It is inherited, so it now applies site-wide.
- **A running dev server can serve a STALE scoped-CSS module** while `curl` of the same
  page shows the new rule inline. The HTML hot-updates and the style module does not, so
  the section renders with last edit's layout and every measurement lies. `touch` the
  component and reload. Related: `npm run check:types` re-optimises Vite's deps out from
  under an already-running dev server, which is what leaves `504 (Outdated Optimize Dep)`
  in its console. Astro's dev-toolbar entrypoint 504ing is harmless; site assets 504ing is
  not.
- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`. If they
  suddenly read as `EPERM`, that is macOS blocking `~/Downloads`; Full Disk Access fixes it
  but **only after the app restarts**.
- **`data-dc-tpl` ids are not in the `.dc.html` files.** `support.js` stamps them at render
  as a pre-order element counter, so mapping one back to source means counting elements.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.** Production returns a 308.
- **A blank black `/admin` in dev with a `504 (Outdated Optimize Dep)` in the console is a
  stale Vite cache, not a broken Studio.** `rm -rf node_modules/.vite .astro` and restart;
  `npm ls @sanity/ui` must show v4 at the top level. Full write-up in `AGENTS.md`.
- **A dev server is usually already running on port 4321** and it is the user's. Use it.
  Only 4321 and the Vercel URL are registered Sanity CORS origins.
- **`await`ing a `requestAnimationFrame` in a hidden browser pane hangs until the tool
  times out**, because the callback never runs. Measure a transitioned property by
  injecting a `transition: none !important` stylesheet and reading the target — an inline
  style cannot reach a pseudo-element like `::details-content`. Beware too that a call
  which times out has usually already run its earlier statements: one that set a
  `<details>` open before hanging made the next reading look like a broken CSS rule.
- **In a hidden browser pane, CSS transitions do not advance and `requestAnimationFrame`
  never fires** — which also means `scroll-behavior: smooth` never completes, so
  `scrollTop = n` reads back as ~20 and screenshots come back stale or blank. Hide the
  sections above instead and measure the DOM.
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
- **`--gutter-header` is smaller than `--gutter` on purpose**, and `.nav { flex: none }`
  makes a future overflow break visibly instead of silently overlapping.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**
  to near-launch.
