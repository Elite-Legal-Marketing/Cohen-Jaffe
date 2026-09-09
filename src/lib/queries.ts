import { defineQuery } from "groq";

/**
 * `defineQuery` is what lets typegen infer a result type for each query — a
 * plain template string produces `any`. Queries live here so `npm run typegen`
 * finds them in one place.
 */
// `_key` is projected on every array: it is the render key, and the handle
// Visual Editing uses for click-to-edit. Note GROQ comments inside a
// `defineQuery` template stop typegen finding the query at all — keep them out
// here, where they still explain the query.
export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    hero{
      eyebrow,
      heading,
      headingAccent,
      body,
      buttons[]{ _key, label, href }
    },
    stats[]{ _key, figure, label, body },
    caseResults{
      heading,
      lead,
      link{ label, href },
      disclaimer,
      results[]->{
        _id,
        recovered,
        insurerOffered,
        category,
        county,
        clientName,
        quote,
        wistiaId,
        image{ ..., alt }
      }
    },
    about{
      eyebrow,
      heading,
      body,
      expectationsLabel,
      expectations[]{ _key, title, blurb, detail },
      quote{
        text,
        attorney->{ name, role, "slug": slug.current, portrait }
      },
      video{ eyebrow, title, wistiaId, coverAlt }
    },
    fees{
      heading,
      columns[]{ _key, label, body },
      quote{
        text,
        attorney->{ name, role, "slug": slug.current, portrait }
      },
      cta{ label, href },
      disclaimer
    },
    practiceAreas{
      eyebrow,
      heading,
      subheading,
      tabs[]{
        _key,
        headline,
        callout,
        links[]{ _key, label, href },
        area->{
          _id,
          name,
          "slug": slug.current,
          icon,
          linkLabel,
          image{ ..., alt }
        }
      },
      disclaimer,
      allHeading,
      allLink{ label, href },
      allAreas[]->{ _id, name, "slug": slug.current }
    },
    deadlines{
      eyebrow,
      heading,
      lead,
      cta{ label, href },
      deadlines[]{ _key, figure, unit, body }
    },
    reviews{
      eyebrow,
      heading,
      lead,
      cta{ label, href },
      reviews[]->{
        _id,
        _type,
        location,
        _type == "review" => { author, quote },
        _type == "videoReview" => { clientName, headline, wistiaId, poster{ ..., alt } }
      }
    },
    attorneys{
      eyebrow,
      heading,
      cta{ label, href },
      attorneys[]->{
        _id,
        name,
        role,
        "slug": slug.current,
        quote,
        wistiaId,
        portrait{ ..., alt }
      }
    },
    whyUs{
      eyebrow,
      heading,
      lead,
      reasons[]{ _key, title, body }
    },
    caseBanner{
      heading,
      cta{ label, href }
    },
    faqs{
      eyebrow,
      heading,
      lead,
      faqs[]->{ _id, question, "slug": slug.current, category, answer },
      closingHeading,
      closingLead,
      closingCta{ label, href }
    },
    community{
      eyebrow,
      heading,
      featureLabel,
      featureHeading,
      featureBody,
      featureLink{ label, href },
      cta{ label, href }
    }
  }
`);

/**
 * Site-wide firm identity and contact details — the Site Settings singleton.
 *
 * Fetched once in `Layout.astro` and passed to the nav and footer, rather than
 * fetched per component: three components on one page would otherwise be three
 * round trips for the same document at build time.
 */
export const FIRM_DETAILS_QUERY = defineQuery(`
  *[_id == "firmDetails"][0]{
    name,
    shortName,
    blurb,
    phone,
    sms,
    offices[]{
      _key,
      name,
      badge,
      street,
      cityStateZip,
      phone,
      hours,
      directions,
      map,
      href
    },
    advertisingLabel,
    legalDisclaimer
  }
`);

/**
 * Every FAQ, with its answer — the source for `/faqs/[slug].astro`'s
 * `getStaticPaths()`, which needs the whole body to render 180 static pages
 * from one fetch.
 *
 * Ordered by question so the build output is stable and a diff between two
 * builds means something.
 */
export const FAQS_QUERY = defineQuery(`
  *[_type == "faq"] | order(question asc){
    _id,
    question,
    "slug": slug.current,
    category,
    answer
  }
