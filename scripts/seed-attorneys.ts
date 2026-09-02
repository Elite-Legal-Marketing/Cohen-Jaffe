/**
 * Seeds the firm's six attorneys.
 *
 *   npx sanity exec scripts/seed-attorneys.ts --with-user-token
 *
 * Idempotent. Fixed ids and `createOrReplace`, and each portrait is uploaded
 * only when the document does not already carry one — otherwise every run would
 * orphan six assets. (Sanity dedupes by content hash, so a re-upload of the same
 * file is harmless anyway; the check is about not churning the media library.)
 *
 * ⚠️ DOCUMENT IDS MUST NOT CONTAIN A DOT. A dotted `_id` is non-public: readable
 * with a token, invisible without one. See `seed-case-results.ts` for the full
 * write-up of how nasty that failure looks.
 *
 * ── WHERE THIS CONTENT COMES FROM ───────────────────────────────────────────
 *
 * Every word here is the firm's own published copy, from the six bio pages in
 * the WordPress mirror at `~/Downloads/Cohen & Jaffe/Sitesucker/about/attorneys/`.
 * Biographies are that copy lightly sub-edited the way the approved artboard
 * sub-edits Richard Jaffe's; headlines, blurbs and pull quotes are phrases
 * lifted from the same pages.
 *
 * Nothing here is invented, and that is deliberate — the four featured case
 * results ARE invented, and the whole point of that warning in `HANDOFF.md` is
 * not to do it twice. Concretely, three things the artboards show are NOT
 * seeded because the firm has never published them:
 *
 *   - **Quotes for McNaughton, Sawicki and Parnell.** None of the three is
 *     quoted anywhere on the live site. `quote` is left empty rather than
 *     written for them; the homepage artboard's quotes for the three partners
 *     are likewise ignored in favour of the real ones those three have given.
 *   - **"Managing Partner" / "Founding Partner" / "Lead Trial Lawyer".** The
 *     live site titles Cohen, Jaffe and Tiger identically: "Partner". The
 *     artboards' finer-grained titles are plausible — Cohen did found the
 *     practice — but they are a claim about a real person's position at a real
 *     firm, so they need the firm to confirm them, not us.
 *   - **Most credential lists.** Bar admissions beyond New York, honors, and
 *     any education the bio does not name are simply absent from the source.
 *     Empty is correct; the cards do not render.
 *
 * One knowing edit: Tiger's notable-case list on the live site reads
 * "2.75 for an injured construction worker" — a missing "$" and "million" that
 * every other line in the same list has. Written here as "$2.75 million".
 */
import { getCliClient } from "sanity/cli";
import { createReadStream } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const client = getCliClient();
const assetsDir = resolve(dirname(fileURLToPath(import.meta.url)), "../src/assets");

interface Seed {
  slug: string;
  file: string;
  name: string;
  role: string;
  summary: string;
  quote?: string;
  headline: string;
  biography: string[];
  pullQuote?: string;
  barAdmissions?: string[];
  education?: string[];
  languages?: string[];
  honors?: string[];
  affiliations?: string[];
  representativeCases?: string[];
  phone: string;
}

/** Every attorney works out of both offices, per all six live bio pages. */
const LOCATION = "New Hyde Park & Queens";
/** Likewise one fax number for the firm. */
const FAX = "516-358-6903";

