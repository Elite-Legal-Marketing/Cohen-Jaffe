import { defineArrayMember, defineField, defineType } from "sanity";
import { SplitVerticalIcon } from "@sanity/icons/SplitVertical";

/**
 * One tab of the homepage practice-areas band: a practice area, plus the pitch
 * the homepage makes for it.
 *
 * `area` is a REFERENCE, and it is the only required field. The name, icon,
 * photograph and button label all come from the practice area document, so a
 * tab cannot carry a name the collection has since corrected (rule 7/8 in
 * AGENTS.md). What lives HERE is the copy with one consumer — the thesis
 * headline, the legal callout and the three sub-links — because the detail
 * page's own hero says something different and the listing page's card says
 * something shorter.
 *
 * ⚠️ THERE IS DELIBERATELY NO `quote` FIELD. The artboard draws a pull quote
 * in every pane, one per tab, each credited to "Richard S. Jaffe · Managing
 * Partner" — and every one of the seven was invented for the design, two of
 * them making operational claims the firm's site does not support. The pane
 * was built with them and they were cut whole on the client's call
 * (2026-09-04). Nothing in the pane is attributed to anyone. Do not add the
 * field back without real, sourced quotes; the attorney's ONE representative
 * line already lives on the attorney document.
 */
export const practiceAreaTab = defineType({
  name: "practiceAreaTab",
  title: "Practice area tab",
  type: "object",
  icon: SplitVerticalIcon,
  fields: [
    defineField({
      name: "area",
      title: "Practice area",
      description:
        "Which area this tab is for. Its name, icon, photograph and button label come from that document.",
      type: "reference",
      to: [{ type: "practiceArea" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      description:
        'The one thing someone should know — "A truck case is an investigation, not a claim."',
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule
          .max(90)
          .warning("Set at 36px in a half-width pane — beyond ~90 characters it runs to four lines."),
    }),
    defineField({
      name: "callout",
      title: "Callout",
      description:
        "The gold-ruled paragraph under the headline. These are statements of New York law — check any change against the firm's own page for this area before publishing.",
      type: "text",
      rows: 4,
      validation: (rule) =>
        rule
          .max(340)
          .warning("Beyond ~340 characters the pane outgrows the tab rail beside it."),
    }),
    defineField({
      name: "links",
      title: "Sub-links",
      description:
        "Three at most. They currently point at the area's own page; they become anchors when the detail pages are built.",
      type: "array",
      of: [defineArrayMember({ type: "textLink" })],
      validation: (rule) =>
        rule.max(3).warning("The pane is drawn for three — a fourth pushes the button out of line."),
    }),
  ],
  preview: {
    select: { title: "area.name", subtitle: "headline", media: "area.image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? "No practice area chosen",
      subtitle,
      media,
    }),
  },
});
