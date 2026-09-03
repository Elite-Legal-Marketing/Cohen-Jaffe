import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

/**
 * A video card: the labels over a cover image, and the Wistia id that opens in
 * the lightbox.
 *
 * ⚠️ No cover-image field, and no poster. The cover is a repo asset for now
 * because the firm's videos are not on Wistia yet — see HANDOFF.md → "Videos".
 * When the planned `video` DOCUMENT type lands it owns the id, the duration,
 * the cover and the YouTube id, and this object becomes a reference to it.
 * Until then, an editor can change what the card SAYS but not which frame it
 * shows, which is the honest half-measure rather than an image field that only
 * half works.
 *
 * The page must also pass `videoEmbed` to `Layout.astro`, or every
 * `[data-video-id]` trigger on it is inert.
 */
export const videoCard = defineType({
  name: "videoCard",
  title: "Video card",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: 'The small gold line — "Watch · 2 min".',
      type: "string",
      validation: (rule) => rule.max(24).warning("Sits on one line over the image."),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) =>
        rule.required().max(48).warning("Two lines at most over the foot of the image."),
    }),
    defineField({
      name: "wistiaId",
      title: "Wistia ID",
      description:
        "The hashed id from the video's Wistia URL. Leave empty and the card renders without a play button rather than opening an empty lightbox.",
      type: "string",
    }),
    defineField({
      name: "coverAlt",
      title: "Cover description",
      description: "Alt text for the cover photograph. Describe who and where, not the play button.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "eyebrow" },
  },
});
