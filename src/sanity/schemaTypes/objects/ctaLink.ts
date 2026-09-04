import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons/Link";

import { validateHref } from "../hrefRule";

/**
 * A call-to-action link — a BUTTON.
 *
 * Use `textLink` for a link rendered as text. The two differ only in how
 * long a label may be, and a nested type's validation cannot be overridden
 * per usage, which is why they are separate types rather than one.
 *
 * `href` is a plain string rather than a reference because these point at a
 * mix of internal routes, `tel:` numbers and the odd external URL. The
 * validation keeps the site's trailing-slash rule enforceable at the point of
 * entry — see AGENTS.md → "URLs: trailing slash".
 *
 * Sanity has no built-in link type, so this two-field object IS the idiomatic
 * pattern. The fieldset sets the two side by side: stacked, with a description
 * under each, one link filled most of a screen. The long-form guidance lives in
 * the validation messages, which appear only when someone gets it wrong.
 *
 * ➜ When page documents exist, revisit this. The stronger pattern is a
 * `linkType` radio with a `reference` for internal targets and a `url` for
 * external ones: a reference resolves to whatever the page's slug is today, so
 * an internal link cannot rot when a slug changes. A hand-typed path can, and
 * this one silently 404s if it does.
 */
export const ctaLink = defineType({
  name: "ctaLink",
  title: "Button",
  type: "object",
  icon: LinkIcon,
  fieldsets: [{ name: "link", title: "Link", options: { columns: 2 } }],
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      fieldset: "link",
      validation: (rule) => rule.required().max(28).warning("Long labels wrap the button."),
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
