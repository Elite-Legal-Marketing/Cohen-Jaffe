/**
 * Homepage "Practice areas" section — HARDCODED for design sign-off.
 *
 * Shaped exactly as the `practiceAreas` projection of `HOME_PAGE_QUERY` will
 * be, so wiring it to Sanity is a swap from this constant to a prop
 * (AGENTS.md → "Building sections"). The practice areas themselves are ALREADY
 * in Sanity: `area` below mirrors what `area->{…}` will dereference, down to
 * the real `image.asset._ref` values from the seeded documents, so `urlFor()`
 * works and the image code is identical before and after wiring.
 *
 * Design: the PRACTICE AREAS band of `Cohen & Jaffe Homepage v1.dc.html`
 * (markup 327–401, data `const PAS` 960–1046). Seven tabs, a detail pane, a
 * disclaimer, then the "Handling all areas" card of twelve links.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * The heading copy, the seven thesis headlines, the sub-link labels and the
 * twelve "all areas" labels are the artboard's. The seven CALLOUTS are
 * statements of New York law, so each clause was checked against the firm's
 * own pages in the WordPress mirror (`~/Downloads/Cohen & Jaffe/Sitesucker/`)
 * and, where the site is silent, against the statute. Four stand as drawn.
 * Three were corrected:
 *
 *   - CONSTRUCTION: "strictly liable" dropped. Labor Law § 240(1) imposes
 *     absolute liability; § 241(6) does not, so "240 and 241 … strictly
 *     liable" over-claims. The firm's page says the two "offer additional
 *     avenues" beyond workers' compensation, which is what remains.
 *   - SLIP & FALL: "Comparative fault can reduce but rarely eliminates
 *     recovery" → "does not bar one". New York is pure comparative (CPLR
 *     1411): fault reduces a recovery and never bars it, and the firm's own
 *     geo pages say "pure comparative negligence".
 *   - MEDICAL MALPRACTICE: "require a physician expert to certify the
 *     departure before filing" → the certificate of merit as it actually
 *     works (CPLR 3012-a: the ATTORNEY certifies having consulted a physician
 *     who believes the case has merit — the firm's own pages describe it).
 *     "a separate court-set schedule" → "set by New York law": the sliding
 *     scale is statutory (Judiciary Law § 474-a), which the fee explainer
 *     already cites and the firm's blog explains. The 2½-year period and the
 *     cancer-misdiagnosis discovery rule (Lavern's Law) are both on the site.
 *   - WRONGFUL DEATH: "Both usually run on a two-year clock" split. The
 *     wrongful death claim is two years (EPTL 5-4.1, and the firm's page); the
 *     survival claim follows the underlying injury's own period (CPLR 214 /
 *     210(a)), which is usually three.
 *
 * Note the firm's live wrongful-death page lists "grief" among recoverable
 * damages, which the artboard's headline (rightly, for New York) contradicts.
 * One for the firm.
 *
 * THE ARTBOARD'S SEVEN PULL QUOTES ARE NOT HERE. It draws one per tab, every
 * one credited to "Richard S. Jaffe · Managing Partner", and every one
 * invented — two of them claims about how the firm works that appear nowhere
 * on the site. They were built, then cut on the client's call (2026-09-04):
 * the pane carries the thesis, the callout, the sub-links and the button, and
 * nothing in it is attributed to anyone. Nothing to confirm before launch.
 *
 * The three sub-links per tab point at pages that do not exist yet — the
 * detail-page template has sections for each — so every one currently links
 * to the area's own page. They become real anchors when those pages are built.
 */
import { practiceAreaHref } from "../lib/practiceAreas";

interface Area {
  _id: string;
  name: string;
  slug: string;
  icon: string | null;
  linkLabel: string | null;
  image: {
    _type: "image";
    asset: { _type: "reference"; _ref: string };
    hotspot: { x: number; y: number } | null;
    crop: null;
    alt: string | null;
  } | null;
}

interface Tab {
  _key: string;
  headline: string;
  callout: string | null;
  links: { _key: string; label: string; href: string }[];
  area: Area;
}

