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
    }
  }
`);
