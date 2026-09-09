import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons/Heart";

/**
 * The homepage "In the community" band: a card about the Reagan and Jax Cohen
 * Memorial Fund beside a mosaic of photographs, over a run-in strip of the
 * organizations the firm supports.
 *
 * ⚠️ THE ORGANIZATIONS ARE NOT A FIELD HERE. They are the `organization`
 * collection, read by `ORGANIZATIONS_QUERY` and shown in full — the same twenty
 * that `/about/our-community/` prints with their notes. There is no reference
 * array and there must not be one: the band shows all of them, so there is
 * nothing to curate (contrast `faqSection.faqs`, where eight of a hundred and
 * eighty ARE a choice made on the homepage).
 *
 * ⚠️ THE SEVEN PHOTOGRAPHS ARE NOT A FIELD EITHER, YET. They do not exist —
 * the component renders labelled placeholders. When the firm supplies them this
 * gains a `photos` array of images, because someone will swap them; see rule 5.
 * Modelling seven empty image slots before there is anything to put in them
 * would be seven fields every editor sees and none of them can fill.
 *
 * ⚠️ "A promise Stephen made to his grandchildren." IS UNSOURCED. The fund, the
 * 2014 date, the purpose and "founding partner" all check out against the live
 * `/about/our-community/` page; the promise does not. It is modelled as the
 * board wrote it on the client's instruction — the point of modelling it is
 * that the fix is a Studio edit rather than a deploy.
 */
export const communitySection = defineType({
  name: "communitySection",
  title: "In the community",
  type: "object",
  icon: HeartIcon,
  fieldsets: [
    {
      name: "feature",
      title: "The memorial fund card",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: "The small gold line above the heading.",
      type: "string",
      validation: (rule) =>
        rule.required().max(40).warning("Set centred above the heading; it does not wrap well."),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) =>
        rule.required().max(48).warning("Set at 42px and centred — a long one wraps to three lines."),
    }),

    defineField({
      name: "featureLabel",
      title: "Card label",
      description: "The gold micro-line at the top of the card — the fund's name.",
      type: "string",
      fieldset: "feature",
      validation: (rule) =>
        rule.required().max(48).warning("Set at 12px in a card about 480px wide."),
    }),
    defineField({
      name: "featureHeading",
      title: "Card heading",
      type: "string",
      fieldset: "feature",
      validation: (rule) =>
        rule.required().max(64).warning("Set at 30px in a narrow card; beyond ~64 it runs to four lines."),
    }),
    defineField({
      name: "featureBody",
      title: "Card copy",
      description: "One paragraph. Anything longer than the card is a design change, not a content one.",
      type: "text",
      rows: 4,
      fieldset: "feature",
      validation: (rule) =>
        rule.required().max(240).warning("The card is sized for about 240 characters."),
    }),
    defineField({
      name: "featureLink",
      title: "Card link",
      /**
       * ⚠️ `textLink`, NOT `ctaLink` (rule 10). This renders as an underlined
       * text link with a trailing arrow, not a button — and the type is picked
       * by how a link is RENDERED, not by whether it is a call to action.
       *
       * It points OFF-SITE, to the fund's own domain, which is what the live
       * page links the fund's name to. Not `/about/our-community/`: the band's
       * own button already goes there, and a memorial to the founder's
       * grandchildren should not point at the firm's marketing page.
       */
      type: "textLink",
    }),

    defineField({
      name: "cta",
      title: "Button",
      description: "Goes to the community page. A button, so no arrow in the label.",
      type: "ctaLink",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "In the community",
      subtitle: subtitle ?? undefined,
    }),
  },
});
