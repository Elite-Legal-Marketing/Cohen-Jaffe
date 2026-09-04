import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons/Link";

import { validateHref } from "../hrefRule";

/**
 * A link rendered as TEXT — underlined, usually with a trailing arrow.
 *
 * The same two fields as `ctaLink`, and deliberately a separate type: the only
 * thing that differs is how long a label may be, and that cannot be overridden
 * per usage. `ctaLink` is a BUTTON, so it caps labels at 28 characters because
 * a longer one wraps inside a fixed-width control. A text link has no such
 * box — it sits in a list or beside a heading and wrapping is normal — so the
 * cap here is set where the LAYOUT actually breaks instead.
 *
 * That difference is not academic. The homepage practice-area panes carry
 * twenty-one sub-links from the approved artboards, and thirteen of them are
 * longer than 28 characters ("The serious injury threshold explained"). Under
 * `ctaLink` every publish of the homepage raised thirteen warnings telling an
 * editor that approved copy would "wrap the button", about things that are not
 * buttons — which is how editors learn to ignore warnings.
 */
export const textLink = defineType({
  name: "textLink",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fieldsets: [{ name: "link", title: "Link", options: { columns: 2 } }],
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      fieldset: "link",
      validation: (rule) =>
        rule
          .required()
          .max(48)
          .warning("Beyond ~48 characters a link wraps its trailing arrow onto a line of its own."),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "string",
      fieldset: "link",
      placeholder: "/contact/",
      validation: (rule) => rule.required().custom(validateHref),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
