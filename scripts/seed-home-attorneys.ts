/**
 * Seed the homepage's attorneys band.
 *
 *   npx sanity exec scripts/seed-home-attorneys.ts --with-user-token
 *
 * Writes ONE field — `attorneys` — on the `homePage` singleton, with
 * `createIfNotExists` then `patch().set()`. Never `createOrReplace`: that would
 * take the hero, stats, case results, "Our goals", the fee band, the practice
 * areas, the deadlines band and the testimonials down with it.
 *
 * Re-running is guarded. `.set()` replaces the whole section, so once an editor
 * has tuned this copy in the Studio a second run would silently discard their
 * work. If the section already exists the script reports and stops;
 * `SEED_OVERWRITE=1` forces it.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * Moved here from `src/data/homeAttorneys.ts`, which this replaces. Every value
 * below is the copy that was approved on 2026-09-08 — this script does not
 * introduce a word, it moves three strings out of the repo and into Sanity.
 *
 * ⚠️ THE HEADING DROPS THE ARTBOARD'S "three", on the client's instruction. It
 * has been both ways twice: the word went when the band briefly carried all six
 * attorneys, came back when it was cut to the three partners, and has now gone
 * again by choice rather than by arithmetic. Three cards are shown and the line
 * no longer counts them. Do not "correct" it back to the board.
 *
 * ⚠️ THE BUTTON IS THE BAND'S ONLY ROUTE TO THE ATTORNEYS LISTING. The board
 * pairs it with three circular staff portraits and the line "Six attorneys and
 * a support staff of more than twenty, including…"; the portraits went, then
 * the line, then the hairline over it, all on the client's instruction — so
 * there is no `footNote` field and nothing else in the band links to
 * `/about/attorneys/`.
 *
 * ⚠️ WHO APPEARS IS A PROPERTY OF THIS SECTION, not of the people. The three
 * partners are referenced here in order; McNaughton, Sawicki and Parnell are
 * not selected rather than missing, and there is no `featured` flag on
 * `attorney` to add. All six still belong on `/about/attorneys/` when that page
 * is built. See AGENTS.md rule 7.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

/**
 * Document ids, not slugs. `seed-attorneys.ts` derives them as
 * `attorney-<slug>` — hyphens throughout, because a Sanity `_id` may contain
 * neither a dot (which would make the document non-public) nor a slash.
 */
const ATTORNEY_IDS = [
  "attorney-stephen-cohen",
  "attorney-richard-jaffe",
  "attorney-stephen-tiger",
];

const SECTION = {
  _type: "attorneysSection",
  eyebrow: "Our attorneys",
  heading: "The people who will actually work your case.",
  cta: {
    _type: "ctaLink",
    label: "Meet the Full Team",
    href: "/about/attorneys/",
  },
  attorneys: ATTORNEY_IDS.map((id) => ({
    _type: "reference",
    _key: id,
    _ref: id,
  })),
};

async function main() {
  const existing = await client.fetch<boolean>(`defined(*[_id == "homePage"][0].attorneys)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "homePage.attorneys already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }

  const found = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: ATTORNEY_IDS });
  const missing = ATTORNEY_IDS.filter((id) => !found.includes(id));
  if (missing.length > 0) {
    throw new Error(
      `Missing attorney documents: ${missing.join(", ")}. Run seed-attorneys.ts first.`,
    );
  }

  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client.patch("homePage").set({ attorneys: SECTION }).commit();

  console.log(`Done — attorneys set: ${SECTION.attorneys.length} references.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
