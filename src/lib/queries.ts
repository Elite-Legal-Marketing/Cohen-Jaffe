import { defineQuery } from "groq";

/**
 * `defineQuery` is what lets typegen infer a result type for each query — a
 * plain template string produces `any`. Queries live here so `npm run typegen`
 * finds them in one place.
 */
export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    hero{
      eyebrow,
      heading,
      headingAccent,
      body,
      primaryCta{ label, href },
      secondaryCta{ label, href },
      image{ ..., alt },
      imageNarrow{ ..., alt }
    }
  }
`);
