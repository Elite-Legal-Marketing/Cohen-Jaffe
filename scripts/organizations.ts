/**
 * The twenty organizations the firm supports — the canonical list.
 *
 * DATA ONLY, and deliberately so: `seed-organizations.ts` and
 * `add-organizations.ts` both import it, and a module with a top-level
 * `main()` cannot be imported without running it. The first version of
 * `add-organizations.ts` imported the seed script directly and silently
 * executed its seed on import; it was harmless only because that script is
 * guarded.
 *
 * ── PROVENANCE ──────────────────────────────────────────────────────────────
 *
 * EVERY name, URL and note comes from the LIVE `/about/our-community/` page, as
 * captured in `~/Downloads/Cohen & Jaffe/Sitesucker/about/our-community/`. That
 * is the source on the client's instruction (2026-09-09), chosen over the
 * fifteen organizations drawn on `CJ - Community.dc.html`, which come from the
 * client's own content notes and overlap this list on only FOUR entries.
 *
 * ⚠️ SO THE BOARD'S NOTES ARE NOT THESE NOTES. The board writes "Board member."
 * under the Center for Developmental Disabilities; that belongs to the other
 * list. Each note here is condensed from the live page's own sentence about
 * that organization, kept close to its wording. Two exceptions, both recorded:
 *
 *   - Babylon Breast Cancer Coalition is NAMED on the live page with no
 *     description, so its note is the client's own words from
 *     `Claude Files/CLAUDE.md`.
 *   - Patriot Guard, the Center for Developmental Disabilities, Long Island
 *     ABATE and Blue Knights share ONE dense paragraph about Richard Jaffe's
 *     personal involvement. The notes describe the ORGANIZATION rather than
 *     repeating "Richard is a member" four times.
 *
 * ⚠️ THE LIVE PAGE MISSPELLS TWO OF THEM and neither typo is carried over:
 * "Friends of Jacklyn" (the charity is Friends of Jaclyn, for Jaclyn Murphy —
 * and the URL the page itself links, friendsofjaclyn.org, spells it correctly)
 * and "Syosset Baseball Assocation". The short form "Syosset Baseball" carries
 * neither the typo nor a guess at the correction.
 *
 * ⚠️ "CYSTIC FIBROSIS FOUNDATION" IS NOT HERE ON PURPOSE. The homepage board
 * lists it sixteenth; it appears nowhere on the live page and nowhere in the
 * 217-page mirror.
 *
 * ⚠️ THREE HAVE NO `href`, and that is the live page's doing rather than an
 * omission: it names Tuberous Sclerosis Alliance, CMSA Long Island and the
 * Health & Wellness Fest in running text without linking any of them. Guessing
 * a domain would be inventing a source; the components render an unlinked name.
 *
 * ⚠️ FIVE WERE ADDED AFTER THE FIRST FIFTEEN (2026-09-09). The first pass took
 * its list from the HOMEPAGE board's strip, which names sixteen; the live page
 * actually names twenty organizations the firm supports, so Holy Family, CMSA
 * Long Island, the All Kids Fair, the Over 50 Fair and the Health & Wellness
 * Fest were simply missing. They were carried in the community page's intro
 * copy for one commit and moved here on the client's instruction — if that
 * sentence ever comes back, these five must come out of it.
 *
 * ⚠️ "Port Jefferson Health & Wellness Fest" NAMES THE EVENT, NOT THE CHAMBER.
 * The live page says the firm promotes "The Greater Port Jefferson Chamber of
 * Commerce's Annual Health & Wellness Fest" — the Fest is what is supported,
 * and naming the Chamber instead would widen the claim.
 *
 * Two URLs are Facebook profiles (Blue Knights, Fighters of Fire) because that
 * is what the live page links — neither has a site of its own. One URL is
 * REWRITTEN: the live page's Cinema Arts Centre link, `/about-us/mission/`, now
 * 404s, so this is the page that path was reorganised into. Two more are
 * written `http://` on the live page and 301 to `https://`; stored as https so
 * the link does not spend a redirect. Every URL below was requested and
 * returned 200 (Patriot Guard and the Film Expo answer 406 to a plain `curl`,
 * and Holy Family answers 403 even with full browser headers; all three load
 * normally in a real browser. Bot filters, not dead links — do not "fix" them).
 *
 */

