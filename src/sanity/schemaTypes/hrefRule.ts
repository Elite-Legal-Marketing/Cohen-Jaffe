/**
 * The site's URL rule, shared by every link type.
 *
 * One function rather than a copy per type: the trailing-slash rule is a
 * site-wide invariant (AGENTS.md → "URLs: trailing slash" — all 2262 indexed
 * `og:url` values end in `/`, and the live site 301s the unslashed form), so
 * two link types must not be able to drift on it.
 */
export function validateHref(value: unknown): true | string {
  if (typeof value !== "string") return true;
  if (/^(https?:\/\/|tel:|sms:|mailto:|#)/.test(value)) return true;
  if (!value.startsWith("/"))
    return "Use an internal path like /contact/, or a full https:// or tel: URL";
  if (!value.endsWith("/")) return "Internal links must end with a trailing slash";
  return true;
}
