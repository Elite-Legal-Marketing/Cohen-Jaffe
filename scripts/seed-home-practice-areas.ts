/**
 * Seed the homepage's "What happened?" practice-areas band.
 *
 *   npx sanity exec scripts/seed-home-practice-areas.ts --with-user-token
 *
 * Writes ONE field — `practiceAreas` — on the `homePage` singleton, with
 * `createIfNotExists` then `patch().set()`. Never `createOrReplace`: that
 * would take the hero, stats, case results, "Our goals" and the fee band down
 * with it.
 *
 * Re-running is guarded. `.set()` replaces the whole section, so once an
 * editor has tuned this copy in the Studio a second run would silently discard
 * their work. If the section already exists the script reports and stops;
 * `SEED_OVERWRITE=1` forces it.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * Moved here from `src/data/homePracticeAreas.ts`, which this replaces. The
 * heading copy, the seven thesis headlines, the sub-link labels and the twelve
 * "all areas" labels are the artboard's (`Cohen & Jaffe Homepage v1.dc.html`,
 * markup 327-401, data `const PAS` 960-1046). The seven CALLOUTS are
 * statements of New York law, so each clause was checked against the firm's
 * own pages in the WordPress mirror (`~/Downloads/Cohen & Jaffe/Sitesucker/`)
 * and, where the site is silent, against the statute. Car, truck and premises
 * stand as drawn. Four were corrected:
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
 *     already cites. The 2½-year period and the cancer-misdiagnosis discovery
 *     rule (Lavern's Law) are both on the site.
 *   - WRONGFUL DEATH: "Both usually run on a two-year clock" split. The
 *     wrongful death claim is two years (EPTL 5-4.1, and the firm's page); the
 *     survival claim follows the underlying injury's own period (CPLR 214 /
 *     210(a)), which is usually three.
 *
 * ⚠️ The firm's live wrongful-death page lists "grief" among recoverable
 * damages, which the headline here (rightly, for New York) contradicts. One
 * for the firm to settle.
 *
 * THE ARTBOARD'S SEVEN PULL QUOTES ARE NOT HERE, and `practiceAreaTab` has no
 * field for them. It draws one per pane, every one credited to "Richard S.
 * Jaffe · Managing Partner", and every one invented — two of them claims about
 * how the firm works that appear nowhere on the site. Built, then cut whole on
 * the client's call (2026-09-04).
 *
 * The three sub-links per tab point at pages that do not exist yet — the
 * detail-page template has sections for each — so every one currently links to
 * the area's own page. They become real anchors when those pages are built,
 * which is an edit in the Studio rather than a change here.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

/** Hyphens only: no dots (non-public), no slashes (not a valid id). */
const idFor = (slug: string) => `practice-area-${slug.replace(/\//g, "-")}`;
const hrefFor = (slug: string) => `/${slug}/`;

interface TabSeed {
  key: string;
  slug: string;
  headline: string;
  callout: string;
  links: string[];
}

const TABS: TabSeed[] = [
  {
    key: "car",
    slug: "long-island-car-accident-lawyer",
    headline: "New York is a no-fault state — that is not the whole story.",
    callout:
      "Your own insurer covers the first $50,000 regardless of fault. Beyond that, your injury has to meet New York’s serious injury threshold — and most people have never heard of it.",
    links: [
      "What no-fault actually covers",
      "The serious injury threshold explained",
      "When the adjuster calls",
    ],
  },
  {
    key: "construction",
    slug: "long-island-construction-accident-lawyer",
    headline:
      "New York gives construction workers protections almost no other state does.",
    callout:
      "Labor Law 240 and 241 can hold owners and general contractors liable for height and safety violations, separately from your workers’ compensation claim. That means a second source of recovery. Filing one does not cost you the other.",
    links: [
      "Labor Law 240 in plain English",
      "Comp and a lawsuit at the same time",
      "Undocumented workers have rights too",
    ],
  },
  {
    key: "slip",
    slug: "long-island-slip-and-fall-lawyer",
    headline:
      "The property owner had to know about the hazard — proving that is the case.",
    callout:
      "New York requires notice: the owner either created the condition or should have found and fixed it. Evidence disappears fast, so incident reports, maintenance logs, and camera footage matter in the first weeks. Comparative fault can reduce a recovery, but it does not bar one.",
    links: [
      "What notice means in a fall case",
      "Snow and ice rules on Long Island",
      "Evidence to preserve immediately",
    ],
  },
  {
    key: "malpractice",
    slug: "long-island-medical-malpractice-lawyer",
    headline:
      "A bad outcome is not malpractice — a departure from the standard of care is.",
    callout:
      "New York requires a certificate of merit before filing: your lawyer must first consult a physician who believes the case has merit. You have two and a half years from the malpractice, with a discovery rule for cancer misdiagnosis. Fees in malpractice cases follow a separate sliding scale set by New York law.",
    links: [
      "How we review your records",
      "Deadlines in malpractice cases",
      "Birth injury claims explained",
    ],
  },
  {
    key: "truck",
    slug: "long-island-truck-accident-lawyer",
    headline: "A truck case is an investigation, not a claim.",
    callout:
      "Federal trucking rules require carriers to keep driver logs, inspection records, and electronic data — and allow them to destroy some of it on a schedule. A preservation letter in the first days can decide the case. Multiple insurance layers often apply.",
    links: [
      "Why the black box matters",
      "Who is liable besides the driver",
      "Coverage layers in trucking cases",
    ],
  },
  {
    key: "wrongfuldeath",
    slug: "long-island-wrongful-death-lawyer",
    headline:
      "New York measures a wrongful death claim by economic loss, not grief.",
    callout:
      "Only a court-appointed personal representative of the estate can bring the claim, and damages focus on the financial support the family lost. A separate survival claim covers what your loved one endured. The wrongful death claim runs on a two-year clock; the survival claim follows the underlying injury’s own deadline.",
    links: [
      "Who can file the claim",
      "What damages are available",
      "How estates are opened",
    ],
  },
  {
    key: "premises",
    slug: "long-island-premises-liability-lawyer",
    headline: "If the property was unsafe and someone knew, that is a case.",
    callout:
      "Landlords, managing agents, and businesses all owe a duty to keep the premises reasonably safe. Municipal properties add a 90-day notice of claim requirement that ends most late cases outright. Identifying every responsible entity early is the work.",
    links: [
      "Notice of claim deadlines",
      "Negligent security cases",
      "Landlord responsibilities in New York",
    ],
  },
];

