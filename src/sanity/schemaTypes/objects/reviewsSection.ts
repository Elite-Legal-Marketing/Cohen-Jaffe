import { defineArrayMember, defineField, defineType } from "sanity";
import { StarFilledIcon } from "@sanity/icons/StarFilled";

/**
 * The homepage testimonials band: a carousel mixing video and written reviews.
 *
 * `reviews` is ONE ordered array holding BOTH document types. A single reference
 * member accepting two `to` types is what makes a mixed, editor-ordered list
 * possible — the alternative, two arrays interleaved by the component, would put
 * the running order somewhere no editor can see it.
 *
 * ⚠️ THERE IS NO DISCLAIMER FIELD, and that is a decision rather than an
 * oversight. NY Rule 7.1(e)(3) requires "Prior results do not guarantee a
 * similar outcome" on any advertisement carrying a client testimonial, and this
 * band is squarely that. One was built and removed on the client's call
 * (2026-09-08) because the exact sentence was already printing three times on
 * the homepage. What makes that safe is the FOOTER instance specifically — it is
 * site-wide and unconditional, so it travels with this band wherever the band is
 * reused, which the case-results band's own disclaimer does not.
 *
 * If the footer disclaimer is ever made conditional, shortened, or dropped from
 * a page carrying reviews, this field has to come back.
 *
 * The card draws five stars for every written review, so only put five-star
 * reviews in the collection.
 */
export const reviewsSection = defineType({
  name: "reviewsSection",
  title: "Testimonials",
  type: "object",
  icon: StarFilledIcon,
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "reviews", title: "Reviews" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description: "The small gold line above the heading.",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule.required().max(28).warning("Centred over the heading — it should stay on one line."),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "copy",
      validation: (rule) =>
        rule
          .required()
          .max(52)
          .warning("Set at 42px and centred — past ~52 characters it runs to three lines."),
    }),
    defineField({
      name: "lead",
      title: "Lead",
      description: "One sentence under the heading.",
      type: "text",
      rows: 3,
      group: "copy",
      validation: (rule) =>
        rule.required().max(160).warning("Centred and capped to a readable measure — two lines."),
    }),
    defineField({
      name: "cta",
      title: "Button",
      description: 'The link to the full Testimonials page — "Read all reviews".',
      type: "ctaLink",
      group: "copy",
    }),
    defineField({
      name: "reviews",
      title: "Reviews",
      description:
        "Four or more, in the order they should appear. Mix video and written freely — the carousel takes them as one list. Four fit without scrolling; a fifth turns the arrows on.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "videoReview" }, { type: "review" }],
        }),
      ],
      group: "reviews",
      validation: (rule) =>
        rule
          .min(4)
          .warning(
            "The band is drawn as a row of four. Fewer leaves the row short and the cards stretched.",
          )
          .unique(),
    }),
  ],
  preview: {
    select: { title: "heading", reviews: "reviews" },
    prepare: ({ title, reviews }) => ({
      title: title ?? "Testimonials",
      subtitle: `${Array.isArray(reviews) ? reviews.length : 0} reviews`,
    }),
  },
});
