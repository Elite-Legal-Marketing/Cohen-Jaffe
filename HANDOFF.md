# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-09 (the migration tracker — `scripts/build-inventory.ts`,
`scripts/tracker-template.html` and the published board — on `sitemap_tracking`)

> ## 🗺️ The migration tracker owns state now
>
> **https://claude.ai/code/artifact/132be22d-3167-4080-8b5e-9950dc5fe163**
>
> Every live URL, what happens to it, and the open-items list. **1,658 live URLs;
> 1,527 would 404 at launch.** Rebuild with `npm run inventory`, then republish
> `scripts/tracker.html`.
>
> **This file owns knowledge; the tracker owns state. Nothing belongs in both.**
> That boundary was drawn after this document announced "`hp_community`, four
> commits, NOT PUSHED" in bold, three times — and was contradicted by a merge
> commit **51 seconds later**. It failed structurally, not carelessly: a document
> cannot record its own push. So build status is computed from `dist/` and
> redirect status from `vercel.json`, and nobody can hand-edit either.
>
> **Do not add an open-questions list back to this file.** It lives in the tracker.

## ⚠️ Read this before writing any code

The client's standing instruction, given 2026-09-08 and now rule one under
AGENTS.md → Conventions:

> *"I'm noticing that you are trying to do too much. A lot of fields are being added that
> are unnecessary. Simple is better than complicated. Try to just implement what I ask for.
> If I need more I will ask for it. I'd rather ask for an extra feature than have to go
> through Sanity and turn things off or remove items I never asked for."*

**Build what was asked and nothing beside it. Suggest extras in a sentence; do not build
them and explain afterwards.** When an instruction's scope is ambiguous, **ask before
building, not after.**

**AN APPROVED ARTBOARD IS NOT A SOURCE, AND OFTEN NOT A GOOD DESIGN EITHER.** This is now
the single most expensive lesson on the project. The designer invented copy on at least six
sections, and on `CJ - Community.dc.html` invented *photographs*:

- Pull quotes credited to Richard Jaffe on "Our goals" and the practice-areas band.
- "still works a weekly shift" in "Why Cohen & Jaffe".
- "Cystic Fibrosis Foundation" in the homepage community strip — a named real charity the
  firm has no recorded connection to.
- "Fifty years", "Showing up is not marketing", "free legal clinics", "know your rights"
  guides on the community page — all zero hits across the live site and the 217-page mirror.
