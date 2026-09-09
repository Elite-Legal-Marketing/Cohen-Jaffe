/**
 * Seed the homepage's "In the community" band.
 *
 *   npx sanity exec scripts/seed-home-community.ts --with-user-token
 *
 * Writes ONE field — `community` — on the `homePage` singleton, with
 * `createIfNotExists` then `patch().set()`. Never `createOrReplace`: that would
 * take the other twelve sections down with it.
 *
 * Guarded. `.set()` replaces the whole section, so once an editor has tuned this
 * copy a second run would discard their work. `SEED_OVERWRITE=1` forces it.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * Moved verbatim from the `COMMUNITY` constant in `src/components/Community.astro`,
 * which this replaces. From `Cohen & Jaffe Homepage v1.dc.html` markup 678-706.
 *
 * ⚠️ "A promise Stephen made to his grandchildren." IS THE BOARD'S LINE AND IS
 * UNSOURCED. The fund, the 2014 date, the purpose and "founding partner" all
 * check out against the live `/about/our-community/` page; the promise does
 * not — it is a narrative claim about a real bereavement, on legal
 * advertising. Seeded as drawn on the client's instruction, and it is on the
 * list to confirm or replace before launch. Modelling it is what makes that fix
 * a Studio edit rather than a deploy.
 *
 * ⚠️ THE ORGANIZATIONS ARE NOT SEEDED HERE and have no field. They are the
 * `organization` collection — `scripts/organizations.ts` — read in full by both
 * this band and `/about/our-community/`.
 *
 * The card's link goes to the fund's OWN site, which is what the live page
 * links the fund's name to; the button goes to `/about/our-community/`, which
 * this band is the only route to.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const SECTION = {
  _type: "communitySection",
  eyebrow: "In the community",
  heading: "We're from here.",
  featureLabel: "The Reagan and Jax Cohen Memorial Fund",
  featureHeading: "A promise Stephen made to his grandchildren.",
  featureBody:
    "In 2014, founding partner Stephen Cohen lost his two young grandchildren. The fund in their names supports organizations working for the health of children.",
  featureLink: {
    _type: "textLink",
    label: "About the fund",
    href: "https://www.reaganjax.memorial/",
  },
  cta: {
    _type: "ctaLink",
    label: "More ways we show up",
    href: "/about/our-community/",
  },
};

async function main() {
  /**
   * ⚠️ A DRAFT SHADOWS EVERYTHING THIS SCRIPT DOES. A patch lands on the
   * PUBLISHED document; the Studio renders the DRAFT when one exists. Seed over
   * an outstanding draft and the new content is invisible in the form while the
   * site renders it correctly, and publishing that draft then discards it.
   * `getDocument` resolves the id rather than running a query — `sanity
   * documents query` defaults to an api-version whose perspective EXCLUDES
   * drafts.
   */
  const draft = await client.getDocument("drafts.homePage");
  if (draft) {
    console.log(
      "⚠️  drafts.homePage EXISTS — refusing to seed.\n" +
        "Publish or discard the draft in the Studio first, then re-run.",
    );
    return;
  }

  const existing = await client.fetch<boolean>(`defined(*[_id == "homePage"][0].community)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "homePage.community already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }

  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client.patch("homePage").set({ community: SECTION }).commit();

  console.log(`Done — community set: "${SECTION.heading}"`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
