import { defineField, defineType } from "sanity";
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
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
