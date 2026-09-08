import { defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { FAQ_CATEGORIES, faqCategoryTitle } from "../faqCategories";

/**
 * One question and its answer.
 *
 * 180 documents migrated from the live WordPress FAQ library by
 * `scripts/faq-extract.ts` → `scripts/faqs.json` → `scripts/seed-faqs.ts`. Read
 * the extractor's docblock before touching any of them: it records what the
 * source is, the five ways it corrupts a naive migration, and which pages needed
 * special handling.
 *
 * ⚠️ EVERY ONE OF THESE HAS A LIVE, INDEXED URL AT `/faqs/<slug>/`, and the new
 * site serves the same path. That is the whole reason `slug` is a field rather
 * than something derived: 127 pages, each carrying roughly five thousand
 * characters of long-tail legal content, keep their own ranking instead of being
 * consolidated into one. Changing a slug is a redirect to write, not a free
 * edit — the same rule the practice areas live under.
 *
 * FOUR FIELDS, and the list is short on purpose. The ones NOT here are each one
 * somebody will otherwise propose adding back:
 *
 *   - NO `excerpt` / `summary`. The homepage band shows the answer's opening
 *     paragraph, taken at render. A hand-written summary across 180 legal
 *     answers is 180 new claims nobody has reviewed, and it is the
 *     `attorney.summary` mistake exactly — `.required()`, one consumer, removed
 *     three weeks later.
 *   - NO `featured` FLAG. Which eight appear on the homepage is a property of
 *     the SECTION (rule 7), so it lives in `homePage.faqs.faqs[]` as an ordered
 *     array of references an editor can reorder.
 *   - NO `order`. `menu_order` is 0 on all 128 source pages, so there is no
 *     editorial order to preserve. The hub sorts by question. A manual sort
 *     field over 180 documents is one an editor maintains 180 times and will not.
 *   - NO SEO / META FIELDS. `/new-seo-setup` is the deferred command that adds
 *     those site-wide; a per-type version now would be undone by it.
 */
export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      description:
        "As it should read as the page's heading, and on the homepage and hub rows.",
      type: "string",
      /**
       * ⚠️ 200, AND THE FIRST ATTEMPT AT 90 WAS WRONG. 90 was measured against
       * the 128 source PAGE TITLES, where the longest is 86 characters. But 60
       * of these documents come from splitting the round-up pages, and their
       * questions are whole narrated situations in the firm's own voice — "I was
       * badly injured in a fall on an escalator, but I had just had a couple of
       * glasses of wine with dinner…" runs to 184. The cap fired on 16 published
       * questions the moment the seed landed.
       *
       * A warning that fires on the firm's own approved content is how editors
       * learn to ignore warnings (AGENTS.md rule 10, the same reasoning that
       * split `ctaLink` from `textLink`). 200 sits above the longest real
       * question, so it only catches something genuinely runaway.
       *
       * There is no hard breakage to guard anyway: the question wraps as an h1
       * and wraps in a row. The five questions over 120 characters read as
       * paragraphs rather than questions and are worth REWRITING — but that is a
       * copy decision for the firm, not a validation error on migrated content.
       */
      validation: (rule) =>
        rule
          .required()
          .max(200)
          .warning(
            "Past about 200 characters this is a paragraph rather than a question — the longest migrated one is 184.",
          ),
    }),
    defineField({
      name: "slug",
      title: "URL path",
      description:
        "The page's path under /faqs/, without the surrounding slashes. These are indexed URLs from the current site: changing one is a redirect to write, not a free edit.",
      type: "slug",
      /**
       * No `source`, so no "Generate" button — matching `practiceArea`. These
       * paths are not derivable from the question (`if-you-suspect-abuse` is
       * "Steps to Take If you Suspect Nursing Home Abuse"), and a button that
       * silently rewrites a live URL from the title is an invitation to break
       * one.
       */
      options: { maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((slug) => {
          const current = slug?.current;
          if (!current) return true;
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)
            ? true
            : "Lowercase letters, digits and hyphens only — no slashes, and no leading or trailing hyphen.";
        }),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Which pill this sits under on the FAQs page.",
      type: "string",
      options: {
        list: FAQ_CATEGORIES.map(({ value, title }) => ({ value, title })),
        // Dropdown rather than the radio layout `practiceArea.group` uses:
        // eighteen radios is a wall, five is a choice.
        layout: "dropdown",
      },
      /**
       * Required, unlike the optional fields rule 6 is about. An uncategorised
       * FAQ is invisible under every pill but "All questions", and unlike a
       * missing bar admission this is assignable for all 180 — the live
       * taxonomy covers 178 of them and the extractor records its two
       * assignments in the open.
       */
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      description: "The full answer. Headings, lists and links all work.",
      type: "richText",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "question", category: "category" },
    prepare: ({ title, category }) => ({
      title,
      subtitle: faqCategoryTitle(category),
    }),
  },
});
