/**
 * Seeds the practice areas collection — forty-seven documents.
 *
 *   npx sanity exec scripts/seed-practice-areas.ts --with-user-token
 *
 * Idempotent. Fixed ids and `createOrReplace`, and a photograph is uploaded
 * only when the document does not already carry one, so re-running does not
 * churn the media library. (Sanity dedupes uploads by content hash anyway.)
 *
 * ⚠️ DOCUMENT IDS MUST NOT CONTAIN A DOT — a dotted `_id` is non-public and
 * the site's unauthenticated client dereferences it to null; see
 * `seed-case-results.ts`. They cannot contain a slash either, so an id is
 * `practice-area-<slug with / replaced by ->`. The SLUG keeps its slash:
 * `birth-injury/cerebral-palsy` is that page's live path.
 *
 * ── WHERE THIS LIST COMES FROM ──────────────────────────────────────────────
 *
 * The live `/practice-areas/` hub in the WordPress mirror
 * (`~/Downloads/Cohen & Jaffe/Sitesucker/practice-areas/`) lists 39 areas
 * under five headings. Two of those are not practice areas and are omitted:
 * "Types of Injuries | Long Island Accident" (its link is mis-targeted at an
 * areas-we-serve page) and "Abogado de Accidente" (the deferred Spanish
 * section). Ten more are ADDED because an approved artboard, the nav or the
 * footer names them and each has a live page: Medical Malpractice itself
 * (which the hub oddly omits), Motorcycle, Bus & MTA, Pedestrian, Dog Bites,
 * Rideshare, Burn Injuries, Boating, Defective Products and Catastrophic
 * Injury. SEEDS is in the hub's own order, group by group, with the additions
 * at the end of their group — the hub order is not modelled as a field, so
 * this array is where it is recoverable from.
 *
 * Every slug was checked against the mirror folder and that page's `og:url`.
 * Seven have NO page in the mirror but do appear in the live `/site-map/`,
 * linked absolutely — which is how SiteSucker leaves a page it never fetched:
 * defective-product, catastrophic-injury, erbs-palsy, failure-to-diagnose,
 * surgical-error, failure-to-diagnose-heart-attack, medical-device-lawyer.
 * They are seeded with name, group and path only; confirm they still resolve
 * before launch (HANDOFF open question).
 *
 * NAMES follow the artboard's wording where an artboard names the area, then
 * the nav's, then the hub's — so "Slip & Fall" (homepage tab, footer) over the
 * hub's "Slip and Fall Accidents", "Workers' Compensation" (homepage) over
 * "Workplace Accidents", "Traumatic Brain Injury" (hub) for the homepage's
 * "Brain & Spinal Injury", which has no page of its own.
 *
 * BLURBS are the listing artboard's six card blurbs, each checked against
 * that page in the mirror because they are claims about how the firm works:
 *   - Car, Truck: as drawn (no-fault, logbook/black-box/maintenance evidence
 *     are all on the live pages).
 *   - Slip & Fall: REWRITTEN. "We move fast to preserve incident reports,
 *     maintenance logs, and camera footage" is on neither the page nor the
 *     blog. The page's own claim is used: the owner must have known about the
 *     hazard, proved with accident reports, witness statements and photos.
 *   - Motorcycle: "We rebuild what actually happened" → "We counter the
 *     anti-motorcycle bias", which is the page's own phrase.
 *   - Medical Malpractice: "reviewed by a physician before we ever file" →
 *     "investigated with independent medical experts" — the page says cases
 *     should be investigated by independent medical experts and that the firm
 *     consults them; it does not say a physician signs off before filing.
 *   - Construction: "protections almost no other state does" is a comparative
 *     claim about other states, supported nowhere. Replaced with the page's
 *     own point: Labor Law claims against contractors, owners and equipment
 *     makers, beyond workers' compensation.
 *
 * ICONS are the ten the vendor set covers; PHOTOGRAPHS are the artboards'
 * `pa-*.jpg` originals, downscaled to 2400px in `src/assets/practice-areas/`.
 * Premises Liability has no artboard photograph (the artboard reuses the
 * dog-bite shot); it uses the snow-covered stairway from the live site's own
 * uploads, 1000px wide — fine for a card, replace before any full-bleed use.
 */
import { getCliClient } from "sanity/cli";
import { createReadStream } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { PracticeAreaGroup } from "../src/sanity/schemaTypes/practiceAreaGroups";
import type { PracticeAreaIcon } from "../src/sanity/schemaTypes/practiceAreaIcons";

const client = getCliClient();
const assetsDir = resolve(dirname(fileURLToPath(import.meta.url)), "../src/assets/practice-areas");

interface Seed {
  /** The live path without surrounding slashes. May contain a "/". */
  slug: string;
  name: string;
  group: PracticeAreaGroup;
  icon?: PracticeAreaIcon;
  /** File in `src/assets/practice-areas/`. */
  file?: string;
  blurb?: string;
  linkLabel?: string;
}

