import { defineArrayMember, defineField, defineType } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";

/**
 * The homepage's "Our goals" band — the firm's own introduction.
 *
 * Two columns: the pitch and the "What you can expect" list on the left, a
 * partner's quote and a video card on the right.
 *
 * The intro is `richText` because it is two paragraphs with a bolded clause
 * inside the second — AGENTS.md rule 3. Everything else here is a single line
 * or a single paragraph and stays a plain string or text.
 */
export const aboutSection = defineType({
  name: "aboutSection",
  title: "Our goals",
  type: "object",
  icon: InfoOutlineIcon,
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "expectations", title: "What you can expect" },
    { name: "aside", title: "Quote & video" },
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
      validation: (rule) => rule.required().max(60).warning("Set at 42px over two lines at most."),
    }),
    defineField({
      name: "body",
      title: "Introduction",
      description: "Two or three paragraphs. Bold the clause that names the reader's worries.",
      type: "richText",
      group: "copy",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "expectationsLabel",
      title: "List heading",
      description: 'The olive kicker over the list — "What you can expect".',
      type: "string",
      group: "expectations",
      validation: (rule) => rule.max(40).warning("A kicker, not a sentence."),
    }),
    defineField({
      name: "expectations",
      title: "Rows",
      type: "array",
      of: [defineArrayMember({ type: "expectation" })],
      group: "expectations",
      validation: (rule) =>
        rule
          .max(6)
          .warning("Past six the list is longer than the quote and video beside it, and the two columns stop balancing."),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "attorneyQuote",
      group: "aside",
    }),
    defineField({
      name: "video",
      title: "Video card",
      type: "videoCard",
      group: "aside",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({ title: title ?? "Our goals", subtitle }),
  },
});
