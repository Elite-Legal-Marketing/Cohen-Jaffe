/**
 * Seed the `/thank-you/` page singleton.
 *
 *   npx sanity exec scripts/seed-thank-you-page.ts --with-user-token
 *
 * From `CJ - Thank You.dc.html`, minus the gold checkmark medallion the board
 * opens with — removed on the client's instruction (2026-09-08), since the
 * eyebrow already says "Request received" in words.
 *
 * ⚠️ THE FOUR CARDS ARE LEGAL ADVICE. Unlike most artboard copy they hold up
 * against the live site's own accident pages, and they are general and
 * cautionary rather than specific to any case — which is what keeps them safe on
 * a page shown to someone who has just described their accident. They are
 * editable now, and that cuts both ways: whoever edits them is editing advice.
 *
 * ⚠️ NO NUMBERS IN THE DATA. The cards' "01"…"04" are their POSITION, rendered
 * by the page — reordering in the Studio renumbers them. See `waitStep.ts`.
 *
 * ⚠️ THREE OF THE FOUR LINKS POINT AT PAGES THAT DO NOT EXIST YET —
 * `/about/attorneys/`, `/blog/` and `/about/case-results/`. They are the board's
 * own destinations and all three are already in the nav, so they go live with
 * those pages.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const PAGE = {
  _id: "thankYouPage",
  _type: "thankYouPage",
  eyebrow: "Request received",
  heading: "Thank you. We have your request.",
  lead: "An attorney from our office will reach out within one business day — usually much sooner. If it is urgent, or you would rather not wait, call us now. Someone answers at any hour.",
  cta: { _type: "ctaLink", label: "Meet our team", href: "/about/attorneys/" },
  waitEyebrow: "While you wait",
  waitHeading: "Four things worth doing today.",
  steps: [
    {
      _type: "waitStep",
      _key: "recorded-statement",
      title: "Do not give a recorded statement",
      body: "Be polite with the adjuster, but wait until you have spoken with a lawyer.",
    },
    {
      _type: "waitStep",
      _key: "photograph",
      title: "Photograph everything",
      body: "Injuries, vehicles, the scene, and anything that will be repaired or cleaned up.",
    },
    {
      _type: "waitStep",
      _key: "documents",
      title: "Keep every document",
      body: "Bills, discharge papers, out-of-work notes, and correspondence from any insurer.",
    },
    {
      _type: "waitStep",
      _key: "treatment",
      title: "Follow your treatment",
      body: "Gaps in treatment are the first thing an insurer uses to argue you were not hurt.",
    },
  ],
  readHeading: "Read while you wait",
  readLead:
    "Our attorneys explain the deadlines, the insurance tactics, and what your case may be worth.",
  readPrimary: { _type: "ctaLink", label: "Read the blog", href: "/blog/" },
  readSecondary: { _type: "ctaLink", label: "See case results", href: "/about/case-results/" },
};

async function main() {
  const existing = await client.fetch<boolean>(`defined(*[_id == "thankYouPage"][0]._id)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "thankYouPage already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }
  await client.createOrReplace(PAGE);
  console.log("Done — thankYouPage seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
