import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons/Calendar";

/**
 * One figure in the homepage's deadlines band — "30 Days · To file your
 * no-fault application after a crash."
 *
 * ⚠️ EVERY ONE OF THESE IS A STATEMENT OF NEW YORK LAW, and a reader who
 * believes a number here and acts on it loses their claim. The three seeded
 * figures each carry their statute in the docblock of
 * `scripts/seed-home-deadlines.ts`. Nothing may be added or edited here
 * without a citation — that is not a house style point, it is the reason the
 * section exists.
 *
 * `figure` is kept apart from `unit` because the two are set at wildly
 * different sizes on a shared baseline — 72px Newsreader beside a 15px tracked
 * label — so they cannot be one string. It is a STRING rather than a number:
 * medical malpractice runs two and a half years, and "2½" is not a number.
 */
export const deadlineFigure = defineType({
  name: "deadlineFigure",
  title: "Deadline",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "figure",
      title: "Figure",
      description: 'The numeral alone — "30", "90", "2½". No unit.',
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .max(4)
          .warning("Set at 72px beside its unit — beyond three characters the pair crowds its column."),
    }),
    defineField({
      name: "unit",
      title: "Unit",
      description: 'Rendered in uppercase — enter it in sentence case: "Days", "Years".',
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .max(12)
          .warning("Uppercase and letter-spaced, on one line with the figure."),
    }),
    defineField({
      name: "body",
      title: "What the deadline is for",
      description:
        "One sentence. A figure with nothing under it says nothing — this is the part that has to be right.",
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule
          .required()
          .max(90)
          .warning("Beyond ~90 characters this column runs three lines deeper than the others."),
    }),
  ],
  preview: {
    select: { figure: "figure", unit: "unit", subtitle: "body" },
    prepare: ({ figure, unit, subtitle }) => ({
      title: [figure, unit].filter(Boolean).join(" ") || "No figure",
      subtitle,
    }),
  },
});
