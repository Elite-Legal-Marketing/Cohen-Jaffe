import { defineField, defineType } from "sanity";
import { CheckmarkIcon } from "@sanity/icons/Checkmark";

/**
 * One of the four "While you wait" cards on the thank-you page.
 *
 * ⚠️ NO NUMBER FIELD. The card's big gold "01" is its POSITION in the array,
 * rendered by the component — the same arrangement the why-us icons and the
 * "What you can expect" glyphs use. An editor reordering the array renumbers the
 * cards automatically; a stored number would have to be corrected by hand every
 * time, and would silently be wrong the first time somebody forgot.
 *
 * ⚠️ THESE FOUR ARE LEGAL ADVICE, and unlike most artboard copy they hold up
 * against the live site's own accident pages. They are general and cautionary
 * rather than specific to any case, which is what keeps them safe on a page
 * shown to someone who has just described their accident.
 */
export const waitStep = defineType({
  name: "waitStep",
  title: "Step",
  type: "object",
  icon: CheckmarkIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .max(44)
          .warning("Set at 26px in a quarter-width card — past ~44 characters it runs to three lines."),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.required().max(110).warning("Longer copy makes the four cards uneven."),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "body" },
  },
});
