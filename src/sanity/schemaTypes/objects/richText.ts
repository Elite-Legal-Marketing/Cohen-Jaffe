import { defineArrayMember, defineType } from "sanity";

/**
 * Portable Text.
 *
 * House rule: **any field that holds more than one paragraph is this type**, not
 * `text`. A `text` field forces editors to write a wall with no structure and
 * gives the front end nothing to render but line breaks.
 *
 * Single-paragraph copy — a hero's supporting line, a card blurb — stays a
 * plain `string` or `text`. Reach for this the moment a second paragraph, a
 * list, or a link inside the copy is plausible.
 *
 * Deliberately narrow: the styles here are the ones the designs actually use.
 * Adding H1 would let an editor put a second `<h1>` on a page.
 *
 * ⚠️ THERE IS NO `image` MEMBER, AND ONE WAS TRIED AND REMOVED (2026-09-08).
 * The FAQ migration looked like it needed one: three of the source pages carry
 * 24 of their 25 `<img>` elements between them. Extracting all 25 showed what
 * they actually are — WordPress theme decoration. "info icon", "attorney icon",
 * "caution icon", "justice scales", a "download checklist button" that is a
 * picture of a button, and a set of section glyphs. The single real figure is a
 * 300x300 thumbnail.
 *
 * So the images are dropped at extraction (`scripts/faq-extract.ts` records the
 * count per page) and this type stays text-only. The cost of the member was an
 * "Image" button in EVERY rich-text field on the site — `aboutSection.body` and
 * `attorney.biography` as well — permanently, to carry over the old theme's
 * furniture.
 *
 * If a future page has genuine figures, add it back deliberately for that page
 * and give `RichText.astro` a component for it in the same change:
 * `astro-portabletext` renders a visible "unknown type" placeholder for any
 * block it has no component for.
 */
export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "Link",
                type: "string",
                description:
                  "An internal path such as /contact/ — with a trailing slash — or a full https:// URL.",
                validation: (rule) =>
                  rule.required().custom((value) => {
                    if (typeof value !== "string") return true;
                    if (/^(https?:\/\/|tel:|sms:|mailto:|#)/.test(value)) return true;
                    if (!value.startsWith("/")) return "Internal links must start with /";
                    if (!value.endsWith("/")) return "Internal links must end with a trailing slash";
                    return true;
                  }),
              },
            ],
          }),
        ],
      },
    }),
  ],
});
