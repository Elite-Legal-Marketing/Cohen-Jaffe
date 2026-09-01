import { defineArrayMember, defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons/Star";

/**
 * The page hero: kicker, headline, supporting copy and up to two buttons.
 *
 * `headingAccent` is a second heading line rather than a styling flag. The
 * design sets it in gold beneath the first line, but as content it is the
 * promise the firm makes after the question — it stays meaningful if the site
 * is redesigned.
 *
 * No image field, deliberately. The hero photographs are large decorative art
 * that nobody interacts with, so they live in the repo — see AGENTS.md →
 * "Images: in Sanity or in code?".
 */
export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: StarIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Small gold line above the headline.",
      validation: (rule) => rule.max(48).warning("Wraps to two lines beyond ~48 characters."),
    }),
    defineField({
      name: "heading",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().max(40).warning("Long headlines crowd the hero."),
    }),
    defineField({
      name: "headingAccent",
      title: "Headline, second line",
      type: "string",
      description: "Set in gold beneath the headline. Optional.",
      validation: (rule) => rule.max(40).warning("Long headlines crowd the hero."),
    }),
    defineField({
      name: "body",
      title: "Supporting copy",
      // A single paragraph, so `text` rather than `richText` — see richText.ts.
      type: "text",
      rows: 4,
      validation: (rule) =>
        rule.max(320).warning("Longer copy pushes the buttons off a laptop screen."),
    }),
    defineField({
      name: "buttons",
      title: "Buttons",
      description: "The first is the gold button, the second the light one.",
      type: "array",
      of: [defineArrayMember({ type: "ctaLink" })],
      validation: (rule) => rule.max(2).warning("The hero has room for two buttons."),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
  },
});
