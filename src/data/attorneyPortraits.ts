import type { ImageMetadata } from "astro";

import attyCohen from "../assets/atty-cohen.png";
import attyJaffe from "../assets/atty-jaffe.png";
import attyTiger from "../assets/atty-tiger.png";
import attyMcnaughton from "../assets/atty-mcnaughton.png";
import attySawicki from "../assets/atty-sawicki.png";
import attyParnell from "../assets/atty-parnell.png";

/**
 * TEMPORARY — it goes when the homepage sections are modelled in Sanity.
 *
 * A portrait belongs to the ATTORNEY, not to the section quoting them, and
 * every one of these six files is already uploaded to Sanity as that document's
 * `portrait` (`scripts/seed-attorneys.ts` seeded them from exactly these
 * bytes). Wiring a section up replaces a lookup here with
 * `urlFor(quote.attorney.portrait)` off the dereferenced reference.
 *
 * Until those sections have an `about`/`fees` field there is no reference to
 * dereference, and adding a query for one attorney would be dead code the
 * moment it lands — so the repo copies stand in. Shared between the sections
 * that quote someone, so the stand-in exists once rather than per component.
 */
export const ATTORNEY_PORTRAITS: Record<string, ImageMetadata> = {
  "stephen-cohen": attyCohen,
  "richard-jaffe": attyJaffe,
  "stephen-tiger": attyTiger,
  "caitlin-mcnaughton": attyMcnaughton,
  "katherine-sawicki": attySawicki,
  "garrett-parnell": attyParnell,
};
