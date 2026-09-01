/**
 * Site navigation.
 *
 * The ARCHITECTURE — which items exist, what nests under what, and every URL —
 * is lifted from the live WordPress nav at https://www.cohenjaffe.com/, parsed
 * out of the mirror in ~/Downloads/Cohen & Jaffe/Sitesucker/. Every href below
 * was checked against that page's own `og:url`, so these are the canonical,
 * already-indexed URLs. Preserve them: changing one is a redirect to write, not
 * a free edit.
 *
 * The PRESENTATION — the six top-level items, their order, and the "Practice
 * Areas" label — comes from the approved artboard (`Cohen & Jaffe Homepage
 * v1.dc.html` / `CJNav.dc.html`). Two deliberate differences from live:
 *   1. Live orders it About, Personal Injury, Areas We Serve, …; the artboard
 *      leads with Practice Areas and moves About third.
 *   2. Live calls the practice-area menu "Personal Injury". The artboard calls
 *      it "Practice Areas", which is also where its "All Practice Areas" link
 *      already pointed.
 *
 * Structure inside the dropdowns is ours — the artboard only ever draws the
 * collapsed "▾". Every menu is the same anchored dropdown card. A row that has
 * `children` opens a second-level flyout to its right; two levels is the
 * maximum, deliberately.
 *
 * This file is the seam where Sanity takes over later: swap the constants for a
 * GROQ query returning the same shapes and nothing downstream changes.
 */

export type NavLink = {
  label: string;
  href: string;
};

/**
 * A row inside a dropdown.
 *
 * `href` is optional on purpose. "Mass Torts" and "Defective Medical Devices" are
 * categories, not pages — the live site renders them as `href="#"` headings, and inventing URLs
 * for them would be worse than admitting they have none. A row without `href`
 * renders as a `<button>` so it stays keyboard-reachable and still opens its own
 * submenu; a row with both is a real link that also opens one.
 */
export type NavChild = {
  label: string;
  href?: string;
  children?: NavLink[];
};

export type NavItem = NavLink & {
  children?: NavChild[];
  /** Closing link across the foot of the panel — "All Practice Areas". */
  footerLink?: NavLink;
};

/* -------------------------------------------------------------------------- */
/* Firm contact details — one source, used by nav, footer and forms.           */
/* -------------------------------------------------------------------------- */

export const FIRM = {
  name: "Law Office of Cohen & Jaffe, LLP",
  shortName: "Cohen & Jaffe",
  phone: { display: "516-358-6900", href: "tel:5163586900" },
  sms: { display: "516-400-4967", href: "sms:5164004967" },
  offices: [
    {
      name: "New Hyde Park",
      badge: "New Hyde Park · primary office",
      street: "2001 Marcus Avenue, W295",
      cityStateZip: "New Hyde Park, NY 11042",
      phone: { display: "516-358-6900", href: "tel:5163586900" },
      hours: "Phones answered 24/7 · Office Mon–Fri 9–5",
      directions: "https://www.google.com/maps?cid=67117899491750775",
      map: "https://www.openstreetmap.org/export/embed.html?bbox=-73.7013%2C40.7542%2C-73.6793%2C40.7662&layer=mapnik&marker=40.7602%2C-73.6903",
      href: "/new-hyde-park-office/",
    },
    {
      name: "Jackson Heights",
      badge: "Jackson Heights · by appointment",
      street: "82-11 37th Avenue, Suite LL14",
      cityStateZip: "Jackson Heights, NY 11372",
      phone: { display: "718-280-5337", href: "tel:7182805337" },
      hours: "By appointment · Se habla español",
      directions: "https://www.google.com/maps?cid=11814349000154700354",
      map: "https://www.openstreetmap.org/export/embed.html?bbox=-73.8946%2C40.7429%2C-73.8726%2C40.7549&layer=mapnik&marker=40.7489%2C-73.8836",
      href: "/jackson-heights-office/",
    },
  ],
} as const;

/*
 * NOTE — the artboard's "En Español" control was removed on request; the
 * Spanish section is deferred, not forgotten. The live site does have one at
 * https://www.cohenjaffe.com/es/, but it is NOT a mirror of the English site:
 * 17 pages, with a fully translated menu whose links all point back at ENGLISH
 * pages, and none of those 17 pages appear in it. Several place names are also
 * machine-translated ("Bahía de Ostras" for Oyster Bay, "Yo Resbalo" for Islip,
 * "Playa Larga" for Long Beach). When it comes back, the Spanish IA needs a
 * client decision first — porting that menu as-is carries the errors over.
 */

