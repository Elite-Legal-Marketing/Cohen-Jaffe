# Cohen & Jaffe — agent guide

> **Read `HANDOFF.md` first.** This file holds the durable rules; `HANDOFF.md` holds the
> current state (branch, what's in flight, open questions). `HANDOFF.md` is NOT
> auto-loaded into a session, so open it explicitly before doing anything.

Marketing site for the law firm **Cohen & Jaffe**, built by Elite Legal Marketing.
Migrating off WordPress.

## Stack

- **Astro 7** (`output: "static"`), TypeScript strict.
- **Sanity 6** headless CMS, **embedded** in the Astro app — the Studio is served at
  `/admin` via `studioBasePath`. There is no separate Studio project: ONE `npm run dev`
  runs both the site and the Studio.
- **React** is installed only to host the embedded Studio. Prefer `.astro` components
  for site UI; reach for React only when a component genuinely needs client state.
- **Vercel** for hosting. **No Vercel adapter** — the default static build is correct,
  and the embedded Studio prerenders fine as a static SPA. Only add `@astrojs/vercel`
  if the site later moves to SSR.

## Commands

```bash
npm run dev          # site + Studio on http://localhost:4321  (Studio at /admin/ — slash required)
npm run build        # production build — a gate; must be green before pushing
npm run check:types  # astro check; the OTHER gate — astro build does NOT typecheck
npm run typegen      # regenerate sanity.types.ts after any schema change
npm run preview      # serve the built dist/
```

Both gates must pass. They catch different things, and neither catches the Studio actually
rendering — for that, load `/admin/` in a browser. See "URLs: trailing slash" for why
that slash matters locally.

## Where things live

| Path | What |
| --- | --- |
| `astro.config.mjs` | Astro + Sanity + React integrations, `inlineStylesheets` |
| `sanity.config.ts` | Studio config: title, brand icon, theme, schema, plugins |
| `sanity.cli.ts` | Sanity CLI config — powers `typegen` and `npx sanity exec` |
| `src/sanity/sanity.types.ts` | **Generated** by `npm run typegen` — never hand-edit |
| `src/sanity/schema.json` | **Generated** schema snapshot — never hand-edit |
| `vercel.json` | Framework pin (`astro`) + `trailingSlash` |
| `src/sanity/schemaTypes/index.ts` | The schema array — register every new type here |
| `src/sanity/structure.ts` | The desk: Pages / Collections / Site Settings, and the singletons |
| `src/sanity/theme.ts` | Elite brand theme, locked to light |
| `src/sanity/eliteTheme.js` | Generated Themer palette (do not hand-edit) |
| `src/sanity/eliteTheme.d.ts` | Precise types for the above — why it's narrow is in the file |
| `src/sanity/components/EliteMark.tsx` | ELITE emblem + login-card CSS |
| `src/styles/global.css` | **The design system** — tokens, reset, layout + component primitives |
| `src/layouts/Layout.astro` | The shell — `<head>`, nav, `<main id="main">`, footer |
| `src/components/Nav.astro` | Header: logo, dropdown menus, contact cluster, hamburger, call icon |
| `src/components/MobileNav.astro` | **The mobile drawer** — drill-down panels, its own CSS + script |
| `src/components/Footer.astro` | Four-column footer on the forest gradient |
| `src/data/navigation.ts` | **Nav + footer architecture and every URL** — the Sanity seam |
| `src/lib/urls.ts` | `isCurrent` / `isWithin` — comparison-only URL helpers |
| `src/assets/` | Images that go through Astro's pipeline (the two logos) |
| `src/pages/` | Routes |
| `.claude/launch.json` | Dev-server config for the preview tooling |

## Where designs and content come from

Both live outside the repo, in `~/Downloads/Cohen & Jaffe/` (a configured additional
working directory):

- **`Claude Files/`** — the approved page designs as `.dc.html` design-canvas artboards
  (`CJ - About.dc.html`, `Cohen & Jaffe Homepage v1.dc.html`, shared `CJNav` / `CJFooter`
  / `CJContactForm`, plus `assets/`, `screens/`, `screenshots/`). These are the source of
  truth for layout — build pages from them, don't invent layouts.
- **`Claude Files/CLAUDE.md`** — firm-specific content notes (e.g. the community
  involvement list). Reference it; do not copy it wholesale into pages, and note that it
  marks some content as "do NOT add unless asked".
- **`Sitesucker/`** — a full local mirror of the current WordPress site (~217 URL
  folders). This is the content and URL source for the migration: it's where existing
  copy, page inventory, and the live URL structure come from. Preserve those URLs, or
  plan redirects, when the new site goes up.

## Navigation

`src/data/navigation.ts` holds the whole IA — primary nav, footer columns, office
details — as plain typed constants. **This is the seam where Sanity takes over:** swap the
constants for a GROQ query returning the same shapes and no component changes.

The **architecture** (which items exist, what nests under what, every URL) was parsed out
of the live WordPress nav in the `Sitesucker/` mirror, and every href was checked against
that page's own `og:url`. These are the already-indexed URLs — changing one is a redirect
to write, not a free edit. The **presentation** — the "Practice Areas" label where live says "Personal Injury" —
comes from the artboards. The **top-level order** (About, Practice Areas, Areas We Serve,
Case Results, Resources, Contact) is the client's, and matches neither source.

Rendering rules, ours — the artboards only ever draw the collapsed "▾":
- **One dropdown style only:** an anchored card under its trigger. (A full-width mega
  variant existed briefly and was removed — don't reintroduce it.)
- **Two levels, maximum.** A row with `children` opens a flyout to its right. Only
  Practice Areas (three categories) and About (Attorneys) use the second level; every other
  row is a plain link.
- **A menu whose top-level item already links to its own page gets no `footerLink`** — About
  does not, because "About" in the bar goes to `/about/`. On mobile the drawer's top row is a
  `<summary>` that toggles rather than navigates, so the component falls back to an
  "<label> overview" link automatically when `footerLink` is absent. Don't remove that
  fallback: without it `/about/` is unreachable from the drawer.
- **A row without `href` is a category** ("Mass Torts", "Defective Medical Devices") — the
  live site renders those as `href="#"` headings and inventing URLs for them would be worse. They render as
  a `<button>`, not a `<span>`, so Tab reaches them and `:focus-within` opens the flyout.
- **Only flat panels get `--scroll`.** `overflow` on a panel that has flyouts clips them
  instead of letting them escape, so the max-height cap is applied conditionally
  (`hasFlyouts()` in the component). Areas We Serve is the one that needs it.
- Panels are always in the DOM and revealed with CSS `:hover` / `:focus-within`, so every
  link stays crawlable and keyboard-reachable with no JS. The only script is the mobile
  drawer's open/close.
- The card is capped at `100vh - nav-height` and scrolls: Practice Areas is 17 links plus
  three headings.
- **A centred eyebrow has no dash.** Use `.eyebrow--center` over a centred heading: the dash
  is drawn to the left of the text and reads as a stray mark once the text is centred.
  `.eyebrow--bare` is the other dashless case, for a label that does not open a section.
- **Any link or button ending in an arrow animates it.** Wrap the glyph in
  `<span class="arrow" aria-hidden="true">→</span>` and `global.css` slides it 0.25em on
  hover *and* on keyboard focus (`.arrow--back` for a `←`). Sized in `em` so it scales with
  its type; reduced-motion is already handled globally. This is a site-wide convention, not
  a nav one — use it in page content too.
- **Child rows hover with a gold wash (`--gold-wash`), not an underline.** Each row carries
  its own padding and radius so the fill extends past the text, the card's padding is small
  and even, and `--space-4` between rows guarantees two fills can never touch. Adding
  vertical rhythm here means increasing that gap, never removing it.
- **The panel is `top: calc(100% - var(--nav-panel-lift))`, not `top: 100%`.** Nav links
  are centred in a 104px bar, so the bar's own lower half left ~39px of dead space between
  a label and its card and the card read as detached. The lift halves that to ~19px and
  tucks the card under the bar, which also removes any hover gap to cross. Note this gap
  is *outside* the card — trimming the card's padding does not touch it.

### The mobile drawer

Below 1280px the bar is replaced by **`MobileNav.astro`** — a fixed right-side drawer with
**drill-down panels**, ported from the sibling Cogdell Law site. It is not an accordion:
every level is a separate `<ul>` absolutely positioned in the same box, all parked at
`translateX(100%)` except `root`, and drilling slides a child panel *over* its parent. A
`stack` of panel ids in the script is the entire state model. The bar's title swaps to the
current panel and a back chevron appears below root.

Five things about it are load-bearing:

- **It must be a SIBLING of `<header>`, never a child.** `.site-header` is
  `position: relative; z-index: var(--z-header)`, which creates a stacking context that
  would trap a fixed drawer at z-index 100. As a sibling it uses `--z-overlay` for the
  scrim and `--z-modal` for the drawer.
- **The closed drawer is NOT `visibility: hidden`** — only translated off-screen and
  `inert`. A hidden element cannot take focus, so focusing the close button on open was a
  silent no-op that stranded focus outside the dialog; worse, a `visibility` transition
  only resolves on an animation frame, so no amount of style-flushing fixes it. `inert` is
  what makes it non-interactive; the box-shadow is **faded** rather than hidden so it does
  not bleed over the page.
- **Focus containment is `inert` on every other child of `<body>`**, not a hand-rolled Tab
  trap. It must be lifted *before* focus returns to the toggle, or that call lands on an
  inert element and does nothing.
- **Panels reset on `transitionend`**, not a fixed timeout. (Cogdell uses a 300ms timeout
  against a 500ms transition, so its panels visibly snap back mid-close.) A 600ms timer is
  kept only as a fallback.
- **Leaving the breakpoint while open is guarded twice**, on `matchMedia` *change* and on
  `resize`. If it is missed the page is left inert AND scroll-locked with the toggle
  hidden — nothing on screen can recover it. Hold the MediaQueryList in a variable; an
  unreferenced one can be garbage-collected along with its listener.

Scroll lock is `body.drawer-open { overflow: hidden }` in `global.css`, not an inline
style. The drawer always opens at the root panel — it does not auto-drill to the current
section.

**Panels carry no "overview" row.** Every row that opens a panel is itself a link, so the
section's own page is always one tap away in the level above — a row inside the panel would
just duplicate it. `footerLink` in `navigation.ts` is therefore desktop-only; the drawer
ignores it.

A **tap-to-call icon** (`.header-call`) sits next to the hamburger below 1280px, because
the whole contact cluster is hidden there and the phone is the firm's primary conversion
path.

**The header bar has its own gutter, `--gutter-header`, and it is not a mistake.** The
artboard's bar fills 1660px edge to edge with *zero* gutter, so it cannot also fit the
content column's 100px gutter — it silently compressed the nav until it slid under the
phone number. So **seven things in the bar ramp together from 1280px to 1920px**: the
header gutter (24 → 100px), the outer gap (12 → 32px), the nav gap (10 → 20px), the nav
label size (13 → 15px), the logo height (44 → 52px), the phone size (22 → 26px) and the
CTA width (160 → 250px). At 1280px they sit at their minimums and the bar clears with ~58px
either side; at 1920px they are all back to the artboard's values and the bar finally
aligns with the content column.

**Below 1280px the bar becomes the drawer.** Changing any one of those seven ramps moves
that limit — re-measure before touching the breakpoint. `.nav` is `flex: none` on purpose:
if the bar ever stops fitting it should break visibly at the breakpoint rather than
quietly overlap again.

## Building sections: build it, approve it, then wire it

Decided 2026-09-01, replacing the usual build-everything-then-integrate order, and refined
straight after the hero: **build the section with its content hardcoded, get the design
signed off, and only then model it in Sanity.** Modelling a section that is still moving
means reshaping the schema and re-seeding the document for every visual change.

Write the hardcoded content as a single constant shaped the way the query will project it,
so wiring is a swap from that constant to a prop rather than a rewrite.

Each section is still finished — built, approved, modelled, seeded, verified — before the
next one starts, so modelling problems surface at section one rather than section twelve. It paid for itself immediately:
the `@sanity/icons` export mismatch and the hero scrim's percentage stops both surfaced on
the first section.

- Content is authored **straight into the `production` dataset** (client's call), so the
  "never publish test content" note above is relaxed for this phase — but only for real
  migrated copy, never throwaway text.
- The homepage is a **singleton** (`homePage`), one named field per section, with
  collections that recur elsewhere (attorneys, practice areas, case results) becoming their
  own document types that sections reference.
- After ANY schema change: `npm run typegen`, then `npx sanity documents validate --yes`
  to confirm existing content still satisfies the schema.
- **The hero carries two photographs, not one crop.** `image` is the wide desktop shot;
  `imageNarrow` is a squarer frame for phones, because the wide one loses its subjects at
  that width. Below 900px the hero also **stacks** — picture above, copy below — so text is
  never laid over anyone's face. A `<picture>` element does the swap.

## Sanity conventions — apply these without asking

Settled 2026-09-01. These are the house rules for every schema and every section from here
on; they exist so setup can move fast without a decision each time.

1. **Fixed pages live under a "Pages" folder** in the desk, not at the root beside
   collections. `src/sanity/structure.ts`. Collections and site settings come after a
   divider.
2. **Every section is a collapsible field, collapsed by default** —
   `options: { collapsible: true, collapsed: true }` on the section object. The homepage
   alone has fifteen sections; an always-expanded form is unusable.
   ⚠️ That option only exists on `ObjectOptions`. An **array** section cannot take it and
   TypeScript rejects it — give the document a **fieldset** instead
   (`fieldsets: [{ name, options: { collapsible, collapsed } }]` + `fieldset: "name"` on the
   field). Same accordion, and it avoids burying the items inside a wrapper object.
3. **More than one paragraph ⇒ Portable Text.** Use the shared `richText` type, never a
   `text` field. Single-paragraph copy (a hero's supporting line, a card blurb) stays
   `string`/`text`. `richText` is deliberately narrow — no H1, so an editor cannot put a
   second `<h1>` on a page.
4. **Buttons are an array of `ctaLink`, not named `primaryCta`/`secondaryCta` fields.**
   It reads better in the Studio and the cap is per-section
   (`rule.max(2).warning(...)` on the hero). Order carries the styling: first is the
   gold button, second the light one — so the component reads the index, not a field name.
5. **Images: in Sanity or in code?** In Sanity **only if someone interacts with the
   image** — a card, an attorney portrait, anything an editor swaps as part of the content.
   **Large decorative art lives in the repo** (`src/assets/`), rendered through
   `astro:assets`. It fingerprints, converts to WebP and generates the srcset at build
   time: the hero photographs went from 2.87 MB PNGs to ~102 KB, with no CDN round trip and
   nothing for an editor to break.
6. **`.required()` is only for a field EVERY document genuinely has.** A field the source
   content supplies for some documents and not others is optional, and the component
   renders nothing when it is empty. `featuredCaseResult` went the other way on the
   client's instruction and the cost is now permanent: the 60 real ledger results can never
   be promoted without someone inventing four fields each. `attorney` is the corrective —
   six required fields out of nineteen, because bar admissions, honors and quotes are
   simply absent from the live site for most of the six. An empty credentials card renders
   as nothing; a guessed one is a false claim about a real person.
7. **A collection gets ONE document type unless the two uses are different CONTENT.**
   Case results needed two because a featured card carries a client interview, a portrait,
   a quote and an insurer's offer that the ledger entry has never had. An attorney is the
   same person on every page, so `attorney` is one type and each section picks who appears
   with an ordered array of references — no `featured` flag, no second type, nothing to
   drift. Ordering and grouping (partners vs associates) are properties of the *section*,
   not of the person.

8. **A quote attributed to a person is a `reference` to that person, never typed-in text.**
   The section owns the words; the attorney document owns the name, role and portrait. That
   is what stops a homepage quote carrying a title the bio page has since corrected, and it
   is why `attorneyQuote` exists as a shared object rather than three sets of loose fields.
   The reverse also holds: the quote TEXT belongs to the section, not to the attorney — an
   attorney's own `quote` field is the one line that represents them site-wide, and reusing
   it per section prints the same sentence twice on one page.
9. **Site-wide facts live in Site Settings, not on the section that happens to show one.**
   The bar is "appears in more than one place": the phone number is in the header, the
   drawer, the footer and the fee explainer, so it is a Firm Details field and every consumer
   reads it through `getFirm()`. A field with one consumer belongs on that consumer.
   Navigation is the deliberate exception — it is indexed IA, not settings.

Three mechanical notes that follow from these:
- **A slug may hold a multi-segment live path.** The WordPress practice-area pages sit at the
  root (`/long-island-car-accident-lawyer/`) or one level down (`/birth-injury/cerebral-palsy/`),
  so `practiceArea.slug` stores the path without its surrounding slashes, slash included, and
  `practiceAreaHref()` in `src/lib/practiceAreas.ts` adds them back. Such a slug field gets NO
  `options.source` — Sanity's default slugify turns the `/` into a hyphen — and the document
  **id** replaces `/` with `-` (`practice-area-birth-injury-cerebral-palsy`), because an id
  may contain neither a slash nor a dot.
- Project **`_key`** on every array in a GROQ query. It is the render key and the handle
  Visual Editing uses for click-to-edit.
- **Never put a `//` comment inside a `defineQuery` template.** Typegen stops finding the
  query entirely and silently regenerates with `0 queries`, leaving stale result types.
  Put the comment above the export.

## The Spanish section — deferred, not forgotten

The artboard's **"En Español"** control has been removed from the build on request. The
live site does have a Spanish section at `https://www.cohenjaffe.com/es/`, so this will
come back — but **it is not a mirror of the English site.** It is 17 pages, with a fully
translated menu whose links all point back at *English* pages; none of those 17 pages
appear in it. Several of its place names are machine-translated ("Bahía de Ostras" for
Oyster Bay, "Yo Resbalo" for Islip, "Playa Larga" for Long Beach, "Babilonia" for Babylon).
Do not port that menu as-is — the Spanish IA needs a client decision first. The background
is kept as a comment at the top of `src/data/navigation.ts`.

Note the header currently has **no** room for a language control in the nav row (it costs
~120px the bar does not have); when it returns it belongs in the 24/7 utility cluster.

Two live-nav links point at pages **absent from the mirror** — `/medical-device-lawyer-long-island/`
and `/personal-injury-lawyer-nassau-county/`. Both are written as absolute paths in the
live nav, which is exactly how SiteSucker leaves a link it never downloaded. Confirm they
still resolve before launch.

## URLs: trailing slash — ALWAYS

Settled 2026-09-01 from evidence, not preference: all 2262 unique `og:url` values in the
WordPress mirror end in `/`, and the live site 301s the unslashed form to the slashed one.
Match what is already indexed.

Three layers must agree, and they are already set:
- `astro.config.mjs` → `trailingSlash: "always"`
- `vercel.json` → `"trailingSlash": true`
- `canonicalize()` in the SEO layer, when `/new-seo-setup` adds it

Keep the **comparison** form (nav active-state) separate from the **canonical** form. On a
sibling site, normalising for display changed what links matched and silently removed
`aria-current` from every nav item on every page, with no error anywhere.

⚠️ **In dev, `localhost:4321/admin` now 404s — use `localhost:4321/admin/`.** Astro's dev
server does not redirect the unslashed form; it just 404s. Production is fine because
Vercel's `trailingSlash: true` redirects — **measured as a 308, not a 301** (verified
2026-09-01 against the production deploy). This catches everyone once: a 404 on `/admin`
locally is almost always the missing slash, not a broken Studio.

Also applies to any form `action`: a POST to a path missing its slash earns a 308 that
**re-sends the whole body**.

## Design tokens, breakpoints, layout grid

Established 2026-09-01 and living in **`src/styles/global.css`** — the single source of
truth. Import it once (in `Layout.astro` when that exists) and use the tokens; do not
introduce one-off values.

Every token was extracted from the approved `.dc.html` artboards by frequency, so a design
that says `42px` maps to `--fs-42`, and the mapping stays checkable. Two deliberate
departures from the artboards are marked `DEPARTURE` in the file.

**Type is fluid between 375px and 1660px** (smallest common phone → artboard width).
Verified at both ends: at 1660 every token lands on its exact artboard value; at 375 each
sits on its floor. Floors are `16 + (design − 16) × 0.42`, so everything compresses toward
16px and nothing goes under it.

- `--fs-17` … `--fs-88` are `clamp()`. **`--fs-16` and below are fixed** — already at the
  legibility floor, and clamping them would only shrink them.
- Semantic aliases sit on top: `--fs-hero` (66), `--fs-page-title` (56), `--fs-section`
  (42), `--fs-card-title` (26), `--fs-lead` (19), `--fs-body` (16).

**Line-height and tracking both fall as size rises** — that is the single rule the ramps
follow, and reading the tokens top to bottom the values only ever decrease. The artboards'
own body leading broke it: 16/28, 15/26 and 19/32 were nearly flat across the whole body
range and *inverted* at the small end (15px sat tighter than 16px). Replaced with a graded
ramp — `1.02` at display sizes through `1.6` body to `1.7` at 13-15px. Tracking is
`--ls-display` (-0.02em) at 48px+, `--ls-tight` (-0.01em) at 30-42px, and zero below.

⚠️ **`--lh-flat: 1` is only for text that CANNOT wrap.** Anything that might — eyebrows,
labels, pills, buttons — uses **`--lh-label` (1.35)**, or its two lines collide. Uppercase
tracked micro-type wants *more* leading than its size suggests, because caps are
full-height with no x-height or descender relief. The footer's office pill is the case that
proved it.

**Measure** — `--measure` caps `.prose` at ~68 characters (45-75 is the readable band).
It is **not** in `ch` on purpose: `ch` is the width of the font's "0", and Instrument Sans
sets a wide zero (~0.67em) against an average lowercase advance of ~0.52em, so `68ch`
measured out at 82 characters. The token is calibrated in `rem` instead; re-measure if the
body face changes.

**Margins are part of the component, because the reset zeroes them.** Two elements own
their trailing gap so no consumer has to remember it:
- `h1`-`h6` carry `margin-block-end: 0.5em`. Headings run at line-heights near 1, which
  leaves almost no room under the baseline — without this an h1 sits ~3px off whatever
  follows. Sections that control their own spacing can zero it.
- `.eyebrow` carries `margin-block-end: 1.2em` (18px), the artboards' most common kicker
  gap. It always introduces the heading below it.

**Body text carries no default margin, and that is deliberate** — decided 2026-09-01 after
weighing the alternative. Only `h1`-`h6` and `.eyebrow` own a trailing gap, because a
heading's relationship to the next element is *fixed* (it introduces it) while a
paragraph's is *contextual* (the next sibling might be another paragraph, a card grid, or
the end of the section). Margins on `p`/`ul`/`li` would double against `gap` in every
column-flex component — the nav, footer and drawer alone hold 27 such elements — so the
tax would be a removal line in nearly every component, and a missed removal is a silent
extra 24px rather than an obvious one.

Rhythm comes from **`.prose`** (authored long-form) or **`.stack`** / `--flow` (designed
sections) instead.

➜ **When the Portable Text renderer is built, have it always emit `.prose` on its
wrapper.** That makes editor-authored copy correct structurally, so nobody has to remember
a class — which is the goal a global default would have been reaching for, without the
removal tax.

**Long-form rhythm** — `.prose` spacing is in `em`, so it scales with each element's own
size. A heading takes **more space above than below** (~3:1) so it binds to the section it
introduces rather than floating between two blocks. Measured: 59/49/43px above vs
20/15/15px below, against a 21px paragraph gap. Note the owl selector (`.prose > * + *`)
needs the companion rule that zeroes the top margin after a heading — and that rule must
list **h1 through h6**, not h2 onward, or the first paragraph of a prose block is the one
place the gap silently doubles.

**Typefaces** — Newsreader (all headings, 400; variable `opsz` 6..72, so the range must be
requested from Google Fonts, not a single value), Instrument Sans (body + form fields),
Roboto Condensed (uppercase eyebrows/labels/meta), Oswald (phone numbers, CTA buttons, stat
figures), Mrs Saint Delafield (signature flourish only).

**Motion** — `--transition: 0.5s cubic-bezier(0.17, 0.66, 0.34, 0.98)` on everything unless
a specific element is called out. This is the house standard and **overrides the artboards**,
which animate at `.15s ease`. Name the properties; never `transition: all`.

**Layout** — `.container` is `1660px` wide with `max-width: calc(100% - var(--gutter) * 2)`.
The content gutter ramps **20px → 100px**, and unlike everything else it is anchored at
768px, not 375px: phones want content edge-to-edge and the growth belongs on desktop.
`--gutter-header` is a *separate*, smaller ramp for the nav bar — see "Navigation" for why. `--container-narrow` (1040px) for articles, `--container-prose`
(790px) for a single column of running text. `.section` is `--space-section` (64 → 130px);
`.section--compact` is `--space-section-sm` (52 → 90px) — 90px is the artboards' own
explicit `compactSpacing` variant, not a guess.

**Spacing** — fixed px steps (`--space-4` … `--space-80`) for *inside* a component, where
the artboards use hard pixels that should not drift; fluid steps (`--space-3xs` … `--space-xl`)
for anything separating blocks or sections.

**Dark surfaces flip the palette by inheritance.** Putting `.surface-forest`, `.surface-ink`
or `.on-dark` on a wrapper redefines `--color-text`, `--color-heading`, `--color-link` and
the border tokens for everything nested inside, so components don't restate their colours
per context. Build components against the semantic tokens, not the raw ones, or they will
be unreadable on dark sections.

⚠️ **Breakpoints are NOT from the designs.** The artboards are fixed `min-width:1660px`
boards with no `@media` rules and no mobile counterparts, so they describe the desktop end
only. The responsive layer is ours: `sm 500 · md 768 · lg 1024 · xl 1280 · 2xl 1660`.
They are documented in `:root` as a comment and **repeated as literals in the media
queries** — custom properties do not work inside `@media`. The header is the exception: it
swaps to the drawer at **1280px**, a measured fit limit rather than a scale step. Change both or neither.
Because type and spacing already ramp via `clamp()`, the media queries handle structure
only. Confirm mobile layout decisions with the user rather than inferring them.

## Conventions

- **Start blank, add on request.** No example schema types, no extra pages until asked.
- **Every page wraps `Layout.astro`** — props `title`, optional `description`, optional
  `bare` to drop the chrome (thank-you and landing pages). Content lands inside
  `<main id="main">`, which is the skip-link target, so a page must not add its own
  `<main>`. Component CSS goes in a scoped `<style>` block; only genuinely shared
  primitives belong in `global.css`.
- **Never put a gradient on a button.** A gradient cannot cross-fade to a flat hover
  colour — there is no interpolation between the two, so the fill snaps and the 0.5s curve
  is thrown away. Buttons are flat fills only. The artboards do give the hero CTA a gold
  gradient; that is deliberately not carried over.
- **Schema**: follow `defineType` / `defineField` from the `sanity-best-practices` skill.
  Every type gets an `icon` and a `preview` — no row should read "Untitled".
- **Validation**: on design-coupled short strings use `.max(N).warning(...)`, **never
  `.error()`** — publishing fires the deploy hook, and a blocking error over a nitpick
  stops the whole rebuild.
- **Data fetching**: `sanityClient` from `sanity:client` + `defineQuery` from `groq`.
  Portable Text via `astro-portabletext`; images via `@sanity/image-url`.
- **Env**: `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` in `.env` (gitignored).
  Same two must exist in Vercel for all environments **before the first deploy**.

## Gotchas that have already cost time

- **`@sanity/ui` must be pinned at v4 in our own `dependencies`.** `sanity@6.11` needs
  `@sanity/ui@^4` (it imports `@sanity/ui/toast`), but `@sanity/astro` pulls in
  `@sanity/visual-editing`, which depends on `@sanity/ui@3`. npm can hoist the v3 copy to
  the top level, and Vite's dev-time `optimizeDeps` resolves against the hoisted copy —
  which has no `./toast` export. Symptom: **`npm run build` passes but `/admin` is a blank
  black page in dev**, with `504 (Outdated Optimize Dep)` in the console and
  `"./toast" is not exported ... from @sanity/ui` in the dev-server log. The production
  build hides it because it resolves per-importer. Fix: keep the explicit
  `"@sanity/ui": "^4"` dependency, and after any dependency change that reshuffles the
  tree, `rm -rf node_modules/.vite .astro` and restart. Verify with
  `npm ls @sanity/ui` — the top-level entry must be v4.
- **A Sanity document id must NEVER contain a dot.** Sanity treats a dotted `_id`
  as non-public: the document is readable with a token and invisible without one.
  Seeding case results as `caseResult.danny-r` produced a genuinely nasty failure —
  the Studio, `sanity documents query` and `sanity documents validate` all showed
  four healthy documents, while the site's unauthenticated client dereferenced
  every reference to `null` and `npm run build` died on `Cannot read properties of
  null`. Nothing in the error points at the id. Use hyphens (`case-result-danny-r`).
  Diagnose it by hitting the public API without a token:
  `curl "https://<projectId>.api.sanity.io/v2024-01-01/data/query/<dataset>?query=*[_type=='x']{_id}"`
  — an empty result there against a populated CLI result is the tell.
- **Re-uploading the same image file does not orphan an asset.** Sanity dedupes by
  content hash, so `client.assets.upload` returns the existing asset id. Seed
  scripts can be re-run without littering the media library.
- **`.env` is gitignored**, so a Vercel build with missing env vars fails while
  prerendering `/admin` with `Error: Configuration must contain 'projectId'` — and because
  that fails the whole build, **every route 404s**, not just `/admin`. Env-var changes
  alone don't rebuild; trigger a redeploy.
- **Deployed `/admin` stuck on an endless spinner = missing Sanity CORS origin**, not a
  build problem. The Studio ships fine and the page is served; it just can't call
  `https://<projectId>.api.sanity.io/.../users/me` from an origin Sanity doesn't allow.
  The console says so explicitly (`blocked by CORS policy`). Fix in the Sanity dashboard →
  **API → CORS origins** → add the exact origin **with credentials**. Every new
  origin needs its own entry: localhost, the `.vercel.app` URL, and the eventual custom
  domain. Don't go hunting through the build logs for this one.
- **`npx tsc --noEmit` reports ~8 errors** (`Cannot find name 'process'`, `string |
  undefined` on `projectId`/`dataset`, two in `theme.ts`). These are pre-existing and
  shared with the other Elite sites; `astro build` does not run `tsc`, so they are not a
  gate. Don't "fix" them by diverging from the shared brand files. **`npm run build` is
  the gate.**
- **Studio branding uses a scoped CSS hook into Sanity's internal DOM** (in
  `EliteMark.tsx`). It's cosmetic and fails gracefully — the login card reverts to
  Sanity's default inline header if the markup changes. Re-check after major Sanity
  upgrades.
- **`buildLegacyTheme`, `studio.components.logo`, and `studio.components.navbar` are all
  dead ends** for branding in Studio 6. The workspace `icon` + modern `theme` is the path.
  `studio.components.layout` does not wrap the login screen.
- **Phone numbers are stored in DISPLAY form only**; `telHref()` / `smsHref()` in
  `src/lib/phone.ts` derive the link. Storing the pair is two things that can disagree, and
  they did — an editor fixes the visible number and the link keeps dialling the old one,
  with nothing to show for it until someone taps it on a phone.
- Writing through the `CLAUDE.md` symlink is refused — **edit `AGENTS.md`**.

- **A scrim can't be a negative-z-index pseudo-element on the thing it sits behind.**
  Painting order inside a stacking context is: the element's own background, *then*
  negative-z children, *then* its content. So `.mobile-nav::before { z-index: -1 }` dimmed
  the drawer's own cream background while leaving its text crisp — it looked like a broken
  colour token, not a layering bug. The scrim has to be a **sibling** of the drawer. Same
  trap applies to any overlay drawn from inside the element it's meant to sit under.
- **A `<picture>` wrapper needs the size too.** `height: 100%` on the `<img>` inside has
  nothing to resolve against, because `<picture>` is auto-height — so a full-bleed
  photograph stops short and leaves a bar of the section's own background along the bottom.
  Size the `<picture>`, not just the `<img>`.
- **`text-decoration-line` cannot be transitioned**, so an underline that only exists in a
  `:hover` rule pops in no matter what the transition line says. Declare the underline at
  rest with `text-decoration-color: transparent` and animate the COLOUR to `currentColor`
  — colour interpolation is premultiplied, so it fades up from nothing rather than through
  a grey. This bit four links before it was noticed: both phone numbers, `.link-arrow`, and
  the fee band's call line.
- **A responsive override must come AFTER the rule it overrides.** Media queries carry no
  extra specificity, so `@media { .x { … } }` placed above a plain `.x { … }` silently
  loses. A block moved during an edit is the usual cause; the symptom is a mobile value
  that never applies while the layout parts of the same block clearly do.
- **A visually-hidden radio or checkbox must be `position: fixed` with explicit offsets,
  never `position: absolute`.** Clicking a `<label>` focuses its input, and focusing an
  element scrolls it into view — so wherever the input sits is where the page jumps. An
  absolutely-positioned child of a grid container with no offsets resolves to the
  container's padding edge, which stacked all seven practice-area radios on ONE point at
  the top of the tab rail: clicking the sixth tab threw the page back up to the first, by
  440px. `position: fixed; top: 0; left: 0` is always inside the viewport, so there is
  nothing to scroll to, at every breakpoint and for any number of tabs. The offsets are
  not optional — with `top`/`left` auto a fixed box sits at its static position, which is
  the same off-screen point. Applies to any CSS-only tab/accordion built on
  `:checked + label + pane`.
- **Never put a background on an element that is also `.container`.** It is inset by the
  gutter, so the background stops short and whatever sits behind shows in two strips down
  the sides. Put it on the full-width parent.
- **`aspect-ratio` plus `max-height` shrinks the WIDTH.** Once the height clamps, the ratio
  pulls the width in to match it, so a block meant to be full-bleed only fills part of the
  viewport — the hero's picture filled the left half of a 900px screen. Size the height
  directly (`height: min(100vw, 60vh)`) rather than combining the two.
- **CSS transitions do not advance, and `requestAnimationFrame` never fires, while the
  browser pane is hidden.** Computed values of transitioned properties stay frozen at their
  start, so reading one mid-transition proves nothing. To check a transitioned property,
  set `transition: none` on the element, toggle the class, and read the target value.
- **`:focus` and `:focus-within` misreport when the browser window isn't focused.** In an
  automated browser, `document.hasFocus()` is false and `el.matches(':focus')` returns
  false while `.matches(':focus-within')` returns true — and focus styles don't paint.
  Verifying a focus-driven dropdown that way shows it "broken" when it is fine. Click into
  the page first and confirm `document.hasFocus()` before trusting the reading.

## How to verify

1. `npm run build` — must be green. This is the real gate.
2. `npm run dev`, then check the pages you touched at `localhost:4321`.
3. For Studio changes, reload `/admin` and look at the **login card** — the theme, title,
   workspace icon and card layout all render **pre-auth**, so branding is verifiable
   without signing in.
4. **Never publish test content to the production dataset** — it fires the deploy hook.

## Git

- Work on `master` unless asked otherwise; branch before committing if the change is
  substantial.
- Commit and push **only when asked**.
- Deploys: prefer `vercel redeploy <production-url>` over `vercel deploy --prod` —
  redeploy rebuilds from the same git commit, while `deploy --prod` ships the local
  working tree and can silently put uncommitted state into production.

## Maintaining these two docs

> Before pushing — and at the end of a session, even with nothing pushed — rewrite
> `HANDOFF.md`. Rewrite it whole; never append. Update `AGENTS.md` when a *rule* changes,
> not on a schedule.

`HANDOFF.md` is the present, not a changelog — `git log` already covers what happened. A
stale line in it is a wrong line. What earns a place is what the next session would
otherwise get wrong.

## Deferred launch-prep commands

Run these near launch, once real pages and content exist — they intentionally do nothing
useful against a blank scaffold:

- **`/new-seo-setup`** — per-page meta fields, Global SEO Settings singleton with a crawl
  switch, JSON-LD, `sitemap.xml`, `robots.txt`.
- **`/studio-polish ux`** — desk grouping into Pages / Collections / Site Settings, unique
  icons, length caps, preview fixes. (The Elite *branding* half is already applied.)
- **`/page-speed`** — get above 90 on mobile + desktop PageSpeed against a real deploy.
