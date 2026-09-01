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
