/**
 * Seed the `/about/our-community/` singleton.
 *
 *   npx sanity exec scripts/seed-community-page.ts --with-user-token
 *
 * Guarded: if the document already has a heading the script reports and stops,
 * so it cannot revert an editor's work. `SEED_OVERWRITE=1` forces it.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * ⚠️ ALMOST NONE OF THIS IS THE ARTBOARD'S COPY, and that is the point.
 * `CJ - Community.dc.html` was checked line by line against the LIVE
 * `/about/our-community/` page (refetched 2026-09-09, byte-identical to the
 * SiteSucker mirror). What the board invented was replaced with the live
 * site's own words:
 *
 *   H1              board: "This is our neighborhood too." over the kicker
 *                   "Our community focus". The live page uses "Our Community
 *                   Focus" AS its H1, and that is also the URL, the nav item,
 *                   the footer link and the browser title — five things now
 *                   saying one thing. The board's kicker became the H1, so its
 *                   heading "Why we show up" moved up to be the kicker.
 *   Intro heading   board: "Fifty years in one community earns you a
 *                   responsibility to it." ZERO hits for "fifty years" across
 *                   the live site and the 217-page mirror. The firm advertises
 *                   "100 years combined", which is a different claim about
 *                   different people.
 *   Intro copy      board: one paragraph rewritten from a DIFFERENT page's
 *                   opening, plus one invented ("charity rides, toy runs, golf
 *                   outings… most of them run by people we have known for
 *                   decades"). Replaced with four paragraphs from the live
 *                   page, carrying what the sections below do not — including
 *                   what the firm's people personally do, which the board
 *                   ignored entirely.
 *   Orgs lead       board: "Some of these we have supported for twenty years.
 *                   Others started with a client who told us about a group that
 *                   needed help, and we showed up." Invented on both counts —
 *                   nothing dates these relationships and no client is recorded
 *                   as introducing one.
 *
 * The MEMORIAL is the board's own words, kept because they are accurate to the
 * live page's account: the 2014 accident, both children, their ages, their
 * grandmother, and the outing at Pine Hollow.
 *
 * ⚠️ THE MEMORIAL PULL QUOTE IS THE ONE SURVIVING INVENTION. "Every family we
 * represent has lost something…" appears nowhere. It is attributed to the firm
 * rather than to a person, which is the only reason it is less serious than the
 * board's other inventions. Confirm or replace before launch.
 *
 * ⚠️ THE QUOTES IN THE INTRO CARD ARE REAL AND VERBATIM, which is worth saying
 * because so little else on this board was. Both are on the live
 * `/about/community-scholarship/` page, printed there as Richard Jaffe's words.
 *
 * ⚠️ MARIA FIORE IS A NAMED REAL PERSON and a paralegal, not an attorney. The
 * live page names her; if she leaves the firm, that sentence goes with her.
 *
 * ── PORTABLE TEXT KEYS ──────────────────────────────────────────────────────
 *
 * `_key`s are a deterministic counter, not `randomKey`, so re-running against
 * unchanged source produces an identical document and a diff answers "did the
 * copy change?". Same convention as `faq-extract.ts`.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

/** Deterministic block keys — see the note above. */
let n = 0;
const paragraph = (text: string) => {
  n += 1;
  return {
    _type: "block",
    _key: `intro-${n}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `intro-${n}-0`, text, marks: [] }],
  };
};

const PAGE = {
  _id: "communityPage",
  _type: "communityPage",

  eyebrow: "Why we show up",
  heading: "Our Community Focus",
  lead: "Our entire team strives to serve the community through volunteer work in a wide variety of organizations — sometimes with legal help, and just as often with our time.",

  introHeading: "Not all of it is legal work.",
  introBody: [
    paragraph(
      "The attorneys and staff at the Law Office of Cohen & Jaffe are committed to the Long Island communities where we live and work. Some of that service is legal. Much of it is not — it goes to health, to youth development, and to the families who need the help most.",
    ),
    paragraph(
      "Richard Jaffe has served as a volunteer firefighter and medic with the Jericho Fire Department and as a medic for Brentwood Legion Ambulance. He has coached basketball for the Jericho Athletic Association and lacrosse at the Jericho Lacrosse Club, and he helped victims of 9/11 through Trial Lawyers Care. He still volunteers as a small claims court arbitrator and sits as a mediator for the Supreme Court of New York.",
    ),
    paragraph(
      "It is not only the attorneys. Paralegal Maria Fiore volunteers at her church’s food pantry, and the firm has given to the Tuberous Sclerosis Alliance for every like its Facebook page received.",
    ),
    paragraph(
      "We represent injured people and people who have suffered discrimination at work, so a good deal of our practice is already spent improving lives in this community. The rest is what our attorneys and staff do with their own time.",
    ),
  ],
  introQuote: {
    _type: "attorneyQuote",
    text: "Community service represents a critical aspect of our firm.",
    attorney: { _type: "reference", _ref: "attorney-richard-jaffe" },
  },
  introQuoteBody:
    "To further extend our commitment to giving back to the community, we want to help today’s young volunteers succeed in their academic and professional pursuits. When they venture out into their own careers, they will, in a way, be continuing our legacy.",

  orgsEyebrow: "Organizations we support",
  orgsHeading: "Where our time and money go.",
  orgsLead:
    "A small sample of the many ways our attorneys and staff give their time to help make Long Island a better place.",

  memorialEyebrow: "In memoriam",
  memorialHeading: "The Reagan and Jax Memorial Golf Outing",
  memorialBody:
    "Held each year at Pine Hollow Country Club in East Norwich, the outing is a memorial to Stephen Cohen’s two grandchildren — three-year-old Reagan Cohen and eighteen-month-old Jaxson Cohen — who died in an ATV accident while visiting their grandparents in 2014. The children’s grandmother, Renee Monroe, died in the accident as well.",
  memorialQuote:
    "Every family we represent has lost something. Ours is no different, and it is why we do not treat any of this as routine.",
  memorialNote:
    "Proceeds from the outing support the causes the family cares about most, including organizations serving children and families in crisis on Long Island.",
  memorialLink: {
    _type: "textLink",
    label: "About the fund",
    href: "https://www.reaganjax.memorial/",
  },
};

async function main() {
  const draft = await client.getDocument("drafts.communityPage");
  if (draft) {
    console.log(
      "⚠️  drafts.communityPage EXISTS — refusing to seed.\n" +
        "Publish or discard the draft in the Studio first, then re-run.",
    );
    return;
  }

  const existing = await client.fetch<boolean>(`defined(*[_id == "communityPage"][0].heading)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "communityPage already has content — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }

  await client.createOrReplace(PAGE);

  console.log(`Done — communityPage seeded: "${PAGE.heading}" (${PAGE.introBody.length} paragraphs)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