- ⚠️ **Four AI-generated photographs** carrying invented signage ("COMMUNITY LEGAL AID",
  "FREE LEGAL RESOURCES · COMMUNITY LAW DAY", a board reading "COMMUNITY LAW PARTNERS"
  which is not the firm's name) and a "Scholarship Certificate" made out to **a person who
  does not exist** over two forged signatures. All four are deleted from the repo.

**Check every named fact and every legible word in an image against the mirror before
building it.** On legal advertising these are not typos. And when a section is built
faithfully and still reads badly, say so — that is what the build-it-then-approve order is
FOR. The attorneys band was built exactly as drawn and the verdict was *"Not in love with
how this is turning out. Not your fault. I don't think the section was designed well by the
designer."*

## Where things stand

**Thirteen of the homepage's SEVENTEEN sections exist and all thirteen are finished** —
hero, stats, case results, "Our goals", the fee explainer, practice areas, the New York
deadlines band, testimonials, the attorneys band, "Why Cohen & Jaffe", the case review
banner, the FAQ band and the community band.

The board draws seventeen real sections between NAV and FOOTER. `MID CTA BAR` (line 576) is
an empty comment with no markup and does not count; `CASE BANNER` is drawn inside the FAQ
block at 621-628 and does. The four still unbuilt are **RESOURCES (the blog band), CONTACT,
RECOGNITION and AREAS WE SERVE** — the board's last four, in that order.

**`src/pages/`** holds `index.astro`, `faqs/index.astro`, `faqs/[slug].astro`,
`thank-you.astro` and `about/our-community.astro` — **185 pages build**, of which 180 are
FAQs. **`src/data/` holds `navigation.ts` alone.**

`hp_community` was merged as PR #21 and is in `master` at `c2f4137`. Current branch is
**`sitemap_tracking`**, which carries the migration tracker.

⚠️ **185 pages is 11% of the job.** The live site publishes **1,658 URLs** and 1,527 of them
have no page and no redirect. That gap is invisible from inside this repo, which is what the
tracker exists to show — check it before estimating anything.

Gates: `npm run build` green at **185 pages**, `npm run check:types` **0 errors (121
files)**, `npm run typegen` **9 queries, 58 schema types**, `npx sanity documents validate
--yes` clean at **348 documents, 0 errors, 0 warnings**.

The 348 are 180 FAQs + 60 case results + 47 practice areas + 21 reviews + **20
organizations** + 6 attorneys + 4 featured case results + 4 video reviews + `homePage` +
`firmDetails` + `faqsPage` + **`communityPage`** + `thankYouPage` + `contactSection`.
(`*[]` returns 371 — the extra 23 are image assets, which validation does not count.)

⚠️ **NOTHING ON EITHER COMMUNITY SURFACE IS HARDCODED ANY MORE.** Both were built, approved
and then modelled, in that order, on 2026-09-09. The homepage band reads
`homePage.community`; the page reads the `communityPage` singleton. The only things in code
are the seven placeholder tiles, which are scaffolding rather than content.

---

## Organizations — one collection, two surfaces

`organization`: **`name`, `href`, `note`. Three fields.** Studio → Collections →
Organizations. Twenty documents, seeded from the LIVE `/about/our-community/` page.

The homepage band prints the names as a run-in strip; `/about/our-community/` sets each
name over its note in three cards. Same documents, two presentations — AGENTS.md rule 7 —
so grouping and ordering belong to the SECTION, not the document.

⚠️ **THE ABSENCES ARE DELIBERATE.** No `category`: the board groups organizations under
"Children & families / Health & awareness / Veterans & first responders", but those labels
were drawn against a DIFFERENT list (the client's own notes, which overlap ours on four
entries), and an arts centre, a film festival and a running club fit none of the three.
No `logo` — twenty logos at twenty aspect ratios is a design problem, not a content one.
No `order`, no `featured`. No `slug`, because an organization is not a page.

⚠️ **`order(lower(name) asc)`, NOT `order(name asc)`.** GROQ's `order()` is CASE-SENSITIVE,
so every capital sorts ahead of every lowercase letter: on a plain sort "CMSA Long Island"
lands between "Blue Knights" and "Center for Developmental Disabilities", because it
compares "M" against "e". It only appears once one name is an acronym, and it reads as
random misfiling rather than a rule. Both surfaces read the one query, so the fix lands in
both.

### The list, and why it is these twenty

**The live page is the source, on the client's instruction (2026-09-09)** — chosen over the
fifteen organizations on `CJ - Community.dc.html`, which come from the client's own content
notes and overlap this list on only FOUR entries.

- ⚠️ **"Cystic Fibrosis Foundation" is NOT here on purpose.** The homepage board lists it
  sixteenth; it appears nowhere on the live page and nowhere in the mirror.
- ⚠️ **Five were added after the first fifteen.** The first pass took its list from the
  homepage board's strip; the live page actually names twenty. Holy Family, CMSA Long
  Island, the All Kids Fair, the Over 50 Fair and the Health & Wellness Fest were simply
  missing, and were carried in the community page's intro prose for one commit before
  moving here. **If that sentence ever comes back, these five must come out of it.**
- ⚠️ **Three have no `href`** — Tuberous Sclerosis Alliance, CMSA Long Island and the Health
  & Wellness Fest. The live page names all three in running text without linking them.
  Guessing a domain would be inventing a source; the components render an unlinked name.
- ⚠️ **Two link to Facebook** (Blue Knights, Fighters of Fire) because that is what the live
  page does — neither has a site of its own. Worth a look if the firm would rather not.
- **One URL is rewritten**: the live Cinema Arts Centre link, `/about-us/mission/`, now
  404s, so it points at the page that path was reorganised into.
- **Two are stored `https://` where the live page writes `http://`** (Hicksville soccer, the
  Film Expo) — both 301, so this saves a redirect.
- ⚠️ **Patriot Guard and the Film Expo answer 406 to a plain `curl`, and Holy Family answers
  403 even with full browser headers.** All three load normally in a real browser. **Bot
  filters, not dead links — do not "fix" them.**
- **Two names are not the live page's exact string:** it types "Friends of Jacklyn" (the
  charity is Friends of Jaclyn, and the URL it links spells it correctly) and "Syosset
  Baseball Assocation" [sic]. The short form "Syosset Baseball" carries neither the typo nor
  a guess at the correction.
- **"Port Jefferson Health & Wellness Fest" names the EVENT, not the Chamber.** The live
  page says the firm promotes the Chamber's Fest; naming the Chamber would widen the claim.

### The three scripts

`scripts/organizations.ts` is **DATA ONLY** and holds the canonical list plus all of the
above. `seed-organizations.ts` is `createOrReplace` and guarded; `add-organizations.ts` is
`createIfNotExists` and only writes documents whose id is missing, so it is safe against a
dataset editors have touched.

