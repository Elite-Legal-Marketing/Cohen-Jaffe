import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

/**
 * The homepage — a singleton.
 *
 * Singletons are enforced by Studio Structure, not by a schema option: see
 * `src/sanity/structure.ts`, which pins this to the document id "homePage" and
 * hides it from the generic document lists.
 *
 * One named field per section of the approved design, added as each section is
 * built. **Every section is collapsible and starts collapsed** — with fifteen
 * of them, an always-expanded form is unusable. Sections that repeat elsewhere
 * on the site (attorneys, practice areas, case results) will reference their own
 * document types rather than nest copies here.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  /**
   * An ARRAY section cannot take `options.collapsible` — that lives on
   * `ObjectOptions`, not `ArrayOptions`, and TypeScript rejects it. A fieldset
   * gives the same accordion without burying the items an extra level deep in
   * a wrapper object.
   */
  fieldsets: [
    {
      name: "statsBand",
      title: "Stats band",
      description: "The four claims under the hero.",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
      fieldset: "statsBand",
      validation: (rule) =>
        rule
          .max(4)
          .warning("The band is a four-across grid; a fifth stat sits alone on a second row."),
    }),
    defineField({
      name: "caseResults",
      title: "Case results",
      type: "caseResultsSection",
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "about",
      title: "Our goals",
      type: "aboutSection",
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "fees",
      title: "Fee explainer",
      type: "feesSection",
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "practiceAreas",
      title: "Practice areas",
      type: "practiceAreasSection",
      options: { collapsible: true, collapsed: true },
    }),
    /**
     * ⚠️ THIS SECTION LEANS ON THE ONE ABOVE IT. The deadlines band carries no
     * disclaimer of its own because the practice-areas band closes with the
     * one that covers it, naming deadlines specifically. Reordering these two,
     * or removing the practice-areas band, leaves a section of bare legal
     * deadlines with no qualification on the page at all — move the line with
     * it. See `deadlinesSection.ts`.
     */
    defineField({
      name: "deadlines",
      title: "New York deadlines",
      type: "deadlinesSection",
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
