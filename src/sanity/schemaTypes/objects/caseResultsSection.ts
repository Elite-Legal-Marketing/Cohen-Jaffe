import { defineArrayMember, defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";

/**
 * The homepage case results band: its own copy, plus REFERENCES to the case
 * results it features.
 *
 * References, not nested copies — see `caseResult.ts`. The band is a curated
 * selection ("these four"), so the order here is the order on the page, and
 * swapping which results are featured never touches the results themselves.
 */
export const caseResultsSection = defineType({
  name: "caseResultsSection",
  title: "Case results band",
  type: "object",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) =>
        rule.required().max(48).warning("Shares one line with the link beside it."),
    }),
    defineField({
      name: "lead",
      title: "Supporting line",
      // One sentence, so `text` rather than `richText` — see richText.ts.
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule.required().max(120).warning("Longer copy pushes the cards down the page."),
    }),
    defineField({
      name: "link",
      title: "Link",
      description: 'The "See all results →" link beside the heading.',
      type: "ctaLink",
    }),
    defineField({
      name: "results",
      title: "Featured results",
      description:
        "Four, in the order they should appear. These come from Featured Case Results, not the Case Results ledger — a featured card needs a client story, photograph and offer figure that a ledger entry does not have.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "featuredCaseResult" }] })],
      /**
       * A hard cap, not a warning. Four is structural here rather than
       * cosmetic: the band is a four-across grid above 1280px and a
       * four-page carousel below it, and the fifth card has nowhere to go.
       * This is the exception to AGENTS.md's "use .warning(), never .error()"
       * rule — that rule is about design-coupled string LENGTHS, where
       * blocking a publish over a nitpick would stop the whole deploy.
       */
      validation: (rule) =>
        rule
          .max(4)
          .error("The band holds exactly four results — remove one before adding another.")
          .unique(),
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      description:
        "The small print under the cards. Required by legal advertising rules — do not remove it.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title ?? "Case results band" }),
  },
});
