/**
 * Seed the homepage's FAQ band.
 *
 *   npx sanity exec scripts/seed-home-faqs.ts --with-user-token
 *
 * Writes ONE field — `faqs` — on the `homePage` singleton, with
 * `createIfNotExists` then `patch().set()`. Never `createOrReplace`: that would
 * take the other eleven sections down with it.
 *
 * ⚠️ THIS PATCHES THE PUBLISHED DOCUMENT; THE STUDIO SHOWS THE DRAFT. If an
 * unpublished `drafts.homePage` exists when this runs, the seeded content is
 * invisible in the Studio while the SITE renders it correctly — and publishing
 * that draft then discards it. Check with `npx sanity documents get
 * drafts.homePage`, NOT `sanity documents query`, whose default api-version
 * perspective excludes drafts and returns empty against a dataset that has one.
 *
 * ── THE EIGHT ──────────────────────────────────────────────────────────────
 *
 * Chosen against the artboard's own eight intents — fees, case value,
 * deadlines, no-fault, the insurance release, a first offer, changing lawyers,
 * and court — under two rules:
 *
 *   - None of the twelve migrated titles that are NOT questions (see
 *     `review.notQuestions` in `scripts/faqs.json`). They read badly under a
 *     heading that says "Frequently asked questions".
 *   - Broadly applicable over practice-specific: "What fees are involved with a
 *     personal injury case?" rather than the birth-injury or motorcycle version
 *     of the same question.
 *
 * The references are STRONG, so an FAQ cannot be deleted while the homepage
 * points at it. That is the usual trade and it is the right one here.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const SLUGS = [
  "what-fees-are-involved-with-a-personal-injury-case",
  "how-much-is-my-car-accident-settlement-worth-in-new-york",
  "what-is-the-car-accident-statute-of-limitations-in-new-york",
  "is-new-york-a-no-fault-state",
  "should-i-sign-an-insurance-company-release",
  "it-seems-like-the-insurance-company-is-making-a-good-offer-and-i-have-bills-now",
  "can-you-switch-personal-injury-lawyers",
  "do-you-have-to-go-to-court-for-a-car-accident",
];

const SECTION = {
  _type: "faqSection",
  eyebrow: "Answers, upfront",
  heading: "Frequently asked questions",
  lead: "Pick what is on your mind. No forms and no fine print — just the answers we give people on the phone every day.",
  faqs: SLUGS.map((slug) => ({
    _type: "reference",
    _key: slug.slice(0, 40),
    _ref: `faq-${slug}`,
  })),
  closingHeading: "Still have a question about your own situation?",
  closingLead: "Ask an attorney directly — free, and nothing you say obligates you to hire us.",
  closingCta: { _type: "ctaLink", label: "Ask us anything", href: "/contact/" },
};

async function main() {
  // A reference to a document that does not exist publishes fine and then
  // dereferences to null on the site, so check before writing rather than
  // after the build dies.
  const missing = await client.fetch<string[]>(
    `$ids[!(@ in *[_type == "faq"]._id)]`,
    { ids: SLUGS.map((slug) => `faq-${slug}`) },
  );
  if (missing.length > 0) {
    throw new Error(`These FAQs do not exist yet:\n  ${missing.join("\n  ")}`);
  }

  const existing = await client.fetch<boolean>(`defined(*[_id == "homePage"][0].faqs)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "homePage.faqs already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }

  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client.patch("homePage").set({ faqs: SECTION }).commit();

  console.log(`Done — homePage.faqs set: ${SLUGS.length} questions.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
