# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-09 (the homepage community band built, on `hp_community` —
one commit, **NOT PUSHED**)

## ⚠️ Read this before writing any code

The client's standing instruction, given 2026-09-08 and now rule one under
AGENTS.md → Conventions:

> *"I'm noticing that you are trying to do too much. A lot of fields are being added that
> are unnecessary. Simple is better than complicated. Try to just implement what I ask for.
> If I need more I will ask for it. I'd rather ask for an extra feature than have to go
> through Sanity and turn things off or remove items I never asked for."*

**Build what was asked and nothing beside it. Suggest extras in a sentence; do not build
them and explain afterwards.** It has bitten twice: once as stray fields (five on the
reviews collection, all removed), once as a scope misread — asked to "model everything into
studio" for the FAQ work, the session modelled the contact form and the thank-you page too.
**When an instruction's scope is ambiguous, ask before building, not after.**

**AN APPROVED ARTBOARD IS NOT ALWAYS A GOOD DESIGN.** The attorneys band was built exactly
as drawn and the client's verdict was *"Not in love with how this is turning out. Not your
fault. I don't think the section was designed well by the designer."* When a section is
built faithfully and still reads badly, say so and show it — that is what the
build-it-then-approve order is FOR.

**AND AN APPROVED ARTBOARD IS NOT A SOURCE.** The designer invented copy on at least four
sections: the pull quotes credited to Richard Jaffe in "Our goals" and the practice-areas
band, the "still works a weekly shift" line in "Why Cohen & Jaffe", and — found 2026-09-09 —
"Cystic Fibrosis Foundation" in the community strip, which appears nowhere on the live site
or in the 217-page mirror. **Check any named fact on a board against the mirror before
building it.** On legal advertising these are not typos.

## Where things stand

**Thirteen of the homepage's SEVENTEEN sections exist and all thirteen are finished** —
hero, stats, case results, "Our goals", the fee explainer, practice areas, the New York
deadlines band, testimonials, the attorneys band, "Why Cohen & Jaffe", the case review
banner, the FAQ band and the community band. Every one built and approved; every one
modelled, seeded and wired EXCEPT the community band, which is hardcoded pending approval.

⚠️ **THE COUNT USED TO SAY FIFTEEN AND THAT WAS WRONG.** The board draws seventeen real
sections between NAV and FOOTER. `MID CTA BAR` (line 576) is an empty comment with no
markup and does not count; `CASE BANNER` is drawn inside the FAQ block at 621-628 and does.
The four still unbuilt are **RESOURCES (the blog band), CONTACT, RECOGNITION and AREAS WE
SERVE** — the board's last four, in that order.

**`src/pages/`** holds `index.astro`, `faqs/index.astro`, `faqs/[slug].astro` and
`thank-you.astro` — **184 pages build**, of which 180 are FAQs. **`src/data/` holds
`navigation.ts` alone.**

⚠️ **ONE BRANCH IS IN FLIGHT AND IT IS NOT PUSHED.** `hp_community`, cut from `master`
(`3a9fc50`), one commit: `54c8269` *Build the homepage community band*. Nothing is stacked
on it. The FAQ work that the previous handoff described as unpushed is **merged** — PR #20.

Gates: `npm run build` green at **184 pages**, `npm run check:types` **0 errors (112
files)**. No schema changed on this branch, so `npm run typegen` still reports **7 queries,
55 schema types** and `npx sanity documents validate --yes` is clean at **327 documents, 0
errors, 0 warnings**.

The 327 are 180 FAQs + 60 case results + 47 practice areas + 21 reviews + 6 attorneys +
4 featured case results + 4 video reviews + `homePage` + `firmDetails` + `faqsPage` +
`thankYouPage` + `contactSection`.

---

## The community band — the one section not yet in Sanity

`src/components/Community.astro`, rendered unconditionally at the end of `index.astro`
because there is nothing in Sanity to guard on. Content is a `COMMUNITY` constant shaped
the way the GROQ projection will return it, so wiring is a swap to a prop.

⚠️ **THE SEVEN PHOTOGRAPHS DO NOT EXIST.** They are the section's entire visual weight and
nothing in `Claude Files/assets/` or the repo fills them. The tiles are scaffolding — one
flat `--border-deep` fill, a label, `aria-hidden` — and the whole `PHOTO_SLOTS` array plus
its three CSS rules come OUT when the firm supplies images. The board tints its seven
placeholders four slightly different greys; deliberately not carried over, because four
one-off hexes would have to be deleted anyway and a uniform fill reads as "photos to come"
where four varied ones read as a design.

