import { defineArrayMember, defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

/**
 * The `/faqs/` hub page — a singleton, pinned in `src/sanity/structure.ts`.
 *
 * The page's CONTENT is the FAQ collection; this document is the chrome around
 * it. What is NOT here is as deliberate as what is:
 *
 *   - NO QUESTION LIST. Every FAQ is its own document and the hub renders all of
 *     them, ordered by question. There is nothing to curate, so there is nothing
 *     to model.
 *   - NO CATEGORY LIST. `FAQ_CATEGORIES` is a constant in the code, and the
 *     pills are generated from the categories that actually hold a question.
 *     See `faqCategories.ts` for why it is not a document type.
 *   - NO CONTACT BAND. That is `contactSection`, a Site Settings singleton,
 *     because the same band appears on several pages.
 *
 * ⚠️ THE QUOTE HAS NO ACCENT FIELD, so it renders in one colour. The artboard
 * sets its middle clause in gold, and `attorneyQuote` used to carry a second
 * `accent` field for exactly that — removed on the client's call, because it
 * costs an editor a decision about where a sentence ends every time they write a
 * quote. Reusing the shared type inherits that decision, which is the point of
 * reusing it.
 *
 * ⚠️ THE QUOTE ITSELF IS UNSOURCED, and it is attributed to a real named person
 * on a page that is legal advertising. Nothing in the WordPress mirror contains
 * the sentence. It is seeded as the board wrote it on the client's instruction
 * (2026-09-08), and the firm confirms or replaces it before launch — the point
 * of modelling it is that the fix is then a Studio edit rather than a deploy.
 */
export const faqsPage = defineType({
  name: "faqsPage",
  title: "FAQs page",
  type: "document",
  icon: HelpCircleIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "list", title: "Question list" },
    { name: "stats", title: "Claims band" },
    { name: "quote", title: "Quote band" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required().max(40).warning("One line above the heading."),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      description: "The page's h1.",
      type: "string",
      group: "hero",
      validation: (rule) =>
        rule.required().max(56).warning("Set at 56px — past ~56 characters it runs to three lines."),
    }),
    defineField({
      name: "lead",
      title: "Lead",
      type: "text",
      rows: 3,
      group: "hero",
      validation: (rule) => rule.required().max(200).warning("Two lines under the heading."),
    }),
    defineField({
      name: "listEyebrow",
      title: "Eyebrow",
      description: 'The small gold line over the question list — "Browse by topic".',
      type: "string",
      group: "list",
      validation: (rule) => rule.required().max(28).warning("One line."),
    }),
    defineField({
      name: "listHeading",
      title: "Heading",
      type: "string",
      group: "list",
      validation: (rule) =>
        rule.required().max(60).warning("Set at 42px over the category pills — two lines."),
    }),
    defineField({
      name: "stats",
      title: "Claims",
      description:
        "The four-across band under the questions. Four divides cleanly at every breakpoint; a fifth strands itself.",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
      group: "stats",
      validation: (rule) =>
        rule.max(4).warning("The band is a four-across grid; a fifth sits alone on a second row."),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      description:
        "Shown large and italic over a photograph. The name and role come from the attorney you pick, so they can never go stale.",
      type: "attorneyQuote",
      group: "quote",
    }),
  ],
  preview: {
    prepare: () => ({ title: "FAQs page" }),
  },
});
