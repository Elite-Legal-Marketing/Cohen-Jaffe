/**
 * The brand icon set a practice area can pick from.
 *
 * The icons themselves live in the repo at `src/assets/icons/practice-areas/`
 * and are inlined by `PracticeAreaIcon.astro`; a document stores only the KEY.
 * That is the "Our goals" decision applied again: a fixed brand set is a
 * library to choose from, not artwork to upload, so it stays out of Sanity's
 * image fields where an editor could swap one for a JPEG.
 *
 * This list is the single source of truth for both the Studio's dropdown and
 * the component's key→SVG map — the map is typed `Record<PracticeAreaIcon, …>`,
 * so adding a key here without an SVG fails `npm run build`, not the page.
 *
 * Ten keys for forty-odd areas is deliberate: these are the ones the vendor
 * set covers. An area without an icon renders without one.
 *
 * No `sanity` import here on purpose — Astro components import this too.
 */
export const PRACTICE_AREA_ICONS = [
  { value: "car", title: "Car" },
  { value: "truck", title: "Truck" },
  { value: "motorcycle", title: "Motorcycle" },
  { value: "slip", title: "Slip and fall" },
  { value: "malpractice", title: "Medical malpractice" },
  { value: "construction", title: "Construction" },
  { value: "nursing", title: "Nursing home" },
  { value: "dog", title: "Dog bite" },
  { value: "premises", title: "Premises" },
  { value: "wrongfuldeath", title: "Wrongful death" },
] as const;

export type PracticeAreaIcon = (typeof PRACTICE_AREA_ICONS)[number]["value"];
