import { defineField, defineType } from "sanity";
import { TrendUpwardIcon } from "@sanity/icons/TrendUpward";

/**
 * One claim in the stats band: a large figure, a gold label under it, and a
 * sentence of supporting copy.
 *
 * "Figure" is loose on purpose — the design's four are "No Fee", "We Travel",
 * "Millions" and "100 Years+". Only one is a number.
 */
export const stat = defineType({
  name: "stat",
  title: "Stat",
  type: "object",
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: "figure",
      title: "Figure",
      description: 'The large line — "Millions", "100 Years+", "No Fee".',
      type: "string",
      validation: (rule) =>
        rule
          .required()
          // Set large and never allowed to wrap, so a long figure runs out of
          // its column rather than breaking onto a second line.
          .max(14)
          .warning("Longer figures overflow the column — this line cannot wrap."),
    }),
    defineField({
      name: "label",
      title: "Label",
      description: 'The gold line under the figure — "Recovered", "Unless we win".',
      type: "string",
      validation: (rule) =>
        rule.required().max(28).warning("Wraps to a second line beyond ~28 characters."),
    }),
    defineField({
      name: "body",
      title: "Supporting copy",
      // One sentence, so `text` rather than `richText` — see richText.ts.
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.required().max(120).warning("Longer copy makes the columns uneven."),
    }),
  ],
  preview: {
    select: { title: "figure", subtitle: "label" },
  },
});
