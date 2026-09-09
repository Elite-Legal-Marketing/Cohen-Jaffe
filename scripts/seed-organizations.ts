/**
 * Seed the organizations the firm supports.
 *
 *   npx sanity exec scripts/seed-organizations.ts --with-user-token
 *
 * The list, and every note on where it came from, is in `./organizations.ts`.
 * This script only writes it.
 *
 * ── RE-RUNNING ──────────────────────────────────────────────────────────────
 *
 * ⚠️ THIS IS `createOrReplace`, so it is idempotent against the list above and
 * a loaded gun once the Studio has been used — a re-run reverts every editor
 * fix with nothing to show that it did. Guarded: if any organization already
 * exists the script reports and stops. `SEED_OVERWRITE=1` forces it. After the
 * first run, prefer a targeted `patch`.
 *
 * Ids are `organization-<slugified name>`. ⚠️ A Sanity document id may contain
 * neither a dot (the document silently becomes non-public — the Studio and CLI
 * show it while the site dereferences it to null) nor a slash.
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
  const ids = ORGANIZATIONS.map((o) => id(o.name));

  const existing = await client.fetch<string[]>(`*[_type == "organization"]._id`);
  if (existing.length > 0 && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      `${existing.length} organization document(s) already exist — refusing to overwrite editor changes.\n` +
        "Re-run with SEED_OVERWRITE=1 if replacing them is what you want.",
    );
    return;
  }

  const tx = ORGANIZATIONS.reduce(
    (t, org, i) =>
      t.createOrReplace({
        _id: ids[i],
        _type: "organization",
        name: org.name,
        ...(org.href ? { href: org.href } : {}),
        note: org.note,
      }),
    client.transaction(),
  );

  await tx.commit();

  console.log(`Done — ${ORGANIZATIONS.length} organizations seeded.`);
  const unlinked = ORGANIZATIONS.filter((o) => !o.href).map((o) => o.name);
  if (unlinked.length) console.log(`  no website (by design): ${unlinked.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
