import { defineField, defineType } from "sanity";
import { CheckmarkIcon } from "@sanity/icons/Checkmark";

/**
 * One reason in the homepage's "Why Cohen & Jaffe" band — a gold glyph, a
 * sentence in Newsreader, and a line of supporting copy under it.
 *
 * ⚠️ THERE IS NO ICON FIELD, and that is deliberate rather than unfinished.
 * The four glyphs are hand-cut SVGs in `src/assets/icons/why/` and are matched
 * to the reasons BY POSITION in `WhyUs.astro`, exactly the way the "What you
 * can expect" glyphs are. Reordering these rows in the Studio therefore moves
 * the WORDS and not the pictures, and a fifth reason wraps back to the first
 * icon. See AGENTS.md rule 5 — a decorative glyph nobody swaps as content
 * belongs in the repo, not in Sanity.
 *
 * ⚠️ THREE OF THE FOUR SEEDED ROWS MAKE A CLAIM OF FACT about the firm or
 * about a named person, on a page that is legal advertising. Each was checked
 * against the WordPress mirror before it was written, and one of the artboard's
 * lines was CORRECTED because it was not supported. The sources are in the
 * docblock of `scripts/seed-home-why-us.ts`; nothing should be edited here
 * without going back to them.
 */
export const whyReason = defineType({
  name: "whyReason",
  title: "Reason",
  type: "object",
  icon: CheckmarkIcon,
  fields: [
    defineField({
      name: "title",
      title: "Reason",
      description: "One sentence, set in the serif — the claim itself.",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .max(48)
          .warning(
            "Set at 26px in a quarter-width column — beyond ~48 characters it runs to three lines and the four columns fall out of step.",
          ),
    }),
    defineField({
      name: "body",
      title: "Supporting line",
      description:
        "One sentence backing the claim up. This is the half that has to be sourced.",
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule
          .required()
          .max(130)
          .warning(
            "Beyond ~130 characters this column runs a line or two deeper than the others and the gold rules between them stop lining up.",
          ),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "body" },
    prepare: ({ title, subtitle }) => ({
      title: title || "No reason",
      subtitle,
    }),
  },
});
