/**
 * Seed the homepage's "Not sure if you have a case?" banner.
 *
 *   npx sanity exec scripts/seed-home-case-banner.ts --with-user-token
 *
 * Writes ONE field — `caseBanner` — on the `homePage` singleton, with
 * `createIfNotExists` then `patch().set()`. Never `createOrReplace`: that would
 * take all ten of the other sections down with it.
 *
 * Re-running is guarded. `.set()` replaces the whole section, so once an editor
 * has tuned this copy in the Studio a second run would silently discard their
 * work. If the section already exists the script reports and stops;
 * `SEED_OVERWRITE=1` forces it.
 *
 * ⚠️ CHECK FOR A DRAFT BEFORE RUNNING THIS. See the block below — it is the
 * same warning `seed-home-why-us.ts` carries, and it is here because it has
 * already cost a session once.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * Moved here verbatim from `src/data/homeCaseBanner.ts`, which this replaces
 * and which is deleted in the same change. Both strings are the artboard's own
 * words, from `Cohen & Jaffe Homepage v1.dc.html` markup 621-628. Neither makes
 * a claim of fact about the firm or about a named person, so unlike the why-us
 * and deadlines bands there was nothing here to check against the WordPress
 * mirror.
 *
 * The board gives the button `href="#"`. `/contact/` is where the deadlines
 * band's CTA already points, and it is the URL `navigation.ts` carries for the
 * top-level Contact item.
 *
 * ⚠️ THE PHONE NUMBER IS NOT SEEDED HERE AND HAS NO FIELD. The board writes the
 * second button as "Call 516-358-6900"; the component reads the number from
 * Site Settings through `getFirm()` and composes the label, so it cannot drift
 * from the header, the drawer, the footer and the fee explainer. AGENTS.md
 * rule 9.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const SECTION = {
  _type: "caseBannerSection",
  heading: "Not sure if you have a case?",
  cta: {
    _type: "ctaLink",
    label: "Free case review",
    href: "/contact/",
  },
};

async function main() {
  /**
   * ⚠️ A DRAFT SHADOWS EVERYTHING THIS SCRIPT DOES. A patch lands on the
   * PUBLISHED document; the Studio renders the DRAFT when one exists. Seed over
   * an outstanding draft and the new content is invisible in the form — while
   * the site renders it perfectly, because the unauthenticated client reads
   * published — and publishing that draft then replaces published wholesale and
   * discards what was seeded. That is exactly what happened to the why-us band
   * on 2026-09-08.
   *
   * `client.getDocument` resolves the id rather than running a query, which
   * matters: `sanity documents query` defaults to a recent API version whose
   * perspective EXCLUDES drafts, so `*[_id == "drafts.homePage"]` comes back
   * empty against a dataset that has one.
   */
  const draft = await client.getDocument("drafts.homePage");
  if (draft) {
    console.log(
      "⚠️  drafts.homePage EXISTS — refusing to seed.\n" +
        "The Studio shows the draft, so seeded content would be invisible there,\n" +
        "and publishing the draft would discard it. Publish or discard the draft\n" +
        "in the Studio first, then re-run this script.",
    );
    return;
  }

  const existing = await client.fetch<boolean>(`defined(*[_id == "homePage"][0].caseBanner)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "homePage.caseBanner already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }

  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client.patch("homePage").set({ caseBanner: SECTION }).commit();

  console.log(`Done — caseBanner set: "${SECTION.heading}"`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
