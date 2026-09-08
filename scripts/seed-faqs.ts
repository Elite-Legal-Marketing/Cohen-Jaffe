/**
 * Seeds the FAQ collection — 180 documents.
 *
 *   npx sanity exec scripts/seed-faqs.ts --with-user-token
 *
 * Reads `scripts/faqs.json` and writes it to the dataset. **It fetches nothing.**
 * The live WordPress site is read by `scripts/faq-extract.ts`, which writes that
 * JSON and prints a summary table; extraction and seeding are two scripts with a
 * reviewable file between them because this is 127 pages of legal copy going
 * straight into `production`. Run the extractor, read `faqs.json`, then run this.
 *
 * ── WHAT IS IN THE 180 ──────────────────────────────────────────────────────
 *
 * 128 live pages sit under `/faqs/`. One (`what-to-do-after-a-bus-accident-in-
 * new-yorkas-we-serve`) is dead on the live site — empty `content.rendered` and
 * a corrupted slug — and is dropped, so 127 are real. Seven of those are
 * round-ups that bundle 8-13 questions under headings; each is split into its
 * own documents, which turns 7 into 60. 127 - 7 + 60 = 180.
 *
 * The seven round-up URLs therefore retire and need redirects, as does the dead
 * page — eight entries in `vercel.json`. **Every other FAQ keeps its live URL**,
 * which is the whole reason `faq.slug` exists.
 *
 * ── IDS ─────────────────────────────────────────────────────────────────────
 *
 * `faq-<slug>`. ⚠️ NEVER A DOT: a dotted `_id` is non-public, so the Studio, the
 * CLI and `sanity documents validate` all show healthy documents while the
 * site's unauthenticated client dereferences every one to null and the build
 * dies on `Cannot read properties of null` with nothing pointing at the cause.
 * The FAQ slugs are single-segment and hyphenated, so no id needs rewriting —
 * unlike `practice-area-*`, whose slugs carry a slash. Longest id here is 89
 * characters.
 *
 * Diagnose a suspected id problem by hitting the public API WITHOUT a token:
 *   curl "https://<projectId>.api.sanity.io/v2024-01-01/data/query/production?query=count(*%5B_type%3D%3D%27faq%27%5D)"
 * An empty or zero result there against a populated CLI result is the tell.
 *
 * ── RE-RUNNING ──────────────────────────────────────────────────────────────
 *
 * Fixed ids and `createOrReplace`, so it is idempotent against the JSON. But
 * ⚠️ A `createOrReplace` SEED IS A LOADED GUN ONCE THE STUDIO HAS BEEN USED —
 * every editor fix to a question, a category or an answer is reverted with
 * nothing to show that it was. `seed-attorneys.ts` is the cautionary example:
 * three roles were edited in the Studio and re-running it would silently undo
 * them. The guard below refuses to run while any `faq` exists;
 * `SEED_OVERWRITE=1` forces it. After the first run, prefer a targeted
 * `client.patch(id).set({…})` — `scripts/unset-attorney-summary.ts` is the
 * worked example.
 *
 * ── WHAT THE MIGRATION DECIDED, RECORDED HERE ───────────────────────────────
 *
 * These are the judgement calls; every one of them is a Studio edit away from
 * being changed, and none of them is hidden in a heuristic:
 *
 *  - THREE PAGES HAD NO CATEGORY on the live site and `category` is required.
 *    `who-is-liable-for-a-slip-and-fall-accident` → Slip and Fall Injury.
 *    `what-to-do-after-a-bus-accident-new-york` → Personal Injury, because the
 *    taxonomy has no bus or transit term at all and Car Accidents would be wrong
 *    on the facts. (The third untagged page is the dead one.)
 *  - ONE PAGE CARRIED TWO, `who-may-be-liable-in-a-blind-spot-accident` (Car
 *    Accidents and Truck Accidents). `category` is single-valued and WordPress
 *    has no notion of a primary term, so the lower term id wins — Car Accidents.
 *    Deterministic rather than guessed; change it in the Studio if the firm
 *    would rather it sat under Truck.
 *  - 25 IMAGES WERE DROPPED across 4 pages. They are old-theme decoration —
 *    "info icon", "justice scales", a picture of a download button — not figures
 *    the answers depend on. `richText` has no image member; see its docblock.
 *  - 110 `tel:` LINKS ARE MIGRATED VERBATIM inside the answers. ⚠️ This is the
 *    one thing here that breaks the house rule that phone numbers are stored in
 *    display form and the link derived (`telHref()`), and it breaks it 110
 *    times. Rewriting them means editing 110 pieces of legal copy, which is not
 *    a migration's call — but the day the number changes, these will not follow.
 *    `faqs.json` → `review.telLinkTargets` is the list.
 *  - SIX NEAR-DUPLICATE GROUPS are flagged and NONE is merged. Two are genuine
 *    duplicates inside `birth-injury-faqs`; one is a round-up child against its
 *    own standalone twin; the rest are the same question asked about different
 *    vehicles. Deciding which of two pieces of legal copy survives is not a
 *    script's call. `faqs.json` → `review.nearDuplicates`.
 *  - TWELVE TITLES ARE NOT QUESTIONS ("10 Mistakes To Avoid After A Car
 *    Accident", "Types of Slips, Trips, and Falls"). They work as pages; they
 *    read oddly in a band headed "Frequently asked questions", so keep them out
 *    of the homepage eight. `faqs.json` → `review.notQuestions`.
 */
import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

const client = getCliClient();

interface FaqRecord {
  slug: string;
  question: string;
  category: string;
  answer: unknown[];
  source: string;
  flags: string[];
}

const data = JSON.parse(
  readFileSync(new URL("./faqs.json", import.meta.url), "utf8"),
) as { items: FaqRecord[] };

/** Batched, because 180 separate requests is slow and a mid-way failure is worse. */
const BATCH = 50;

async function main() {
  const items = data.items;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("scripts/faqs.json has no items — run `node scripts/faq-extract.ts` first.");
  }

  // The extractor's `_sourceUrl` placeholder is not a Sanity field. Nothing
  // should produce one now that images are dropped, but a stray one would be
  // written to 180 documents before anyone noticed.
  const stray = items.filter((f) => JSON.stringify(f.answer).includes("_sourceUrl"));
  if (stray.length > 0) {
    throw new Error(
      `${stray.length} FAQ(s) still carry an image placeholder (${stray[0]!.slug}). ` +
        `Re-run the extractor — richText has no image member, so these cannot be written.`,
    );
  }

  const existing = await client.fetch<number>(`count(*[_type == "faq"])`);
  if (existing > 0 && process.env.SEED_OVERWRITE !== "1") {
    console.error(
      `Refusing to run: ${existing} faq documents already exist.\n` +
        "This is createOrReplace, so a second run reverts every edit made in the\n" +
        "Studio since the first — questions, categories and answers alike, with\n" +
        "nothing to show that it did.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing all of them is what you want.",
    );
    process.exit(1);
  }

  for (let i = 0; i < items.length; i += BATCH) {
    const tx = client.transaction();
    for (const faq of items.slice(i, i + BATCH)) {
      tx.createOrReplace({
        _id: `faq-${faq.slug}`,
        _type: "faq",
        question: faq.question,
        slug: { _type: "slug", current: faq.slug },
        category: faq.category,
        answer: faq.answer,
      });
    }
    await tx.commit();
    console.log(`  ${Math.min(i + BATCH, items.length)}/${items.length}`);
  }

  console.log(`Done — ${items.length} FAQs seeded.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
