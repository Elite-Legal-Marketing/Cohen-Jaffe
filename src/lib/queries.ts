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
 * The attorneys the homepage band draws, by slug.

 *
 * ⚠️ TEMPORARY, and it goes away with `src/data/homeAttorneys.ts`. The band's
 * copy and running order are still hardcoded pending sign-off, so the six
 * documents are fetched on their own rather than through an `attorneys[]->`
 * projection on `homePage` that does not exist yet. When the section is
 * modelled this query is deleted and that projection replaces it — the
 * component's prop shape is already the shape it will produce.
 *
 * `_type` is not projected — unlike the reviews band, every card here is one
 * type — but `_id` is, because it is the handle Visual Editing needs and the
 * `attorneys[]->` projection that replaces this will carry it anyway.
 */
export const HOME_ATTORNEYS_QUERY = defineQuery(`
  *[_type == "attorney" && slug.current in $slugs]{
    _id,
    name,
    role,
    "slug": slug.current,
    quote,
    wistiaId,
    portrait{ ..., alt }
  }
`);
