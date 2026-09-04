import { defineArrayMember, defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons/Tags";

/**
 * The homepage's "What happened?" band — seven practice-area tabs beside a
 * detail pane, then a disclaimer and the "Handling all areas" card.
 *
 * Everything that names a practice area is a REFERENCE, in both the tabs and
 * the all-areas card, so the band cannot drift from the collection. Which
 * seven appear, and in what order, is a choice made HERE rather than a flag on
 * the documents (rule 7 in AGENTS.md) — there is no `featured` or `order`
 * field on `practiceArea`.
 *
 * Below 1024px the band is an accordion rather than a tab rail, so a tab's
 * pane always sits under the thing that was tapped. That is a rendering
 * decision in `PracticeAreas.astro`, not a content one; nothing here changes.
 */
export const practiceAreasSection = defineType({
  name: "practiceAreasSection",
  title: "Practice areas",
  type: "object",
  icon: TagsIcon,
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "tabs", title: "Tabs" },
    { name: "all", title: "All areas card" },
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
      validation: (rule) => rule.required().max(60).warning("Set at 52px, centred, over two lines at most."),
    }),
    defineField({
      name: "subheading",
      title: "Supporting line",
      description: "The small capitalised line under the heading.",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule.max(60).warning("Uppercase and letter-spaced — beyond ~60 characters it wraps awkwardly."),
    }),
    defineField({
      name: "tabs",
      title: "Tabs",
      description:
        "Seven, in the order they should appear. Each pairs a practice area with the homepage's pitch for it.",
      type: "array",
      of: [defineArrayMember({ type: "practiceAreaTab" })],
      group: "tabs",
      /**
       * A WARNING, not an error. The rail is seven fixed 96px rows, but an
       * eighth tab simply makes a taller rail — ugly, not broken. Contrast the
       * case-results band, where the fifth card has nowhere to go in a
       * four-across grid and the cap is a hard `.error()`.
       *
       * The duplicate check is `.custom()` rather than `.unique()` because
       * `.unique()` on an array of OBJECTS compares whole objects: two tabs
       * pointing at the same practice area differ in `_key` and in their copy,
       * so they are never "equal" and it would never fire.
       */
      validation: (rule) => [
        rule.max(7).warning("The rail is drawn for seven — an eighth makes it taller than its pane."),
        rule
          .custom((tabs) => {
            if (!Array.isArray(tabs)) return true;
            const seen = new Map<string, number>();
            const repeats: string[] = [];
            tabs.forEach((tab, i) => {
              const ref = (tab as { area?: { _ref?: string } } | null)?.area?._ref;
              if (!ref) return;
              const first = seen.get(ref);
              if (first === undefined) seen.set(ref, i);
              else repeats.push(`tab ${i + 1} repeats tab ${first + 1}`);
            });
            return repeats.length
              ? `The same practice area is used twice — ${repeats.join(", ")}.`
              : true;
          })
          .warning(),
      ],
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      description:
        "The small print under the tabs. This band states New York law, so the disclaimer is not optional — do not remove it.",
      type: "text",
      rows: 3,
      group: "copy",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "allHeading",
      title: "Card heading",
      type: "string",
      group: "all",
      validation: (rule) =>
        rule.max(56).warning("Shares one line with the link beside it above 768px."),
    }),
    defineField({
      name: "allLink",
      title: "Card link",
      description:
        'The "See all practice areas →" link. It renders beside the heading on desktop and under the list on a phone — one field, both places.',
      type: "textLink",
      group: "all",
    }),
    defineField({
      name: "allAreas",
      title: "Areas listed",
      description:
        "The check-marked links in the card, in order. These are the areas the tabs do not cover.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "practiceArea" }] })],
      group: "all",
      validation: (rule) =>
        rule
          .max(16)
          .warning("A four-across grid — beyond sixteen the card runs to a fifth row.")
          .unique(),
    }),
  ],
  preview: {
    select: { title: "heading", tabs: "tabs" },
    prepare: ({ title, tabs }) => ({
      title: title ?? "Practice areas",
      subtitle: `${Array.isArray(tabs) ? tabs.length : 0} tabs`,
    }),
  },
});
