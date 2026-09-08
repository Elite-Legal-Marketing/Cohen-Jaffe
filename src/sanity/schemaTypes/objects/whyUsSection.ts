import { defineArrayMember, defineField, defineType } from "sanity";
import { ThumbsUpIcon } from "@sanity/icons/ThumbsUp";

/**
 * The homepage's "Why Cohen & Jaffe" band — a full-bleed team photograph with
 * the copy held left over it, and four reasons ruled off in gold along the
 * foot.
 *
 * Built from the WHY COHEN & JAFFE band of `Cohen & Jaffe Homepage v1.dc.html`
 * (markup 579-618) and approved on 2026-09-08. `WhyUs.astro` carries the
 * layout reasoning and `scripts/seed-home-why-us.ts` carries the provenance of
 * every line; neither is repeated here.
 *
 * FOUR FIELDS AND NO MORE. Three things this band draws are deliberately NOT
 * modelled, and each is a field somebody will otherwise propose adding back:
 *
 *   - NO IMAGE FIELD. Both photographs are large decorative art, so they live
 *     in `src/assets/` and go through Astro's pipeline — AGENTS.md rule 5,
 *     "in Sanity only if someone interacts with the image". They are also a
 *     matched PAIR at two different aspect ratios, one of which the stacked
 *     layout's height is derived from, so an editor swapping one of them in
 *     isolation would silently start cropping a person off the end.
 *   - NO ICON FIELD on the reasons. The four glyphs are matched by position —
 *     see `whyReason.ts`.
 *   - NO BUTTON. The artboard's "MID CTA BAR" above this band (line 576) is an
 *     empty section comment with no markup under it, so nothing was built and
 *     nothing was invented to fill it. A mid-page CTA is a NEW REQUEST, not a
 *     missing implementation — do not "restore" one from the board.
 */
export const whyUsSection = defineType({
  name: "whyUsSection",
  title: "Why Cohen & Jaffe",
  type: "object",
  icon: ThumbsUpIcon,
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "reasons", title: "Reasons" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: "The small gold line above the heading.",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule
          .required()
          .max(32)
          .warning("Held in a 560px column over the photograph — it should stay on one line."),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule
          .required()
          .max(56)
          .warning(
            "Set at 62px in a 560px column — beyond ~56 characters it runs to four lines and pushes down onto the reasons.",
          ),
    }),
    defineField({
      name: "lead",
      title: "Supporting line",
      description: "One line under the heading, inside the same column.",
      type: "text",
      rows: 2,
      group: "copy",
      validation: (rule) =>
        rule
          .required()
          .max(130)
          .warning(
            "Beyond ~130 characters the lead runs past the scrim that keeps it legible and the last line sits out over the photograph.",
          ),
    }),
    defineField({
      name: "reasons",
      title: "Reasons",
      description:
        "Four, in the order they should appear. The row is a four-across grid that folds to two and then to one, so four divides cleanly at every width and a fifth strands itself. There are also only four glyphs, matched by position — a fifth reason repeats the first one's icon.",
      type: "array",
      of: [defineArrayMember({ type: "whyReason" })],
      group: "reasons",
      /**
       * A WARNING, the house default — the same call the deadlines and stats
       * bands make. A fifth reason is ugly rather than broken: it sits alone on
       * a second row and borrows the first glyph. The two `.error()` sections
       * on this page (case results, attorneys) are both there on an explicit
       * client instruction; there is none here.
       */
      validation: (rule) =>
        rule
          .max(4)
          .warning(
            "The row is four across — a fifth reason sits alone on a second row and repeats the first icon.",
          ),
    }),
  ],
  preview: {
    select: { title: "heading", reasons: "reasons" },
    prepare: ({ title, reasons }) => ({
      title: title ?? "Why Cohen & Jaffe",
      subtitle: `${Array.isArray(reasons) ? reasons.length : 0} reasons`,
    }),
  },
});