/* -------------------------------------------------------------------------- */
/* Primary navigation                                                          */
/* -------------------------------------------------------------------------- */

// Order is the client's — it matches neither the live site nor the artboard.
export const PRIMARY_NAV: NavItem[] = [
  {
    label: "About",
    href: "/about/",
    children: [
      // Live nests the attorneys under About > Attorneys, which is exactly this
      // shape. "Attorneys" is a real page, so the row links AND opens a flyout.
      {
        label: "Attorneys",
        href: "/about/attorneys/",
        children: [
          { label: "Stephen M. Cohen", href: "/about/attorneys/stephen-cohen/" },
          { label: "Richard S. Jaffe", href: "/about/attorneys/richard-jaffe/" },
          { label: "Stephen B. Tiger", href: "/about/attorneys/stephen-tiger/" },
          { label: "Caitlin McNaughton", href: "/about/attorneys/caitlin-mcnaughton/" },
          { label: "Katherine Sawicki", href: "/about/attorneys/katherine-sawicki/" },
          { label: "Garrett V. Parnell", href: "/about/attorneys/garrett-parnell/" },
        ],
      },
      // Flat at level 1 — the live site lists these four ungrouped, and the
      // top-level "About" already links to /about/, so no footerLink either.
      { label: "Testimonials", href: "/about/testimonials/" },
      { label: "No Fee Promise", href: "/about/no-fee-promise/" },
      { label: "Letter to Prospective Clients", href: "/about/letter-to-prospective-clients/" },
      { label: "Our Community Focus", href: "/about/our-community/" },
    ],
  },

  {
    // Live label: "Personal Injury". Renamed per the artboard.
    label: "Practice Areas",
    href: "/practice-areas/",
    children: [
      // All three are categories with no page of their own. Live renders the
      // latter two as href="#"; "Personal Injury" pointed at the homepage,
      // which "All Practice Areas" already covers better.
      {
        label: "Personal Injury",
        children: [
          { label: "Car Accidents", href: "/long-island-car-accident-lawyer/" },
          { label: "Motorcycle Accidents", href: "/long-island-motorcycle-accident-lawyer/" },
          { label: "Bicycle Accidents", href: "/long-island-bicycle-accident-lawyer/" },
          { label: "Truck Accidents", href: "/long-island-truck-accident-lawyer/" },
          { label: "Slip and Fall", href: "/long-island-slip-and-fall-lawyer/" },
          { label: "Malpractice", href: "/long-island-medical-malpractice-lawyer/" },
        ],
      },
      {
        label: "Mass Torts",
        children: [
          { label: "Depo-Provera Lawsuit", href: "/depo-provera-lawsuit/" },
          { label: "Hair Relaxer Cancer Lawsuit", href: "/product-liability-lawyer-chemical-hair-relaxer/" },
          { label: "Ozempic Lawsuit", href: "/ozempic-lawsuit/" },
          { label: "Wegovy Lawsuit", href: "/wegovy-lawsuit/" },
          { label: "Mounjaro Lawsuit", href: "/mounjaro-lawsuit/" },
          { label: "Rybelsus Lawsuit", href: "/rybelsus-lawsuit/" },
          { label: "Saxenda Lawsuit", href: "/saxenda-lawsuit/" },
        ],
      },
      {
        label: "Defective Medical Devices",
        children: [
          // NOT in the site mirror — the live nav writes it as an absolute path,
          // which is how SiteSucker leaves links it never downloaded. Confirm
          // this page still exists before launch.
          { label: "Defective Medical Device Lawyer", href: "/medical-device-lawyer-long-island/" },
          { label: "Paragard Lawsuit", href: "/paragard-iud-lawsuit/" },
          { label: "Defective Hernia Mesh Lawyer", href: "/defective-hernia-mesh-lawyer/" },
          { label: "Hip Replacement Lawsuit", href: "/hip-replacement-lawyers/" },
        ],
      },
    ],
    footerLink: { label: "All Practice Areas", href: "/practice-areas/" },
  },

  {
    label: "Areas We Serve",
    href: "/areas-we-serve/",
    // Flat — one level. The live list is 19 towns in no particular order and
    // there is no grouping in it worth inventing.
    children: [
      { label: "Long Island", href: "/" },
      { label: "Queens", href: "/personal-injury-lawyer-queens/" },
      { label: "Hempstead", href: "/areas-we-serve/hempstead-ny/" },
      { label: "Valley Stream", href: "/areas-we-serve/valley-stream-ny/" },
      { label: "Westbury", href: "/areas-we-serve/westbury-ny/" },
      { label: "Glen Oaks", href: "/areas-we-serve/glen-oaks-ny/" },
      { label: "Islip", href: "/areas-we-serve/islip-ny/" },
      { label: "Forest Hills", href: "/areas-we-serve/forest-hills-ny/" },
      { label: "Jamaica", href: "/areas-we-serve/jamaica-ny/" },
      // Also absent from the mirror — verify before launch.
      { label: "Nassau", href: "/personal-injury-lawyer-nassau-county/" },
      { label: "Oyster Bay", href: "/areas-we-serve/oyster-bay-ny/" },
      { label: "Elmhurst", href: "/areas-we-serve/elmhurst-ny/" },
      { label: "Freeport", href: "/areas-we-serve/freeport-ny/" },
      { label: "Jackson Heights", href: "/areas-we-serve/jackson-heights/" },
      { label: "Babylon", href: "/areas-we-serve/babylon-ny/" },
      { label: "Long Beach", href: "/areas-we-serve/long-beach-ny/" },
      { label: "Mineola", href: "/areas-we-serve/mineola-ny/" },
      { label: "Bethpage", href: "/areas-we-serve/bethpage-ny/" },
      { label: "Corona", href: "/areas-we-serve/corona/" },
    ],
    footerLink: { label: "All Areas We Serve", href: "/areas-we-serve/" },
  },

  { label: "Case Results", href: "/about/case-results/" },

  {
    label: "Resources",
    href: "/resources/",
    children: [
      { label: "Blog", href: "/blog/" },
      { label: "FAQ", href: "/faqs/" },
      { label: "Video Library", href: "/video-center/" },
      { label: "Scholarship Essay Contest", href: "/about/community-scholarship/" },
    ],
  },

  {
    label: "Contact",
    href: "/contact/",
    children: [
      { label: "Free Consultation", href: "/free-consultation/" },
      { label: "Attorney Referrals", href: "/about/attorney-referrals/" },
      { label: "New Hyde Park Office", href: "/new-hyde-park-office/" },
      { label: "Jackson Heights Office", href: "/jackson-heights-office/" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

/** Column three of the footer, per the artboard's own eight-item list. */
export const FOOTER_PRACTICE_AREAS: NavLink[] = [
  { label: "Car Accidents", href: "/long-island-car-accident-lawyer/" },
  { label: "Truck Accidents", href: "/long-island-truck-accident-lawyer/" },
  { label: "Motorcycle Accidents", href: "/long-island-motorcycle-accident-lawyer/" },
  { label: "Slip & Fall", href: "/long-island-slip-and-fall-lawyer/" },
  { label: "Medical Malpractice", href: "/long-island-medical-malpractice-lawyer/" },
  { label: "Construction Accidents", href: "/long-island-construction-accident-lawyer/" },
  { label: "Nursing Home Abuse", href: "/long-island-nursing-home-abuse-lawyer/" },
  { label: "Birth Injury", href: "/long-island-birth-injury-lawyer/" },
];

/** Column four. The artboard's labels, pointed at the real URLs. */
export const FOOTER_USEFUL_LINKS: NavLink[] = [
  { label: "About the firm", href: "/about/" },
  { label: "Our attorneys", href: "/about/attorneys/" },
  { label: "Case results", href: "/about/case-results/" },
  { label: "Testimonials", href: "/about/testimonials/" },
  { label: "No fee promise", href: "/about/no-fee-promise/" },
  { label: "In our community", href: "/about/our-community/" },
  { label: "Blog & resources", href: "/blog/" },
];

/** The utility strip. Matches the live footer menu exactly. */
export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Privacy", href: "/privacy-policy/" },
  { label: "Disclaimer", href: "/disclaimer/" },
  { label: "Site map", href: "/site-map/" },
  { label: "Contact", href: "/contact/" },
];
