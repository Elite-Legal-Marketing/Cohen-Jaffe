import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

/**
 * A video card: the labels over a cover image, and the Wistia id that opens in
 * the lightbox.
 *
 * ⚠️ No DURATION field, and there must never be one. `eyebrow` used to hold the
 * whole string — "Watch · 2 min" — for a video that actually runs 2:47, and
 * nobody typing it had any way to check. The length is now read from the video
 * at build time (`src/lib/wistia.ts`) and appended to whatever label this holds,
 * so the field is the LABEL only. A validation warning catches a typed length.
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
      description:
        'The small gold line over the image — just the label, like "Watch". The video\'s length is added automatically and must NOT be typed here.',
      type: "string",
      validation: (rule) => [
        rule.max(24).warning("Sits on one line over the image."),
        rule
          .custom((value) =>
            typeof value === "string" && /\d+\s*(min|sec|:\s*\d)/i.test(value)
              ? "Remove the length — it is read from the video itself, so a typed one both duplicates it and goes stale."
              : true,
          )
          .warning(),
      ],
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
