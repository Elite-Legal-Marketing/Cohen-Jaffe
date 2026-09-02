import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";

/**
 * One line in an attorney's "Representative cases" block on their bio page.
 *
 * Deliberately NOT a reference to `caseResult`. The ledger is the firm's, and
 * publishes no attorney attribution — nothing in the 60 migrated results says
 * who tried them. These lines come from the attorney's own published bio
 * instead, and are written the way that bio writes them ("$3 million for an
 * injured motorcyclist who suffered multiple fractures").
 *
 * If the firm ever attributes its results, replace this with a reference and
 * project the figure from the result itself — but do not stand up a second
 * parallel ledger in the meantime.
 */
export const representativeCase = defineType({
  name: "representativeCase",
  title: "Representative case",
  type: "object",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "cite",
      title: "The case",
      description:
        'One line, the way the attorney\'s own bio puts it — "$1.45 million for a child who suffered a head injury in a motor vehicle accident."',
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule
          .required()
          .max(180)
          .warning("Set at 17/29 in a narrow card — beyond ~180 characters it runs past three lines."),
    }),
    defineField({
      name: "note",
      title: "Note",
      description:
        "Optional italic second line under the citation — what made the case hard, or how it resolved. Leave empty and no second line renders.",
      type: "string",
      validation: (rule) =>
        rule.max(120).warning("The italic line is meant to be shorter than the citation above it."),
    }),
  ],
  preview: {
    select: { title: "cite", subtitle: "note" },
  },
});
