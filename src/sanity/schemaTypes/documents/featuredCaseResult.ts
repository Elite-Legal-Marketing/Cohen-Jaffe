import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons/Star";
import { CASE_RESULT_CATEGORIES } from "../caseResultCategories";

/**
 * A case result produced as a STORY — the card in the homepage band.
 *
 * Separate from `caseResult` (the ledger entry) because it is different
 * content, not the same content with extras: a client interview, a portrait, a
 * quote, and the insurer's original offer set against what the case actually
 * recovered. See `caseResult.ts` for the trade-off the split accepts.
 *
 * ⚠️ EVERY FIELD IS REQUIRED except the Wistia id. The card's whole argument is
 * the offer against the recovery; one missing its quote, photograph or offer is
 * not a weaker card but a broken one, so the Studio refuses to publish it.
 *
 * Know what that costs before migrating: NONE of the 60 published results has a
 * client name, quote, photograph or offer figure (9 mention an offer in prose,
 * none as a number). Every featured card is new content the firm has to
 * produce — it cannot be promoted from the ledger.
 */
export const featuredCaseResult = defineType({
  name: "featuredCaseResult",
  title: "Featured Case Result",
  type: "document",
  icon: StarIcon,
  groups: [
    { name: "result", title: "The result", default: true },
    { name: "client", title: "Client story" },
  ],
  fields: [
    defineField({
      name: "recovered",
      title: "Amount recovered",
      description: 'The headline figure, written the way it should read — "$2,800,000".',
      type: "string",
      group: "result",
      validation: (rule) =>
        rule
          .required()
          .max(16)
          .warning("Set large and never allowed to wrap — a longer figure drops below its label."),
    }),
    defineField({
      name: "insurerOffered",
      title: "Insurer offered",
      description: 'The struck-through figure set against the recovery — "$250,000".',
      type: "string",
      group: "result",
      validation: (rule) =>
        rule.required().max(16).warning("Longer figures crowd the label beside them."),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Left half of the card's footer line.",
      type: "string",
      options: { list: [...CASE_RESULT_CATEGORIES] },
      group: "result",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "county",
      title: "County",
      description: 'Right half of the footer line — "Nassau County", "Queens".',
      type: "string",
      group: "result",
      validation: (rule) =>
        rule.required().max(24).warning("Longer names wrap the footer line."),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      description: "What happened. Not shown on the homepage card — this is for the result's own page.",
      type: "text",
      rows: 6,
      group: "result",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "clientName",
      title: "Client name",
      description:
        'As it appears over the photograph — "Danny R.". First name and an initial; never a full name.',
      type: "string",
      group: "client",
      validation: (rule) =>
        rule
          .required()
          .max(24)
          .warning("Sits over the photograph on one line — longer names overlap the play button."),
    }),
    defineField({
      name: "quote",
      title: "Client quote",
      description:
        "One line, in the client's own words, without quotation marks — the card adds them. This is the largest text on the card.",
      type: "text",
      rows: 2,
      group: "client",
      validation: (rule) =>
        rule
          .required()
          .max(64)
          .warning("Beyond ~64 characters the quote runs to three lines and unbalances the row."),
    }),
    defineField({
      name: "image",
      title: "Client photograph",
      description:
        "Shown 16:9 on the card. Set the hotspot on the subject's face — the card crops to it.",
      type: "image",
      options: { hotspot: true },
      group: "client",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          description:
            "Leave empty if the photograph is decorative — the client's name is already beside it in text.",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "wistiaId",
      title: "Wistia ID",
      description:
        'The hashed media id from the Wistia URL, e.g. "c6b0eghb5r". Adding one puts a play button on the card. Leave it empty and no button appears — better than one that does nothing. The only optional field here.',
      type: "string",
      group: "client",
    }),
  ],
  preview: {
    select: { title: "clientName", recovered: "recovered", category: "category", media: "image" },
    prepare: ({ title, recovered, category, media }) => ({
      title: [title, recovered].filter(Boolean).join(" — "),
      subtitle: category,
      media,
    }),
  },
});
