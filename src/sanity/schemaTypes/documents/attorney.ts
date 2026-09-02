import { defineArrayMember, defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";

/**
 * One of the firm's attorneys.
 *
 * ONE type, not a featured/full split. Case results needed two types because a
 * featured card is different *content* from a ledger entry — a client
 * interview, a portrait, a quote, an insurer's offer, none of which the ledger
 * has. An attorney is the same person everywhere: the homepage band, the
 * `/about/attorneys/` listing and the bio page draw different FIELDS from one
 * document, never different documents. Sections pick who to show with an
 * ordered array of references, the way `caseResultsSection` does — so the
 * homepage's three are a choice made on the homepage, not a flag set here.
 *
 * The field list is the union of what the three approved artboards read:
 * `Cohen & Jaffe Homepage v1.dc.html` (the OUR ATTORNEYS band),
 * `CJ - Attorneys.dc.html` (partner and associate cards) and
 * `CJ - Attorney Bio.dc.html` (the bio page, which reads nearly all of it).
 *
 * ⚠️ ONLY SIX FIELDS ARE REQUIRED — name, slug, role, portrait, summary,
 * biography. That is a deliberate reaction to `featuredCaseResult`, where
 * making every field required means the 60 real results cannot be migrated
 * without inventing four fields each. Here the credentials blocks are genuinely
 * absent from the live site for most of the six attorneys, so a required
 * `barAdmissions` would make four of them unpublishable. An empty credentials
 * card renders as nothing; a wrong one is worse than none.
 *
 * Three blocks the bio artboard draws are deliberately NOT modelled here:
 *
 *   - **The video card** (thumbnail, "Watch · 2:14", title). A `video` document
 *     type is already planned for the 81 Wistia uploads; per-attorney video
 *     becomes a reference to that, and loose `wistiaId`/`duration` strings here
 *     would only have to be unpicked. No attorney video exists yet either.
 *   - **The practice-areas sidebar.** Becomes `reference` to `practiceArea`
 *     when that type lands. An array of strings now is the same parallel
 *     taxonomy problem the case-result categories already have.
 *   - **The award badge row.** Firm-level imagery the homepage's Recognition
 *     section needs too — model it once, there, not six times here.
 */
export const attorney = defineType({
  name: "attorney",
  title: "Attorney",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "biography", title: "Biography" },
    { name: "credentials", title: "Credentials" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: 'As it should read everywhere on the site — "Richard S. Jaffe".',
      type: "string",
      group: "profile",
      validation: (rule) =>
        rule
          .required()
          .max(40)
          .warning("Set at 42-64px on the bio page and the listing card — a longer name wraps."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "The last segment of the bio page's URL: /about/attorneys/<slug>/. These six are already indexed — changing one is a redirect to write, not a free edit.",
      type: "slug",
      group: "profile",
      options: { source: "name", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      description:
        'The uppercase gold line under the name, in full — "Partner · Personal Injury Attorney". One field, because every artboard renders this as a single line.',
      type: "string",
      group: "profile",
      validation: (rule) =>
        rule
          .required()
          .max(48)
          .warning("Uppercase and tracked at 0.16em — beyond ~48 characters it wraps to two lines."),
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      description:
        "One photograph serves every crop — 1:1 on the homepage, 4:5 on an associate card, 3:4 on the bio hero, and a 62px circle beside the pull quote. Set the hotspot on the face or the circle crops a shoulder.",
      type: "image",
      options: { hotspot: true },
      group: "profile",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          description:
            "Leave empty if the attorney's name is already beside the photograph in text, which it is on every card.",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "summary",
      title: "Card blurb",
      description:
        "One or two sentences under the script-font signature, on the homepage band and the listing cards. Not shown on the bio page — the biography takes over there.",
      type: "text",
      rows: 3,
      group: "profile",
      validation: (rule) =>
        rule
          .required()
          .max(220)
          .warning("Sits in a third-width column at 16/28 — beyond ~220 characters it unbalances a row of three."),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      description:
        "In the attorney's own words, without quotation marks — the cards and the bio hero add them. Leave empty if the attorney has never been quoted; a card without one is fine, an invented one is not.",
      type: "text",
      rows: 3,
      group: "profile",
      validation: (rule) =>
        rule
          .max(240)
          .warning("Set italic at 21-24px on the cards — beyond ~240 characters it dominates the card."),
    }),

    defineField({
      name: "headline",
      title: "Bio headline",
      description:
        'The large line that opens the biography — "A fierce trial attorney and litigator." A phrase from the attorney\'s own bio, not a slogan.',
      type: "string",
      group: "biography",
      validation: (rule) =>
        rule.max(70).warning("Set at 46px over two lines at most — beyond ~70 characters it takes three."),
    }),
    defineField({
      name: "biography",
      title: "Biography",
      description: "The full profile. Several paragraphs, so Portable Text rather than a text box.",
      type: "richText",
      group: "biography",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pullQuote",
      title: "Pull quote",
      description:
        "The line lifted out of the biography into the bordered card, above the portrait and name. A sentence from the biography itself, not a new claim. Leave empty and no card renders.",
      type: "text",
      rows: 2,
      group: "biography",
      validation: (rule) =>
        rule.max(160).warning("Set italic at 30px — beyond ~160 characters the card grows past its neighbours."),
    }),

    defineField({
      name: "barAdmissions",
      title: "Bar admissions",
      description:
        'One per line — "New York", "United States District Court, Eastern District of New York". Leave the whole list empty rather than guessing; the card simply does not render.',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "credentials",
    }),
    defineField({
      name: "education",
      title: "Education",
      description: 'One per line, school first — "St. John\'s University School of Law — J.D., 1974".',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "credentials",
    }),
    defineField({
      name: "languages",
      title: "Languages",
      description: 'One per line — "Spanish (fluent)". Shares a card with Education.',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "credentials",
    }),
    defineField({
      name: "honors",
      title: "Honors and awards",
      description:
        'One per line — "Million Dollar Advocates Forum". Directory listings are not honors; only what the attorney has actually been named to.',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "credentials",
    }),
    defineField({
      name: "affiliations",
      title: "Affiliations",
      description:
        'One per line, with the position if there is one — "The Center for Developmental Disabilities — board member".',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "credentials",
    }),
    defineField({
      name: "representativeCases",
      title: "Representative cases",
      description:
        "Results this attorney's own bio publishes. Leave empty and the block does not render.",
      type: "array",
      of: [defineArrayMember({ type: "representativeCase" })],
      group: "credentials",
    }),

    defineField({
      name: "location",
      title: "Location",
      description: 'The offices this attorney works out of — "New Hyde Park & Queens".',
      type: "string",
      group: "contact",
      validation: (rule) => rule.max(40).warning("One of four columns in a narrow dark band."),
    }),
    defineField({
      name: "phone",
      title: "Phone (toll free)",
      description:
        'The attorney\'s own toll-free number as it should read — "866-878-6774". Not the firm\'s main line, which the header already carries.',
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "fax",
      title: "Fax",
      type: "string",
      group: "contact",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "portrait" },
  },
});
