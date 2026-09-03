import { defineField, defineType } from "sanity";
import { BlockquoteIcon } from "@sanity/icons/Blockquote";

/**
 * A quote attributed to one of the firm's attorneys.
 *
 * **The attorney is a REFERENCE, not typed-in text.** An editor picks the
 * person from the Attorneys collection, and their name, role and portrait all
 * come from that one document — so a quote can never carry a stale title or a
 * portrait that no longer matches the listing page. It is also the only way to
 * be sure the name on a homepage quote is spelled the same as the name on the
 * bio it links to.
 *
 * The quote TEXT lives here rather than on the attorney, deliberately. An
 * attorney's own `quote` field is the one line that represents them across the
 * site; a section quote is chosen for that section. If they were the same
 * field, two sections on one page would print the same sentence twice — which
 * is exactly what the artboards do, and it only reads as acceptable there
 * because both of those quotes were invented.
 *
 * Shared by the "Our goals" band and the fee explainer.
 *
 * The quote is ONE field. There was a second, `accent`, holding the closing
 * clause so the design could set it in the section's accent colour — the
 * artboards draw the "Our goals" quote two-tone. It was removed on the client's
 * call: it is a typographic effect that costs an editor a decision about where
 * a sentence ends every time they write a quote, and its words belong to the
 * quote either way.
 */
export const attorneyQuote = defineType({
  name: "attorneyQuote",
  title: "Attorney quote",
  type: "object",
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: "text",
      title: "Quote",
      description:
        "In the attorney's own words, without quotation marks — the design adds them. Must be something they actually said.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule
          .required()
          .max(240)
          .warning("Set large and italic — beyond ~240 characters it dominates the section."),
    }),
    defineField({
      name: "attorney",
      title: "Attributed to",
      description: "Pick from the Attorneys collection. Name, role and portrait come from there.",
      type: "reference",
      to: [{ type: "attorney" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "text", subtitle: "attorney.name" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "Quote",
      subtitle: subtitle ? `— ${subtitle}` : "No attorney chosen",
    }),
  },
});
