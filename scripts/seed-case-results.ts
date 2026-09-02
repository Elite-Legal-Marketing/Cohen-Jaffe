/**
 * Seeds the four FEATURED case results and wires them into the homepage band.
 * The 60 migrated ledger entries are a separate script — `migrate-case-results.ts`.
 *
 *   npx sanity exec scripts/seed-case-results.ts --with-user-token
 *
 * Idempotent. Documents use fixed ids and `createOrReplace`, and the images are
 * only uploaded when the document does not already carry one — otherwise every
 * run would orphan four assets in the media library.
 *
 * The homepage is PATCHED, never `createOrReplace`d: the Sanity CLI has no
 * `patch` command and `documents create --replace` overwrites the whole
 * document, which would silently drop the hero and stats sections that are
 * already published. Hence a script rather than a CLI one-liner.
 *
 * ⚠️ DOCUMENT IDS MUST NOT CONTAIN A DOT. Sanity treats a dotted `_id` as
 * non-public: the document is readable with a token and invisible without one.
 * These ids were `caseResult.danny-r` first, and the symptom was nasty — the
 * Studio, the CLI and `documents validate` all showed four healthy documents,
 * while the site's unauthenticated client dereferenced every reference to null
 * and the BUILD died on `Cannot read properties of null`. Hyphens, never dots.
 */
import { getCliClient } from "sanity/cli";
import { createReadStream } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const client = getCliClient();
const assetsDir = resolve(dirname(fileURLToPath(import.meta.url)), "../src/assets");

interface Seed {
  id: string;
  file: string;
  clientName: string;
  quote: string;
  insurerOffered: string;
  recovered: string;
  category: string;
  county: string;
  summary: string;
  wistiaId?: string;
}

/**
 * From the CASE RESULTS band of `Cohen & Jaffe Homepage v1.dc.html`.
 *
 * ⚠️ The client names, quotes and offer figures are the artboard's own
 * illustrative copy — they are NOT migrated from the live site, which publishes
 * no client names, quotes, photographs or offer figures on any of its 60
 * results. Seeded here on the client's instruction so the approved design has
 * real content behind it. Replace them with genuine client stories before
 * launch: these are fabricated case outcomes on a law firm's site, which is a
 * different thing from placeholder body copy.
 */
const SEEDS: Seed[] = [
  {
    id: "case-result-danny-r",
    file: "result-client-1.png",
    clientName: "Danny R.",
    quote: "They told me it was my fault.",
    insurerOffered: "$250,000",
    recovered: "$2,800,000",
    category: "Auto Accident",
    county: "Nassau County",
    summary:
      "Rear-ended at a light and told by the other driver's insurer that the collision was his own fault. Liability was contested throughout; the offer moved only once the medical evidence was assembled in full.",
    // Live test of the Wistia pipeline. Resolves to "Experienced Personal Injury
    // Lawyers in Long Island & Queens, NY" (2:47) — the video the current site
    // runs on /free-consultation/. The other three have no video yet.
    wistiaId: "c6b0eghb5r",
  },
  {
    id: "case-result-carol-m",
    file: "result-client-2.png",
    clientName: "Carol M.",
    quote: "I almost signed the first offer.",
    insurerOffered: "$150,000",
    recovered: "$1,500,000",
    category: "Medical Malpractice",
    county: "Suffolk County",
    summary:
      "A delayed diagnosis that the insurer moved quickly to settle at a fraction of its value. The first offer arrived before the medical records had been reviewed in full.",
  },
  {
    id: "case-result-andre-w",
    file: "result-client-3.png",
    clientName: "Andre W.",
    quote: "I could not work for eight months.",
    insurerOffered: "$85,000",
    recovered: "$950,000",
    category: "Slip & Fall",
    county: "Nassau County",
    summary:
      "A fall on an unmaintained surface that kept the client out of work for eight months. The property owner denied notice of the hazard until maintenance records were obtained.",
  },
  {
    id: "case-result-marisol-t",
    file: "result-client-4.png",
    clientName: "Marisol T.",
    quote: "I did not think I had a case.",
    insurerOffered: "$50,000",
    recovered: "$675,000",
    category: "Construction Accident",
    county: "Queens",
    summary:
      "A site injury the client believed she had no claim for, having been told the accident was her own doing. Labor Law protections applied and the case resolved before trial.",
  },
];

async function imageFor(seed: Seed) {
  const existing = await client.fetch<{ assetId?: string } | null>(
    `*[_id == $id][0]{ "assetId": image.asset._ref }`,
    { id: seed.id },
  );
  if (existing?.assetId) {
    console.log(`  ${seed.id}: reusing asset ${existing.assetId}`);
    return existing.assetId;
  }
  const asset = await client.assets.upload("image", createReadStream(resolve(assetsDir, seed.file)), {
    filename: seed.file,
  });
  console.log(`  ${seed.id}: uploaded ${asset._id}`);
  return asset._id;
}

async function main() {
  console.log("Seeding case results…");

  for (const seed of SEEDS) {
    const assetId = await imageFor(seed);
    await client.createOrReplace({
      _id: seed.id,
      _type: "featuredCaseResult",
      recovered: seed.recovered,
      category: seed.category,
      summary: seed.summary,
      county: seed.county,
      insurerOffered: seed.insurerOffered,
      clientName: seed.clientName,
      quote: seed.quote,
      ...(seed.wistiaId ? { wistiaId: seed.wistiaId } : {}),
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
        // Decorative: the client's name sits beside the photograph as real text,
        // so a description here would only repeat it to a screen reader.
        alt: "",
      },
    });
  }

  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client
    .patch("homePage")
    .set({
      caseResults: {
        _type: "caseResultsSection",
        heading: "Real people. Real recoveries.",
        lead: "Insurance companies made an offer. Here is what these cases were actually worth.",
        link: { _type: "ctaLink", label: "See all results", href: "/case-results/" },
        disclaimer:
          "Prior results do not guarantee a similar outcome. Every case is evaluated on its individual facts and circumstances.",
        results: SEEDS.map((seed) => ({
          _type: "reference",
          _key: seed.id.replace("case-result-", ""),
          _ref: seed.id,
        })),
      },
    })
    .commit();

  console.log(`Done — ${SEEDS.length} case results, homepage band wired.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
