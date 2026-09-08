import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";

/**
 * The homepage attorneys band: a centred head, a static row of three attorney
 * cards, and one closing button to the full listing.
 *
 * ⚠️ THIS SECTION IS A REWORK, AND THE ARTBOARD IS NOT ITS REFERENCE. The
 * ATTORNEYS band of `Cohen & Jaffe Homepage v1.dc.html` was built as drawn and
 * REJECTED on the design on 2026-09-08. `Attorneys.astro` carries the full list
 * of what was cut; what matters for the MODEL is what is deliberately absent
 * here, because each one is a field somebody will otherwise propose adding:
 *
 *   - NO `summary` / CARD BLURB. It existed on `attorney`, was `.required()`,
 *     fed this one paragraph and nothing else on the site, and was removed from
 *     the schema and unset on all six documents.
 *   - NO `footNote`. The board pairs the closing button with the line "Six
 *     attorneys and a support staff of more than twenty, including…". The line
 *     went with the three staff portraits beside it.
 *   - NO QUOTE FIELD. The card quote is `attorney.quote` — the one line that
 *     represents that person site-wide — not copy owned by this section. That
 *     is rule 8 in AGENTS.md, and it is why an `attorneyQuote` object is NOT
 *     used here: this band quotes three people in passing rather than putting
 *     one person's words in the section's mouth.
 *
 * WHICH ATTORNEYS APPEAR IS A PROPERTY OF THIS SECTION, not of the people
 * (AGENTS.md rule 7). `attorneys` is an ordered array of references, so the
 * three partners are chosen and sequenced here and McNaughton, Sawicki and
 * Parnell are simply not selected. **There is no `featured` flag on `attorney`
 * and there must not be one** — all six still belong on `/about/attorneys/`.
 */
export const attorneysSection = defineType({
  name: "attorneysSection",
  title: "Attorneys",
  type: "object",
  icon: UsersIcon,
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "attorneys", title: "Attorneys" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: "The small gold line above the heading.",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule
          .required()
          .max(28)
          .warning("Centred over the heading — it should stay on one line."),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule
          .required()
          .max(52)
          .warning(
            "Set at 42px and centred — past ~52 characters it runs to three lines.",
          ),
    }),
    defineField({
      name: "cta",
      title: "Button",
      description:
        "The closing button under the row. ⚠️ It is this band's ONLY route to the attorneys listing — the cards link to individual profiles, so removing it leaves no link to the full team.",
      type: "ctaLink",
      group: "copy",
    }),
    defineField({
      name: "attorneys",
      title: "Attorneys",
      description:
        "Exactly three, in the order they should appear. The band is a row of three and there is no two-up layout: three cards divide by three or by one, so a fourth strands itself on a second row beside a whole empty column.",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "attorney" }] }),
      ],
      group: "attorneys",
      /**
       * A hard requirement of exactly three, not a warning, on the client's
       * instruction (2026-09-08) — "no more no less. We can adjust later if
       * needed". Three is structural rather than cosmetic here: the grid is
       * `repeat(3, …)` down to 700px and one-up below it, with NO two-up
       * breakpoint, deliberately. A fourth reference has nowhere to go.
       *
       * This is the same exception `caseResultsSection.results` takes to
       * AGENTS.md's "use .warning(), never .error()" rule — that rule is about
       * design-coupled string LENGTHS, where blocking a publish over a nitpick
       * would stop the whole deploy.
       *
       * `.required()` is what makes it "no less": a validation rule does not
       * fire on an absent value, so `.length(3)` alone would pass on an empty
       * band.
       */
      validation: (rule) =>
        rule
          .required()
          .length(3)
          .error(
            "The band is a row of exactly three attorneys — swap one out rather than adding a fourth.",
          )
          .unique(),
    }),
  ],
  preview: {
    select: { title: "heading", attorneys: "attorneys" },
    prepare: ({ title, attorneys }) => ({
      title: title ?? "Attorneys",
      subtitle: `${Array.isArray(attorneys) ? attorneys.length : 0} attorneys`,
    }),
  },
});
