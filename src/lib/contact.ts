import { sanityClient } from "sanity:client";
import { CONTACT_SECTION_QUERY } from "./queries";
import type { CONTACT_SECTION_QUERY_RESULT } from "../sanity/sanity.types";

export type Contact = CONTACT_SECTION_QUERY_RESULT;

let cached: Promise<Contact> | null = null;

/**
 * The Contact Form singleton, fetched once per build.
 *
 * The same reasoning as `getFirm()`: the band appears on several pages, and
 * without this each one would be another round trip for the same document. The
 * PROMISE is cached rather than the result, so pages rendering concurrently
 * share one request instead of racing to start several.
 */
export function getContact(): Promise<Contact> {
  cached ??= sanityClient.fetch<Contact>(CONTACT_SECTION_QUERY);
  return cached;
}
