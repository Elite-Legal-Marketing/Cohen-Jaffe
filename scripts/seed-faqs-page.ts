/**
 * Seed the `/faqs/` hub page singleton.
 *
 *   npx sanity exec scripts/seed-faqs-page.ts --with-user-token
 *
 * Guarded: if the document already exists it reports and stops, so a re-run
 * cannot quietly discard Studio edits. `SEED_OVERWRITE=1` forces it.
 *
 * ⚠️ THE QUOTE IS UNSOURCED AND ATTRIBUTED TO A REAL NAMED PERSON, on a page
 * that is legal advertising. "No question is too small to ask, and no call
 * obligates you to hire us." appears nowhere in the WordPress mirror and Richard
 * Jaffe has not been recorded saying it. It is seeded as the artboard wrote it
 * on the client's instruction (2026-09-08); the firm confirms or replaces it
 * before launch. The point of modelling it is that the fix is a Studio edit
 * rather than a deploy — same standing item as the homepage's "Our goals" quote.
 *
 * ⚠️ THE QUOTE'S GOLD MIDDLE CLAUSE IS GONE. The board sets "no call obligates
 * you to hire us" in gold; `attorneyQuote` deliberately has no `accent` field —
 * removed on the client's call because it costs an editor a decision about where
 * a sentence ends every time they write one.
 *
 * ⚠️ "MILLIONS / RECOVERED" IS THE ONE CLAIM WITH NO FIGURE BEHIND IT. The other
 * three hold up: "no fee unless we win" is the firm's standing promise and
 * "100 Years+" is `/about/`'s own "more than 100 years of combined experience".
 * The case-results ledger holds 60 real recoveries, so a real number is
 * available if the firm would rather print one.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const PAGE = {
  _id: "faqsPage",
  _type: "faqsPage",
  eyebrow: "Frequently asked questions",
  heading: "The questions people ask us first.",
  lead: "Straight answers about fees, deadlines, insurance adjusters, and what actually happens to a case in New York — no legalese, no obligation.",
  listEyebrow: "Browse by topic",
  listHeading: "Answers from the attorneys who handle these cases.",
  stats: [
    {
      _type: "stat",
      _key: "no-fee",
      figure: "No Fee",
      label: "Unless we win",
      body: "You pay nothing up front, and nothing at all unless we recover for you.",
    },
    {
      _type: "stat",
      _key: "we-travel",
      figure: "We Travel",
      label: "Home, hospital, or video",
      body: "If you cannot come to us, we come to you — anywhere on Long Island.",
    },
    {
      _type: "stat",
      _key: "millions",
      figure: "Millions",
      label: "Recovered",
      body: "Verdicts and settlements won for injured Long Islanders and their families.",
    },
    {
      _type: "stat",
      _key: "experience",
      figure: "100 Years+",
      label: "Of combined experience",
      body: "A century of courtroom-tested work in serious injury and accident claims.",
    },
  ],
  quote: {
    _type: "attorneyQuote",
    text: "No question is too small to ask, and no call obligates you to hire us. Ask, and then decide.",
    attorney: { _type: "reference", _ref: "attorney-richard-jaffe" },
  },
};

async function main() {
  const existing = await client.fetch<boolean>(`defined(*[_id == "faqsPage"][0]._id)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "faqsPage already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }
  await client.createOrReplace(PAGE);
  console.log("Done — faqsPage seeded.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
