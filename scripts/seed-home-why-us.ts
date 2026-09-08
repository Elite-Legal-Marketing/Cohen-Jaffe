/**
 * Seed the homepage's "Why Cohen & Jaffe" band.
 *
 *   npx sanity exec scripts/seed-home-why-us.ts --with-user-token
 *
 * Writes ONE field — `whyUs` — on the `homePage` singleton, with
 * `createIfNotExists` then `patch().set()`. Never `createOrReplace`: that would
 * take the hero, stats, case results, "Our goals", the fee band, the practice
 * areas, the deadlines band, the testimonials and the attorneys band down with
 * it.
 *
 * Re-running is guarded. `.set()` replaces the whole section, so once an editor
 * has tuned this copy in the Studio a second run would silently discard their
 * work. If the section already exists the script reports and stops;
 * `SEED_OVERWRITE=1` forces it.
 *
 * ⚠️ THIS PATCHES THE PUBLISHED DOCUMENT ONLY, AND THE STUDIO SHOWS THE DRAFT.
 * If an unpublished `drafts.homePage` exists when this runs, the seeded content
 * is invisible in the Studio — the form renders the draft, which predates the
 * seed and has no `whyUs` — while the SITE renders it correctly, because the
 * unauthenticated client reads published. That split cost a session on
 * 2026-09-08: the band shipped, the public API returned it, the build rendered
 * all four reasons, and the Studio form sat empty. Worse, publishing the draft
 * then replaced the published document wholesale and DISCARDED the seeded
 * values.
 *
 * ⚠️ AND THE OBVIOUS CHECK DOES NOT SEE IT. `sanity documents query` defaults
 * to a recent `--api-version` whose perspective EXCLUDES drafts, so
 * `*[_id == "drafts.homePage"]` comes back empty against a dataset that has
 * one. Check with a direct `npx sanity documents get drafts.homePage` instead —
 * that resolves the id rather than running a perspective-filtered query.
 *
 * So before seeding ANY field on a singleton: confirm no draft exists, or
 * publish/discard it first. Every seed script in this directory has the same
 * exposure.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * Moved here verbatim from `src/data/homeWhyUs.ts`, which this replaces and
 * which is deleted in the same change. This script does not introduce a word:
 * it moves the copy approved on 2026-09-08 out of the repo and into Sanity.
 *
 * From the WHY COHEN & JAFFE band of `Cohen & Jaffe Homepage v1.dc.html`
 * (markup 579-618). ⚠️ FOUR OF THE FIVE COPY BLOCKS MAKE A STATEMENT OF FACT
 * about the firm or about a NAMED PERSON, on a page that is legal advertising,
 * so each was checked against the WordPress mirror in
 * `~/Downloads/Cohen & Jaffe/Sitesucker/`:
 *
 *   - "Six attorneys. More than twenty staff." — SOURCED, /about/: "a
 *     multi-lawyer firm that now boasts six attorneys and a support staff of
 *     more than 20". This is the same sentence that was cut from the attorneys
 *     band's closing banner; it is approved copy for THIS band.
 *   - "A century of combined experience" — SOURCED, /about/: "more than 100
 *     years of combined experience in plaintiff personal injury litigation".
 *   - "We are not afraid to try your case" — SUPPORTED: Jaffe is "our lead
 *     trial lawyer", a member of the New York State Trial Lawyers Association,
 *     and the firm's mission statement says "in and out of the courtroom".
 *   - "Calls returned within 24 hours, and a partner's cell phone" — SOURCED
 *     almost verbatim, live homepage: "Our Long Island accident lawyers return
 *     calls within 24 hours, and clients get Richard Jaffe's cell phone for
 *     24/7 accessibility". Generalised to "a partner's" so the promise survives
 *     the day it is somebody else's number.
 *
 * ⚠️ ONE LINE WAS CORRECTED, and it is the only departure from the artboard's
 * words. The board writes: "Richard Jaffe is a former firefighter and certified
 * EMT who STILL WORKS A WEEKLY SHIFT as a volunteer medic." Nothing in the
 * mirror supports a present tense or a frequency — /about/ says only "He has
 * experience as a firefighter, certified EMT (emergency medical technician) ...
 * Volunteering as a medic in Brentwood, he gained firsthand knowledge". "Still"
 * and "a weekly shift" are invented, about a REAL, NAMED person. The line below
 * says what the source says. Same treatment the deadlines band's corrected
 * lines got — see `scripts/seed-home-deadlines.ts`. DO NOT RESTORE THE BOARD'S
 * WORDING.
 *
 * ⚠️ STILL UNSOURCED: "A caseload we keep small on purpose." Nothing in the
 * mirror says it. It is a claim about how the firm operates that only the firm
 * can confirm — raised 2026-09-08, unanswered, and left in as approved artboard
 * copy. It is now editable in the Studio, which is the right place to fix it
 * when the answer comes.
 *
 * ── WHY THERE ARE FOUR AND WHY THERE IS NO ICON FIELD ───────────────────────
 *
 * FOUR is structural: the row is a four-across grid that folds to two and then
 * to one, so four divides cleanly at every breakpoint and a fifth strands
 * itself. The four glyphs live in `src/assets/icons/why/` and are matched to
 * these rows BY POSITION in `WhyUs.astro` — there is no icon field, reordering
 * in the Studio moves the words and not the pictures, and a fifth row would
 * wrap back to the first icon.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const SECTION = {
  _type: "whyUsSection",
  eyebrow: "Why Cohen & Jaffe",
  heading: "This is the firm you want on your side.",
  lead: "Six attorneys. More than twenty staff. A caseload we keep small on purpose.",
  reasons: [
    {
      _type: "whyReason",
      _key: "why-experience",
      title: "Insurance companies know our name.",
      body: "A century of combined experience in the Nassau, Suffolk, and Queens courts.",
    },
    {
      _type: "whyReason",
      _key: "why-trial",
      title: "We are not afraid to try your case.",
      body: "When trying it is what gets you more, we try it.",
    },
    {
      _type: "whyReason",
      _key: "why-medical",
      title: "A trained EMT reads your medical file.",
      body: "Richard Jaffe is a former firefighter and certified EMT who volunteered as a medic in Brentwood.",
    },
    {
      _type: "whyReason",
      _key: "why-access",
      title: "You will reach us when you need us.",
      body: "Calls returned within 24 hours, and a partner's cell phone for real access.",
    },
  ],
};

async function main() {
  const existing = await client.fetch<boolean>(`defined(*[_id == "homePage"][0].whyUs)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "homePage.whyUs already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }

  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client.patch("homePage").set({ whyUs: SECTION }).commit();

  console.log(`Done — whyUs set: ${SECTION.reasons.length} reasons.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
