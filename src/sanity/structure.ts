import type { StructureResolver } from "sanity/structure";
import { CaseIcon } from "@sanity/icons/Case";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { FolderIcon } from "@sanity/icons/Folder";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { HeartIcon } from "@sanity/icons/Heart";
import { HomeIcon } from "@sanity/icons/Home";
import { PlayIcon } from "@sanity/icons/Play";
import { StarIcon } from "@sanity/icons/Star";
import { StarFilledIcon } from "@sanity/icons/StarFilled";
import { CommentIcon } from "@sanity/icons/Comment";
import { TagsIcon } from "@sanity/icons/Tags";
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
const SINGLETONS = [
  "homePage",
  "faqsPage",
  "thankYouPage",
  "firmDetails",
  "contactSection",
] as const;

/**
 * Collections given their own list item above. They must be excluded from the
 * generic fallback too, or the Studio shows each of them twice.
 */
const LISTED = [
  "featuredCaseResult",
  "caseResult",
  "attorney",
  "practiceArea",
  "videoReview",
  "review",
  "faq",
  "organization",
] as const;

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
            .items([
              singleton(S, "homePage", "Homepage", HomeIcon),
              singleton(S, "faqsPage", "FAQs", HelpCircleIcon),
              singleton(S, "thankYouPage", "Thank You", CheckmarkCircleIcon),
            ]),
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

              // Nested for the same reason Case Results is: two types that are
              // one thing to an editor. A video review and a written review sit
              // in the same carousel and are ordered together on the section.
              S.listItem()
                .title("Reviews")
                .icon(StarFilledIcon)
                .child(
                  S.list()
                    .title("Reviews")
                    .items([
                      S.documentTypeListItem("videoReview").title("Video Reviews").icon(PlayIcon),
                      S.documentTypeListItem("review").title("Reviews").icon(CommentIcon),
                    ]),
                ),

              // Flat: six documents, no sub-folder to open. Ordering in the
              // list is the Studio's, not ours — who appears where on a page is
              // the ordered reference array on that page's section, so there is
              // nothing here to sort.
              S.documentTypeListItem("attorney").title("Attorneys").icon(UsersIcon),

              // Flat too, at forty-seven documents: the row subtitle carries the
              // group and the path, which is enough to find one. Five per-group
              // sub-lists are a `/studio-polish` option if editors ask.
              S.documentTypeListItem("practiceArea").title("Practice Areas").icon(TagsIcon),

              // Flat at a hundred and eighty, which is the largest collection on
              // the site — the row subtitle carries the category, and the list's
              // own search is how anyone finds one. Eighteen per-category
              // sub-lists is the `/studio-polish` option if editors ask for it.
              S.documentTypeListItem("faq").title("FAQs").icon(HelpCircleIcon),

              // The charities and clubs the firm supports. Read by two
              // surfaces — the homepage band and /about/our-community/ — and
              // both sort alphabetically at render, so there is no order to
              // maintain here either.
              S.documentTypeListItem("organization")
                .title("Organizations")
                .icon(HeartIcon),
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
            .items([
              singleton(S, "firmDetails", "Firm Details", CogIcon),
              // Not a page field: the same band appears on several pages, which
              // is rule 9's bar for Site Settings.
              singleton(S, "contactSection", "Contact Form", EnvelopeIcon),
            ]),
        ),

      // Anything else: not a singleton, and not already listed above.
      ...S.documentTypeListItems().filter(
        (item) =>
          !SINGLETONS.includes(item.getId() as (typeof SINGLETONS)[number]) &&
          !LISTED.includes(item.getId() as (typeof LISTED)[number]),
      ),
    ]);
