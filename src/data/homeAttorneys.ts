/**
 * The homepage attorneys band — the HARDCODED STAGE.
 *
 * Per AGENTS.md → "build it, approve it, then wire it": the section's own copy
 * lives here until the design is signed off, so a visual change costs an edit
 * to one constant rather than a schema change, a re-seed and a typegen run.
 * Once approved this becomes an `attorneysSection` object on the `homePage`
 * singleton and this file is deleted, the way `src/data/homeReviews.ts` was.
 *
 * The ATTORNEYS THEMSELVES ARE NOT HARDCODED. Unlike the reviews band, this
 * section's cards draw on a collection that is already modelled, seeded and
 * carrying the firm's own published copy — duplicating six real people into a
 * throwaway file would mean re-typing content that is already correct, and
 * would move six portraits off the Sanity CDN and back again. So only the two
 * strings and the running ORDER are staged here; `index.astro` resolves the
 * slugs against the collection and hands the component the same shape the
 * eventual `attorneys[]->` projection will.
 *
 * ⚠️ THE HEADING DROPS THE ARTBOARD'S "three", on the client's instruction
 * (2026-09-08). It has been both ways: the word went when the band briefly
 * carried all six attorneys, came back when it was cut to the three partners,
 * and has now gone again by choice rather than by arithmetic. Three cards are
 * shown and the line no longer counts them, which is what the client wants —
 * do not "correct" it back to the board.
 */
export const HOME_ATTORNEYS = {
  eyebrow: "Our attorneys",
  heading: "The people who will actually work your case.",
  /**
   * WHO APPEARS, and in what order. The three partners, which is the artboard's
   * choice and the client's — the band showed all six for one iteration and was
   * cut back on 2026-09-08.
   *
   * ⚠️ THE OTHER THREE ATTORNEYS ARE NOT MISSING, they are not selected. There
   * is no `featured` flag on `attorney` and there must not be one: which people
   * a section shows is a property of the SECTION (rule 7), so McNaughton,
   * Sawicki and Parnell are simply absent from this list and still appear in
   * full on `/about/attorneys/` when that page is built.
   *
   * Slugs rather than ids because a slug is the thing a human can check against
   * the live site.
   */
  order: ["stephen-cohen", "richard-jaffe", "stephen-tiger"],
  /**
   * The closing banner is now this button and nothing else — the band's only
   * route to the attorneys listing, and it had none at all for one iteration
   * after the banner was first removed.
   *
   * The artboard pairs the button with three circular staff portraits and the
   * line "Six attorneys and a support staff of more than twenty, including…".
   * The portraits went first and the line went after, both on the client's
   * instruction, so there is no `footNote` field to model.
   */
  cta: { label: "Meet the Full Team", href: "/about/attorneys/" },
} as const;