**The grid rows are `minmax(_, auto)`, not the board's fixed 150px.** The card's column
narrows faster than the row height does: at 1660 it has 460px of content in a 460px box, and
at 1280 the same copy wants ~390px in a 357px box. Because the tiles occupy exactly the
three rows the card spans, letting them grow keeps the mosaic aligned rather than breaking
it.

**The tile spans tile a 4-wide x 3-tall block EXACTLY** (2 + 1 + 1x2 + 1 + 2 + 2 + 2 =
twelve cells). That is the whole reason the sub-1280 layout can drop the card to its own
row and reuse the spans untouched on a four-column grid. **Changing one shape breaks both
layouts.**

**The strip is sourced from the live `/about/our-community/` page, names and URLs both**,
and rendered alphabetically from a derived `ORGANIZATIONS` constant — the source array
stays in the board's order so it is diffable against the board and the live page. Fifteen
names, not the board's sixteen. Every URL was requested and returns 200.

- ⚠️ **Tuberous Sclerosis Alliance is UNLINKED** — the live page names it in running text
  without a link, and `tsalliance.org` would be an invented source.
- **Cinema Arts Centre is the one URL rewritten**: the mirror's `/about-us/mission/` now
  404s, so it points at the page that path was reorganised into.
- **Blue Knights and Fighters of Fire link to Facebook**, because that is what the live page
  does — neither has a site of its own.
- Patriot Guard and the Film Expo **answer 406 to a plain `curl` and 200 to a browser**.
  That is a bot filter, not a dead link; do not "fix" them.

**"About the fund" goes to `https://www.reaganjax.memorial/`**, the fund's own site, which
is what the live page links those words to. NOT `/about/our-community/` — the section's own
button already goes there, and a memorial to the founder's grandchildren should not point
at the firm's marketing page.

---

## The FAQ library

**180 documents**, migrated from the LIVE WordPress site. The whole thing runs through two
scripts with a reviewable JSON between them, and that separation is the point:
`scripts/faq-extract.ts` → `scripts/faqs.json` → `scripts/seed-faqs.ts`.

### Where the 180 comes from

128 live pages sit under `/faqs/`. **One is dead** —
`what-to-do-after-a-bus-accident-in-new-yorkas-we-serve` has an empty `content.rendered`
and a slug that is two slugs run together; a working duplicate exists at
`what-to-do-after-a-bus-accident-new-york`. That leaves 127. **Seven of those are
round-ups** bundling 8-13 questions under headings, each split into its own documents,
which turns 7 into 60. **127 − 7 + 60 = 180.**

### ⚠️ The mirror is NOT the source. The live REST API is.

`~/Downloads/Cohen & Jaffe/Sitesucker/faqs/index.html` lists **no** FAQs: the live hub
renders its list over AJAX, so SiteSucker captured an empty `<div>`. The mirror is also a
page behind. `GET /wp-json/wp/v2/pages?parent=3025` is the source, and it carries the
category on each record.

(For the community strip the mirror IS the source — that page is static HTML and complete.
Which source is right depends on whether the live page renders its content over AJAX.)

### ⚠️ Five source hazards, all measured, all silent

Each of these corrupts a naive migration without erroring:

1. **Page 1 of the REST response is not valid JSON** — 132 bytes of stray Elementor markup
   before the array, so `res.json()` throws. Page 2 is clean.
2. **`.common-content` returns nothing on 5 of 128.** Four use an older template where the
   body sits as bare siblings after the form; a fallback of "everything from the first
   `<h2>`" recovers them. And **120 of the other 123 split the answer across TWO widgets** —
   taking only the first drops most of the body on nearly every page.
3. **The author bio and Gravity Form markup leak** into four answers.
4. **`<b>` outnumbers `<strong>` 255 to 196**, and `<i>` beats `<em>` 22 to 9.
5. **1,456 `<span>`s**, 654 of them `font-weight: 400` — a Word artifact. Unwrap, never
   convert to a mark. One page (`is-new-york-a-no-fault-state`) also has **leaked AI-chat
   UI markup** pasted into its body.

### What makes the extractor trustworthy

