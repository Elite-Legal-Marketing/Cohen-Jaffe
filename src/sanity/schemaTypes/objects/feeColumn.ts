import { defineField, defineType } from "sanity";
import { CreditCardIcon } from "@sanity/icons/CreditCard";

/**
 * One column of the fee explainer.
 *
 * ⚠️ These are FEE REPRESENTATIONS BY A LAW FIRM. Everything currently in them
 * is traceable to the firm's own "No Fee Promise" page, and anything added
 * should be too — see `HANDOFF.md`, which records the two clauses from the
 * design that were removed for having no source.
 */
export const feeColumn = defineType({
  name: "feeColumn",
  title: "Fee column",
  type: "object",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "label",
      title: "Question",
      description: 'The gold kicker — "What is the fee".',
      type: "string",
      validation: (rule) =>
        rule.required().max(32).warning("A short question — it sits on one line above the answer."),
    }),
    defineField({
      name: "body",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (rule) =>
        rule
          .required()
          .max(280)
          .warning("Three columns share one row — past ~280 characters one column runs much longer than its neighbours."),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "body" },
  },
});
