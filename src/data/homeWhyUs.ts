/**
 * The homepage "Why Cohen & Jaffe" band — the HARDCODED STAGE.
 *
 * Per AGENTS.md → "build it, approve it, then wire it": the copy lives here
 * until the design is signed off, so a visual change costs an edit to one
 * constant rather than a schema change, a re-seed and a typegen run. Once
 * approved this becomes a `whyUsSection` object on the `homePage` singleton and
 * this file is deleted, the way `src/data/homeAttorneys.ts` was.
 *
 * The shape below is the shape the eventual projection will produce, so wiring
 * is a swap rather than a rewrite.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * From the WHY COHEN & JAFFE band of `Cohen & Jaffe Homepage v1.dc.html`
 * (markup 579-618). Every claim was checked against the WordPress mirror in
 * `~/Downloads/Cohen & Jaffe/Sitesucker/`, because four of the five make a
 * statement of FACT about the firm or about a named person:
 *
 *   - "Six attorneys. More than twenty staff." — SOURCED, /about/: "a
 *     multi-lawyer firm that now boasts six attorneys and a support staff of
 *     more than 20". Note this is the same sentence that was cut from the
 *     attorneys band's closing banner; it is approved copy for THIS band.
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
 * mirror supports a present tense or a frequency — /about/ says only
 * "He has experience as a firefighter, certified EMT (emergency medical
 * technician) ... Volunteering as a medic in Brentwood, he gained firsthand
 * knowledge". "Still" and "a weekly shift" are invented, and they are invented
 * about a REAL, NAMED person, on a page that is legal advertising. The line
 * now says what the source says. Same treatment the deadlines band's three
 * corrected lines got — see `scripts/seed-home-deadlines.ts`.
 *
 * ⚠️ STILL UNSOURCED: "A caseload we keep small on purpose." Nothing in the
 * mirror says it. It is a claim about how the firm operates that only the firm
 * can confirm — raised 2026-09-08, and left in as approved artboard copy.
 */
export const HOME_WHY_US = {
  eyebrow: "Why Cohen & Jaffe",
  heading: "This is the firm you want on your side.",
  lead: "Six attorneys. More than twenty staff. A caseload we keep small on purpose.",
  /**
   * FOUR, and the count is structural — the row is a four-across grid that
   * folds to two and then to one, so four divides cleanly at every breakpoint
   * and a fifth would strand itself. The icons are matched BY POSITION in the
   * component, the way the "What you can expect" glyphs are.
   */
  reasons: [
    {
      title: "Insurance companies know our name.",
      body: "A century of combined experience in the Nassau, Suffolk, and Queens courts.",
    },
    {
      title: "We are not afraid to try your case.",
      body: "When trying it is what gets you more, we try it.",
    },
    {
      title: "A trained EMT reads your medical file.",
      body: "Richard Jaffe is a former firefighter and certified EMT who volunteered as a medic in Brentwood.",
    },
    {
      title: "You will reach us when you need us.",
      body: "Calls returned within 24 hours, and a partner's cell phone for real access.",
    },
  ],
} as const;