type Seed = { name: string; href?: string; note: string };

/**
 * In the live page's own order; both surfaces sort alphabetically at render.
 *
 * Exported so `add-organizations.ts` reads the SAME list — two copies of
 * twenty organizations is two things to keep in step.
 */
export const ORGANIZATIONS: Seed[] = [
  {
    name: "Patriot Guard",
    href: "https://pgrny.org/index.php/about-us",
    note: "Supporting the families of fallen heroes, and shielding memorial services from disturbance.",
  },
  {
    name: "Center for Developmental Disabilities",
    href: "https://www.centerfordd.org/",
    note: "Services for people with intellectual and developmental challenges.",
  },
  {
    name: "Long Island ABATE",
    href: "https://longislandabate.org/",
    note: "American Bikers for Awareness, Training and Education — motorcycle safety and awareness.",
  },
  {
    name: "Blue Knights",
    href: "https://www.facebook.com/profile.php?id=61559472040893",
    note: "A law enforcement motorcycle club; the firm rides with the New York chapter.",
  },
  {
    name: "Tuberous Sclerosis Alliance",
    note: "Working toward a cure for tuberous sclerosis complex, and better lives for those affected.",
  },
  {
    name: "New York Bully Crew",
    href: "https://www.nybullycrew.org/",
    note: "A nonprofit rescue founded in 2010. No animal in dire need is turned away.",
  },
  {
    name: "Greater Long Island Running Club",
    href: "https://www.glirc.org/who-we-are",
    note: "Long Island's largest running group, and more than thirty events a year.",
  },
  {
    name: "Syosset Baseball",
    href: "https://www.syossetbaseball.org/",
    note: "A nonprofit association here on Long Island, for everyone who plays Little League.",
  },
  {
    name: "Hicksville American Soccer Club",
    href: "https://hicksvillesoccerclub.com/about",
    note: "Founded in 1973, with leagues from under-four through high school.",
  },
  {
    name: "Huntington Tri-Village Little League",
    href: "https://www.htvlittleleague.org/",
    note: "Life lessons that have value beyond the playing field.",
  },
  {
    name: "Cinema Arts Centre",
    href: "https://cinemaartscentre.org/about-us/mission-history",
    note: "Bringing the best in cinematic artistry to Long Island.",
  },
  {
    name: "Long Island International Film Expo",
    href: "https://longislandfilm.com/",
    note: "Over a hundred films every July, and a case for Long Island as a place to shoot.",
  },
  {
    name: "Friends of Jaclyn Foundation",
    href: "https://friendsofjaclyn.org/",
    note: "Connecting children fighting pediatric brain tumors and childhood cancers with local teams and clubs.",
  },
  {
    name: "Babylon Breast Cancer Coalition",
    href: "https://babylonbreastcancer.org/",
    note: "Dedicated to breast and gynecological cancer concerns.",
  },
  {
    name: "Fighters of Fire Motorcycle Club",
    href: "https://www.facebook.com/profile.php?id=61550973894643",
    note: "Their 'Christmas in June' toy run benefits the children of SCO Family Services.",
  },
  {
    name: "Holy Family Roman Catholic Church",
    href: "https://www.holyfamilyparishny.org/",
    note: "A Hicksville parish where all are welcome, with schools from nursery through high school.",
  },
  {
    name: "CMSA Long Island",
    note: "The Case Management Society of America, advocating for patients and better health outcomes.",
  },
  {
    name: "All Kids Fair",
    href: "https://www.allkidsfair.com/",
    note: "Created in 2011 to connect Long Island parents and children with local businesses and organizations.",
  },
  {
    name: "Over 50 Fair",
    href: "https://www.over50fair.com/",
    note: "Part health and wellness fair, part conference, created to celebrate life over fifty.",
  },
  {
    name: "Port Jefferson Health & Wellness Fest",
    note: "The Greater Port Jefferson Chamber's annual fair, for every stage of life from pre-birth to elder years.",
  },
];