- A **round-trip check** fails any FAQ that loses more than 2% of its text in conversion.
- **Deterministic keys** (a per-document counter, not `randomKey`), so a re-run against
  unchanged source is byte-identical and `git diff` answers "did the source change?".
- **Assertions on the source shape** — 130 children, 18 populated terms — so a change
  upstream fails loudly rather than migrating a different corpus.
- A **tag audit** that refuses anything outside the allowed set, because block-tools drops
  an unknown tag without a word.

### Decisions recorded in `scripts/seed-faqs.ts`

- **Three pages had no category** and `category` is required. `who-is-liable-for-a-slip-and-fall-accident`
  → Slip and Fall Injury. `what-to-do-after-a-bus-accident-new-york` → Personal Injury,
  because the taxonomy has no bus or transit term and Car Accidents would be wrong on the
  facts.
- **One carried two** (`who-may-be-liable-in-a-blind-spot-accident`). The lower term id
  wins — Car Accidents. Deterministic rather than guessed.
- ⚠️ **25 IMAGES WERE DROPPED, and the reason matters.** They looked like infographics and
  are old-theme decoration: "info icon", "justice scales", a picture of a download button.
  An `image` member was added to `richText` for them and **taken back out**; its docblock
  records the attempt so nobody repeats it.
- ⚠️ **110 hardcoded `tel:` links are migrated verbatim** inside the answers. This breaks
  the house rule that phone numbers live in Site Settings, 110 times. Rewriting them means
  editing legal copy, which is not a migration's call — but **the day that number changes,
  these will not follow.** The list is in `faqs.json` → `review.telLinkTargets`.
- **Six near-duplicate groups flagged, none merged**, including two pairs inside
  `birth-injury-faqs` itself.
- **Twelve titles are not questions** ("10 Mistakes To Avoid After A Car Accident"). They
  work as pages; keep them out of the homepage eight.

### ⚠️ `seed-faqs.ts` is `createOrReplace`

Idempotent against the JSON, and a loaded gun once the Studio has been used — it reverts
every editor fix with nothing to show that it did. Guarded, and `SEED_OVERWRITE=1` forces
it. After the first run, prefer a targeted `patch`.

---

## The FAQ surfaces

### `faq` — four fields and no more

