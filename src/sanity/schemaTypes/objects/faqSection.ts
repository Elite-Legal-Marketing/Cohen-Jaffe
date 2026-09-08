import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

/**
 * The homepage FAQ band: a centred head, eight questions that open to the start
 * of their answer, and a closing panel.
 *
 * WHICH EIGHT APPEAR IS A PROPERTY OF THIS SECTION, not of the questions
 * (AGENTS.md rule 7), so `faqs` is an ordered array of references. There is no
 * `featured` flag on `faq` and there must not be one — all 180 belong on
 * `/faqs/`, and the eight here are a choice made on the homepage.
 *
 * ⚠️ `.max(8)` AT WARNING, NOT `.length(8).error()`. The two existing hard
 * errors — `caseResultsSection.results` and `attorneysSection.attorneys` — each
 * had an explicit client instruction AND a structural reason: those bands are
 * fixed grids where an extra item strands itself beside empty columns. This band
 * is a single stacked column of `<details>` rows, so a ninth just makes it one
 * row longer. Neither condition holds, so the house default applies.
 *
 * Three things the board draws are deliberately absent, and each is a field
 * somebody will otherwise proposeadding back:
 *
 *   - NO CATEGORY PILLS. The board filters fifteen invented FAQs across five
 *     invented categories. The real taxonomy is eighteen live terms, and eight
 *     hand-picked questions would give a pill row where most pills filter to one
 *     row. The filter belongs on `/faqs/`, and that is where it is built.
 *   - NO COUNT. It counted a filter that no longer exists.
 *   - NO VIDEO. The board puts a 16:9 card beside every answer; there is no FAQ
 *     video and never has been. See `FaqSection.astro` for the full note.
 */
export const faqSection = defineType({
  name: "faqSection",
  title: "FAQs",
  type: "object",
  icon: HelpCircleIcon,
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "questions", title: "Questions" },
    { name: "closing", title: "Closing panel" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: "The small gold line above the heading.",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule.required().max(28).warning("Centred over the heading — it should stay on one line."),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule
          .required()
          .max(52)
          .warning("Set at 42px and centred — past ~52 characters it runs to three lines."),
    }),
    defineField({
      name: "lead",
      title: "Lead",
      description: "One or two sentences under the heading.",
      type: "text",
      rows: 3,
      group: "copy",
      validation: (rule) =>
        rule.required().max(160).warning("Centred and capped to a readable measure — two lines."),
    }),
    defineField({
      name: "faqs",
      title: "Questions",
      description:
        "Eight, in the order they should appear. Each row opens to the start of its answer and links to that question's own page. Avoid the entries whose titles are not questions — they read oddly under this heading.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
      group: "questions",
      validation: (rule) => [
        rule.required().unique(),
        rule.max(8).warning("The band is drawn as eight rows."),
      ],
    }),
    defineField({
      name: "closingHeading",
      title: "Heading",
      type: "string",
      group: "closing",
      validation: (rule) =>
        rule.required().max(60).warning("One line beside the button at desktop."),
    }),
    defineField({
      name: "closingLead",
      title: "Lead",
      type: "text",
      rows: 2,
      group: "closing",
      validation: (rule) => rule.required().max(120).warning("One line under the heading."),
    }),
    defineField({
      name: "closingCta",
      title: "Button",
      description: "⚠️ This is the band's only outbound link other than the questions themselves.",
      type: "ctaLink",
      group: "closing",
    }),
  ],
  preview: {
    select: { title: "heading", faqs: "faqs" },
    prepare: ({ title, faqs }) => ({
      title: title ?? "FAQs",
      subtitle: `${Array.isArray(faqs) ? faqs.length : 0} questions`,
    }),
  },
});