const SEEDS: Seed[] = [
  {
    slug: "stephen-cohen",
    file: "atty-cohen.png",
    name: "Stephen M. Cohen",
    role: "Partner · Personal Injury Attorney",
    summary:
      "He started out on his own in a third-floor Bedford-Stuyvesant walkup and has represented injured working people ever since.",
    quote:
      "I take great pride that the firm is really people-related. I want the firm to convey the idea that when they come in to see us, we're no better than they are.",
    headline: "A solo practice in a Brooklyn walkup, grown into a six-attorney firm.",
    biography: [
      "Stephen Cohen grew up in working-class Queens, where he learned the importance of hard work from his family and neighbors. He also learned that bad things can happen to good people — and that when they do, they often need a helping hand. “I had an understanding that everyday people had accidents through no fault of their own,” he recalls. “I think that's what pushed me into becoming a lawyer.” He has carried that commitment to helping everyday working people throughout his legal career.",
      "After receiving his B.S. at Bradley University in 1971, he enrolled at St. John's University School of Law and earned his J.D. there in 1974. He joined a small law firm for a time before venturing out to create his own solo practice, located in a third-floor walkup in the Bedford-Stuyvesant neighborhood of Brooklyn.",
      "Initially, Cohen handled a wide variety of cases. But early on he realized that personal injury law was his passion and began to focus his practice in that area. In the ensuing years, that concentration has never wavered.",
      "For a time he moved his practice to lower Manhattan, but after he started a family and moved to Long Island he decided to set up shop closer to home. He opened an office in Great Neck and then moved to the firm's current location in New Hyde Park. Over the years, his solo practice grew into a multi-lawyer firm that now has six attorneys and a support staff of more than twenty.",
      "Cohen believes the key to the firm's success and growth has been its focus on providing the best possible service. “I take great pride that the firm is really people-related,” he says. “I want the firm to convey the idea that when they come in to see us, we're no better than they are — that this is just what we do and that we respect what they do.”",
      "He has represented thousands of injured parties in automobile accidents, trip and fall cases, construction accidents, and the like. He also divested the practice into No-Fault collection in both the arbitration and judicial forums, representing health care providers against insurance carriers for the collection of bills relating to the treatment of individuals injured in automobile accidents.",
    ],
    pullQuote:
      "His solo practice in a third-floor Bedford-Stuyvesant walkup grew into a firm of six attorneys and more than twenty staff.",
    barAdmissions: ["New York"],
    education: [
      "Bradley University — B.S., 1971",
      "St. John's University School of Law — J.D., 1974",
    ],
    phone: "866-575-2042",
  },
  {
    slug: "richard-jaffe",
    file: "atty-jaffe.png",
    name: "Richard S. Jaffe",
    role: "Partner · Personal Injury Attorney",
    summary:
      "A trial attorney of thirty years who has volunteered as a firefighter and critical-care EMT on Long Island, and who has secured multi-million dollar verdicts and settlements.",
    quote:
      "I want to convey to the clients that we're going to do the best we can and that no matter how many questions you have, you're always going to get that service. You're going to get courteous people who care about you.",
    headline: "A fierce trial attorney and litigator.",
    biography: [
      "After pioneering a string of personal injury cases on Long Island and in the New York City metropolitan area involving lead paint poisoning of infants, Richard's reputation would be well known enough as a fierce trial attorney and litigator. But he didn't stop there. In fact, Richard has managed to secure several multi-million dollar verdicts and settlements throughout his 30 years of experience, which has earned him membership in many prestigious circles, such as the nation's Million Dollar Advocates Forum.",
      "When not in front of a jury, Richard is a proud member of the Patriot Guard — an organization established in 2005 which primarily aims to support the families of fallen heroes by protecting them from disruptions during the services for their loved one. He also serves as a board member for The Center for Developmental Disabilities and actively supports the Babylon Breast Cancer Coalition. In the past, Rich has volunteered as a Critical Care Emergency Medical Technician (EMT-CC) and Firefighter on Long Island. When his children were younger, he often coached basketball and lacrosse on Long Island sports fields. Rich is smart, confident, entertaining, fully committed, energetic, and caring. Recently, Richard became a member of the Blue Knights LE MC Chapter in New York State. He is, perhaps, the world's worst (but most enthusiastic) dancer, and the start and finish of every family function.",
      "Richard was born and raised in New York, as were his parents and grandparents, all of whom forged his incredibly strong work ethic and tenacity. To his credit, he paid for both college and law school tuition by working during the hours he was not studying. As a graduate of Binghamton University with a degree in Romance Languages and Literature, Richard is fluent in Spanish and has a working knowledge of five other languages. His history of helping victims of discrimination and negligence dates back as far as 1988, giving the Hispanic community a voice while working as a paralegal for a major personal injury law firm.",
      "Richard met his current law partner, Stephen Cohen, in 1993. Working as a law clerk by day and completing law school by night, Richard authored memoranda and appellate briefs on negligence and discrimination issues that continue to be cited by New York State's highest courts to this day. Upon graduation from law school, Richard became an associate attorney with Cohen's law office, and began a trial the very first day he was admitted to practice. He has obtained hundreds of verdicts and settlements for victims of accidents and discrimination throughout the courts of Long Island and the New York City metropolitan area, many in excess of one million dollars.",
      "He and Stephen Cohen are now partners at Cohen & Jaffe. Nonetheless, Richard hasn't forgotten his New York roots, nor his blue collar formative years. He is thankful for the opportunities and core values given to him by his family, which serve as the backbone of his fight for the rights of his clients against insurance giants like State Farm, Allstate and GEICO, to name a few. Whether your life is shattered by a car accident, a trip and fall, a construction accident, or discrimination at work, Richard knows it's more than just a case for you — it's about putting your life and the lives of your family back together.",
    ],
    pullQuote:
      "He began a trial the very first day he was admitted to practice — and hasn't looked back since.",
    barAdmissions: ["New York"],
    education: ["SUNY Binghamton — B.A., Romance Languages and Literature"],
    languages: ["English", "Spanish (fluent)", "Working knowledge of five other languages"],
    honors: ["Million Dollar Advocates Forum", "Super Lawyers", "Martindale-Hubbell"],
    affiliations: [
      "Patriot Guard",
      "The Center for Developmental Disabilities — board member",
      "Babylon Breast Cancer Coalition",
      "Blue Knights LE MC Chapter, New York State",
    ],
    phone: "866-878-6774",
  },
  {
    slug: "stephen-tiger",
    file: "atty-tiger.png",
    name: "Stephen B. Tiger",
    role: "Partner · Personal Injury Attorney",
    summary:
      "He came to plaintiff's work from a career in finance, and is known for the persistence he brings to the discovery process.",
    quote:
      "I really don't like to take what the insurance companies do lying down, so I'm happy to fight with them for the people.",
    headline: "Whatever is necessary to secure the best possible recovery.",
    biography: [
      "Stephen B. Tiger is a firm believer in doing whatever is necessary to secure the best possible recoveries for his clients. “I take a lot of pride in helping people,” he says. “I do my best for them and try to make a change for what's right.”",
      "After receiving a Bachelor of Business Administration degree at Hofstra University in 1987, Tiger worked in the field of finance for several years before realizing that he wanted to practice law. He enrolled at Touro College Jacob D. Fuchsberg Law Center and earned his J.D. there in 1994.",
      "Tiger clerked for two criminal court judges and began his legal career handling criminal defense cases, but then began to move into the area of plaintiff's personal injury law, which he prefers. He practiced solo and also in a small partnership before joining The Law Office of Cohen & Jaffe, LLP in 2011, where his career has thrived, leading to his promotion to partner in 2024.",
      "Tiger's practice concentrates almost exclusively on plaintiff-side civil litigation. “I represent injured persons,” he says. “I attempt to get them fairly compensated, usually from big insurance companies or other big corporate entities that have harmed them through negligence.”",
      "Usually, the defendants in these cases are reluctant to admit fault, but Tiger has years of experience in knowing how to deal with them. “I'm appalled that the insurance carriers have managed to negatively influence the public's perception of injured parties going for recovery,” he says.",
      "Tiger is particularly known for his relentlessness in the discovery process. Often, defendants are dishonest and do not exchange documents they are lawfully required to. Only through his persistence and perseverance are these materials uncovered, often leading to favorable results even in circumstances that at first glance seem unfavorable to injured clients.",
    ],
    pullQuote: "Tiger is particularly known for his relentlessness in the discovery process.",
    barAdmissions: ["New York"],
    education: [
      "Hofstra University — B.B.A., 1987",
      "Touro College Jacob D. Fuchsberg Law Center — J.D., 1994",
    ],
    representativeCases: [
      "$3 million for an injured motorcyclist who suffered multiple fractures.",
      "$2.75 million for an injured construction worker.",
      "$1.8 million for an automobile passenger who suffered spinal injuries in an accident.",
      "$1.65 million for an injured motorist with hip injuries.",
      "$1.45 million for a child who suffered a head injury in a motor vehicle accident.",
      "$1 million for an injured motorcyclist with a fractured leg.",
      "$875,000 for a passenger whose injured knee required multiple surgical procedures.",
    ],
    phone: "866-878-6774",
  },
  {
    slug: "caitlin-mcnaughton",
    file: "atty-mcnaughton.png",
    name: "Caitlin McNaughton, Esq.",
    role: "Managing Attorney · Personal Injury Attorney",
    summary:
      "Licensed in three states and admitted in federal and appellate courts, with more than $12 million recovered for her clients.",
    headline: "Standing up for those who cannot stand up for themselves.",
    biography: [
      "Caitlin McNaughton is a tough litigator who chose a career as an attorney because she firmly believes in standing up for those who cannot stand up for themselves. She has always believed that while flawed, the American judicial system represents the best force for justice in the world.",
      "During law school, as part of her LL.M. degree, Caitlin worked in Tanzania with the Tanzanian government and various non-governmental organizations on legislative reform to expand legal rights for Tanzanian women and children.",
      "Caitlin is licensed in three states as well as admitted to practice in both federal and Appellate courts; she takes pride in her work, zealously representing clients at all stages of litigation, arbitration, and in pre-litigation matters. Caitlin has achieved over $12 million in settlements and verdicts for her clients.",
      "In her spare time, Caitlin enjoys reading and political activism.",
    ],
    pullQuote: "Caitlin has achieved over $12 million in settlements and verdicts for her clients.",
    phone: "866-878-6774",
  },
  {
    slug: "katherine-sawicki",
    file: "atty-sawicki.png",
    name: "Katherine Sawicki, Esq.",
    role: "Personal Injury Attorney",
    summary:
      "She worked full time as a paralegal while earning her law degree at night, and has been with the firm since 2019.",
    headline: "Close communication, at every stage of the recovery.",
    biography: [
      "With a passion for helping accident victims and a commitment to maintaining close communication with her clients, Katherine Sawicki has been a dedicated personal injury attorney with the Law Office of Cohen & Jaffe since 2019.",
      "She graduated from St. John's University in 2016 with a Bachelor's degree in History and a minor in Philosophy of Law, while also working as a paralegal at a personal injury firm. She continued working full time as a paralegal and attending night classes at St. John's University School of Law, earning her Juris Doctor in 2020.",
      "Katherine's work ethic and commitment to her clients are evident in her practice. She takes pride in being readily available to communicate with and assist her clients in all aspects of their roads to recovery. Her skills and experience have been recognized through the Red Storm Scholars Scholarship she received while attending St. John's University School of Law, as well as her participation in several mock trial competitions during her studies.",
      "Katherine also served as a legal intern under Justice Vito M. DeStefano at the Commercial Division of Nassau County Supreme Court during the summer of 2018, further enriching her legal expertise.",
    ],
    pullQuote:
      "She takes pride in being readily available to her clients at every stage of their recovery.",
    barAdmissions: ["New York"],
    education: [
      "St. John's University — B.A., History, 2016",
      "St. John's University School of Law — J.D., 2020",
    ],
    honors: ["Red Storm Scholars Scholarship, St. John's University School of Law"],
    phone: "866-575-2042",
  },
  {
    slug: "garrett-parnell",
    file: "atty-parnell.png",
    name: "Garrett V. Parnell, Esq.",
    role: "Personal Injury Attorney",
    summary:
      "He spent years defending personal injury claims for insurance carriers before moving to the plaintiff's side of the same work.",
    headline: "He learned the insurance company's playbook from inside it.",
    biography: [
      "Having tried cases for insurance carriers, Garrett brings a strategic advantage to representing injured clients. His understanding of how insurance companies investigate, evaluate and negotiate claims informs the way he handles plaintiff's personal injury claims.",
      "Garrett uses his experience to advocate aggressively for injured individuals and their families. He places great emphasis on making sure that clients feel heard and that their questions are answered while navigating what can be some of life's most challenging times.",
      "Since being admitted to practice in December 2014, Garrett has built a decade-long career focused exclusively on personal injury litigation. Before joining the plaintiff's bar, he spent years working for insurance carriers, defending personal injury claims and handling them from inception through trial.",
    ],
    pullQuote:
      "He knows how insurance companies evaluate a claim, because he spent years doing it for them.",
    barAdmissions: ["New York"],
    phone: "866-878-6774",
  },
];

