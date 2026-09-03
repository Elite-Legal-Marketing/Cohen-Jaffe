import { sanityClient } from "sanity:client";

import { FIRM_DETAILS_QUERY } from "./queries";
import type { FIRM_DETAILS_QUERY_RESULT } from "../sanity/sanity.types";

export type Firm = FIRM_DETAILS_QUERY_RESULT;

let cached: Promise<Firm> | null = null;

/**
 * The Firm Details singleton, fetched once per build.
 *
 * Site-wide details are wanted in two places at once — the shell draws the
 * phone number in the header, the drawer and the footer, and the fee explainer
 * draws it again in the page body. Without this every page would fetch the same
 * document twice, and every new consumer would add another round trip.
 *
 * The PROMISE is cached, not the result, so concurrent callers on the same
 * build share one request rather than racing to start several. The module lives
 * for the length of the build, which is exactly the lifetime wanted: a static
 * build has no stale-cache problem because it ends before the content can
 * change, and `npm run dev` re-evaluates on edit.
 */
export function getFirm(): Promise<Firm> {
  cached ??= sanityClient.fetch<Firm>(FIRM_DETAILS_QUERY);
  return cached;
}
