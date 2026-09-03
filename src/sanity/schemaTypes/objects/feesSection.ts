import { defineArrayMember, defineField, defineType } from "sanity";
import { CreditCardIcon } from "@sanity/icons/CreditCard";

/**
 * The homepage's fee explainer — the firm's named "No Fee Promise", stated on
 * the homepage rather than only on its own page.
 *
 * No phone-number field, and no label for it either. The number is firm-level
 * and lives once, in **Site Settings → Firm Details**; a copy here would be a
 * fourth place to change it and the first to go stale. The two words in front
 * of it are set in the component — a field whose only sensible value is "or
 * call" is a decision an editor should not have to make.
 *
 * `disclaimer` is one of the very few genuinely `.required()` fields on this
 * site. It is a legal-advertising note, not a nicety: New York Judiciary Law
 * § 474-a puts medical malpractice on a sliding scale rather than the flat
 * percentage the columns describe, so a page stating the percentage without it
 * is stating it incompletely.
 */
export const feesSection = defineType({
  name: "feesSection",
  title: "Fee explainer",
  type: "object",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) =>
        rule.required().max(72).warning("Set at 36px across the card — two lines at most."),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      description: "Three, in order. Each answers one question about how the firm gets paid.",
      type: "array",
      of: [defineArrayMember({ type: "feeColumn" })],
      /**
       * A warning rather than an error, per AGENTS.md. Four columns is ugly,
       * not broken — the grid re-flows and nothing overlaps, so blocking a
       * publish over it would stop the deploy for a layout opinion.
       */
      validation: (rule) =>
        rule.max(3).warning("The card is a three-across grid; a fourth column narrows all of them."),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      description: "The partner's line under the columns.",
      type: "attorneyQuote",
    }),
    defineField({
      name: "cta",
      title: "Button",
      type: "ctaLink",
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      description:
        "Required by legal advertising rules, and it is doing real work — medical malpractice follows a different fee schedule under New York law. Do not remove it.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title ?? "Fee explainer" }),
  },
});
