import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons/Pin";

/**
 * One of the firm's offices.
 *
 * Nested in Firm Details rather than being its own document type, because
 * there are two of them and they are firm-level contact data — the footer draws
 * all of them, and nothing references one individually. `href` is here so the
 * office pages the live site already has (`/new-hyde-park-office/`,
 * `/jackson-heights-office/`) can be generated from this array when they are
 * built, without promoting offices to a collection first.
 *
 * ➜ Promote to a document type if an office ever needs its own body copy,
 * photographs or SEO fields. Two rows of contact details do not justify one.
 */
export const office = defineType({
  name: "office",
  title: "Office",
  type: "object",
  icon: PinIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "The neighbourhood, not the firm — “New Hyde Park”.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge",
      description:
        'The gold pill in the footer — "New Hyde Park · primary office". Says which office this is and how it is used.',
      type: "string",
      validation: (rule) => rule.max(48).warning("Uppercase and tracked; it wraps past ~48."),
    }),
    defineField({
      name: "street",
      title: "Street",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cityStateZip",
      title: "City, state and ZIP",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      description: "As it should read on the page. The tel: link is built from it.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hours",
      title: "Hours",
      description: 'One line — "Phones answered 24/7 · Office Mon–Fri 9–5".',
      type: "string",
    }),
    defineField({
      name: "directions",
      title: "Directions link",
      description: "The Google Maps URL this office's “Get directions” opens.",
      type: "url",
    }),
    defineField({
      name: "map",
      title: "Map embed URL",
      description: "The OpenStreetMap embed the footer frames. Leave empty and no map renders.",
      type: "url",
    }),
    defineField({
      name: "href",
      title: "Office page",
      description:
        "The path to this office's own page, with a trailing slash. These URLs are already indexed — changing one is a redirect to write.",
      type: "string",
      validation: (rule) =>
        rule.custom((value) => {
          if (typeof value !== "string" || value === "") return true;
          if (!value.startsWith("/")) return "Use an internal path like /new-hyde-park-office/";
          if (!value.endsWith("/")) return "Internal links must end with a trailing slash";
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "cityStateZip" },
  },
});