const PI = "personal-injury";
const MM = "medical-malpractice";
const DEV = "defective-medical-devices";
const EMP = "employment-law";
const MT = "mass-torts";

const SEEDS: Seed[] = [
  // ── Personal Injury — hub order ─────────────────────────────────────────
  {
    slug: "long-island-car-accident-lawyer",
    name: "Car Accidents",
    group: PI,
    icon: "car",
    file: "pa-car.jpg",
    blurb:
      "Injured in a crash caused by someone else’s negligence? New York no-fault covers only the first part of your losses — we pursue the rest.",
    linkLabel: "Long Island car accident lawyers",
  },
  {
    slug: "long-island-truck-accident-lawyer",
    name: "Truck Accidents",
    group: PI,
    icon: "truck",
    file: "pa-truck.jpg",
    blurb:
      "A truck case is an investigation, not a claim. Driver logs, maintenance records, and black-box data have to be secured before they disappear.",
    linkLabel: "Long Island truck accident lawyers",
  },
  { slug: "long-island-bicycle-accident-lawyer", name: "Bicycle Accidents", group: PI },
  { slug: "long-island-brain-injury-attorney", name: "Traumatic Brain Injury", group: PI },
  {
    slug: "long-island-construction-accident-lawyer",
    name: "Construction Accidents",
    group: PI,
    icon: "construction",
    file: "pa-construction.jpg",
    blurb:
      "New York’s Labor Law gives injured construction workers claims beyond workers’ compensation — against contractors, owners, and equipment makers.",
    linkLabel: "Long Island construction accident lawyers",
  },
  {
    slug: "long-island-nursing-home-abuse-lawyer",
    name: "Nursing Home Abuse",
    group: PI,
    icon: "nursing",
    file: "pa-nursing.jpg",
  },
  {
    slug: "long-island-slip-and-fall-lawyer",
    name: "Slip & Fall",
    group: PI,
    icon: "slip",
    file: "pa-slip-fall.jpg",
    blurb:
      "Ice, broken stairs, unlit walkways, and spills. The owner had to know about the hazard — we gather the reports, witnesses, and photographs that prove it.",
    linkLabel: "Long Island slip and fall lawyers",
  },
  {
    slug: "long-island-premises-liability-lawyer",
    name: "Premises Liability",
    group: PI,
    icon: "premises",
    file: "pa-premises.jpg",
    linkLabel: "Long Island premises liability lawyers",
  },
  { slug: "long-island-workers-compensation-attorney", name: "Workers’ Compensation", group: PI },
  {
    slug: "long-island-wrongful-death-lawyer",
    name: "Wrongful Death",
    group: PI,
    icon: "wrongfuldeath",
    file: "pa-wrongfuldeath.jpg",
    linkLabel: "Long Island wrongful death lawyers",
  },
  // ── Personal Injury — additions (nav, footer, artboards) ────────────────
  {
    slug: "long-island-motorcycle-accident-lawyer",
    name: "Motorcycle Accidents",
    group: PI,
    icon: "motorcycle",
    file: "pa-motorcycle.jpg",
    blurb:
      "Riders are blamed first and hurt worst. We counter the anti-motorcycle bias and take on the insurer’s version of what happened.",
    linkLabel: "Long Island motorcycle accident lawyers",
  },
  { slug: "long-island-bus-accident-lawyer", name: "Bus & MTA Accidents", group: PI },
  { slug: "long-island-pedestrian-accident-lawyer", name: "Pedestrian Accidents", group: PI },
  { slug: "long-island-dog-bite-lawyer", name: "Dog Bites", group: PI, icon: "dog", file: "pa-dog.jpg" },
  { slug: "long-island-rideshare-accident-lawyer", name: "Rideshare Accidents", group: PI },
  { slug: "long-island-burn-injury-lawyer", name: "Burn Injuries", group: PI },
  { slug: "long-island-boat-accident", name: "Boating Accidents", group: PI },
  { slug: "long-island-defective-product-lawyer", name: "Defective Products", group: PI },
  { slug: "new-york-catastrophic-injury-attorneys", name: "Catastrophic Injury", group: PI },

  // ── Medical Malpractice ─────────────────────────────────────────────────
  {
    slug: "long-island-medical-malpractice-lawyer",
    name: "Medical Malpractice",
    group: MM,
    icon: "malpractice",
    file: "pa-malpractice.jpg",
    blurb:
      "Missed diagnoses, surgical errors, birth injuries, and medication mistakes — investigated with independent medical experts.",
    linkLabel: "Long Island medical malpractice lawyers",
  },
  { slug: "long-island-birth-injury-lawyer", name: "Birth Injuries", group: MM },
  { slug: "birth-injury/cerebral-palsy", name: "Cerebral Palsy", group: MM },
  { slug: "birth-injury/erbs-palsy", name: "Erb’s Palsy / Nerve Damage", group: MM },
  { slug: "medical-malpractice-lawyer-failure-to-diagnose", name: "Failure to Diagnose / Misdiagnosis", group: MM },
  { slug: "medical-malpractice-lawyer-surgical-error", name: "Surgery Error", group: MM },
  {
    slug: "medical-malpractice-lawyer-surgical-error-foreign-objects-left-in-body",
    name: "Foreign Objects Left in Body",
    group: MM,
  },
  {
    slug: "medical-malpractice-lawyer-failure-to-diagnose-heart-attack",
    name: "Failure to Diagnose Heart Attack",
    group: MM,
  },

  // ── Defective Medical Devices ───────────────────────────────────────────
  { slug: "medical-device-lawyer-long-island", name: "Defective Medical Device Lawyer", group: DEV },
  { slug: "paragard-iud-lawsuit", name: "Paragard Lawsuit", group: DEV },
  { slug: "defective-hernia-mesh-lawyer", name: "Defective Hernia Mesh Lawyer", group: DEV },
  { slug: "hip-replacement-lawyers", name: "Hip Replacement Lawsuit", group: DEV },

  // ── Employment Law ──────────────────────────────────────────────────────
  { slug: "wrongful-termination-lawyer-long-island", name: "Wrongful Termination", group: EMP },
  { slug: "long-island-sexual-harassment-lawyer", name: "Sexual Harassment", group: EMP },
  { slug: "long-island-employment-discrimination-attorney", name: "Employment Discrimination", group: EMP },
  { slug: "disability-lawyers-long-island", name: "Disability and Health Conditions Discrimination", group: EMP },
  { slug: "employment-lawyer-employment-discrimination-gender", name: "Gender Discrimination", group: EMP },
  {
    slug: "long-island-employment-discrimination-attorney-race-ethnicity",
    name: "Race, Ethnicity and National Origin Discrimination",
    group: EMP,
  },
  { slug: "new-york-pregnancy-discrimination-lawyer", name: "Pregnancy Discrimination", group: EMP },
  {
    slug: "long-island-employment-discrimination-attorney-cancer-disability",
    name: "Cancer Disability Discrimination",
    group: EMP,
  },
  { slug: "employment-lawyer-employment-discrimination-religious", name: "Religious Discrimination", group: EMP },

  // ── Mass Torts ──────────────────────────────────────────────────────────
  { slug: "product-liability-lawyer-chemical-hair-relaxer", name: "Hair Relaxer Cancer Lawsuit", group: MT },
  { slug: "ozempic-lawsuit", name: "Ozempic Lawsuit", group: MT },
  { slug: "wegovy-lawsuit", name: "Wegovy Lawsuit", group: MT },
  { slug: "rybelsus-lawsuit", name: "Rybelsus Lawsuit", group: MT },
  { slug: "mounjaro-lawsuit", name: "Mounjaro Lawsuit", group: MT },
  { slug: "saxenda-lawsuit", name: "Saxenda Lawsuit", group: MT },
  { slug: "depo-provera-lawsuit", name: "Depo-Provera Lawsuit", group: MT },
];

