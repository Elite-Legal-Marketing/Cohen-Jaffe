import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons/Link";

/**
 * A call-to-action link.
 *
 * `href` is a plain string rather than a reference because these point at a
 * mix of internal routes, `tel:` numbers and the odd external URL. The
 * validation keeps the site's trailing-slash rule enforceable at the point of
 * entry — see AGENTS.md → "URLs: trailing slash".
 */
export const ctaLink = defineType({
  name: "ctaLink",
  title: "Button",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().max(28).warning("Long labels wrap the button."),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description:
        "An internal path such as /contact/ — with a trailing slash — or a full https:// or tel: URL.",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== "string") return true;
          if (/^(https?:\/\/|tel:|sms:|mailto:|#)/.test(value)) return true;
          if (!value.startsWith("/")) return "Internal links must start with /";
          // Site-wide rule: every internal URL is slash-terminated.
          if (!value.endsWith("/")) return "Internal links must end with a trailing slash";
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
