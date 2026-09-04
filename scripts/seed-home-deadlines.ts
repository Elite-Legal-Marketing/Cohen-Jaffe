/**
 * Seed the homepage's "New York deadlines" band.
 *
 *   npx sanity exec scripts/seed-home-deadlines.ts --with-user-token
 *
 * Writes ONE field — `deadlines` — on the `homePage` singleton, with
 * `createIfNotExists` then `patch().set()`. Never `createOrReplace`: that would
 * take the hero, stats, case results, "Our goals", the fee band and the
 * practice areas down with it.
 *
 * Re-running is guarded. `.set()` replaces the whole section, so once an editor
 * has tuned this copy in the Studio a second run would silently discard their
 * work. If the section already exists the script reports and stops;
 * `SEED_OVERWRITE=1` forces it.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * Moved here from `src/data/homeDeadlines.ts`, which this replaces.
 *
 * EVERY WORD OF THIS SECTION IS A STATEMENT OF NEW YORK LAW. Every other band
 * on the homepage can be wrong in a way that is merely embarrassing; this one
 * tells an injured person how long they have, and a reader who believes a
 * number here and acts on it loses their claim. So each figure was checked
 * against the statute or regulation that sets it rather than taken from the
 * artboard (`Cohen & Jaffe Homepage v1.dc.html`, markup 403-437).
 *
 * The three figures are right as drawn:
 *
 *   - 30 DAYS — 11 NYCRR § 65-1.1 (Regulation 68): written notice of claim to
 *     the no-fault insurer "as soon as reasonably practicable but no later than
 *     30 days after the date of the accident." This is the one most people get
 *     wrong, because it was 90 days until the 2002 revision.
 *   - 3 YEARS — CPLR § 214(5), personal injury.
 *   - 90 DAYS — General Municipal Law § 50-e(1)(a): a notice of claim within 90
 *     days after the claim arises, as a condition precedent to suing a public
 *     corporation (city, county, town, village, school district). Transit
 *     authorities are reached by their own enabling acts rather than by § 50-e
 *     itself — e.g. Public Authorities Law § 1212 for the New York City Transit
 *     Authority — which is why the card names them separately. Note the statute
 *     runs the 90 days from when the CLAIM ARISES, and in a wrongful death case
 *     from the appointment of the estate's representative instead.
 *
 * Every figure above was re-verified against the primary source on 2026-09-04
 * — nysenate.gov for the statutes, dfs.ny.gov for Regulation 68.
 *
 * THREE lines were CORRECTED:
 *
 *   - THE LEAD contradicted its own first card. The artboard reads "— and the
 *     shortest deadline applies when a bus, a town, or a school district was
 *     involved." Thirty days for the no-fault notice is shorter than the
 *     90-day municipal notice, and it applies to every crash rather than only a
 *     municipal one. The superlative was the only thing wrong, so it was the
 *     only thing replaced: "the window shortens sharply". The point it was
 *     reaching for is true and now survives the card sitting next to it — a
 *     municipal claim collapses from three years to 90 days' notice and then to
 *     one year and ninety days to sue, GML § 50-i.
 *   - "LESS FOR MALPRACTICE AND WRONGFUL DEATH" → "medical malpractice".
 *     Unqualified, that is wrong in the client's favour and so worth fixing:
 *     LEGAL malpractice is three years under CPLR § 214(6), the same as any
 *     other injury claim. It is MEDICAL malpractice that is shorter — two years
 *     and six months, CPLR § 214-a. Wrongful death is two years from the date
 *     of death, EPTL § 5-4.1.
 *   - "TO FILE YOUR NO-FAULT APPLICATION" → "to give your insurer written
 *     notice of a no-fault claim". The artboard hangs the 30 days on the wrong
 *     document, and this is the card where that costs the most. § 65-1.1 puts
 *     the 30 days on WRITTEN NOTICE; the NF-2 "Application for Motor Vehicle
 *     No-Fault Benefits" is a different filing, which the insurer must mail out
 *     within five business days of receiving that notice (11 NYCRR § 65-3.4(b))
 *     and which the claimant returns on its own clock. Department of Financial
 *     Services OGC Opinion 08-06-01 is explicit that a LATE NF-2 does not
 *     defeat a claim where timely written notice was given by some other means
 *     — an MV-104 police report will do it. So the original misleads both ways:
 *     someone waiting for an application form to arrive can blow the notice
 *     deadline, and someone whose form arrives late can believe they have lost
 *     a claim they still have. The corrected line names the filing that the 30
 *     days actually governs.
 *
 * "A bus" is left as drawn. A charter bus is not a public corporation, so the
 * word is loose — but in a list with "a town" and "a school district" it plainly
 * means a public one, and this is approved copy.
 *
 * ⚠️ THE HEADING IS A GENERALISATION. "The clock started the day of your
 * accident" is true of the ordinary negligence case and not of every case:
 * wrongful death runs from the date of DEATH (EPTL 5-4.1), medical malpractice
 * from the act or omission or the end of continuous treatment (CPLR 214-a), and
 * some toxic-exposure claims from discovery (CPLR 214-c). It is approved
 * artboard copy and the practice-areas disclaimer covers it — but it is a
 * headline, not a rule, and nobody should later "tighten" the figures to agree
 * with it.
 *
 * ⚠️ THE SECTION CARRIES NO DISCLAIMER, and that is deliberate. The
 * practice-areas band directly above it already closes with "Information on
 * this page is general and is not legal advice about your case. New York
 * deadlines and rules vary by claim type" — this section's disclaimer, sitting
 * one band away and naming deadlines specifically. A second would be the same
 * sentence twice in a screen. If the two bands are ever reordered, that line
 * has to move with this one.
 *
 * THE BUTTON goes to `/contact/`. The label promises a check and there is no
 * checker; the only honest way to check a deadline is to have a lawyer look at
 * the facts. `/contact/` rather than `/free-consultation/` so that every gold
 * CTA on this page lands in the same place.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const SECTION = {
  _type: "deadlinesSection",
  eyebrow: "Time-sensitive",
  heading: "The clock started the day of your accident.",
  lead:
    "New York gives you less time than most people assume — and the window shortens sharply when a bus, a town, or a school district was involved.",
  cta: {
    _type: "ctaLink",
    label: "Check my deadline",
    href: "/contact/",
  },
  deadlines: [
    {
      _type: "deadlineFigure",
      _key: "deadline-no-fault",
      figure: "30",
      unit: "Days",
      body: "To give your insurer written notice of a no-fault claim.",
    },
    {
      _type: "deadlineFigure",
      _key: "deadline-injury",
      figure: "3",
      unit: "Years",
      body: "To file most injury claims. Less for medical malpractice and wrongful death.",
    },
    {
      _type: "deadlineFigure",
      _key: "deadline-municipal",
      figure: "90",
      unit: "Days",
      body: "To notify a town, county, school district, or transit authority.",
    },
  ],
};

async function main() {
  const existing = await client.fetch<boolean>(
    `defined(*[_id == "homePage"][0].deadlines)`,
  );
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "homePage.deadlines already exists — refusing to overwrite editor changes.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }

  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client.patch("homePage").set({ deadlines: SECTION }).commit();

  console.log(`Done — deadlines set: ${SECTION.deadlines.length} figures.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