⚠️ **THE LIST IS A SEPARATE MODULE FOR A REASON.** `add-organizations.ts` first imported the
seed script directly, and **importing a module with a top-level `main()` runs it** — it
silently executed a `createOrReplace` seed on import. It was harmless only because that
script is guarded.

---

## `/about/our-community/`

Built from `CJ - Community.dc.html`, **minus four of its eight sections**. Four remain:
**hero, intro, organizations, memorial.** The sibling board
`CJ - Community Involvement.dc.html` draws the same page differently and is NOT the
reference.

⚠️ **WHAT WAS CUT, so nobody restores it from the board:**

| Cut | Why |
| --- | --- |
| Photo hero | Interior pages get ONE hero treatment, and it is `/faqs/`'s. |
| Breadcrumb | Removed site-wide **on 2026-09-08** — `/faqs/` records it too. This page reintroduced one from the board by mistake. **There are no breadcrumbs on this site.** |
| Showcase | Claimed "free legal clinics" and printed "know your rights" guides, neither sourced anywhere, over three AI photographs with invented signage. |
| Stats | A THIRD copy of the homepage's four claims. |
| Quote band | Unsourced, attributed to Stephen Cohen. |
| Scholarship band | The contest closed applications 12 June 2026. |

⚠️ **THE SCHOLARSHIP REDIRECT HAS A DEPENDENCY.** `/about/community-scholarship/` now 301s
to this page in `vercel.json`, and the "Scholarship Essay Contest" nav item is gone from
`navigation.ts`. **But the live page still says "Each year".** If a 2027 round opens, the
redirect, the nav item AND the band all come back together — restoring one without the
others is the failure mode. Both files carry the warning.

**The H1 is the live page's H1, verbatim**: "Our Community Focus". The board draws "This is
our neighborhood too." over the kicker "Our community focus"; matching the live H1 means
the URL, the nav item, the footer link, the browser title and the heading all say one thing
instead of four. The board's heading became the hero kicker — "Why we show up" — which is
why the intro has no kicker of its own.

**Every word of the intro is from the live page**, refetched 2026-09-09 and byte-identical
to the mirror. It carries what the three sections below it do not: the firm-level
commitment, and — the best material on the page, which the board ignored entirely —
Richard Jaffe as a volunteer firefighter and medic, coaching, Trial Lawyers Care after 9/11,
and his court arbitration and mediation work. ⚠️ **Paralegal Maria Fiore is a named real
person**; the live page names her, and if she leaves the firm that line goes with her.

**Sections alternate grounds and every one declares its own** (client, 2026-09-09):
forest-deep hero → sand → cream → sand → the footer's forest. `surface-cream` on the causes
band is the page default and therefore redundant; it is written anyway so the alternation
reads off the markup rather than being inferred from what is missing — which is exactly how
the intro and the causes band came to be the same colour. **Inserting a section means
re-checking its two neighbours.**

⚠️ **`.page-hero` IS COPIED FROM `/faqs/`, NOT SHARED.** Two pages now carry those rules
verbatim including the measured `* 1.5` tablet override. The repo's bar for promotion is the
second consumer — `.toggle` came out of `About.astro` at exactly this point — so this
belongs in `global.css`. Not done because it means editing a shipped page. **Raised.**

### How it is modelled

**`communityPage`, a singleton** — Studio → Pages → **Our Community**. Four tabs: Hero,
Intro, Organizations, In memoriam. Seeded by `scripts/seed-community-page.ts`, which
carries the full provenance of every string.

⚠️ **FLAT FIELDS IN TABS, NOT NESTED SECTION OBJECTS.** This follows `faqsPage`, not
`homePage`. Rule 2 wraps every section in a collapsible object because the homepage has
fifteen and an always-expanded form is unusable; this page has four, and three of them
would be single-use object types holding three strings each. Tabs do the same job for TWO
new schema types instead of five. The `intro*` / `orgs*` / `memorial*` prefixes are the
same idiom as `faqsPage`'s `list*`.

⚠️ **`introQuoteBody` IS A SIBLING OF `introQuote`, NOT A FIELD INSIDE IT.** The card shows
a pull quote, a second paragraph, then ONE attribution. `attorneyQuote` is shared with "Our
goals", the fee explainer and the FAQs page — adding a second text field to it for this one
card would put an empty box on all four.

**The attribution is a real reference now (rule 8)**, which deleted the hand-rolled
`COMMUNITY_ATTORNEY_QUERY` that fetched Richard Jaffe by id. It matters here specifically:
the live site calls him "founding partner" in the very sentence this page quotes, while the
Studio has him as Managing Partner. The page renders the Studio's value and so cannot
contradict his own bio.

