/**
 * The case result taxonomy, shared by `caseResult` and `featuredCaseResult`.
 *
 * A predefined list rather than a `caseResultCategory` document type, on
 * purpose. The Case Results page filters by this, and a free-text or
 * editor-created taxonomy drifts immediately — "Car Accident" and "Auto
 * Accident" and "Motor Vehicle Accident" would all appear and split one filter
 * into three. There are ten of these and they change roughly never.
 *
 * ⚠️ THE LIVE SITE HAS NO CATEGORIES. All 60 published results carry a recovery
 * figure, a case type in their page title, and a narrative — nothing
 * structured. This list was derived from those 60 titles, and the migration
 * assigns each result exactly one. The distribution as migrated:
 *
 *   25  Auto Accident            5  Slip & Fall              1  Construction Accident
 *    8  Pedestrian Accident      4  Truck Accident           1  Medical Malpractice
 *    6  Traumatic Brain Injury   3  Personal Injury
 *    5  Motorcycle Accident      2  Premises Liability
 *
 * "Auto Accident" is the artboard's own label for the homepage card, so it wins
 * over "Car Accident" even though the nav says the latter. Keep the two in mind
 * when practice areas become their own document type — these categories are
 * effectively a subset of them, and should become references at that point
 * rather than a second, parallel taxonomy.
 */
export const CASE_RESULT_CATEGORIES = [
  "Auto Accident",
  "Motorcycle Accident",
  "Truck Accident",
  "Pedestrian Accident",
  "Slip & Fall",
  "Premises Liability",
  "Construction Accident",
  "Medical Malpractice",
  "Traumatic Brain Injury",
  "Personal Injury",
] as const;