`);

/**
 * The same list WITHOUT the answers — for `/faqs/` , which is a list of links
 * rather than a page of articles.
 *
 * A separate query rather than a projection of the one above on purpose: the
 * answers are roughly 2.7 MB across the collection, and the hub renders none of
 * them. Fetching them to throw them away is the difference between a hub build
 * step that is instant and one that is not.
 */
export const FAQ_INDEX_QUERY = defineQuery(`
  *[_type == "faq"] | order(question asc){
    _id,
    question,
    "slug": slug.current,
    category
  }
`);

/**
 * The `/faqs/` hub's own chrome — hero, list head, claims band and quote.
 *
 * NOT the questions: those are `FAQ_INDEX_QUERY`, because the page renders every
 * one of them rather than a curated set. Two queries because they are two
 * different things, and the hub would otherwise fetch 180 documents to read four
 * strings off a singleton.
 */
export const FAQS_PAGE_QUERY = defineQuery(`
  *[_id == "faqsPage"][0]{
    eyebrow,
    heading,
    lead,
    listEyebrow,
    listHeading,
    stats[]{ _key, figure, label, body },
    quote{
      text,
      attorney->{ name, role }
    }
  }
`);

/**
 * The contact band, shared by every page that carries it.
 *
 * Fetched through `getContact()` in `src/lib/contact.ts`, which memoises it for
 * the build the way `getFirm()` does — the band appears on several pages and
 * each one would otherwise be another round trip for the same document.
 */
export const CONTACT_SECTION_QUERY = defineQuery(`
  *[_id == "contactSection"][0]{
    eyebrow,
    heading,
    lead,
    callLabel,
    textLabel,
    travelLabel,
    travelText,
    noteLabel,
    disclaimer,
    badge,
    formHeading,
    submitLabel,
    spanishLabel
  }
`);

/** The `/thank-you/` page. */
export const THANK_YOU_PAGE_QUERY = defineQuery(`
  *[_id == "thankYouPage"][0]{
    eyebrow,
    heading,
    lead,
    cta{ label, href },
    waitEyebrow,
    waitHeading,
    steps[]{ _key, title, body },
    readHeading,
    readLead,
    readPrimary{ label, href },
    readSecondary{ label, href }
  }
`);

/**
 * The charities and clubs the firm supports.
 *
 * Ordered here rather than at render, unlike the homepage band's first pass:
 * both surfaces want the same alphabetical order, so it is the query's job.
 *
 * ⚠️ `lower(name)`, NOT `name`. GROQ's `order()` is CASE-SENSITIVE, so every
 * capital sorts ahead of every lowercase letter: on a plain `order(name asc)`
 * "CMSA Long Island" lands between "Blue Knights" and "Center for
 * Developmental Disabilities", because it compares "M" against "e". It shows up
 * the moment one name is an acronym and looks like a random misfiling rather
 * than a sort rule. Both surfaces read this query, so fixing it here fixes it
 * in both places.
 *
 * `note` is projected even though the homepage band never prints it — one query
 * for two surfaces is worth more than the ~1 KB the band discards, and a second
 * near-identical query is a second thing to keep in step.
 */
export const ORGANIZATIONS_QUERY = defineQuery(`
  *[_type == "organization"] | order(lower(name) asc){
    _id,
    name,
    href,
    note
  }
`);

/**
 * `/about/our-community/` — the whole page.
 *
 * The ORGANIZATIONS are not here: they are a collection, fetched separately by
 * `ORGANIZATIONS_QUERY`, because the same twenty feed the homepage band too.
 *
 * `introQuote.attorney` is dereferenced for name, role and portrait — house
 * rule 8, and it replaces a hand-rolled query that fetched Richard Jaffe by id
 * because the hardcoded version had nowhere to put a reference. The live site
 * calls him "founding partner" in the very sentence quoted on this page while
 * the Studio has him as Managing Partner, so reading the role rather than
 * typing it is what stops the page contradicting his bio.
 */
export const COMMUNITY_PAGE_QUERY = defineQuery(`
  *[_id == "communityPage"][0]{
    eyebrow,
    heading,
    lead,
    introHeading,
    introBody,
    introQuote{
      text,
      attorney->{ name, role, portrait }
    },
    introQuoteBody,
    orgsEyebrow,
    orgsHeading,
    orgsLead,
    memorialEyebrow,
    memorialHeading,
    memorialBody,
    memorialQuote,
    memorialNote,
    memorialLink{ label, href }
  }
`);