⚠️ **NO HERO IMAGE FIELD, AND NO SCHOLARSHIP SECTION.** Both absences are decisions, and
both are defended in the type's docblock — a field for an image the design does not render
is a field an editor will fill and then wonder about.

**The memorial links to the fund** (`https://www.reaganjax.memorial/`), the same target and
label the homepage band uses. It described the fund at length with no way to reach it.

**`.memorial__panel` is a three-child, two-row grid** so the pull quote lines up with the
heading rather than the "In memoriam" kicker. `column-gap`, not `gap`: the kicker's own
margin is what sets where row 2 starts for both columns, so it is load-bearing at desktop
width. The intro used to need the same structure and no longer does — its kicker moved to
the hero, so its grid is a plain single row and `align-items: start` aligns the card.

---

## The homepage community band

`src/components/Community.astro`, reading `homePage.community` — a `communitySection`
object, collapsible and collapsed like every other homepage band. Seeded by
`scripts/seed-home-community.ts`.

⚠️ **THE ORGANIZATIONS ARE NOT A FIELD ON IT.** They are the collection, shown in full, so
there is nothing to curate — contrast `faqSection.faqs`, where eight of a hundred and
eighty ARE a choice made on the homepage. **The seven photographs are not a field either,
yet**: modelling seven empty image slots before there is anything to put in them would be
seven fields every editor sees and none of them can fill. It gains a `photos` array when
the firm supplies them.

⚠️ **The card link is a `textLink`, the button is a `ctaLink`** (rule 10) — the type is
picked by how a link is RENDERED, not by whether it is a call to action.

⚠️ **THE SEVEN PHOTOGRAPHS DO NOT EXIST.** They are the section's entire visual weight. The
tiles are scaffolding — one flat `--border-deep` fill, a label, `aria-hidden` — and the
whole `PHOTO_SLOTS` array plus its three CSS rules come OUT when the firm supplies images.
A uniform fill reads as "photos to come" where the board's four subtly different greys read
as a design.

**Grid rows are `minmax(_, auto)`, not the board's fixed 150px** — the card's column narrows
faster than the row height does, and the copy overflows a fixed box by ~30px around 1280.
**The tile spans tile a 4-wide x 3-tall block EXACTLY**, which is why below 1280 the card
takes its own row and the tiles reuse their spans untouched. **Changing one shape breaks
both layouts.**

⚠️ **"A promise Stephen made to his grandchildren." is the board's heading and appears in no
source.** Everything else on that card checks out — the fund, 2014, the purpose, "founding
partner". The promise does not. **Open — but now a Studio edit rather than a deploy, which
is the point of modelling it.**

⚠️ **The strip is 442px tall over 14 lines at 375px** — 28% of the section for a supporting
detail. Left as built on the client's instruction.

---

## The FAQ library

**180 documents**, migrated from the LIVE WordPress site through two scripts with a
reviewable JSON between them: `scripts/faq-extract.ts` → `scripts/faqs.json` →
`scripts/seed-faqs.ts`.

128 live pages sit under `/faqs/`. **One is dead** —
`what-to-do-after-a-bus-accident-in-new-yorkas-we-serve` has an empty `content.rendered`; a
working duplicate exists at `what-to-do-after-a-bus-accident-new-york`. That leaves 127.
**Seven are round-ups** bundling 8-13 questions each, split into their own documents, which
turns 7 into 60. **127 − 7 + 60 = 180.**

### ⚠️ For the FAQs the mirror is NOT the source. The live REST API is.

`Sitesucker/faqs/index.html` lists **no** FAQs: the live hub renders its list over AJAX, so
SiteSucker captured an empty `<div>`. `GET /wp-json/wp/v2/pages?parent=3025` is the source.

**Which source is right depends on whether the live page renders its content over AJAX.**
For the community page the mirror IS complete and correct — that page is static HTML.

### ⚠️ Five source hazards, all measured, all silent

1. **Page 1 of the REST response is not valid JSON** — 132 bytes of stray Elementor markup
   before the array, so `res.json()` throws. Page 2 is clean.
2. **`.common-content` returns nothing on 5 of 128**, and **120 of the other 123 split the
   answer across TWO widgets** — taking only the first drops most of the body on nearly
   every page.
3. **The author bio and Gravity Form markup leak** into four answers.
4. **`<b>` outnumbers `<strong>` 255 to 196**, `<i>` beats `<em>` 22 to 9.
5. **1,456 `<span>`s**, 654 of them `font-weight: 400` — a Word artifact. Unwrap, never
   convert to a mark. One page (`is-new-york-a-no-fault-state`) has **leaked AI-chat UI
   markup** pasted into its body.

### What makes the extractor trustworthy

