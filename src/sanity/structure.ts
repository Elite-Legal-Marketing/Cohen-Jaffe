import type { StructureResolver } from "sanity/structure";
import { CaseIcon } from "@sanity/icons/Case";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { FolderIcon } from "@sanity/icons/Folder";
import { HomeIcon } from "@sanity/icons/Home";
import { StarIcon } from "@sanity/icons/Star";
import { UsersIcon } from "@sanity/icons/Users";

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
const SINGLETONS = ["homePage", "firmDetails"] as const;

/**
 * Collections given their own list item above. They must be excluded from the
 * generic fallback too, or the Studio shows each of them twice.
 */
const LISTED = ["featuredCaseResult", "caseResult", "attorney"] as const;

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

      // Collections, in a folder of their own so the root stays two items deep.
      // Listed explicitly, so the titles, icons and ORDER are ours — the generic
      // fallback sorts alphabetically, which would put the ledger above the
      // featured stories for no reason anyone could explain.
      S.listItem()
        .title("Collections")
        .icon(FolderIcon)
        .child(
          S.list()
            .title("Collections")
            .items([
              S.listItem()
                .title("Case Results")
                .icon(CaseIcon)
                .child(
                  S.list()
                    .title("Case Results")
                    .items([
                      S.documentTypeListItem("featuredCaseResult")
                        .title("Featured Case Results")
                        .icon(StarIcon),
                      S.documentTypeListItem("caseResult").title("Case Results").icon(CaseIcon),
                    ]),
                ),

              // Flat: six documents, no sub-folder to open. Ordering in the
              // list is the Studio's, not ours — who appears where on a page is
              // the ordered reference array on that page's section, so there is
              // nothing here to sort.
              S.documentTypeListItem("attorney").title("Attorneys").icon(UsersIcon),
            ]),
        ),

      // Site settings last, after the content an editor opens every day.
      // A folder rather than a bare item because it is the one that grows:
      // Global SEO Settings joins it at launch prep.
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Site Settings")
            .items([singleton(S, "firmDetails", "Firm Details", CogIcon)]),
        ),

      // Anything else: not a singleton, and not already listed above.
      ...S.documentTypeListItems().filter(
        (item) =>
          !SINGLETONS.includes(item.getId() as (typeof SINGLETONS)[number]) &&
          !LISTED.includes(item.getId() as (typeof LISTED)[number]),
      ),
    ]);