/** Hyphens only: no dots (non-public), no slashes (not a valid id). */
const idFor = (seed: Seed) => `practice-area-${seed.slug.replace(/\//g, "-")}`;

async function imageFor(seed: Seed) {
  if (!seed.file) return null;
  const existing = await client.fetch<{ assetId?: string } | null>(
    `*[_id == $id][0]{ "assetId": image.asset._ref }`,
    { id: idFor(seed) },
  );
  if (existing?.assetId) {
    console.log(`  ${seed.slug}: reusing asset ${existing.assetId}`);
    return existing.assetId;
  }
  const asset = await client.assets.upload("image", createReadStream(resolve(assetsDir, seed.file)), {
    filename: seed.file,
  });
  console.log(`  ${seed.slug}: uploaded ${asset._id}`);
  return asset._id;
}

async function main() {
  const slugs = new Set(SEEDS.map((seed) => seed.slug));
  if (slugs.size !== SEEDS.length) throw new Error("Duplicate slug in SEEDS");

  console.log(`Seeding ${SEEDS.length} practice areas…`);

  for (const seed of SEEDS) {
    const assetId = await imageFor(seed);
    await client.createOrReplace({
      _id: idFor(seed),
      _type: "practiceArea",
      name: seed.name,
      slug: { _type: "slug", current: seed.slug },
      group: seed.group,
      ...(seed.icon ? { icon: seed.icon } : {}),
      ...(seed.blurb ? { blurb: seed.blurb } : {}),
      ...(seed.linkLabel ? { linkLabel: seed.linkLabel } : {}),
      ...(assetId
        ? {
            image: {
              _type: "image",
              asset: { _type: "reference", _ref: assetId },
              // Decorative: the area's name sits beside the photograph as real
              // text on every card and tab that shows it.
              alt: "",
            },
          }
        : {}),
    });
  }

  console.log(`Done — ${SEEDS.length} practice areas.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
