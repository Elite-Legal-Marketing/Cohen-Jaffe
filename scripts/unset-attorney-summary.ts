/**
 * Drops the retired `summary` ("Card blurb") field from the six attorneys.
 *
 *   npx sanity exec scripts/unset-attorney-summary.ts --with-user-token
 *
 * One-shot, and safe to re-run — `unset` on a field that is already gone is a
 * no-op. It exists because removing a field from the schema does NOT remove it
 * from documents already holding it: the Studio stops showing the value but
 * `sanity documents validate` reports every one as an unknown field.
 *
 * A patch rather than a re-run of `seed-attorneys.ts`. That seed is
 * `createOrReplace`, so it would have dropped the field as a side effect — and
 * taken any edit an editor has made in the Studio down with it. This touches
 * exactly the one field.
 *
 * ⚠️ `unset` takes TOP-LEVEL field names here. The array form
 * `unset(["path.array[].field"])` silently matches nothing; that needs an
 * explicit `_key` in the path.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

async function main() {
  const ids: string[] = await client.fetch(`*[_type == "attorney" && defined(summary)]._id`);

  if (ids.length === 0) {
    console.log("Nothing to do — no attorney still carries `summary`.");
    return;
  }

  const tx = ids.reduce(
    (transaction, id) => transaction.patch(id, (patch) => patch.unset(["summary"])),
    client.transaction(),
  );
  await tx.commit();

  console.log(`Unset \`summary\` on ${ids.length} attorneys:`);
  for (const id of ids) console.log(`  ${id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
