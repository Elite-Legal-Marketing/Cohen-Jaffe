import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

/**
 * A client telling their own story on camera.
 *
 * ⚠️ NO DURATION FIELD, and there must never be one. The length is read from
 * Wistia at build time (`src/lib/wistia.ts`). The hand-typed "2 min" it replaced
 * was wrong about a video that runs 2:47, with no way for the person typing it
 * to know.
 *
 * `wistiaId` is required, unlike the optional one on `featuredCaseResult` where
 * the card is a case result that may or may not have a film. Here the card IS
 * the video. When the deferred `video` document type lands, it and `poster`
 * become one reference to it.
 *
 * The page rendering this must pass `videoEmbed` to `Layout.astro`, or every
 * `[data-video-id]` trigger on it is inert.
 */
export const videoReview = defineType({
  name: "videoReview",
  title: "Video Review",
  type: "document",
  icon: PlayIcon,
  groups: [
    { name: "story", title: "The story", default: true },
    { name: "video", title: "Video" },
  ],
  fields: [
    defineField({
      name: "clientName",
      title: "Client name",
      description: "As the client agreed it may be published — usually a first name and initial.",
      type: "string",
      group: "story",
      validation: (rule) => rule.required().max(40).warning("Set on one line under the quote."),
    }),
    defineField({
      name: "headline",
      title: "Pull quote",
      description:
        "One line from the client, in their words, with the curly quotation marks typed in — “I thought I could handle the adjuster myself.” It is the largest text on the card.",
      type: "string",
      group: "story",
      validation: (rule) =>
        rule
          .required()
          .max(64)
          .warning(
            "Set at 24px in a card that narrows to about 270px — beyond ~64 characters it runs past three lines and unbalances the row.",
          ),
    }),
    defineField({
      name: "location",
      title: "Town",
      description: "Only if the client agreed to it. Empty renders nothing — just the name.",
      type: "string",
      group: "story",
      validation: (rule) => rule.max(28).warning("Sits on one line beside the name."),
    }),
    defineField({
      name: "caseType",
      title: "Case type",
      description: "For the Testimonials page; the homepage card does not use it.",
      type: "string",
      group: "story",
      validation: (rule) => rule.max(32).warning("A short label, not a description."),
    }),
    defineField({
      name: "wistiaId",
      title: "Wistia ID",
      description:
        'The hashed id from the video\'s Wistia URL, e.g. "c6b0eghb5r". Its length is read from Wistia rather than typed.',
      type: "string",
      group: "video",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Cover frame",
      description:
        "Shown 16:9 with the play button over it. Set the hotspot on the client's face — the card crops to it, and the gold badge sits dead centre.",
      type: "image",
      options: { hotspot: true },
      group: "video",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          description:
            "Leave empty — the client's name and their quote are already beside it in text, so describing the frame only repeats them.",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "clientName", subtitle: "headline", media: "poster" },
  },
});