A **round-trip check** failing any FAQ that loses more than 2% of its text; **deterministic
keys** so a re-run against unchanged source is byte-identical; **assertions on the source
shape** (130 children, 18 populated terms); and a **tag audit**, because block-tools drops
an unknown tag without a word.

### Decisions recorded in `scripts/seed-faqs.ts`

- **Three pages had no category.** `who-is-liable-for-a-slip-and-fall-accident` → Slip and
  Fall Injury. `what-to-do-after-a-bus-accident-new-york` → Personal Injury, because the
  taxonomy has no bus term and Car Accidents would be wrong on the facts.
- **One carried two** (`who-may-be-liable-in-a-blind-spot-accident`). Lower term id wins.
- ⚠️ **25 IMAGES WERE DROPPED** — old-theme decoration ("info icon", "justice scales", a
  picture of a download button). An `image` member was added to `richText` for them and
  **taken back out**; its docblock records the attempt.
- ⚠️ **110 hardcoded `tel:` links are migrated verbatim** inside the answers, breaking the
  house rule 110 times. Rewriting them means editing legal copy. **The day that number
  changes, these will not follow.** List in `faqs.json` → `review.telLinkTargets`.
- **Six near-duplicate groups flagged, none merged.**
- **Twelve titles are not questions.** Keep them out of the homepage eight.

⚠️ **`seed-faqs.ts` is `createOrReplace`** — a loaded gun once the Studio has been used.
Guarded; `SEED_OVERWRITE=1` forces it. Prefer a targeted `patch`.

---

## The FAQ surfaces

### `faq` — four fields and no more

`question`, `slug`, `category`, `answer`. No `excerpt`, no `featured`, no `order`, no SEO
fields — each absence defended in the type's docblock.

⚠️ **`question` is capped at 200, and 90 was wrong.** 90 came from the 128 source titles;
the 60 split out of round-ups are whole narrated situations and the longest runs **184**.
The cap fired on 16 published questions the moment the seed landed.

### ⚠️ Every FAQ keeps its live URL

`/faqs/<slug>/` — 120 of the 180 are indexed WordPress URLs. Collapsing them onto `/faqs/`
would have thrown away the long-tail ranking of 127 pages **and broken the 30 links the
answers make to one another**. That is why `faq.slug` is stored with no `options.source`: a
"Generate" button beside it is an invitation to rewrite a live URL from a title.

**`vercel.json` holds 10 redirects** — `/case-results/:slug`, the seven retired round-ups,
the dead FAQ page, and `/about/community-scholarship/`.

### `/faqs/` — the hub

A **list of links, not a page of answers**. Rendering all 180 inline measured **895 KB
uncompressed / 179 KB brotli / ~9,200 nodes**. It is 200 KB as built.

⚠️ **THE FILTER WORKS WITH JAVASCRIPT OFF, AND THE CAP MUST NOT.** Nineteen visually-hidden
radios plus generated CSS do the filtering; the script adds only the 16-at-a-time cap.
**The cap is scoped to a `data-paged` attribute only the script sets** — in plain CSS a
visitor without JavaScript would see 16 cards and no way to reach the other 164.

⚠️ **`.faq-more[hidden]` IS NOT REDUNDANT.** The reset's `[hidden] { display: none }` and
`.faq-more`'s `display: flex` have the same specificity, so source order decides.
**Check the computed value, not the property.**

⚠️ **The nineteen radios are `position: fixed; top: 0; left: 0`.** As `absolute` they
collapse to one point and clicking a pill throws the page to the top.

The rail sorts **alphabetically**, not by count — a count sort reshuffles it every time the
collection changes. The grid is 4 / 2 / 1, skipping three columns because **16 divides by 4,
2 and 1**. There is **one count, in the pills**.

### `/faqs/<slug>/` — the detail pages

⚠️ **NO ARTBOARD DRAWS THIS PAGE.** Built from **`CJ - Blog Post.dc.html`**, approved, but a
reasoned choice between two boards rather than a board.

The question is the `<h1>`. The meta description is the answer's first paragraph —
⚠️ **skipping headings AND list items**, because four fallback-extracted pages open on an
`<h2>` and a list item is a `normal` block with a `listItem`.

### The homepage FAQ band

Eight `<details>` rows opening to an **excerpt** plus a link — not the whole answer, which
runs to a median of 16 paragraphs. **Four departures from the board:** no category pills, no
count line, **no video card** (there is no FAQ video, and eight rows under "Video answer"
would be eight false claims), and the excerpt.

⚠️ **THE BAND HAS NO ROUTE TO THE HUB.** Cutting the pills took the count line with it. A
"See all 180 questions →" would fix it — **raised, not built.**

