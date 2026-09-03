import { defineField, defineType } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";

/**
 * One row of the homepage's "What you can expect" list.
 *
 * `detail` is what sits behind the row's "+" toggle. It is optional, and a row
 * without one renders with no toggle at all.
 *
 * There was an `icon` field — a key into a fixed set of olive line glyphs that
 * came with the designs, which the artboard draws beside each row. It was
 * removed on the client's call along with the glyphs themselves, so a row is
 * now a title, a summary and an optional detail. If they come back, the field
 * is a `string` with a `list` of keys and a matching map in `About.astro`, not
 * an image upload: a fixed brand set is a library to choose from, not artwork
 * to supply.
 */
export const expectation = defineType({
  name: "expectation",
  title: "Expectation",
  type: "object",
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) =>
        rule.required().max(44).warning("Set at 24px on one line — longer titles wrap."),
    }),
    defineField({
      name: "blurb",
      title: "Summary",
      description: "The line always on show, under the title.",
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule.required().max(120).warning("Two lines at most, or the rows stop scanning."),
    }),
    defineField({
      name: "detail",
      title: "Detail",
      description:
        'Behind the "+". Leave empty and the row has no toggle — a row that opens onto nothing is worse than one that does not open.',
      type: "text",
      rows: 4,
      validation: (rule) =>
        rule.max(400).warning("One paragraph. Longer belongs on a page of its own."),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "blurb" },
  },
});
