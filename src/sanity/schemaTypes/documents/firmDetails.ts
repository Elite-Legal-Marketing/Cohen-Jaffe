import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

/**
 * Firm Details — the singleton under Site Settings.
 *
 * The one place the firm's identity and contact details live. Everything here
 * appears in more than one place on the site, which is the bar for putting it
 * here rather than on the section that happens to show it: the phone number is
 * in the header, the footer and the fee explainer, and before this it was three
 * copies of the same string.
 *
 * Enforced as a singleton by `src/sanity/structure.ts`, not by a schema option
 * — there isn't one. Add it to `SINGLETONS` there or the Studio offers a
 * "create new" beside it and an editor ends up with two.
 *
 * **What is deliberately NOT here:**
 *
 * - **Navigation.** The menus, their nesting and every href stay in
 *   `src/data/navigation.ts`. That architecture was parsed out of the live
 *   WordPress nav and each URL checked against its own page's `og:url`; it is
 *   already-indexed IA, not settings, and moving it is its own project with its
 *   own redirect questions. See AGENTS.md → "Navigation".
 * - **SEO defaults.** A Global SEO Settings singleton is a planned, separate
 *   thing — `/new-seo-setup` builds it near launch, with the crawl switch,
 *   JSON-LD and sitemap that belong beside it. Two settings singletons is the
 *   intended shape, not an accident.
 * - **Anything with one consumer.** A field only the footer reads belongs on
 *   the footer, not in global settings where it looks site-wide.
 *
 * Phone numbers are stored in their DISPLAY form only. The `tel:` href is
 * derived in code by stripping non-digits, so the two can never disagree —
 * which they did, in the old hand-maintained pairs.
 */
export const firmDetails = defineType({
  name: "firmDetails",
  title: "Firm Details",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact" },
    { name: "offices", title: "Offices" },
    { name: "legal", title: "Legal" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Legal name",
      description:
        "The full registered name, used in the copyright line and as the logo's alt text.",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortName",
      title: "Short name",
      description: 'What the firm is called in running copy and page titles — "Cohen & Jaffe".',
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "blurb",
      title: "Description",
      description:
        "One or two sentences saying who the firm is and who it acts for. Currently under the logo in the footer.",
      type: "text",
      rows: 3,
      group: "identity",
      validation: (rule) =>
        rule.max(200).warning("Sits in a narrow footer column — beyond ~200 characters it runs long."),
    }),

    defineField({
      name: "phone",
      title: "Main phone",
      description:
        "As it should read on the page. Shown in the header, the footer and the fee explainer; the tel: link is built from it.",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sms",
      title: "Text number",
      description: "The number for the footer's “Text us 24/7”. Leave empty and that line is hidden.",
      type: "string",
      group: "contact",
    }),

    defineField({
      name: "offices",
      title: "Offices",
      description: "In the order they should appear. The first is treated as the main office.",
      type: "array",
      of: [defineArrayMember({ type: "office" })],
      group: "offices",
      validation: (rule) => rule.min(1).warning("The footer expects at least one office."),
    }),

    defineField({
      name: "advertisingLabel",
      title: "Advertising label",
      description:
        'The words that must appear, set in bold at the head of the disclaimer. New York Rule 7.1 requires this specific label on a law firm\'s site — it is not a heading you are free to reword.',
      type: "string",
      group: "legal",
      initialValue: "Attorney Advertising",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "legalDisclaimer",
      title: "Site disclaimer",
      description:
        "The rest of the notice across the foot of every page, after the label. Do not remove it, and do not soften “Prior results do not guarantee a similar outcome”. The copyright line is appended automatically.",
      type: "text",
      rows: 4,
      group: "legal",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { subtitle: "phone" },
    prepare: ({ subtitle }) => ({ title: "Firm Details", subtitle }),
  },
});