⚠️ **`CaseBanner` sits directly above it** making the same offer ~900px away. Both on the
approved board. **Worth looking at side by side.**

---

## The contact form — built, NOT WIRED

`src/components/ContactForm.astro`, copy in **Site Settings → Contact Form**.

⚠️⚠️ **IT DOES NOT SUBMIT ANYWHERE. `ENDPOINT` IS `null`.** On a valid submission it says so
and hands over the phone number. **There is no optimistic success state, deliberately** — a
form that silently swallows an injured person's case description is the one outcome that
must never ship.

Wiring needs: **a destination** (a Vercel Function at `/api/contact` works alongside a
static build; where it forwards is the client's call), and **the server-side honeypot
check** — a `company` honeypot exists and the client handler drops a filled one, but the
server must check it too. The thank-you redirect already points at `/thank-you/`.

⚠️ **The form is `novalidate`, so its `pattern`s never fire** — the JS rules are what run,
and the two must stay identical or a number the mask just typed gets rejected.

---

## Existing sections — the load-bearing notes

**The attorneys band** — a REWORK; the artboard is no longer its reference. ⚠️
`attorneys[]` is `.required().length(3)` at **error** severity on the client's instruction.
⚠️ **`seed-attorneys.ts` MUST NEVER BE RE-RUN** — `createOrReplace`, and the roles have been
edited in the Studio since. (Stephen M. Cohen is **Founding Partner** there; the live site
says only "Partner", and calls Richard Jaffe "founding partner" while the Studio has him as
Managing Partner. **The Studio is the current truth** — which is why the community page
reads the role rather than typing it.)

**Case results** — `featuredCaseResult` (4, fabricated artboard copy) and `caseResult` (60,
real). ⚠️ **The four featured must be replaced with genuine client stories before launch.**

**The deadlines band** — every word is a statement of New York law; provenance in
`scripts/seed-home-deadlines.ts`. ⚠️ No disclaimer; it **leans on the practice-areas band
directly above it**.

**The testimonials band** — ⚠️ **22 of the 25 reviews are placeholder copy** and nothing
marks them. Three are real (Howard, Menache R., Patty R.). ⚠️ **The FOOTER disclaimer is
what covers this band** — if that is ever dropped, this band needs its own.

**"Why Cohen & Jaffe"** — ⚠️ "A caseload we keep small on purpose" is **unsourced**, and the
Jaffe medic line was **corrected** away from the board's invented wording. Do not restore it.

**The practice areas band** — radio-button tabs, **no JavaScript**. ⚠️ The seven callouts
are statements of New York law; the artboard's seven pull quotes were invented and are
**not** on the page.

**"Our goals"** — ⚠️ its pull quote is the artboard's **invented** line attributed to
Richard Jaffe.

---

## What is wired

**Nine queries:** `HOME_PAGE_QUERY`, `FIRM_DETAILS_QUERY`, `FAQS_QUERY`, `FAQ_INDEX_QUERY`,
`FAQS_PAGE_QUERY`, `CONTACT_SECTION_QUERY`, `THANK_YOU_PAGE_QUERY`, `ORGANIZATIONS_QUERY`,
`COMMUNITY_PAGE_QUERY`.

**Desk shape:** **Pages** → { Homepage, FAQs, **Our Community**, Thank You } ·
**Collections** → { Case Results → { Featured, Case Results }, Reviews → { Video, Written },
Attorneys, Practice Areas, FAQs, **Organizations** } · **Site Settings** → { Firm Details,
Contact Form }.

⚠️ Two rules in `structure.ts`, neither of which fails loudly: anything listed explicitly
must also be in `LISTED` or the Studio shows it twice; any singleton must be in `SINGLETONS`
or the Studio offers a "create new" beside it.

**Site-wide rules:**
- ⚠️ **An arrow never goes inside a `.btn`.** `.btn .arrow { display: none }` is a guard,
  not the fix — take it out of the markup.
- ⚠️ **An underlined link containing an arrow must not be a flex container.** The underline
  propagates and **cannot be cancelled from inside**.
- ⚠️ **`text-decoration-line` cannot be transitioned.** Declare the underline at rest with
  `text-decoration-color: transparent` and animate the COLOUR.
- **`.toggle`** — the disclosure control, with `details::details-content` carrying the
  open/close animation for every `<details>`.

---

## Open questions / waiting on the user

**Moved to the tracker** — https://claude.ai/code/artifact/132be22d-3167-4080-8b5e-9950dc5fe163

All 18 of the items that used to sit here are open items there, with their detail intact,
alongside four this survey added: the `/case-results/:slug` redirect that 301s into a 404,
the live canonical loop on the foreign-objects pages, the 46 practice areas with no design,
and the 81 unaccounted-for firm videos.

⚠️ **Do not restore the list here.** Two documents describing the same 22 facts is exactly
the arrangement that let this file claim a merged branch was unpushed. The tracker owns
state; this file owns knowledge.

The three that block launch outright, kept here because they are knowledge rather than
task state:

1. **The contact form has no destination** (`ENDPOINT` is `null`) and **`/thank-you/` is not
   `noindex`**. Neither may launch as-is.
2. **The four featured case results are fabricated artboard copy** and must be replaced with
   genuine client stories.
3. **22 of the 25 reviews are placeholder copy and nothing marks them.** The FOOTER
   disclaimer is what currently covers that band.
## What's next

**Sequenced against the tracker, which shows where the 1,527 unbuilt URLs actually are.**
The homepage sections below are small; the routes underneath them are the job.

1. **A practice-area detail route** — the single largest unblocking win. It clears 47 seeded
   `practiceArea` documents that have no page today and roughly 17 dead nav/footer links at
   once. ⚠️ **But 46 of the 47 have no design** — `CJ - Car Accidents` draws the top-level
   car accidents page only, and a lighter default layout has to be designed first.
2. **Four homepage sections remain unbuilt**: the blog band, contact, recognition and
   "Areas we serve", in the board's order.
3. **`/about/testimonials/`** — `CJ - Testimonials.dc.html` approved, `caseType` exists, and
   the "Read all reviews" button already points at it.
4. **`/about/attorneys/`** and **`/about/attorneys/[slug]/`** — both boards approved, and
   the homepage band's "View Profile →" links already point at the second. ⚠️ **McNaughton
   and Sawicki have neither a hotspot nor a crop.**
5. **`/practice-areas/`** and **`/case-results/`**.
6. **Wire the contact form**, and give `/thank-you/` its `noindex`.
7. Then a **`video`** type once the Wistia uploads exist, and **set `site` in
   `astro.config.mjs`** so `Layout.astro` emits a canonical link.

## Things that would surprise someone

### Astro and CSS

- ⚠️ **ASTRO CAN SILENTLY FAIL TO EXTRACT `Props`**, and `Astro.props` then falls back to
  `Record<string, any>` — the component still builds and renders, it just loses every prop
  type. On `Community.astro` the cause bisected to **one character**: prose in a frontmatter
  comment that Astro read as markup. It is context-dependent, not a blanket ban on angle
  brackets. ⚠️ **The only symptom is downstream** — `Parameter 'x' implicitly has an 'any'
  type` on a map in the template, which invites you to annotate the parameter and accept
  untyped props forever. **Confirm with `const probe: number = <the prop>`**; the error
  names the resolved type, and `Record<string, any>` is the tell. All 20 Props-declaring
  components were swept; no others are affected.
- ⚠️ **SCOPED CSS DOES NOT REACH A CHILD COMPONENT'S OWN MARKUP.** A class passed to a
  component lands on its root element, but that element does not carry the PARENT's scope
  attribute — so a rule written in the parent compiles to `.thing[data-astro-cid-…]` and
  silently matches nothing. Wrap the inner selector in `:global()`. Same family as the
  `Props` failure above: correct-looking code that quietly does nothing.
- ⚠️ **TYPEGEN IS THE BRACE CHECK FOR GROQ.** An unbalanced projection in `queries.ts` fails
  with a character offset and a query count one short — **`8 queries` when nine are written
  is the tell**, and it is easy to read past. A balance sweep over every `defineQuery`
  template finds it faster than the offset does.
- ⚠️ **A RUNNING DEV SERVER SERVES STALE SCOPED CSS, AND IT PRODUCES WRONG MEASUREMENTS.**
  This is worse than the "my edit did not apply" symptom it was first filed under: a
  `getComputedStyle` reading against stale CSS looks like data. A correct, correctly-ordered
  fix measured as still-broken until the file was touched. **`touch` the component and
  reload BEFORE trusting any measurement**, not just when something looks wrong.
- ⚠️ **A BARE `<ul>` STILL HAS BULLETS.** The reset does not strip `list-style`, and making
  the list a flex container does NOT drop the markers — blockification leaves a `list-item`
  a `list-item`. ⚠️ **And it survives the obvious measurement:** an `outside` marker paints
  beyond the li's border box, so comparing the text's left edge to the li's reports 0 either
  way. Read `list-style-type` and `display` instead.
- ⚠️ **A SEPARATOR DRAWN WITH `li + li::before` ORPHANS ON EVERY WRAPPED LINE.** A flex item
  carries its own pseudo-element, so the middot travels to the FRONT of whatever line its
  name wraps onto. Draw it `::after` on all but the last. Invisible until the row wraps.
- ⚠️ **AN IMAGE AS A GRID ITEM SIZES THE ROW.** `height: 100%` has nothing to resolve
  against in an auto row, so it falls back to the intrinsic height — a 560px hero came out
  927px, and `min-height` is a floor so nothing pulled it back. Take the image out of flow.
  Same family as **`aspect-ratio` plus `max-height` shrinking the WIDTH**: a size derived
  from the wrong axis.
- ⚠️ **A MARGIN DOUBLES AGAINST A GRID GAP WHEN A RESPONSIVE LAYOUT COLLAPSES.** A kicker
  whose `margin-block-end` is load-bearing in two columns adds to the row gap in one. Move
  the gap to the element that needs it rather than zeroing the margin, or the tight
  kicker-to-heading pairing goes with it.
- ⚠️ **A RESPONSIVE OVERRIDE MUST COME AFTER THE RULE IT OVERRIDES.** Media queries carry no
  extra specificity.
- ⚠️ **An undefined custom property falls back silently.** `--fs-46` does not exist (the ramp
  steps 42 → 48); a heading using it lands at the inherited size with no error anywhere.
  **Check every token in a new file against `global.css`.**
- ⚠️ **Never put a background on an element that is also `.container`** — it is inset by the
  gutter, so the background stops short.
- ⚠️ **A scrim cannot be a negative-z pseudo-element on the thing it sits behind**, and **a
  full-bleed photo band's scrim cannot be a fixed gradient** — the stop that clears a copy
  column at 1660 sits mid-copy at 375. Heroes **stack** below their breakpoint.
- ⚠️ **A `<picture>` wrapper needs the size too** — `height: 100%` on the inner `<img>` has
  nothing to resolve against.
- ⚠️ **A visually-hidden radio must be `position: fixed` with explicit offsets.**
- **`--measure` NO LONGER EXISTS.** Use `--container-prose` (790px).

### Sanity

- ⚠️ **A SEED PATCHES THE PUBLISHED DOCUMENT; THE STUDIO SHOWS THE DRAFT.** Seed over an
  outstanding draft and the content is invisible in the form while the SITE renders it, and
  publishing the draft then discards it. **The obvious check does not see it:** `sanity
  documents query` defaults to an api-version whose perspective excludes drafts. Use
  `npx sanity documents get drafts.<id>`.
- ⚠️ **A document id must NEVER contain a dot** (non-public — the Studio and CLI show
  healthy documents while the site dereferences every one to null) **or a slash**.
- ⚠️ **GROQ's `order()` IS CASE-SENSITIVE.** Use `order(lower(field) asc)` for anything a
  human reads as alphabetical.
- ⚠️ **IMPORTING A SCRIPT WITH A TOP-LEVEL `main()` RUNS IT.** Keep shared seed data in a
  data-only module.
- **Never put a `//` comment inside a `defineQuery` template** — typegen silently
  regenerates with 0 queries. It currently reports **9 queries and 58 schema types**.
- **Typegen counts an auto-generated `<type>.reference` per referenced document type.**
- **A dereferenced reference array (`refs[]->`) comes back in the array's own order.** GROQ's
  `in` does not.
- **`options: { collapsible }` does not exist on array fields** — use a fieldset.
- **Re-uploading the same image does not orphan an asset** — Sanity dedupes by content hash.

### Environment

- ⚠️ **IN A HIDDEN BROWSER PANE:** the page cannot scroll, `requestAnimationFrame` never
  fires, transitions never advance, and **`innerWidth` can be 0**. Force a viewport with
  `resize_window` first, and **hide a section's previous siblings** rather than scrolling.
- ⚠️ **A SCREENSHOT SCALED TO THE PANE HIDES 13px TYPE.** A 1660px viewport in an 800px pane
  is a 48% reduction — a stray bullet or a doubled separator is simply not legible. Set the
  viewport near the pane's own width when checking micro-type.
- **Lazy images do not paint before the first screenshot in that pane.** Two captures.
- ⚠️ **Some sites answer 403/406 to `curl` and 200 to a browser.** Check a "dead" link in the
  browser pane before removing it.
- **A `cd` in one Bash call leaks into parallel calls in the same shell.** Use absolute
  paths.
- **The design files live outside the repo** in `~/Downloads/Cohen & Jaffe/`.
- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.**
- **A dev server is usually already running on port 4321 and it is the user's.** Only 4321
  and the Vercel URL are registered Sanity CORS origins — do NOT move the port.
- **`public/` ships verbatim.**
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — edit `AGENTS.md`.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**.
  ⚠️ `/faqs/` will need a second look at `/page-speed` time, and `/new-seo-setup` is what
  gives `/thank-you/` its `noindex`.