`question`, `slug`, `category`, `answer`. Each is defended in the type's docblock, and so
is each field that is NOT there: no `excerpt` (the homepage takes the answer's opening at
render), no `featured` flag (rule 7 — the homepage's array decides), no `order`
(`menu_order` is 0 on every source page), no SEO fields (`/new-seo-setup` adds those).

⚠️ **`question` is capped at 200, and the first attempt at 90 was wrong.** 90 came from the
128 source page titles, where the longest is 86. But 60 documents come from splitting the
round-ups, and their questions are whole narrated situations — the longest runs **184**.
The cap fired on 16 published questions the moment the seed landed, which is how editors
learn to ignore warnings.

### ⚠️ Every FAQ keeps its live URL, and that is the whole shape

`/faqs/<slug>/` — 120 of the 180 are indexed WordPress URLs the new site continues to
serve. The rejected alternative was collapsing every answer onto `/faqs/` and redirecting
them all, which would have thrown away the long-tail ranking of 127 pages carrying ~5,000
characters each **and broken the 30 links the answers make to one another**. That is why
`faq.slug` is a stored field with no `options.source`: a "Generate" button beside it is an
invitation to rewrite a live URL from a title.

**`vercel.json` holds 9 redirects** — the pre-existing `/case-results/:slug`, the seven
retired round-up URLs → `/faqs/`, and the dead page → its working duplicate.

### `/faqs/` — the hub

A **list of links, not a page of answers**. Rendering all 180 answers inline measured
**895 KB uncompressed / 179 KB brotli / ~9,200 nodes** — 3.3× the homepage, on a page with
no images. It is 200 KB as built.

⚠️ **THE FILTER WORKS WITH JAVASCRIPT OFF, AND THE CAP IS WHAT MUST NOT.** Two mechanisms
compose: nineteen visually-hidden radios plus generated CSS do the filtering; the script
adds only the 16-at-a-time cap, the "View more" button and the entry animation. **The cap
is scoped to a `data-paged` attribute only the script sets** — in plain CSS a visitor
without JavaScript would see 16 cards and no way to reach the other 164, and a crawler
would follow 16 links instead of 180.

⚠️ **`.faq-more[hidden]` IS NOT REDUNDANT.** The reset's `[hidden] { display: none }` and
`.faq-more`'s own `display: flex` have the same specificity, so source order decides — and
without the explicit rule the button stayed on screen with nothing left to reveal, while
`more.hidden` read `true` the whole time. `CaseResults.astro` documents the same trap.
**Check the computed value, not the property.**

⚠️ **The nineteen radios are `position: fixed; top: 0; left: 0`.** As `absolute` they
collapse to one point and clicking a pill throws the page to the top — the documented 440px
bug the practice-areas rail hit with seven.

Other notes: the category rail is one row that scrolls **inside the container**, not to the
page edge, sorted **alphabetically** (not by count — a count sort reshuffles the rail every
time the collection changes; the community strip is sorted for the same reason). The grid
is 4 / 2 / 1 across, skipping three columns because **16 divides by 4, 2 and 1** and a
three-across fold strands a card at every batch boundary. There is **one count, in the
pills** — the header count was removed because two numbers disagreed for a moment on every
filter change.

### `/faqs/<slug>/` — the detail pages

⚠️ **NO ARTBOARD DRAWS THIS PAGE.** `CJ - FAQ.dc.html` is the hub only. It is built from
**`CJ - Blog Post.dc.html`**, the approved treatment for long-form on this site and the same
shape — meta row, serif title, body column, 460px rail. **That derivation has been
approved, but it is a reasoned choice between two boards, not a board.**

The question is the `<h1>`, so the answer's own H2s sit correctly beneath it. The meta
description is the answer's first paragraph — ⚠️ **skipping headings AND list items**,
because four fallback-extracted pages open on an `<h2>` and a list item is a `normal` block
with a `listItem` (that one described `is-new-york-a-no-fault-state` by a "Key Takeaways"
bullet).

### The homepage FAQ band

Eight `<details>` rows opening to an **excerpt** plus a link to the answer's own page —
not the whole answer, which runs to a median of 16 paragraphs.

**Four departures from the board, all deliberate:** no category pills (eight hand-picked
items across an eighteen-term taxonomy gives a pill row where most pills filter to one
row); no count line; **no video card** (there is no FAQ video, and eight rows showing the
one placeholder under "Video answer" would be eight false claims on legal advertising); and
the excerpt instead of the full answer.

⚠️ **THE BAND HAS NO ROUTE TO THE HUB.** Cutting the pills took the count line with it, so
the only outbound links are the eight rows. A "See all 180 questions →" where the count was
would fix it — **raised, not built.**

⚠️ **`CaseBanner` sits directly above it** saying "Not sure if you have a case? / Free case
review", and the closing panel says "Still have a question about your own situation? / Ask
an attorney directly". Two calls to action ~900px apart making the same offer. Both are on
the approved board. **Still worth looking at side by side.**

---

## The contact form — built, NOT WIRED

`src/components/ContactForm.astro`, shared, with its copy in **Site Settings → Contact
Form** (`contactSection`).

⚠️⚠️ **IT DOES NOT SUBMIT ANYWHERE. `ENDPOINT` IS `null`.** On a valid submission it says
so and hands over the phone number rather than pretending. **There is no optimistic success
state, deliberately** — a form that silently swallows an injured person's case description
is the one outcome that must never ship.

Wiring it needs three things, none decided:

1. **A destination.** On this static build the route is a Vercel Function at
   `/api/contact`, which works alongside a static build without adding `@astrojs/vercel`.
   Where it forwards — the firm's intake CRM, or an email provider — is the client's call.
2. **The server-side honeypot check.** A `company` honeypot is in place and the client
   handler drops a filled one, but that is the free half. **The server must check it too.**
3. Nothing else: the thank-you redirect already points at `/thank-you/`.

The phone mask (`src/scripts/phoneMask.ts`) and the strict phone/email `pattern`s are
ported from the sibling **Dormer Harpring** site. ⚠️ **The form is `novalidate`, so those
`pattern`s never fire** — the JS rules are what run, and the two must stay identical or a
number the mask just typed gets rejected as malformed.

---

## Existing sections — the load-bearing notes

Everything below is settled and shipped. What is kept is what a session would otherwise get
wrong.

**The attorneys band** — a REWORK; the artboard is no longer its reference. No script
signature, no card blurb, no carousel, three partners not six, no staff portraits. ⚠️
`attorneys[]` is `.required().length(3)` at **error** severity on the client's instruction.
⚠️ **`seed-attorneys.ts` MUST NEVER BE RE-RUN** — it is `createOrReplace` and the three
partners' roles have been edited in the Studio since. (Stephen M. Cohen is **Founding
Partner** there; the live site says only "Partner". The Studio is the current truth.)

