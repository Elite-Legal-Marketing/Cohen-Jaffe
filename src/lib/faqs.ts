/**
 * An FAQ's page URL.
 *
 * ⚠️ THESE ARE INDEXED URLS FROM THE WORDPRESS SITE, not paths we chose. All
 * 127 migrated FAQ pages live at `/faqs/<slug>/` on the live site and the new
 * site serves the same path, which is the whole reason `faq.slug` is a stored
 * field. Changing this function changes 127 already-ranking URLs.
 *
 * The 60 documents split out of the seven round-up pages are the exception:
 * their slugs are derived from their questions and are NEW paths, because the
 * question they answer had no page of its own before. The seven round-up URLs
 * they replace are redirected in `vercel.json`.
 *
 * Deliberately NOT in `urls.ts`: that module is comparison-only and its header
 * forbids feeding its output into an `href`. Same split as `practiceAreas.ts`.
 */
export const faqHref = (slug: string): string => `/faqs/${slug}/`;
