import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";
import { CASE_RESULT_CATEGORIES } from "../caseResultCategories";

/**
 * A case result as it appears in the LEDGER — the `/case-results/` index.
 *
 * Three fields, all required, and nothing else. This is the shape the migrated
 * content actually has: all 60 published results carry a recovery figure, a
 * case type in their page title, and a narrative. None carries a client name,
 * quote, photograph or insurer-offer figure.
 *
 * The richer homepage card is a SEPARATE type, `featuredCaseResult` — see that
 * file. The split is deliberate: these two are different content, not one type
 * with optional extras. A ledger entry is a fact; a featured card is a produced
 * piece with an interview, a photograph and a video.
 *
 * ⚠️ CONSEQUENCE OF THE SPLIT: a result does not appear in both places by
 * being flagged. Featuring one on the homepage means entering it as a
 * `featuredCaseResult` as well, and the two then drift independently. That is
 * the accepted trade; if it starts to hurt, the fix is one type with a
 * `featured` boolean and conditional fields, not a reference between them.
 */
export const caseResult = defineType({
  name: "caseResult",
  title: "Case Result",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "recovered",
      title: "Amount recovered",
      description:
        'Written the way it should read — "$2,800,000", "$1.2 Million", "Confidential". A string, not a number: the live site publishes all three of those forms and formatting from a number would flatten them.',
      type: "string",
      validation: (rule) => rule.required().max(20),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "One per result. Drives the filters on the Case Results page.",
      type: "string",
      options: { list: [...CASE_RESULT_CATEGORIES] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "What happened, and what the firm did about it.",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),

  ],
  preview: {
    select: { title: "recovered", subtitle: "category" },
  },
});
