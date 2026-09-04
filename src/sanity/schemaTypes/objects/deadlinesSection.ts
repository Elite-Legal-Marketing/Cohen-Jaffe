import { defineArrayMember, defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons/Clock";

/**
 * The homepage's "New York deadlines" band — the kicker, heading and lead with
 * the CTA held to the right, then three big gold figures across.
 *
 * ⚠️ THIS SECTION IS NOTHING BUT STATEMENTS OF NEW YORK LAW. Every other band
 * on the page can be wrong in a way that is merely embarrassing; this one tells
 * an injured person how long they have. The statute behind each figure, and
 * the two places the artboard's copy was corrected, are in the docblock of
 * `scripts/seed-home-deadlines.ts`.
 *
 * ⚠️ THERE IS DELIBERATELY NO `disclaimer` FIELD, and this is the one section
 * that most looks like it needs one. The practice-areas band DIRECTLY ABOVE
 * already closes with "Information on this page is general and is not legal
 * advice about your case. New York deadlines and rules vary by claim type" —
 * which is this section's disclaimer, sitting one band away and naming
 * deadlines specifically. A second would be the same sentence twice in a
 * screen. If these sections are ever reordered or the practice-areas band is
 * removed, that line has to come with this one; see `homePage.ts`.
 *
 * ⚠️ THE HEADING IS A GENERALISATION, on purpose. "The clock started the day of
 * your accident" is true of the ordinary negligence case and not of every one:
 * wrongful death runs from the date of DEATH (EPTL 5-4.1), medical malpractice
 * from the act or omission or the end of continuous treatment (CPLR 214-a),
 * and some toxic-exposure claims from discovery (CPLR 214-c). It is approved
 * artboard copy, and the disclaimer above covers it — but nobody should later
 * "tighten" the figures to agree with it.
 */
export const deadlinesSection = defineType({
  name: "deadlinesSection",
  title: "New York deadlines",
  type: "object",
  icon: ClockIcon,
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "figures", title: "Figures" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "copy",
      validation: (rule) => rule.max(48).warning("Wraps to two lines beyond ~48 characters."),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule
          .required()
          .max(70)
          .warning("Set at 38px beside the button — beyond ~70 characters it runs to three lines."),
    }),
    defineField({
      name: "lead",
      title: "Supporting line",
      type: "text",
      rows: 3,
      group: "copy",
      validation: (rule) =>
        rule.max(220).warning("Beyond ~220 characters the band grows a line at every width."),
    }),
    defineField({
      name: "cta",
      title: "Button",
      description:
        "Held to the right of the copy on desktop, full width on a phone. It goes to the contact page: the label promises a check, and the only honest way to check a deadline is to have a lawyer look at the facts.",
      type: "ctaLink",
      group: "copy",
    }),
    defineField({
      name: "deadlines",
      title: "Deadlines",
      description: "Three, in the order they should appear.",
      type: "array",
      of: [defineArrayMember({ type: "deadlineFigure" })],
      group: "figures",
      /**
       * A WARNING, not an error — the same call the stats band makes. The grid
       * is three across and a fourth figure sits alone on a second row: ugly,
       * not broken. (The case-results band is the one place this is a hard
       * `.error()`, because a fifth card has nowhere to go at all.)
       */
      validation: (rule) =>
        rule
          .max(3)
          .warning("The grid is three across — a fourth figure sits alone on a second row."),
    }),
  ],
  preview: {
    select: { title: "heading", deadlines: "deadlines" },
    prepare: ({ title, deadlines }) => ({
      title: title ?? "New York deadlines",
      subtitle: `${Array.isArray(deadlines) ? deadlines.length : 0} deadlines`,
    }),
  },
});