/** Paragraphs → Portable Text. Keys only need to be unique within one array. */
const toBlocks = (paragraphs: string[]) =>
  paragraphs.map((text, index) => ({
    _key: `p${index}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: `p${index}s0`, _type: "span", text, marks: [] }],
  }));

const idFor = (seed: Seed) => `attorney-${seed.slug}`;

async function portraitFor(seed: Seed) {
  const existing = await client.fetch<{ assetId?: string } | null>(
    `*[_id == $id][0]{ "assetId": portrait.asset._ref }`,
    { id: idFor(seed) },
  );
  if (existing?.assetId) {
    console.log(`  ${seed.slug}: reusing asset ${existing.assetId}`);
    return existing.assetId;
  }
  const asset = await client.assets.upload("image", createReadStream(resolve(assetsDir, seed.file)), {
    filename: seed.file,
  });
  console.log(`  ${seed.slug}: uploaded ${asset._id}`);
  return asset._id;
}

async function main() {
  console.log("Seeding attorneys…");

  for (const seed of SEEDS) {
    const assetId = await portraitFor(seed);
    await client.createOrReplace({
      _id: idFor(seed),
      _type: "attorney",
      name: seed.name,
      slug: { _type: "slug", current: seed.slug },
      role: seed.role,
      summary: seed.summary,
      ...(seed.quote ? { quote: seed.quote } : {}),
      headline: seed.headline,
      biography: toBlocks(seed.biography),
      ...(seed.pullQuote ? { pullQuote: seed.pullQuote } : {}),
      ...(seed.barAdmissions ? { barAdmissions: seed.barAdmissions } : {}),
      ...(seed.education ? { education: seed.education } : {}),
      ...(seed.languages ? { languages: seed.languages } : {}),
      ...(seed.honors ? { honors: seed.honors } : {}),
      ...(seed.affiliations ? { affiliations: seed.affiliations } : {}),
      ...(seed.representativeCases
        ? {
            representativeCases: seed.representativeCases.map((cite, index) => ({
              _key: `case${index}`,
              _type: "representativeCase",
              cite,
            })),
          }
        : {}),
      location: LOCATION,
      phone: seed.phone,
      fax: FAX,
      portrait: {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
        // Decorative: the attorney's name is beside the photograph as real text
        // in every context that uses it.
        alt: "",
      },
    });
  }

  console.log(`Done — ${SEEDS.length} attorneys.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
