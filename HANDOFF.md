# Handoff — Cohen & Jaffe

**Rewritten whole each time. This is the present state, not a changelog.**
Last updated: 2026-09-01

## Where things stand

The scaffold now has a **design system and a working shell**. `global.css` carries every
token, `Layout.astro` wraps nav + footer, and the whole IA from the live WordPress site is
in the tree as typed data. What is still missing is *pages* — there is one placeholder
home page whose only job is to give the chrome somewhere to live.

The next session builds real pages from the artboards.

- **Branch: `design_system`.** The design system and shell are **committed but NOT pushed**
  — `origin/design_system` is still at `f0d3c54` and `origin/master` at `09bcdfe`, so none
  of this is on any remote yet. `AGENTS.md` says "work on `master` unless asked otherwise";
  that is overtaken — `design_system` is current.
- Verified after every change: `npm run build` green, `npm run check:types` **0 errors**.

## What landed on `design_system`

All finished and verified, committed locally, **not pushed**:

`src/styles/global.css`, `src/layouts/Layout.astro`,
`src/components/{Nav,MobileNav,Footer}.astro`, `src/data/navigation.ts`, `src/lib/urls.ts`,
`src/assets/logo-{dark,white}.png`, a rewritten `src/pages/index.astro`, and the `AGENTS.md`
sections that document them.

**1. The design system.** Tokens extracted from the artboards by frequency, not by eye, so
`--fs-42` really is the 42px the designs use. Type is fluid 375px → 1660px; verified at
both ends. Sizes **above** 16px clamp; 16px and below are fixed. All motion is
`0.5s cubic-bezier(0.17, 0.66, 0.34, 0.98)`, which **overrides** the artboards' `.15s ease`.
Content gutter ramps 20px → **100px**. **Gradients are banned on buttons** — they cannot
cross-fade to a flat hover colour, so the fill snaps and the curve is wasted.

**2. The shell.** `Layout.astro` (head + nav + `<main id="main">` + footer), a desktop bar
with one dropdown style, a **fixed drill-down mobile drawer** (`MobileNav.astro`), and the
four-column footer. 69 unique internal links in the built page, **every one
slash-terminated**. Verified at 1280 / 1279 / 768 / 375 — no overlap, no clipping, no page
overflow at any of them.

**3. The IA.** `src/data/navigation.ts` holds 54 nav links + footer columns + office
details, parsed from the live nav in the `Sitesucker/` mirror with every href checked
against that page's own `og:url`.

## Decisions made, and why

- **Breakpoints are ours, not the designs'.** The artboards are fixed `min-width:1660px`
  boards with no `@media` rules and no mobile counterparts. Established
  `sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1660`; documented in `:root` as a comment and
  repeated as literals in the media queries, because custom properties don't work in
  `@media`. Since type and spacing already ramp via `clamp()`, the queries handle structure
  only.
- **The header bar has its own gutter and its own breakpoint, and this is forced, not
  preferred.** The artboard's bar fills 1660px edge to edge with *zero* gutter, so it
  cannot also carry the content column's 100px gutter — it was silently compressing the nav
  until it slid under the phone number (a bug that predated the gutter change and was
  masked by flex shrinking). **Seven things now ramp together from 1280px to 1920px** —
  header gutter, outer gap, nav gap, nav label size, logo height, phone size, CTA width.
  At 1280px they are at their minimums and the bar clears with ~58px either side; at
  1920px all are back to artboard values and the bar aligns with content. Below 1280px it
  becomes the drawer. **Changing any one ramp moves that limit — re-measure first.**
- **Top-level order is the client's** (About, Practice Areas, Areas We Serve, Case Results,
  Resources, Contact) and matches neither the live site nor the artboard.
- **Dropdown children hover with a gold wash, not an underline.** Rows carry their own
  padding and radius; `--space-4` between them guarantees two fills never touch.
- **"En Español" is removed from the build.** Deferred on request along with the Spanish
  section. When it returns it belongs in the 24/7 utility cluster, not the nav row — that
  costs ~120px the bar does not have. Background kept as a comment in `navigation.ts`.
- **Dropdown cards are lifted 20px into the bar** (`top: calc(100% - 20px)`). Nav links are
  centred in a 104px bar, so its lower half left ~39px of dead space above each card and
  the card read as detached; now 19px, measured. That gap is *outside* the card — trimming
  card padding does nothing to it, which is what made a first attempt at this a no-op.
