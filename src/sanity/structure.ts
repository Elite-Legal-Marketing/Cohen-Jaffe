import type { StructureResolver } from "sanity/structure";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { HomeIcon } from "@sanity/icons/Home";

/**
 * Studio desk structure.
 *
 * Shape: **Pages** (the fixed pages of the site) → then collections → then site
 * settings. Editors look for "the homepage" under Pages, not at the root
 * alongside a list of blog posts.
 *
 * Singletons are enforced HERE, not in the schema — there is no
 * `singleton: true` option. Two things make one:
 *   1. `S.document().documentId("homePage")` pins it to a fixed id, so the
 *      editor can only ever open the one document.
 *   2. The type is excluded from the generic document lists below, or the
 *      Studio offers a "create new" alongside it and editors end up with two.
 *
 * Keep SINGLETONS in sync when adding one, or step 2 silently stops working.
 */
const SINGLETONS = ["homePage"] as const;

/** A singleton list item: fixed id, so there is only ever one document. */
const singleton = (
  S: Parameters<StructureResolver>[0],
  type: string,
  title: string,
  icon?: React.ComponentType,
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Pages")
            .items([singleton(S, "homePage", "Homepage", HomeIcon)]),
        ),

      S.divider(),

      // Everything that is not a singleton, listed normally.
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.includes(item.getId() as (typeof SINGLETONS)[number]),
      ),
    ]);