/** Mirrors the seeded `practiceArea` documents (`scripts/seed-practice-areas.ts`). */
const area = (
  slug: string,
  name: string,
  icon: string | null,
  linkLabel: string | null,
  assetRef: string | null,
): Area => ({
  _id: `practice-area-${slug.replace(/\//g, "-")}`,
  name,
  slug,
  icon,
  linkLabel,
  image: assetRef
    ? { _type: "image", asset: { _type: "reference", _ref: assetRef }, hotspot: null, crop: null, alt: "" }
    : null,
});

const links = (key: string, slug: string, labels: string[]) =>
  labels.map((label, i) => ({ _key: `${key}-${i}`, label, href: practiceAreaHref(slug) }));

const AREAS = {
  car: area(
    "long-island-car-accident-lawyer",
    "Car Accidents",
    "car",
    "Car accident lawyers",
    "image-8f6053a5db99683b839a8379d28169e11060d3c6-2400x1599-jpg",
  ),
  construction: area(
    "long-island-construction-accident-lawyer",
    "Construction Accidents",
    "construction",
    "Construction accident lawyers",
    "image-4a482cadcabb347e35d32d931e99593cbf4bc7c4-2400x1681-jpg",
  ),
  slip: area(
    "long-island-slip-and-fall-lawyer",
    "Slip & Fall",
    "slip",
    "Slip and fall lawyers",
    "image-079991aba14bd347994f88d9103aee2e8184535c-2400x1600-jpg",
  ),
  malpractice: area(
    "long-island-medical-malpractice-lawyer",
    "Medical Malpractice",
    "malpractice",
    "Medical malpractice lawyers",
    "image-5d1db4a52ebffee4abd5b0aa63bef4768b31a978-2400x1600-jpg",
  ),
  truck: area(
    "long-island-truck-accident-lawyer",
    "Truck Accidents",
    "truck",
    "Truck accident lawyers",
    "image-48d2eab0b20f43d90fdec85737fa0ccf067f6a69-2400x1784-jpg",
  ),
  wrongfuldeath: area(
    "long-island-wrongful-death-lawyer",
    "Wrongful Death",
    "wrongfuldeath",
    "Wrongful death lawyers",
    "image-7cefc6d37dde64dd43b982c93069720eb40056a4-2400x1600-jpg",
  ),
  premises: area(
    "long-island-premises-liability-lawyer",
    "Premises Liability",
    "premises",
    "Premises liability lawyers",
    "image-22b127189da6efb28cfc6cdc8928ede27ea867f4-1000x667-jpg",
  ),
};