- **The mobile drawer is a port of the sibling Cogdell Law site's**, in Cohen & Jaffe's
  brand: a fixed right-side drawer whose levels are drill-down panels sliding over each
  other, not accordions. Dark forest surface (client's choice) using the existing `.on-dark`
  utility. Full-bleed below 480px, 380px above. Lives in its own `MobileNav.astro`, which
  took ~300 lines back out of `Nav.astro`.
  Three defects in the Cogdell original were fixed rather than copied: panels resetting
  mid-close, no resize guard, and no focus containment. Details in `AGENTS.md`.
- **Drawer panels have no "overview" rows.** The row that opens a panel is itself a link,
  so the section page is one tap away in the level above. `footerLink` ("All Practice
  Areas") is now desktop-only — the drawer ignores it. Verified nothing is orphaned.
- **A tap-to-call icon sits beside the hamburger below 1280px.** The contact cluster is
  hidden there, and the phone is the firm's primary conversion path.
- **One dropdown style, two levels deep.** An anchored card under its trigger; a row with
  children opens a flyout to its right. Only Practice Areas (Personal Injury, Mass
  Torts, Defective Medical Devices) and About (Attorneys) use the second level; every other
  row is a plain link. About has no footer link — the bar's own "About" already goes to
  `/about/` — and the drawer falls back to an "About overview" link because its top row is a
  toggling `<summary>`, not a link. Category rows with no page of their own render as
  `<button>` so they stay keyboard-reachable. A full-width mega variant existed briefly and
  was removed on request.
- **Arrows animate site-wide.** `<span class="arrow" aria-hidden="true">→</span>` slides
  0.25em on hover and keyboard focus. A convention for page content, not just the nav.
- **Top-level nav follows the artboard, dropdown contents follow live.** The artboard leads
  with Practice Areas and calls it that; live leads with About and calls it "Personal
  Injury". The artboard never draws an open menu, so all dropdown content is live's.
- **Fonts still load from the Google CDN**, matching the artboards. `/page-speed` decides
  at launch whether to self-host.
- **No React.** The dropdowns are CSS `:hover` / `:focus-within`, the mobile sub-menus are
  native `<details>`. The only script in the site is the drawer's open/close.

## Open questions / waiting on the user

1. **The Spanish section is deferred.** "En Español" is out of the build. When it comes
   back, `/es/` is **not** a mirror of the English site: 17 pages with a fully translated
   menu whose links all point back at *English* pages, none of those 17 pages in it, and
   machine-translated place names ("Bahía de Ostras" for Oyster Bay, "Yo Resbalo" for
   Islip, "Playa Larga" for Long Beach). Needs a client decision before rebuilding —
   porting that menu as-is would carry the mistranslations over.
2. **Mobile layout is partly unreviewed.** The drawer itself now follows an approved
   pattern (Cogdell) with client-chosen colours, but the collapse points and the footer
   reflow are still reasonable defaults rather than approved designs.
   Also note the drawer always opens at the root panel — it does not auto-drill to the
   section you are currently on. Cogdell behaves the same way; seeding the stack from
   `pathname` would change that if wanted.
3. **Two live-nav links point at pages absent from the mirror** —
   `/medical-device-lawyer-long-island/` and `/personal-injury-lawyer-nassau-county/`. Both
   are written as absolute paths in the live nav, exactly how SiteSucker leaves a link it
   never downloaded. Confirm they still resolve before launch.
4. **0.5s on nav dropdowns may be too slow.** The house curve is applied everywhere as
   instructed; on a hover menu it is noticeably languid. Easy to except if you want it.

A new Sanity CORS origin **will** be needed for the eventual custom domain — with
credentials, or that origin's `/admin` hangs on a spinner.

## What's next

1. Build the homepage from `Cohen & Jaffe Homepage v1.dc.html`, then interior pages.
2. Add content types to `src/sanity/schemaTypes/index.ts` (still empty), then
   `npm run typegen`. `src/data/navigation.ts` is the seam the nav/footer swap through.
3. Set `Astro.site` in `astro.config.mjs` — `Layout.astro` already emits a canonical link,
   but only when `site` is configured. It currently isn't, so no canonical is being written.

## Things that would surprise someone

- **`localhost:4321/admin` 404s — use `localhost:4321/admin/`.** Astro's dev server doesn't
  redirect the unslashed form. Production is fine (Vercel 301s it).

  ⚠️ **That Vercel redirect is configured but still NOT verified.** The `design_system`
  preview sits behind Deployment Protection and `master` doesn't carry the setting.
  **Check `curl -sI https://cohen-jaffe.vercel.app/admin` returns a 301 once this branch
  merges.**
- **A dev server is already running on port 4321** and it is the user's, from their IDE.
  Use it; don't start a second.
- **The closed drawer is deliberately not `visibility: hidden`.** It is translated
  off-screen and `inert`, with its shadow faded to transparent. Hiding it breaks focus:
  a hidden element cannot be focused, so opening the drawer left focus outside the dialog.
  "Tidying" this back to `visibility` reintroduces that bug silently.
- **The drawer must stay a sibling of `<header>`.** Moving it inside traps the fixed
  positioning in the header's stacking context.
- **`--gutter-header` being smaller than `--gutter` looks like an oversight. It is not.**
  See "Decisions" above — the bar cannot carry the content gutter until 1920px. Likewise
  `.nav { flex: none }` is deliberate: it makes a future overflow break visibly at the
  breakpoint instead of silently overlapping the phone number.
- **The dropdown panel's scroll cap is conditional and must stay that way.** `overflow` on
  a panel that has flyouts clips them; only flat panels get `--scroll`.
- **A `scrollWidth` reading on the nav list over-reports by ~80px.** The dropdown panels
  are absolutely positioned inside the `<li>`s and count toward it. Measure link rectangles
  against the contact cluster to check for real overlap, not `scrollWidth`.
- The Astro **dev toolbar** throws `504 (Outdated Optimize Dep)` in the console. It is the
  toolbar only — every page resource is 200. `rm -rf node_modules/.vite .astro` clears it.
- `CLAUDE.md` is a **symlink to `AGENTS.md`** — writing through the symlink is refused.
- The Studio login card leans on a **scoped CSS hook into Sanity's internal DOM** (in
  `EliteMark.tsx`). Cosmetic, degrades gracefully, worth a glance after a Sanity upgrade.
- `/new-seo-setup`, `/studio-polish ux` and `/page-speed` remain **deliberately deferred**
  to near-launch — they audit real pages and content.
