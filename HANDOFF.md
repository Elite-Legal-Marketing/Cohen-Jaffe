# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-01

## Where things stand

The design system and the site shell are **built, merged to `master`, and live in
production**. What is still missing is *pages*: there is one placeholder home page whose
only job is to give the nav and footer somewhere to live.

The next session builds real pages from the artboards.

- `origin/master` is at **`3047266`** (merge of PR #3 from `design_system`).
  `design_system` is fully merged — 0 commits ahead — so it can be deleted or reused.
- ⚠️ **Local `master` is behind 6.** Start with `git checkout master && git pull`, or you
  will branch off a stale base.
- Verified in production after the merge: `/` 200, `/admin/` 200, and the new nav, the
  drill-down drawer and the call icon are all present in the deployed HTML.

## What's in the build

**Design system** — `src/styles/global.css`. Tokens extracted from the approved `.dc.html`
artboards by frequency, named for their artboard value so `--fs-42` really is the design's
42px. Type is fluid 375px → 1660px; above 16px clamps, 16px and below is fixed. All motion
is `0.5s cubic-bezier(0.17, 0.66, 0.34, 0.98)`, overriding the artboards' `.15s ease`.
Gradients are banned on buttons. Content gutter ramps 20px → 100px.

**Shell** — `Layout.astro` (head + nav + `<main id="main">` + footer), `Nav.astro` (desktop
bar, one dropdown style, two levels deep), `MobileNav.astro` (fixed right-side drill-down
drawer, ported from the sibling Cogdell Law site), `Footer.astro` (four columns on the
forest gradient).

**IA** — `src/data/navigation.ts`: nav tree, footer columns and office details, parsed from
the live WordPress nav in the `Sitesucker/` mirror with every href checked against that
page's own `og:url`. **This file is the seam Sanity takes over later** — swap the constants
for a GROQ query returning the same shapes and no component changes.

## Decisions worth not re-litigating

- **Breakpoints are ours, not the designs'.** The artboards are fixed `min-width:1660px`
  boards with no `@media` rules and no mobile counterparts. `sm 480 · md 768 · lg 1024 ·
  xl 1280 · 2xl 1660`, documented in `:root` and repeated as literals in the media queries.
- **The header bar has its own gutter (`--gutter-header`) and its own breakpoint (1280px),
  and this is forced, not preferred.** The artboard's bar fills 1660px edge to edge with
  *zero* gutter, so it cannot also carry the content column's 100px gutter — it was
  silently compressing the nav until it slid under the phone number. Seven properties ramp
  together from 1280px to 1920px. **Changing any one moves the fit limit — re-measure.**
- **The mobile drawer is a Cogdell port**, in Cohen & Jaffe's brand: drill-down panels, not
  accordions; dark forest surface via the existing `.on-dark` utility; full-bleed below
  480px. Three defects in the Cogdell original were fixed rather than copied — panels
  resetting mid-close, no resize guard, no focus containment.
- **Top-level nav order is the client's** and matches neither the live site nor the
  artboard: About, Practice Areas, Areas We Serve, Case Results, Resources, Contact.
- **Drawer panels carry no "overview" rows.** The row that opens a panel is itself a link,
  so the section page is one tap away in the level above. `footerLink` is desktop-only.
- **Fonts still load from the Google CDN.** `/page-speed` decides at launch whether to
  self-host.
- **No React.** Desktop dropdowns are CSS `:hover`/`:focus-within`; the only script on the
  site is the drawer's open/close.

## Open questions / waiting on the user

1. **The Spanish section is deferred.** "En Español" is out of the build. `/es/` exists on
   the live site but is **not** a mirror: 17 pages, a fully translated menu whose links all
   point back at *English* pages, none of those 17 pages in it, and machine-translated
   place names ("Bahía de Ostras" for Oyster Bay, "Yo Resbalo" for Islip, "Playa Larga" for
   Long Beach). Needs a client decision before rebuilding — porting that menu as-is carries
   the mistranslations over. Background is kept as a comment in `navigation.ts`.
2. **Mobile is partly unreviewed.** The drawer follows an approved pattern with
   client-chosen colours, but the collapse points and the footer reflow are still
   reasonable defaults, not approved designs.
3. **Two live-nav links point at pages absent from the mirror** —
   `/medical-device-lawyer-long-island/` and `/personal-injury-lawyer-nassau-county/`. Both
   are written as absolute paths in the live nav, exactly how SiteSucker leaves a link it
   never downloaded. Confirm they still resolve before launch.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with
credentials, or that origin's `/admin` hangs on a spinner.

## What's next

1. Build the homepage from `Cohen & Jaffe Homepage v1.dc.html`, then interior pages.
2. Add content types to `src/sanity/schemaTypes/index.ts` (still empty), then
   `npm run typegen`.
3. **Set `site` in `astro.config.mjs`.** `Layout.astro` already emits a canonical link, but
   only when `Astro.site` is configured — it currently is not, so no canonical is written.

## Things that would surprise someone

- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.** Astro's dev server does
  not redirect the unslashed form. **Production is confirmed fine: `/admin` returns a
  308 to `/admin/`** (verified against the live deploy — a 308, not the 301 this file
  previously predicted). That long-standing open item is now closed.
- **A dev server is usually already running on port 4321** and it is the user's, from their
  IDE. Use it; don't start a second.
- **The mobile drawer must stay a sibling of `<header>`.** Moving it inside traps the fixed
  positioning in the header's stacking context.
- **The closed drawer is deliberately not `visibility: hidden`** — it is translated
  off-screen and `inert`, with its shadow faded to transparent. A hidden element cannot
  take focus, so hiding it left focus outside the dialog on open. Reverting this
  reintroduces that bug silently.
- **`--gutter-header` being smaller than `--gutter` is deliberate.** So is
  `.nav { flex: none }` — it makes a future overflow break visibly at the breakpoint
  instead of silently overlapping the phone number.
- **CSS transitions do not advance, and `requestAnimationFrame` never fires, while the
  browser pane is hidden.** Reading a transitioned property mid-flight proves nothing; set
  `transition: none`, toggle the class, and read the target value instead.
- **`:focus` and `:focus-within` misreport when the browser window isn't focused** —
  `document.hasFocus()` is false and focus styles don't paint. Click into the page first.
- **A `scrollWidth` reading on the nav list over-reports by ~80px** — the dropdown panels
  are absolutely positioned inside the `<li>`s and count toward it.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- The Studio login card leans on a **scoped CSS hook into Sanity's internal DOM** (in
  `EliteMark.tsx`). Cosmetic, degrades gracefully, worth a glance after a Sanity upgrade.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**
  to near-launch — they audit real pages and content.