const TABS: Tab[] = [
  {
    _key: "car",
    area: AREAS.car,
    headline: "New York is a no-fault state — that is not the whole story.",
    callout:
      "Your own insurer covers the first $50,000 regardless of fault. Beyond that, your injury has to meet New York’s serious injury threshold — and most people have never heard of it.",
    links: links("car", AREAS.car.slug, [
      "What no-fault actually covers",
      "The serious injury threshold explained",
      "When the adjuster calls",
    ]),
  },
  {
    _key: "construction",
    area: AREAS.construction,
    headline: "New York gives construction workers protections almost no other state does.",
    callout:
      "Labor Law 240 and 241 can hold owners and general contractors liable for height and safety violations, separately from your workers’ compensation claim. That means a second source of recovery. Filing one does not cost you the other.",
    links: links("construction", AREAS.construction.slug, [
      "Labor Law 240 in plain English",
      "Comp and a lawsuit at the same time",
      "Undocumented workers have rights too",
    ]),
  },
  {
    _key: "slip",
    area: AREAS.slip,
    headline: "The property owner had to know about the hazard — proving that is the case.",
    callout:
      "New York requires notice: the owner either created the condition or should have found and fixed it. Evidence disappears fast, so incident reports, maintenance logs, and camera footage matter in the first weeks. Comparative fault can reduce a recovery, but it does not bar one.",
    links: links("slip", AREAS.slip.slug, [
      "What notice means in a fall case",
      "Snow and ice rules on Long Island",
      "Evidence to preserve immediately",
    ]),
  },
  {
    _key: "malpractice",
    area: AREAS.malpractice,
    headline: "A bad outcome is not malpractice — a departure from the standard of care is.",
    callout:
      "New York requires a certificate of merit before filing: your lawyer must first consult a physician who believes the case has merit. You have two and a half years from the malpractice, with a discovery rule for cancer misdiagnosis. Fees in malpractice cases follow a separate sliding scale set by New York law.",
    links: links("malpractice", AREAS.malpractice.slug, [
      "How we review your records",
      "Deadlines in malpractice cases",
      "Birth injury claims explained",
    ]),
  },
  {
    _key: "truck",
    area: AREAS.truck,
    headline: "A truck case is an investigation, not a claim.",
    callout:
      "Federal trucking rules require carriers to keep driver logs, inspection records, and electronic data — and allow them to destroy some of it on a schedule. A preservation letter in the first days can decide the case. Multiple insurance layers often apply.",
    links: links("truck", AREAS.truck.slug, [
      "Why the black box matters",
      "Who is liable besides the driver",
      "Coverage layers in trucking cases",
    ]),
  },
  {
    _key: "wrongfuldeath",
    area: AREAS.wrongfuldeath,
    headline: "New York measures a wrongful death claim by economic loss, not grief.",
    callout:
      "Only a court-appointed personal representative of the estate can bring the claim, and damages focus on the financial support the family lost. A separate survival claim covers what your loved one endured. The wrongful death claim runs on a two-year clock; the survival claim follows the underlying injury’s own deadline.",
    links: links("wrongfuldeath", AREAS.wrongfuldeath.slug, [
      "Who can file the claim",
      "What damages are available",
      "How estates are opened",
    ]),
  },
  {
    _key: "premises",
    area: AREAS.premises,
    headline: "If the property was unsafe and someone knew, that is a case.",
    callout:
      "Landlords, managing agents, and businesses all owe a duty to keep the premises reasonably safe. Municipal properties add a 90-day notice of claim requirement that ends most late cases outright. Identifying every responsible entity early is the work.",
    links: links("premises", AREAS.premises.slug, [
      "Notice of claim deadlines",
      "Negligent security cases",
      "Landlord responsibilities in New York",
    ]),
  },
];

/**
 * The twelve "Handling all areas" links, as the artboard lists them. Each is
 * a seeded document; the artboard's "Brain & Spinal Injury" is the site's
 * Traumatic Brain Injury page, which is the one that exists.
 */
const ALL_AREAS = [
  ["long-island-bus-accident-lawyer", "Bus & MTA Accidents"],
  ["long-island-bicycle-accident-lawyer", "Bicycle Accidents"],
  ["long-island-pedestrian-accident-lawyer", "Pedestrian Accidents"],
  ["long-island-dog-bite-lawyer", "Dog Bites"],
  ["long-island-nursing-home-abuse-lawyer", "Nursing Home Abuse"],
  ["long-island-rideshare-accident-lawyer", "Rideshare Accidents"],
  ["long-island-defective-product-lawyer", "Defective Products"],
  ["long-island-burn-injury-lawyer", "Burn Injuries"],
  ["long-island-brain-injury-attorney", "Traumatic Brain Injury"],
  ["new-york-catastrophic-injury-attorneys", "Catastrophic Injury"],
  ["long-island-boat-accident", "Boating Accidents"],
  ["long-island-workers-compensation-attorney", "Workers’ Compensation"],
].map(([slug, name]) => ({ _id: `practice-area-${slug}`, name, slug }));

export const HOME_PRACTICE_AREAS = {
  eyebrow: "Practice areas",
  heading: "What happened?",
  subheading: "Long Island personal injury practice areas",
  tabs: TABS,
  disclaimer:
    "Information on this page is general and is not legal advice about your case. New York deadlines and rules vary by claim type.",
  allHeading: "Handling all areas of personal injury",
  allLink: { label: "See all practice areas", href: "/practice-areas/" },
  allAreas: ALL_AREAS,
};

export type HomePracticeAreas = typeof HOME_PRACTICE_AREAS;
