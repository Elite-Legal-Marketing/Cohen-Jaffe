/**
 * Migrates the 60 published case results from the WordPress site into the
 * `caseResult` ledger.
 *
 *   npx sanity exec scripts/migrate-case-results.ts --with-user-token
 *
 * Source data is `scripts/case-results.json`, extracted from the SiteSucker
 * mirror in ~/Downloads/Cohen & Jaffe/Sitesucker/case-results/. Each record is
 * the recovery figure and case type parsed out of the page title, the narrative
 * from the page body, and the original URL path.
 *
 * ⚠️ CATEGORIES ARE DERIVED, NOT MIGRATED. The live site publishes no
 * structured category — only a case type embedded in each page title. Every
 * category here was matched from that title against the list in
 * `caseResultCategories.ts`. They are a reasonable reading of the titles, not
 * the firm's own classification, so they are worth a review pass.
 *
 * Two values are editorial rather than parsed, and should be checked:
 *   - "Policy Limits" on /case-results/traumatic-brain-injury-tbi/, whose page
 *     publishes no figure at all and says only that the insurer "paid their
 *     entire policy".
 *   - "Confidential" on the five results whose pages say exactly that.
 *
 * ⚠️ ONE-SHOT. This has already been run, and it is NOT idempotent any more.
 * It originally wrote a `sourcePath` field and matched on it when re-run, but
 * that field has served its purpose — the 60 redirects it was needed for are
 * written into `vercel.json` — and has been removed from the schema and unset
 * from the documents. With nothing to match on, a second run would create 60
 * duplicates, so it now refuses to start when the ledger is already populated.
 *
 * The paths themselves are not lost: they are still in `case-results.json`
 * beside this file, which is the record of what was imported and where each
 * result used to live.
 *
 * To re-import from scratch: delete the existing `caseResult` documents first.
 */
import { getCliClient } from "sanity/cli";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const client = getCliClient();
const here = dirname(fileURLToPath(import.meta.url));

interface Record {
  recovered: string;
  category: string;
  summary: string;
  sourcePath: string;
}

const records: Record[] = JSON.parse(readFileSync(resolve(here, "case-results.json"), "utf8"));

async function main() {
  const existing = await client.fetch<number>(`count(*[_type == "caseResult"])`);
  if (existing > 0) {
    console.error(
      `Refusing to run: ${existing} caseResult documents already exist.\n` +
        "This import is one-shot — there is no key left to match on, so running it\n" +
        "again would create duplicates. Delete the existing documents first if you\n" +
        "really mean to re-import.",
    );
    process.exit(1);
  }

  // One transaction: 60 separate requests is slow, and a failure part-way
  // through would leave a half-migrated dataset behind.
  const tx = client.transaction();
  for (const record of records) {
    const { sourcePath, ...fields } = record;
    void sourcePath; // kept in the JSON as the import's record; not stored in Sanity
    tx.create({ _type: "caseResult", ...fields });
  }
  await tx.commit();

  console.log(`Done — ${records.length} case results created.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
