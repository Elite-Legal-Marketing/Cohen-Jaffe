/**
 * One-shot: strip the "Long Island " prefix from `practiceArea.linkLabel`.
 *
 * The homepage practice-areas section renders `linkLabel` as its ghost button
 * (`.pa__cta` in `PracticeAreas.astro`), and the client asked for the place
 * name off those buttons. `src/data/homePracticeAreas.ts` and
 * `seed-practice-areas.ts` are already updated; this brings the eight LIVE
 * documents into line so the prefix does not come back when the section is
 * wired to Sanity in Phase C.
 *
 * WHY NOT JUST RE-RUN THE SEED: `seed-practice-areas.ts` writes with
 * `createOrReplace`, so it would rebuild all 47 documents from the seed array
 * and silently discard anything an editor has changed in the Studio since —
 * and we know the Studio is in use (an attorney's role was edited there). This
 * touches ONE field on eight documents and leaves every other field alone.
 *
 * It is also deliberately conservative: a document whose `linkLabel` is
 * neither the old value nor the new one has been edited by hand, so it is
 * reported and SKIPPED rather than overwritten. Re-running the script is safe
 * — a document already carrying the new label is a no-op.
 *
 *   npx sanity exec scripts/patch-practice-area-link-labels.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

/**
 * The eight areas that carry a link label, as `seed-practice-areas.ts` seeds
 * them. `from` is asserted against what is actually stored, so a drifted
 * document is caught rather than clobbered.
 */
const LABELS = [
  { slug: "long-island-car-accident-lawyer", from: "Long Island car accident lawyers", to: "Car accident lawyers" },
  { slug: "long-island-truck-accident-lawyer", from: "Long Island truck accident lawyers", to: "Truck accident lawyers" },
  { slug: "long-island-construction-accident-lawyer", from: "Long Island construction accident lawyers", to: "Construction accident lawyers" },
  { slug: "long-island-slip-and-fall-lawyer", from: "Long Island slip and fall lawyers", to: "Slip and fall lawyers" },
  { slug: "long-island-premises-liability-lawyer", from: "Long Island premises liability lawyers", to: "Premises liability lawyers" },
  { slug: "long-island-wrongful-death-lawyer", from: "Long Island wrongful death lawyers", to: "Wrongful death lawyers" },
  { slug: "long-island-motorcycle-accident-lawyer", from: "Long Island motorcycle accident lawyers", to: "Motorcycle accident lawyers" },
  { slug: "long-island-medical-malpractice-lawyer", from: "Long Island medical malpractice lawyers", to: "Medical malpractice lawyers" },
];

/** Hyphens only: no dots (non-public), no slashes (not a valid id). */
const idFor = (slug: string) => `practice-area-${slug.replace(/\//g, "-")}`;

async function main() {
  // The collection is 47 documents. A different count means this is not the
  // dataset the labels were written against — stop before writing anything.
  const total = await client.fetch<number>(`count(*[_type == "practiceArea"])`);
  if (total !== 47) {
    throw new Error(`Expected 47 practiceArea documents, found ${total}. Aborting without writing.`);
  }

  const ids = LABELS.map((l) => idFor(l.slug));
  const docs = await client.fetch<{ _id: string; linkLabel?: string }[]>(
    `*[_type == "practiceArea" && _id in $ids]{ _id, linkLabel }`,
    { ids },
  );
  const byId = new Map(docs.map((d) => [d._id, d]));

  const missing = LABELS.filter((l) => !byId.has(idFor(l.slug)));
  if (missing.length) {
    throw new Error(`Missing documents, aborting: ${missing.map((l) => idFor(l.slug)).join(", ")}`);
  }

  const toPatch: { id: string; to: string }[] = [];
  const skipped: string[] = [];
  const drifted: string[] = [];

  for (const label of LABELS) {
    const id = idFor(label.slug);
    const current = byId.get(id)?.linkLabel;
    if (current === label.to) skipped.push(`${id} (already "${label.to}")`);
    else if (current === label.from) toPatch.push({ id, to: label.to });
    else drifted.push(`${id} — stored "${current ?? "(empty)"}", expected "${label.from}"`);
  }

  for (const line of skipped) console.log(`  skip   ${line}`);
  for (const line of drifted) console.log(`  DRIFT  ${line}`);

  if (!toPatch.length) {
    console.log(`\nNothing to write. ${skipped.length} already correct, ${drifted.length} drifted.`);
    return;
  }

  // One transaction: all eight land, or none do.
  const tx = toPatch.reduce(
    (t, { id, to }) => t.patch(id, (p) => p.set({ linkLabel: to })),
    client.transaction(),
  );
  await tx.commit();

  for (const { id, to } of toPatch) console.log(`  patch  ${id} → "${to}"`);
  console.log(
    `\nDone — ${toPatch.length} patched, ${skipped.length} already correct, ${drifted.length} left alone.`,
  );
  if (drifted.length) console.log("A drifted document was edited by hand; change it in the Studio.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
