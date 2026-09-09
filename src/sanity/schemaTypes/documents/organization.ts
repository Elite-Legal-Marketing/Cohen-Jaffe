import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons/Heart";

import { validateHref } from "../hrefRule";

/**
 * A charity, club or cause the firm supports.
 *
 * ONE type for two surfaces (AGENTS.md rule 7): the homepage band prints the
 * names as a single run-in strip, `/about/our-community/` sets each name over
 * its note in three cards. Same organization, two presentations — so the
 * grouping and the ordering belong to the SECTION, not to the document, and
 * both surfaces sort alphabetically at render.
 *
 * ⚠️ THREE FIELDS, AND THE ABSENCES ARE DELIBERATE.
 *
 * No `category`. The board groups its organizations under "Children &
 * families" / "Health & awareness" / "Veterans & first responders", but those
 * headings were drawn against a DIFFERENT list — the client's own notes — and
 * the fifteen organizations we actually publish do not map onto them (an arts
 * centre, a film festival and a running club fit none of the three). Inventing
 * a taxonomy to fill the labels would be worse than dropping them, and a
 * category field nobody asked for is a field every editor sees forever.
 * Raise it if the firm wants the groups back.
 *
 * No `logo`. Fifteen logos at fifteen different aspect ratios, weights and
 * background assumptions is a design problem, not a content one, and the board
 * does not draw them.
 *
 * No `order` and no `featured` flag. Both surfaces show every organization, in
 * alphabetical order.
 *
 * ⚠️ NO SLUG, because an organization is not a page. If one ever needs its own
 * page this gains a slug — it does not become a second type.
 */
export const organization = defineType({
  name: "organization",
  title: "Organization",
  type: "document",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description:
        "As the organization writes it. This is what both the homepage strip and the community page print.",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .max(48)
          .warning(
            "The homepage strip sets these on one run-in line; past about 48 characters one name takes a whole line to itself on a phone.",
          ),
    }),
    defineField({
      name: "href",
      title: "Website",
      description:
        "The organization's own site. Optional — a name with no link simply renders as text. Opens in a new tab.",
      type: "url",
      validation: (rule) =>
        rule.custom(validateHref).uri({ scheme: ["http", "https"], allowRelative: false }),
    }),
    defineField({
      name: "note",
      title: "What they do",
      description:
        "One line, shown under the name on /about/our-community/ only — the homepage strip prints names alone. Optional.",
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule
          .max(120)
          .warning(
            "Set at 15px in a third-width card. Past ~120 characters this note runs to four lines and the three cards stop matching.",
          ),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "note" },
  },
  orderings: [
    {
      name: "nameAsc",
      title: "Name, A–Z",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
