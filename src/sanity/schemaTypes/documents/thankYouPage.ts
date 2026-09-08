import { defineArrayMember, defineField, defineType } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";

/**
 * The `/thank-you/` page — a singleton, pinned in `src/sanity/structure.ts`.
 *
 * Where the contact form lands. A real page rather than an inline confirmation
 * because ad platforms fire a conversion on a PAGE VIEW, and this is the page
 * the firm's spend is measured against.
 *
 * ⚠️ NO CHECKMARK MEDALLION FIELD, because there is no medallion. The board
 * opens with a 68px gold circle holding a ✓; removed on the client's instruction
 * (2026-09-08). The eyebrow already says "Request received" in words.
 *
 * ⚠️ THIS PAGE SHOULD BE `noindex` AND STILL IS NOT. An indexed thank-you page
 * turns up in search for people who never submitted anything and quietly
 * corrupts the conversion numbers. `Layout.astro` has no robots prop and
 * `/new-seo-setup` is the deferred command that adds them site-wide, so it is
 * recorded here rather than special-cased — but it must not launch without it.
 *
 * ⚠️ THREE OF THE FOUR LINKS ON THIS PAGE POINT AT PAGES THAT DO NOT EXIST YET —
 * `/about/attorneys/`, `/blog/` and `/about/case-results/`. They are the
 * artboard's own destinations and every one is already in the nav, so they go
 * live with those pages. Modelling them means an editor can repoint them without
 * a deploy if any of that changes.
 */
export const thankYouPage = defineType({
  name: "thankYouPage",
  title: "Thank You page",
  type: "document",
  icon: CheckmarkCircleIcon,
  groups: [
    { name: "hero", title: "Confirmation", default: true },
    { name: "wait", title: "While you wait" },
    { name: "read", title: "Closing panel" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required().max(32).warning("One line above the heading."),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      description: "The page's h1.",
      type: "string",
      group: "hero",
      validation: (rule) =>
        rule.required().max(56).warning("Set at 62px — past ~56 characters it runs to three lines."),
    }),
    defineField({
      name: "lead",
      title: "Lead",
      description: "What happens next, and how to reach the firm sooner.",
      type: "text",
      rows: 4,
      group: "hero",
      validation: (rule) => rule.required().max(260).warning("Three lines at most over the photograph."),
    }),
    defineField({
      name: "cta",
      title: "Button",
      type: "ctaLink",
      group: "hero",
    }),
    defineField({
      name: "waitEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "wait",
      validation: (rule) => rule.required().max(28).warning("One line."),
    }),
    defineField({
      name: "waitHeading",
      title: "Heading",
      type: "string",
      group: "wait",
      validation: (rule) => rule.required().max(48).warning("Set at 52px — two lines."),
    }),
    defineField({
      name: "steps",
      title: "Steps",
      description:
        "Numbered 01, 02, 03… by their order here — there is no number to type, and reordering renumbers them. Four divides cleanly at every breakpoint; a fifth strands itself.",
      type: "array",
      of: [defineArrayMember({ type: "waitStep" })],
      group: "wait",
      validation: (rule) =>
        rule.max(4).warning("The row is a four-across grid; a fifth sits alone on a second row."),
    }),
    defineField({
      name: "readHeading",
      title: "Heading",
      type: "string",
      group: "read",
      validation: (rule) => rule.required().max(40).warning("One line beside the buttons."),
    }),
    defineField({
      name: "readLead",
      title: "Lead",
      type: "text",
      rows: 2,
      group: "read",
      validation: (rule) => rule.required().max(140).warning("Two lines under the heading."),
    }),
    defineField({
      name: "readPrimary",
      title: "First button",
      description: "The gold one.",
      type: "ctaLink",
      group: "read",
    }),
    defineField({
      name: "readSecondary",
      title: "Second button",
      description: "The outlined one. Order carries the styling, so the pair is not interchangeable.",
      type: "ctaLink",
      group: "read",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Thank You page" }),
  },
});
