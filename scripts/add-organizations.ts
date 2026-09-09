/**
 * Add organizations that are not in the dataset yet, leaving existing ones alone.
 *
 *   npx sanity exec scripts/add-organizations.ts --with-user-token
 *
 * `seed-organizations.ts` is `createOrReplace`, so once the Studio has been
 * used it refuses to run rather than revert an editor's fixes. This is the
 * additive half: it reads the same canonical list from `./organizations.ts`,
 * works out which ids are missing, and `createIfNotExists` for only those.
 * Re-running it on an unchanged dataset does nothing.
 *
 * Written for the five the first pass missed — Holy Family, CMSA Long Island,
 * the All Kids Fair, the Over 50 Fair and the Health & Wellness Fest — but it
 * is not specific to them: add a name to `./organizations.ts` and run this.
 *
 * ⚠️ IT DOES NOT UPDATE EXISTING DOCUMENTS. If the canonical list changes a
 * `note` or an `href` on an organization that already exists, this will not
 * notice. That is deliberate — it is the guarantee that makes it safe to run
 * against a dataset editors have touched. Use a targeted `patch` for edits.
 */
import { getCliClient } from "sanity/cli";

import { ORGANIZATIONS } from "./organizations";

const client = getCliClient();

const id = (name: string) =>
  `organization-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;

async function main() {
  const existing = new Set(await client.fetch<string[]>(`*[_type == "organization"]._id`));

  const missing = ORGANIZATIONS.filter((org) => !existing.has(id(org.name)));

  if (missing.length === 0) {
    console.log(`Nothing to add — all ${existing.size} organizations already exist.`);
    return;
  }

  const tx = missing.reduce(
    (t, org) =>
      t.createIfNotExists({
        _id: id(org.name),
        _type: "organization",
        name: org.name,
        ...(org.href ? { href: org.href } : {}),
        note: org.note,
      }),
    client.transaction(),
  );

  await tx.commit();

  console.log(`Added ${missing.length}: ${missing.map((o) => o.name).join(", ")}`);
  console.log(`Total now ${existing.size + missing.length}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