**Case results** — `featuredCaseResult` (4, fabricated artboard copy) and `caseResult` (60,
real). ⚠️ **The four featured ones must be replaced with genuine client stories before
launch.**

**The deadlines band** — every word is a statement of New York law; provenance in
`scripts/seed-home-deadlines.ts`. ⚠️ It carries no disclaimer and **leans on the
practice-areas band directly above it** — reordering those two leaves bare legal deadlines
unqualified.

**The testimonials band** — ⚠️ **22 of the 25 reviews are placeholder copy** and nothing in
the dataset marks them. Three are real (Howard, Menache R., Patty R.). ⚠️ The band has no
disclaimer and **the FOOTER instance is what covers it** — if that is ever made conditional
or dropped, this band needs its own again.

**"Why Cohen & Jaffe"** — ⚠️ "A caseload we keep small on purpose" is **unsourced**, and the
Jaffe medic line was **corrected** away from the board's invented "still works a weekly
shift". Do not restore the board's wording.

**The practice areas band** — the tabs are radio buttons with **no JavaScript**. ⚠️ The
seven callouts are statements of New York law; the artboard's seven pull quotes were all
invented and credited to Jaffe, and are **not** on the page.

**"Our goals"** — ⚠️ its pull quote is the artboard's **invented** line attributed to
Richard Jaffe.

---

## What is wired

Every homepage section EXCEPT the community band reads from `homePage` through
`HOME_PAGE_QUERY`. Seven queries total: `HOME_PAGE_QUERY`, `FIRM_DETAILS_QUERY`,
`FAQS_QUERY`, `FAQ_INDEX_QUERY`, `FAQS_PAGE_QUERY`, `CONTACT_SECTION_QUERY`,
`THANK_YOU_PAGE_QUERY`.

**Desk shape:** **Pages** → { Homepage, FAQs, Thank You } · **Collections** → { Case
Results → { Featured, Case Results }, Reviews → { Video, Written }, Attorneys, Practice
Areas, FAQs } · **Site Settings** → { Firm Details, Contact Form }.

⚠️ Two rules in `structure.ts`, neither of which fails loudly: anything listed explicitly
must also be in `LISTED` or the Studio shows it twice; any singleton must be in
`SINGLETONS` or the Studio offers a "create new" beside it.

**Reused rather than reinvented:** the FAQs page's four claims are the shared `stat`, and
its quote is `attorneyQuote` — so the attribution is a **reference** to
`attorney-richard-jaffe`. ⚠️ **That reuse costs the quote its gold middle clause**, because
`attorneyQuote` deliberately has no `accent` field.

**Site-wide rules:**
- ⚠️ **An arrow never goes inside a `.btn`.** The arrow is a text link's affordance; a
  button already says it goes somewhere with its whole shape. `.btn .arrow { display:
  none }` is a guard, not the fix — take it out of the markup.
- ⚠️ **An underlined link containing an arrow must not be a flex container.** An underline
  on the `<a>` is propagated and **cannot be cancelled from inside** — `text-decoration:
  none` on the arrow does nothing. What normally saves it is that `.arrow` is an atomic
  inline; as a flex item it takes the underline as its own.
- **`.toggle`** — the disclosure control, promoted out of `About.astro`, with
  `details::details-content` carrying the open/close animation for every `<details>`.

---

## Open questions / waiting on the user

1. ⚠️ **The contact form has no destination**, and **`/thank-you/` is not `noindex`.** An
   indexed thank-you page turns up in search for people who never submitted anything and
   corrupts the conversion numbers the firm's spend is measured against. **Neither may
   launch as-is.**
2. ⚠️ **The community band needs seven photographs.** They are the section's entire visual
   weight and it cannot be approved without them.
3. ⚠️ **"A promise Stephen made to his grandchildren."** is the board's heading on the
   community card and appears in no source. Everything else on that card checks out against
   the live page — the fund, 2014, the purpose, "founding partner". The promise does not.
   It is a narrative claim about a real bereavement on legal advertising.
