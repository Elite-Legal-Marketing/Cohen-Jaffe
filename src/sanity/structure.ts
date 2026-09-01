import type { StructureResolver } from "sanity/structure";
import { HomeIcon } from "@sanity/icons/Home";

/**
 * Studio desk structure.
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

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage").title("Homepage")),

      S.divider(),

      // Everything that is not a singleton, listed normally.
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.includes(item.getId() as (typeof SINGLETONS)[number]),
      ),
    ]);
