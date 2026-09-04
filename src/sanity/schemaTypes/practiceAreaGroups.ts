/**
 * The five groups a practice area sits under — the headings of the live
 * `/practice-areas/` hub, in the hub's own order.
 *
 * A constant rather than a `practiceAreaGroup` document type, for the same
 * reason `caseResultCategories.ts` is one: five values that change roughly
 * never, that a page sorts and headlines by. A document type would invite
 * drift ("Personal Injury" / "Personal injury"), cost a dereference in every
 * query just to group, and add a desk entry nobody edits. Promote it only if
 * editors need to add a group or reword a note — mechanical then.
 *
 * `note` is the one line under each group heading on the listing page
 * (`CJ - Practice Areas.dc.html`). The malpractice note is the artboard's
 * "reviewed with a physician expert before filing", reworded: the live page
 * says cases are investigated by independent medical experts and that the firm
 * consults them, not that a physician signs off before every filing.
 *
 * No `sanity` import here on purpose — Astro components import this too.
 */
export const PRACTICE_AREA_GROUPS = [
  {
    value: "personal-injury",
    title: "Personal Injury",
    note: "Crashes, falls, and unsafe premises across Nassau, Suffolk, and Queens.",
  },
  {
    value: "medical-malpractice",
    title: "Medical Malpractice",
    note: "Cases investigated with independent medical experts.",
  },
  {
    value: "defective-medical-devices",
    title: "Defective Medical Devices",
    note: "When the device that was meant to help you caused the harm.",
  },
  {
    value: "employment-law",
    title: "Employment Law",
    note: "When something at work crossed a legal line.",
  },
  {
    value: "mass-torts",
    title: "Mass Torts",
    note: "Nationwide litigation against drug and product manufacturers.",
  },
] as const;

export type PracticeAreaGroup = (typeof PRACTICE_AREA_GROUPS)[number]["value"];

/** The heading for a group value — for previews and the listing page. */
export const practiceAreaGroupTitle = (value: string | null | undefined) =>
  PRACTICE_AREA_GROUPS.find((group) => group.value === value)?.title;