4. **The community strip is 442px tall over 14 lines at 375px** — 28% of the section, for a
   supporting detail. Left as built on the client's instruction; the cheap fix is dropping
   its line-height below 768.
5. **Two community links go to Facebook** (Blue Knights, Fighters of Fire) because the live
   page has no other target for them.
6. **The FAQs page quote is unsourced** and attributed to Richard Jaffe on legal
   advertising. Now a Studio edit rather than a deploy. Same for **"Our goals"**.
7. **"Millions / Recovered"** on the FAQs claims band has no figure behind it. The ledger
   holds 60 real recoveries if the firm would rather print a number.
8. **The 110 `tel:` links** baked into FAQ answers.
9. **Should any FAQ categories be combined?** Raised and left open. The rail mixes three
   kinds of thing — how it happened (Car, Truck, Slip and Fall), what was injured (Brain,
   Neck, Birth), and which department (Personal Injury, Employment Law). The two defensible
   merges are Slip and Fall Injury → Premises Liability and Neck Injuries (1) → Personal
   Injury. **"Personal Injury" is functionally "everything else"** and might be better named
   "General". Cheap to change: it is a dropdown value plus one line in `faqCategories.ts`.
10. **Google Business Profile API access** — a client action, 3-10 business days. Nothing
    started.
11. **Real reviews** for the 22 placeholders, and **real client videos** for all four
    `videoReview` documents.
12. **Case results needs real names, quotes, photographs and insurer-offer figures.**
13. **Two attorneys carry a placeholder video** (`c6b0eghb5r`, on Cohen and Jaffe). A play
    button over a named attorney's portrait is a promise the video is of that attorney.
    **Unset or replace before launch.**
14. **Nine practice-area URLs need confirming live.**
15. **The Spanish section is deferred** — background in `navigation.ts`. ⚠️ The contact
    form's "contact me in Spanish" checkbox is a different thing (a preference, not a
    language switcher) and **presumes someone acts on it**.
16. **The firm's wrongful-death page lists "grief" as recoverable**, which New York does
    not allow.

## What's next

1. **Approve the community band, then model it** — and push `hp_community`.
2. **Four homepage sections remain unbuilt**: the blog band, contact, recognition and
   "Areas we serve", in the board's order.
3. **`/about/our-community/`** — the community band's button points at it and it does not
   exist yet, so that link 404s locally. `CJ - Community.dc.html` and
   `CJ - Community Involvement.dc.html` are both drawn.
4. **`/about/testimonials/`** — `CJ - Testimonials.dc.html` is approved, `caseType` exists
   for it, and the "Read all reviews" button already points at it.
5. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — both boards approved, and
   the homepage band's "View Profile →" links already point at the second. ⚠️ **McNaughton
   and Sawicki have neither a hotspot nor a crop**, and the same square that cut Jaffe and
   Tiger will cut them.
6. **`/practice-areas/`** and **`/case-results/`**.
7. **Wire the contact form**, and give `/thank-you/` its `noindex`.
8. Then a **`video`** type once the Wistia uploads exist, and **set `site` in
   `astro.config.mjs`** so `Layout.astro` emits a canonical link.

## Things that would surprise someone

- ⚠️ **A SEED PATCHES THE PUBLISHED DOCUMENT; THE STUDIO SHOWS THE DRAFT.** If an
  unpublished draft exists when a seed runs, the content is invisible in the Studio while
  the SITE renders it correctly — and publishing that draft then discards it. **And the
  obvious check does not see it:** `sanity documents query` defaults to an api-version whose
  perspective excludes drafts. Use `npx sanity documents get drafts.<id>`.
- ⚠️ **A Sanity document id must NEVER contain a dot** (non-public — the Studio and CLI show
  healthy documents while the site dereferences every one to null) **or a slash** (invalid).
- ⚠️ **A BARE `<ul>` STILL HAS BULLETS.** The reset does not strip `list-style`, and making
  the list a flex container does NOT drop the markers — blockification leaves a `list-item`
  a `list-item`. The community strip shipped a disc in front of every name for an hour.
  ⚠️ **And it survives the obvious measurement:** an `outside` marker paints beyond the li's
  border box, so comparing the text's left edge to the li's reports 0 whether or not a
  bullet is there. Read `list-style-type` and `display` instead.
