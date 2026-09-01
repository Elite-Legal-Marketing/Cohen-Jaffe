import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons/Star";

/**
 * The page hero: kicker, headline, supporting copy, up to two buttons, and a
 * background photograph.
 *
 * `headingAccent` is a second heading line rather than a styling flag. The
 * design sets it in gold beneath the first line, but as content it is the
 * promise the firm makes after the question — it stays meaningful if the site
 * is redesigned.
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
      type: "text",
      rows: 4,
      validation: (rule) => rule.max(320).warning("Longer copy pushes the buttons off a laptop screen."),
    }),
    defineField({
      name: "primaryCta",
      title: "Primary button",
      type: "ctaLink",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary button",
      type: "ctaLink",
    }),
    defineField({
      name: "image",
      title: "Photograph — wide",
      description: "Used on desktop, where the copy sits beside the picture.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Describe the photograph for screen readers and search engines.",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageNarrow",
      title: "Photograph — narrow",
      description:
        "Used on phones, where the picture sits above the copy. A squarer crop that keeps " +
        "everyone in frame; a wide shot loses its subjects at this width. Falls back to the " +
        "wide photograph if empty.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Leave empty to reuse the wide photograph's description.",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "image" },
  },
});