/**
 * The twelve "Handling all areas" links, as the artboard lists them. The
 * artboard's "Brain & Spinal Injury" is the site's Traumatic Brain Injury
 * page, which is the one that exists.
 */
const ALL_AREAS = [
  "long-island-bus-accident-lawyer",
  "long-island-bicycle-accident-lawyer",
  "long-island-pedestrian-accident-lawyer",
  "long-island-dog-bite-lawyer",
  "long-island-nursing-home-abuse-lawyer",
  "long-island-rideshare-accident-lawyer",
  "long-island-defective-product-lawyer",
  "long-island-burn-injury-lawyer",
  "long-island-brain-injury-attorney",
  "new-york-catastrophic-injury-attorneys",
  "long-island-boat-accident",
  "long-island-workers-compensation-attorney",
];

const SECTION = {
  _type: "practiceAreasSection",
  eyebrow: "Practice areas",
  heading: "What happened?",
  subheading: "Long Island personal injury practice areas",
  tabs: TABS.map((tab) => ({
    _type: "practiceAreaTab",
    _key: tab.key,
    area: { _type: "reference", _ref: idFor(tab.slug) },
    headline: tab.headline,
    callout: tab.callout,
    links: tab.links.map((label, i) => ({
      _type: "textLink",
      _key: `${tab.key}-${i}`,
      label,
      href: hrefFor(tab.slug),
    })),
  })),
  disclaimer:
    "Information on this page is general and is not legal advice about your case. New York deadlines and rules vary by claim type.",
  allHeading: "Handling all areas of personal injury",
  allLink: {
    _type: "textLink",
    label: "See all practice areas",
    href: "/practice-areas/",
  },
  allAreas: ALL_AREAS.map((slug) => ({
    _type: "reference",
    _key: slug,
    _ref: idFor(slug),
  })),
};

async function main() {
  const total = await client.fetch<number>(`count(*[_type == "practiceArea"])`);
  if (total !== 47) {
    throw new Error(
      `Expected 47 practiceArea documents, found ${total}. Aborting without writing.`,
    );
  }

  // Every reference must resolve. A dangling `_ref` publishes fine and then
  // dereferences to null at build time, which takes the whole build down.
  const wanted = [...TABS.map((t) => idFor(t.slug)), ...ALL_AREAS.map(idFor)];
  const found = await client.fetch<string[]>(
    `*[_type == "practiceArea" && _id in $ids]._id`,
    {
      ids: wanted,
    },
  );
  const missing = wanted.filter((id) => !found.includes(id));
  if (missing.length) {
    throw new Error(`Missing practice areas, aborting: ${missing.join(", ")}`);
  }

  const existing = await client.fetch<boolean>(
    `defined(*[_id == "homePage"][0].practiceAreas)`,
  );
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "homePage.practiceAreas already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }

  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client.patch("homePage").set({ practiceAreas: SECTION }).commit();

  console.log(
    `Done — practiceAreas set: ${SECTION.tabs.length} tabs, ${SECTION.allAreas.length} areas listed.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