- ⚠️ **A SEPARATOR DRAWN WITH `li + li::before` ORPHANS ON EVERY WRAPPED LINE.** A flex item
  carries its own pseudo-element, so the middot travels to the FRONT of whatever line its
  name wraps onto. Draw it `::after` on all but the last, where it is glued to the name it
  follows. Invisible until the row wraps — it looked correct on the first render.
- ⚠️ **`global.css` HAS A COMPLETE FORM SYSTEM, and `.field` is the INPUT, not a wrapper.**
  Using `.field` on a wrapper div turns it into a 60px white box with the label sitting on
  it and the input overflowing into the row below. The set is `.field`, `.field-label`,
  `.field-error`, and `.field[aria-invalid="true"]` for the invalid ring.
- ⚠️ **`.field` is a LIGHT ISLAND.** It keeps a white ground inside a dark panel, but
  `.on-dark` flips `--faint` to a near-white cream for the copy around it — and the
  placeholder is drawn in `--faint`. Every placeholder on the first dark-panel form was
  rendered, correct in the DOM, and painted cream on white. The field restores the light
  value for its own subtree.
- ⚠️ **A full-bleed photo band's scrim cannot be a fixed gradient.** The stop that clears
  the copy column on a 1660px board sits in the middle of the copy at 375px. The thank-you
  hero and the homepage hero both **stack** below their breakpoint — picture above, copy
  beneath — because a scrim heavy enough to hold copy over a photograph hides the
  photograph. There is no third answer.
- **A shallow full-bleed band wants a ratio near 2:1** and a subject spread across the frame
  rather than gathered in it. Seven candidates were rendered under the quote band's scrim
  before `team-street` (2.01:1) was chosen; a 3.37:1 frame crops to a black strip and a
  square one loses most of itself.
- ⚠️ **`aspect-ratio` plus `max-height` shrinks the WIDTH**, and **a fixed grid row plus a
  narrowing column overflows**. Both are the same shape of bug: a size that is derived
  rather than set. Size the axis that matters directly, or give the row a `minmax(_, auto)`.
- ⚠️ **IN A HIDDEN BROWSER PANE:** the page cannot scroll, `requestAnimationFrame` never
  fires, transitions never advance, and **`innerWidth` can be 0** — which makes every height
  reading nonsense (a FAQ row measured "10,615px tall"). Force an explicit viewport with
  `resize_window` first. **Paint-only computed styles also read one interaction stale**,
  while layout-affecting ones update; a `background-color` can lag while `display` is
  current. To see a section that is far down the page, hide its previous siblings rather
  than scrolling.
- ⚠️ **A SCREENSHOT SCALED TO THE PANE HIDES 13px TYPE.** A 1660px viewport in an 800px pane
  is a 48% reduction, and a stray bullet, a doubled separator or a wrong glyph is simply not
  legible. Set the viewport near the pane's own width when checking micro-type.
- **Lazy images do not paint before the first screenshot in that pane.** Two captures, or
  set `loading = "eager"`.
- **A running dev server can serve a STALE scoped-CSS module** while the file on disk is
  correct. `touch` the component and reload.
- **`--measure` NO LONGER EXISTS.** Use `--container-prose` (790px).
- **Never put a `//` comment inside a `defineQuery` template** — typegen silently
  regenerates with 0 queries. It currently reports **7 queries and 55 schema types**.
- **Typegen counts an auto-generated `<type>.reference` per referenced document type**, not
  per reference. Check `schema.json` before predicting a count.
- **A dereferenced reference array (`refs[]->`) comes back in the array's own order**, so no
  by-index restore is needed. GROQ's `in` does not.
- **`options: { collapsible }` does not exist on array fields** — use a fieldset.
- **A `cd` in one Bash call leaks into parallel calls in the same shell.** Use absolute
  paths.
- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.**
- **A dev server is usually already running on port 4321 and it is the user's.** Only 4321
  and the Vercel URL are registered Sanity CORS origins, so do NOT move the port.
- **`public/` ships verbatim.** Staging comparison images there and forgetting them adds
  tens of megabytes to a deploy.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — edit `AGENTS.md`.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**.
  ⚠️ `/faqs/` is the one page that will need a second look at `/page-speed` time, and
  `/new-seo-setup` is what gives `/thank-you/` its `noindex`.
