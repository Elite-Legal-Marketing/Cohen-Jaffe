/**
 * URL comparison helpers.
 *
 * ⚠️ These normalise for COMPARISON ONLY. Never feed their output back into an
 * `href`, a canonical tag, or a sitemap entry. The site's canonical form is
 * slash-terminated (see AGENTS.md → "URLs: trailing slash"); this strips that
 * slash purely so `/about` and `/about/` compare equal. Collapsing the two
 * concepts into one helper is how a sibling site silently lost `aria-current`
 * on every nav item, with no error anywhere.
 */

/** Strip the trailing slash for comparison. Root stays "/". */
const forComparison = (path: string): string => {
  const [withoutHash] = path.split("#");
  const [clean] = withoutHash.split("?");
  return clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
};

/** True when `current` is exactly `href`. */
export function isCurrent(current: string, href: string): boolean {
  return forComparison(current) === forComparison(href);
}

/**
 * True when `current` is `href` or sits beneath it — used to light up a
 * top-level nav item while the visitor is anywhere in that section.
 *
 * The root is deliberately exact-match only: every path begins with "/", so a
 * prefix test would mark Home active on every page of the site.
 */
export function isWithin(current: string, href: string): boolean {
  const a = forComparison(current);
  const b = forComparison(href);
  if (b === "/") return a === "/";
  return a === b || a.startsWith(`${b}/`);
}
