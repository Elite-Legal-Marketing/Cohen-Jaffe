/**
 * A practice area's `slug` holds its LIVE path without the surrounding slashes —
 * `long-island-car-accident-lawyer`, or `birth-injury/cerebral-palsy` — because
 * the WordPress site put these pages at the root, not under `/practice-areas/`,
 * and those are the indexed URLs. This is the one place the slash-terminated
 * canonical form is assembled from it.
 *
 * Deliberately NOT in `urls.ts`: that file is comparison-only and its header
 * forbids feeding its output into an `href`. Mixing the two forms in one module
 * is exactly the mistake it warns about.
 */
export const practiceAreaHref = (slug: string): string => `/${slug}/`;
