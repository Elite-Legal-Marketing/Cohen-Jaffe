import { defineField, defineType } from "sanity";
import { CommentIcon } from "@sanity/icons/Comment";

/**
 * A written client review, transcribed from Google.
 *
 * Separate from `videoReview` because they are different content, not one type
 * with a flag (house rule 7): this is words, that is a film with a cover frame
 * and a Wistia id. Neither type's fields are a subset of the other's.
 *
 * The type is named `review`, not `googleReview`, because `_type` is immutable —
 * a name that baked in one provider would need a migration the first time a
 * review comes from anywhere else.
 */
export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "author",
      title: "Name",
      description:
        'As the reviewer is shown on Google, including a surname initial. Use "Client" when the review has no name on it.',
      type: "string",
      validation: (rule) => rule.required().max(40).warning("Set on one line under the review."),
    }),
    defineField({
      name: "quote",
      title: "Review",
      description:
        "The reviewer's own words, verbatim. Do not edit for length — the card scrolls anything longer than it can show.",
      type: "text",
      rows: 6,
      validation: (rule) =>
        rule
          .required()
          .max(600)
          .warning(
            "Past about 600 characters the card shows roughly the first thirteen lines and the rest scrolls — fine, but most readers will not scroll a card.",
          ),
    }),
    defineField({
      name: "location",
      title: "Town",
      description: "Only if the firm can confirm it. Empty renders nothing — just the name.",
      type: "string",
      validation: (rule) => rule.max(28).warning("Sits on one line beside the name."),
    }),
    defineField({
      name: "caseType",
      title: "Case type",
      description:
        'What the matter was — "Car accident", "Slip and fall". For the Testimonials page; the homepage card does not use it.',
      type: "string",
      validation: (rule) => rule.max(32).warning("A short label, not a description."),
    }),
  ],
  preview: {
    select: { title: "author", subtitle: "quote" },
  },
});
