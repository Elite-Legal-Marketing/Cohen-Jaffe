import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons/Heart";

/**
 * `/about/our-community/` — a singleton, pinned in `src/sanity/structure.ts`.
 *
 * ⚠️ FLAT FIELDS IN GROUPS, NOT NESTED SECTION OBJECTS. This follows
 * `faqsPage`, not `homePage`. Rule 2 puts every section in a collapsible object
 * because the homepage has fifteen of them and an always-expanded form is
 * unusable; this page has four, and three would be single-use object types
 * existing only to hold three strings each. Tabs do the same job here with two
 * new schema types instead of five. The `list*` prefixes on `faqsPage` are the
 * same idiom as the `intro*` / `orgs*` / `memorial*` ones below.
 *
 * ⚠️ THE ORGANIZATIONS ARE NOT A FIELD. They are the `organization` collection,
 * shown in full — the same twenty the homepage band prints as a strip. Only the
 * section's chrome lives here.
 *
 * ⚠️ THERE IS NO SCHOLARSHIP SECTION, and its absence is a decision (client,
 * 2026-09-09): the live contest closed applications on 12 June 2026, so
 * `/about/community-scholarship/` now 301s to this page in `vercel.json` and
 * its nav item is gone from `navigation.ts`. The live page still says "Each
 * year" — if a 2027 round opens, the redirect, the nav item AND a section here
 * all come back together.
 *
 * ⚠️ NO HERO IMAGE FIELD. The board draws a photograph behind the hero; it was
 * replaced by the `/faqs/` treatment on the client's instruction, because
 * interior pages get one hero and it is not a photograph. A field for an image
 * the design does not render is a field an editor will fill and then wonder
 * about.
 *
 * ⚠️ NOTHING HERE IS THE ARTBOARD'S COPY EXCEPT THE MEMORIAL. The board's hero
 * heading, its intro heading ("Fifty years in one community…"), its intro
 * paragraphs and its organizations lead were all replaced with the live site's
 * own words, because each of the board's returned zero hits across the live
 * site and the 217-page mirror. See `scripts/seed-community-page.ts`.
 */
