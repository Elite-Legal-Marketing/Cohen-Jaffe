import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons/Tag";
import { PRACTICE_AREA_GROUPS, practiceAreaGroupTitle } from "../practiceAreaGroups";
import { PRACTICE_AREA_ICONS } from "../practiceAreaIcons";

/**
 * One practice area — a case type the firm takes.
 *
 * ONE type for every surface. The homepage band, the `/practice-areas/`
 * listing, the footer column, an attorney's sidebar and, eventually, the
 * case-result categories all read different FIELDS from the same document,
 * and a section picks which areas appear with an ordered array of references
 * (rule 7 in AGENTS.md). Which seven the homepage shows is a choice made on
 * the homepage, not a flag set here; there is no `order` or `featured` field.
 *
 * The field list is the CARD LEVEL only — what the homepage tabs and the
 * listing page's cards read. The detail-page template (`CJ - Car Accidents
 * .dc.html`) has twenty-odd bespoke sections and is not modelled until that
 * page is built and approved; modelling it now would mean reshaping this
 * document for every design change on a page nobody has signed off.
 *
 * ⚠️ ONLY THREE FIELDS ARE REQUIRED — name, slug, group. The forty-seven
 * areas are the live hub's taxonomy, and only ten of them have an icon or a
 * photograph and six a card blurb. An empty icon renders nothing; an invented
 * one is worse than none (rule 6).
 *
 * The homepage's per-tab pitch — thesis headline, callout, quote, sub-links —
 * lives on the SECTION (`practiceAreaTab`), not here: it has one consumer,
 * and the detail page's own hero uses different copy.
 */
export const practiceArea = defineType({
  name: "practiceArea",
  title: "Practice area",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description:
        'As it should read on every card, tab and list — "Car Accidents", "Slip & Fall". The page\'s own title is longer and lives on the page.',
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .max(56)
          .warning(
            "Set at 24px beside a 60px icon in a 520px tab — beyond ~24 characters a tab label wraps to two lines. List rows are fine at any length.",
          ),
    }),
    defineField({
      name: "slug",
      title: "URL path",
      description:
        "The live page's path WITHOUT the surrounding slashes — long-island-car-accident-lawyer, or birth-injury/cerebral-palsy. The site renders /<path>/. These are indexed URLs from the current site: changing one is a redirect to write, not a free edit.",
      type: "slug",
      /**
       * No `source`, so no "Generate" button. The live paths are not derivable
       * from the name (`long-island-workers-compensation-attorney` is "Workers'
       * Compensation"), and Sanity's default slugify would turn the `/` in
       * `birth-injury/cerebral-palsy` into a hyphen.
       */
      options: { maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((slug) => {
          const current = slug?.current;
          if (!current) return true;
          return /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(current)
            ? true
            : "Lowercase letters, digits and hyphens, with a single / between segments — no leading or trailing slash.";
        }),
    }),
    defineField({
      name: "group",
      title: "Group",
      description: "Which heading this sits under on the All Practice Areas page.",
      type: "string",
      options: {
        list: PRACTICE_AREA_GROUPS.map(({ value, title }) => ({ value, title })),
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description:
        "From the brand icon set in the code — a library to choose from, not artwork to upload. Leave empty if none fits; the tab and card simply show no icon.",
      type: "string",
      options: { list: [...PRACTICE_AREA_ICONS] },
    }),
    defineField({
      name: "image",
      title: "Photograph",
      description:
        "The card and homepage-pane photograph. Landscape, at least 1600px wide. Set the hotspot on the subject — the pane crops to a tall 40% column at desktop and a wide strip on a phone.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          description:
            "Leave empty when the practice area's name is beside the photograph as text, which it is on every card.",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "blurb",
      title: "Card blurb",
      description:
        "One or two sentences under the name on the All Practice Areas cards. Not shown on the homepage tabs, which carry their own copy.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule
          .max(200)
          .warning("A third-width card at 16/28 — beyond ~200 characters a row of three stops aligning."),
    }),
    defineField({
      name: "linkLabel",
      title: "Link label",
      description:
        'The words on the button or link that goes to this page — "Long Island car accident lawyers". Leave empty and the name is used.',
      type: "string",
      validation: (rule) =>
        rule
          .max(44)
          .warning("A single-line button — beyond ~44 characters it outgrows its column at 1280px."),
    }),
  ],
  preview: {
    select: { title: "name", group: "group", slug: "slug.current", media: "image" },
    prepare: ({ title, group, slug, media }) => ({
      title,
      // The path disambiguates near-duplicates like the two "Failure to Diagnose" pages.
      subtitle: [practiceAreaGroupTitle(group), slug ? `/${slug}/` : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});
