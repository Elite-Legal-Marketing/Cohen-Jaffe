/**
 * The FAQ taxonomy — the eighteen terms the live site files its FAQs under,
 * with the live site's own slugs and its own wording.
 *
 * A constant rather than a `faqCategory` document type, for the same reason
 * `caseResultCategories.ts` and `practiceAreaGroups.ts` are constants: eighteen
 * values that change roughly never, that one page filters by. A document type
 * would invite drift ("Slip and Fall Injury" / "Slip & Fall"), cost a
 * dereference in every query just to group, and add a desk entry nobody edits.
 *
 * ⚠️ AND IT CANNOT BE A REFERENCE TO `practiceArea`, which is the other obvious
 * proposal. Checked against all forty-seven areas: nine match exactly (Bicycle,
 * Car, Construction, Medical Malpractice, Motorcycle, Nursing Home Abuse,
 * Pedestrian, Premises Liability, Truck, Wrongful Death), three exist under a
 * different name (Birth Injury / "Birth Injuries", Brain Injuries / "Traumatic
 * Brain Injury", Slip and Fall Injury / "Slip & Fall"), and FIVE HAVE NO
 * PRACTICE AREA AT ALL — Cruise Ship Accidents, Elevator Accidents, Neck
 * Injuries, Personal Injury and Employment Law. The last two are practice-area
 * GROUPS and can never be areas. Making the reference fit means inventing five
 * `practiceArea` documents, which would then appear on `/practice-areas/`, in
 * the footer and in the nav — polluting the collection that drives three
 * surfaces in order to model a filter on one page.
 *
 * `value` is the WordPress term slug, so the migration's mapping is mechanical
 * and the hub's filter element ids are stable.
 *
 * ⚠️ `scripts/faq-extract.ts` ASSERTS that the live site still has exactly
 * eighteen populated terms and fails the run if it does not. If a category is
 * added or emptied upstream, that assertion is what tells you, and this file is
 * what has to change with it.
 *
 * No `sanity` import on purpose — the hub's pill row imports this too, the same
 * way `practiceAreaGroups.ts` is imported by an Astro component.
 */
export const FAQ_CATEGORIES = [
  { value: "bicycle-accidents", title: "Bicycle Accidents" },
  { value: "birth-injury", title: "Birth Injury" },
  { value: "brain-injuries", title: "Brain Injuries" },
  { value: "car-accidents", title: "Car Accidents" },
  { value: "construction-accidents", title: "Construction Accidents" },
  { value: "cruise-ship-accidents", title: "Cruise Ship Accidents" },
  { value: "elevator-accidents", title: "Elevator Accidents" },
  { value: "employment-law", title: "Employment Law" },
  { value: "medical-malpractice", title: "Medical Malpractice" },
  { value: "motorcycle-accidents", title: "Motorcycle Accidents" },
  { value: "neck-injuries", title: "Neck Injuries" },
  { value: "nursing-home-abuse", title: "Nursing Home Abuse" },
  { value: "pedestrian-accidents", title: "Pedestrian Accidents" },
  { value: "personal-injury", title: "Personal Injury" },
  { value: "premises-liability", title: "Premises Liability" },
  { value: "slip-and-fall-injury", title: "Slip and Fall Injury" },
  { value: "truck-accidents", title: "Truck Accidents" },
  { value: "wrongful-death", title: "Wrongful Death" },
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number]["value"];

/** The heading for a category value — for previews, kickers and the hub's pills. */
export const faqCategoryTitle = (value: string | null | undefined) =>
  FAQ_CATEGORIES.find((category) => category.value === value)?.title;