export const communityPage = defineType({
  name: "communityPage",
  title: "Our Community page",
  type: "document",
  icon: HeartIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Intro" },
    { name: "organizations", title: "Organizations" },
    { name: "memorial", title: "In memoriam" },
  ],
  fields: [
    // ── Hero ────────────────────────────────────────────────────────────────
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required().max(40).warning("The small gold line above the H1."),
    }),
    defineField({
      name: "heading",
      title: "Heading (H1)",
      description:
        "The page's H1. It is the live site's own H1, and the same words as the URL, the nav item, the footer link and the browser title — change one and change all five.",
      type: "string",
      group: "hero",
      validation: (rule) =>
        rule.required().max(56).warning("Set at 56px on a dark band; beyond ~56 characters it runs to three lines."),
    }),
    defineField({
      name: "lead",
      title: "Lead",
      type: "text",
      rows: 3,
      group: "hero",
      validation: (rule) => rule.required().max(220).warning("One or two lines under the H1."),
    }),

    // ── Intro ───────────────────────────────────────────────────────────────
    defineField({
      name: "introHeading",
      title: "Heading",
      type: "string",
      group: "intro",
      validation: (rule) =>
        rule.required().max(64).warning("Set at 52px beside a quote card — beyond ~64 characters the two columns stop balancing."),
    }),
    defineField({
      name: "introBody",
      title: "Copy",
      description:
        "Four paragraphs as seeded. Every named fact in them is on the live /about/our-community/ page — check anything you add the same way.",
      type: "richText",
      group: "intro",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introQuote",
      title: "Pull quote",
      description: "The large italic line at the top of the card. The attribution comes from the attorney you pick.",
      /**
       * ⚠️ `attorneyQuote`, so the attribution is a REFERENCE (rule 8). It
       * matters on this page specifically: the live site calls Richard Jaffe
       * "founding partner" in the very sentence quoted here, while the Studio —
       * which the client has edited since — has him as Managing Partner and
       * Stephen Cohen as Founding Partner. Reading the role means this page
       * cannot contradict his own bio.
       *
       * It replaces a hand-rolled `COMMUNITY_ATTORNEY_QUERY` that fetched him
       * by id, which the hardcoded version needed and this does not.
       */
      type: "attorneyQuote",
      group: "intro",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introQuoteBody",
      title: "Second paragraph",
      description:
        "Sits under the pull quote, above the attribution, and is attributed to the SAME attorney — it is the rest of the same statement, not a second quote. Optional.",
      /**
       * ⚠️ A SIBLING OF `introQuote`, NOT A SECOND FIELD INSIDE IT.
       * `attorneyQuote` is shared with the "Our goals" band, the fee explainer
       * and the FAQs page; adding a second text field to it for one card's sake
       * would put an empty box on all four. Kept here, where it is used.
       */
      type: "text",
      rows: 4,
      group: "intro",
      validation: (rule) =>
        rule.max(320).warning("Set at 17px in a 640px card — beyond ~320 characters the card outgrows the copy beside it."),
    }),

    // ── Organizations ───────────────────────────────────────────────────────
    defineField({
      name: "orgsEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "organizations",
      validation: (rule) => rule.required().max(40).warning("The small gold line above the heading."),
    }),
    defineField({
      name: "orgsHeading",
      title: "Heading",
      type: "string",
      group: "organizations",
      validation: (rule) => rule.required().max(48).warning("Set at 52px."),
    }),
    defineField({
      name: "orgsLead",
      title: "Lead",
      description: "Sits to the right of the heading, above the three cards.",
      type: "text",
      rows: 3,
      group: "organizations",
      validation: (rule) => rule.required().max(200).warning("Two lines at most beside the heading."),
    }),

    // ── In memoriam ─────────────────────────────────────────────────────────
    defineField({
      name: "memorialEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "memorial",
      validation: (rule) => rule.required().max(40).warning("The gold line above the heading."),
    }),
    defineField({
      name: "memorialHeading",
      title: "Heading",
      type: "string",
      group: "memorial",
      validation: (rule) => rule.required().max(56).warning("Set at 48px in the left half of the panel."),
    }),
    defineField({
      name: "memorialBody",
      title: "Copy",
      description:
        "Every fact here is on the live page — the 2014 accident, both children, their ages, their grandmother, and the outing at Pine Hollow. This is an account of a real family's bereavement; do not embellish it.",
      type: "text",
      rows: 6,
      group: "memorial",
      validation: (rule) => rule.required().max(520).warning("The left column is sized for about 520 characters."),
    }),
    defineField({
      name: "memorialQuote",
      title: "Pull quote",
      /**
       * ⚠️ NOT an `attorneyQuote`, and that is right rather than an oversight:
       * the board attributes this to the FIRM, not to a person, and it appears
       * on the page with no name under it. ⚠️ It is also UNSOURCED — nobody at
       * Cohen & Jaffe is recorded as having said it, and it sits beneath an
       * account of a real bereavement. Confirm or replace before launch.
       */
      type: "text",
      rows: 3,
      group: "memorial",
      validation: (rule) => rule.max(200).warning("Set at 26px italic in the right half of the panel."),
    }),
    defineField({
      name: "memorialNote",
      title: "Note",
      description: "Under the rule, below the pull quote.",
      type: "text",
      rows: 3,
      group: "memorial",
      validation: (rule) => rule.max(240).warning("Two or three lines under the rule."),
    }),
    defineField({
      name: "memorialLink",
      title: "Link",
      description: "To the fund's own site. A text link with an arrow, so it opens in a new tab.",
      type: "textLink",
      group: "memorial",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title ?? "Our Community page" }),
  },
});
