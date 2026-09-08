/**
 * Extract the firm's FAQ library from the LIVE WordPress site into
 * `scripts/faqs.json`, ready for `scripts/seed-faqs.ts`.
 *
 *   node scripts/faq-extract.ts
 *
 * ⚠️ THIS WRITES NOTHING TO SANITY, deliberately. It has no Sanity client and
 * cannot acquire one. Extraction and seeding are two scripts with a reviewable
 * JSON file between them, because the source is 127 pages of legal copy that
 * nobody has read and a migration that seeds straight into `production` is a
 * migration nobody can check first. Run this, read `scripts/faqs.json` and the
 * summary table it prints, THEN seed. `scripts/reviews.json` and
 * `scripts/case-results.json` are the same arrangement.
 *
 * ── WHY THE LIVE SITE AND NOT THE MIRROR ────────────────────────────────────
 *
 * `~/Downloads/Cohen & Jaffe/Sitesucker/` has 127 FAQ folders, but its hub page
 * `/faqs/index.html` lists NONE of them: the live hub renders its list over
 * AJAX (`category-filter.js` → `admin-ajax.php`), so SiteSucker captured an
 * empty `<div class="elementor-posts">`. The mirror is also a page behind — the
 * live site has 128 children where the mirror has 127.
 *
 * The REST API is better on every axis: it is current, `faqs: [termId]` carries
 * the category directly, and `title.rendered` is the clean question.
 *
 * ⚠️ NEVER TAKE THE QUESTION FROM THE `<title>` TAG. It is an SEO variant that
 * frequently names a different thing — `/faqs/what-is-the-definition-of-a-car-accident/`
 * has an `<h1>` of "What is the Definition of a Motor Vehicle Accident?" against
 * a `<title>` of "What Is the Definition of a Car Accident? - Free Consultation".
 *
 * ── THE FIVE SOURCE HAZARDS ─────────────────────────────────────────────────
 *
 * Each of these silently corrupts a naive migration, and each was measured
 * across all 128 pages rather than guessed at from a sample:
 *
 *  1. PAGE 1 OF THE REST RESPONSE IS NOT VALID JSON. It carries 132 bytes of
 *     stray Elementor markup before the array, so `res.json()` throws. Page 2 is
 *     clean. Read as text and slice from the first `[{`.
 *
 *  2. `.common-content` RETURNS NOTHING ON 5 OF 128. Four are an older template
 *     where the answer sits as bare top-level siblings after the Gravity Form
 *     and the sidebar; the fallback below recovers 3.4-5.5 KB of clean markup
 *     from each. The fifth is a dead page — see DEAD_PAGE.
 *     ⚠️ And 120 of the remaining 123 split the answer across TWO widgets, one
 *     before the mobile sidebar and one after. Taking only the first drops most
 *     of the body on almost every page, with nothing to show that it did.
 *
 *  3. BLIND CONCATENATION LEAKS NON-ANSWER CONTENT — the author bio on 2 pages,
 *     Gravity Form markup on 2 more.
 *
 *  4. `<b>` OUTNUMBERS `<strong>` 255 TO 196, and `<i>` outnumbers `<em>` 22 to
 *     9. block-tools maps all four correctly; this note exists so nobody
 *     "simplifies" the converter into dropping 277 formatting runs.
 *
 *  5. 1,456 `<span>`s, 654 of them `font-weight: 400` — a Word-paste artifact.
 *     They are unwrapped, never converted to a `strong` mark, which would bold
 *     half the library. One page (`is-new-york-a-no-fault-state`) additionally
 *     has leaked AI-chat UI markup pasted into its body (`data-turn-id`,
 *     `data-testid="conversation-turn-*"`); unwrapping every `div`/`section` and
 *     stripping every attribute handles it without a page-specific case.
 *
 * ── WHAT MAKES IT SAFE TO RE-RUN ────────────────────────────────────────────
 *
 * `keyGenerator` is a per-document COUNTER, not `randomKey`, so a re-run against
 * unchanged source produces a byte-identical `faqs.json` and `git diff` is the
 * real answer to "did the source change?". The fetch also asserts the shape of
 * the source (130 children, 18 populated terms) and fails loudly rather than
 * quietly migrating a different corpus.
 */
import { writeFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { Schema } from "@sanity/schema";
import { builtinTypes } from "@sanity/schema/_internal";
import { htmlToBlocks, type DeserializerRule } from "@portabletext/block-tools";
import { richText } from "../src/sanity/schemaTypes/objects/richText.ts";

const SITE = "https://www.cohenjaffe.com";
const FAQ_HUB_PAGE_ID = 3025;
const OUT = new URL("./faqs.json", import.meta.url);

/** The shape of the source, asserted so a change upstream fails loudly. */
const EXPECT_CHILDREN = 130;
const EXPECT_TERMS = 18;

/**
 * Children of the FAQ hub that are NOT FAQs. Both live at the site root rather
 * than under `/faqs/`, so the pathname filter already excludes them — they are
 * named here so the count reconciles for whoever checks it next.
 */
const NOT_FAQS = new Set(["editorial-guidelines", "queens-nursing-home-abuse-lawyer"]);

/**
 * ⚠️ A DEAD PAGE ON THE LIVE SITE. `content.rendered` is the empty string and
 * the slug is visibly corrupted — "in-new-yorkas-we-serve" is two slugs run
 * together. A working duplicate of the same question exists at
 * `what-to-do-after-a-bus-accident-new-york`, so nothing is lost by dropping it,
 * and its URL gets a redirect to that duplicate rather than a page of its own.
 * This is why the collection is 127 and not 128.
 */
const DEAD_PAGE = "what-to-do-after-a-bus-accident-in-new-yorkas-we-serve";

/**
 * The live `faqs` taxonomy left three pages untagged, and `faq.category` is
 * required — so these three are assigned here, in the open, rather than by a
 * heuristic nobody can audit. Each is the plainest reading of the question, and
 * every one is an editable dropdown in the Studio the moment the seed lands.
 *
 * The bus-accident page gets Personal Injury because the taxonomy has no bus or
 * transit term at all; Car Accidents would be wrong on the facts.
 */
const CATEGORY_FALLBACKS: Record<string, string> = {
  "what-to-do-after-a-bus-accident-new-york": "personal-injury",
  "who-is-liable-for-a-slip-and-fall-accident": "slip-and-fall-injury",
};

/**
 * The seven round-up pages, each of which bundles many questions under headings
 * rather than answering one. ⚠️ ONE SPLITTER RULE DOES NOT SERVE ALL SEVEN, and
 * a blind `<h2>` split mints a garbage document from every one of them:
 *
 *   - `motorcycle-accidents-faqs` keeps its 12 questions in H3s. Its two H2s are
 *     a section title and a "Call our…" CTA, and a blind H2 split would produce
 *     ONE document whose question is "Call Our Experienced Long Island
 *     Motorcycle Accident Law Firm" and whose answer is all twelve questions.
 *   - `birth-injury-faqs` contains two near-duplicate pairs OF ITS OWN. They are
 *     flagged in the review block and NOT auto-merged — a script does not get to
 *     decide which of two pieces of legal copy survives.
 *
 * ⚠️ `dropLast` IS FALSE EVERYWHERE, AND THAT IS A CORRECTION. It was first set
 * true for the three pages believed to end on a "Call our…" heading. They do
 * not: their final H2s are "What makes the Law Office of Cohen & Jaffe, LLP
 * different…", "What can I expect to pay a lawyer…" and "What should I do to
 * start the process…" — all real questions. The `CTA_HEADING` check refused to
 * drop them and warned instead, which is the only reason three genuine answers
 * are still in the collection. The flag and its guard are kept for the next
 * round-up somebody adds; the motorcycle page's actual CTA is caught by the
 * splitter instead, and lands in `outroHeadings`.
 */
const ROUND_UPS: Record<string, { splitOn: "h2" | "h3"; dropLast: boolean }> = {
  "car-accident-faqs": { splitOn: "h2", dropLast: false },
  "cruise-ship-accident-faqs": { splitOn: "h2", dropLast: false },
  "elevator-and-escalator-accident-faqs": { splitOn: "h2", dropLast: false },
  "motorcycle-accidents-faqs": { splitOn: "h3", dropLast: false },
  "birth-injury-faqs": { splitOn: "h2", dropLast: false },
  "employment-law-faqs": { splitOn: "h2", dropLast: false },
  "medical-malpractice-faqs": { splitOn: "h2", dropLast: false },
};

/** A heading that sells rather than asks. Used only to sanity-check `dropLast`. */
const CTA_HEADING =
  /^(call|contact|speak|schedule|reach|let\s|get\s|talk\s|our\s+(long island|experienced|attorneys)|why\s+choose|hire\s|discuss)/i;

/** The author bio, which sits inside a `.common-content` widget on two pages. */
const AUTHOR_BIO = "After pioneering a string of personal injury cases";

/** Everything that is furniture rather than answer. */
const STRIP_SELECTORS =
  "script, style, iframe, noscript, form, button, input, select, textarea, " +
  ".gform_wrapper, .gform_confirmation_wrapper, .elementor-widget-table-of-contents";

/** Unwrapped: the tag goes, its children stay. */
const UNWRAP_TAGS = new Set(["span", "div", "section", "figure", "article", "font", "u"]);

/** The only attributes any element keeps. */
const KEEP_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href"]),
  img: new Set(["src", "alt"]),
};

/**
 * The tag set the answers are allowed to contain once cleaned. ⚠️ THE RUN FAILS
 * ON ANYTHING ELSE. block-tools drops a tag it has no rule for without a word,
 * so this audit is the only thing standing between the next WordPress edit and
 * silently losing whatever it introduces.
 */
const ALLOWED_TAGS = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "a", "strong", "b", "em", "i", "br", "blockquote",
]);

/**
 * `richText` has four styles and none of them is h1 or h4. An unmapped heading
 * is not an error in block-tools — it comes back as `normal`, so an `<h4>`
 * becomes an ordinary paragraph and the document silently loses a level of
 * structure. 84 of the 127 answers use H3s and the four legacy-template pages
 * use H4s, so this matters on real content.
 */
const HEADING_REMAP: Record<string, string> = { h1: "h2", h4: "h3", h5: "h3", h6: "h3" };

// ── The schema, compiled once ───────────────────────────────────────────────
// Compiled from the repo's OWN `richText`, so what this script can produce and
// what the Studio will accept cannot drift. `builtinTypes` is required: without
// it `Schema.compile` throws "Unknown type: sanity.imageHotspot" on the image
// member's `options.hotspot`.
const schema = Schema.compile({ name: "faq-migration", types: [...builtinTypes, richText] });
const richTextType = schema.get("richText");
if (!richTextType) throw new Error("Could not compile the richText schema type.");

const dom = new JSDOM("");
const { document: scratch } = dom.window;

// ── Types ───────────────────────────────────────────────────────────────────

interface Block {
  _type: string;
  _key: string;
  style?: string;
  listItem?: string;
  children?: { _type: string; text?: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  [key: string]: unknown;
}

interface Faq {
  slug: string;
  question: string;
  category: string;
  answer: Block[];
  source: string;
  flags: string[];
}

// ── Fetch ───────────────────────────────────────────────────────────────────

/**
 * ⚠️ `res.json()` THROWS ON PAGE 1. See hazard 1 — the response is prefixed with
 * stray Elementor markup. Slicing from the first structural character is the
 * whole fix, and it is a no-op on a clean response.
 */
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  const text = await res.text();
  const start = text.search(/[[{]/);
  if (start < 0) throw new Error(`No JSON in the response from ${url}`);
  return JSON.parse(text.slice(start)) as T;
}

interface WpPage {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  faqs?: number[];
}

interface WpTerm {
  id: number;
  slug: string;
  name: string;
  count: number;
}

async function fetchSource() {
  const fields = "id,slug,link,title,content,faqs";
  const pages: WpPage[] = [];
  for (let page = 1; page <= 2; page++) {
    pages.push(
      ...(await fetchJson<WpPage[]>(
        `${SITE}/wp-json/wp/v2/pages?parent=${FAQ_HUB_PAGE_ID}&per_page=100&page=${page}&_fields=${fields}`,
      )),
    );
  }
  const terms = (await fetchJson<WpTerm[]>(`${SITE}/wp-json/wp/v2/faqs?per_page=100`)).filter(
    (t) => t.count > 0,
  );

  if (pages.length !== EXPECT_CHILDREN) {
    throw new Error(
      `Expected ${EXPECT_CHILDREN} children of page ${FAQ_HUB_PAGE_ID}, got ${pages.length}. ` +
        `The live site has changed — read the diff before raising this number.`,
    );
  }
  if (terms.length !== EXPECT_TERMS) {
    throw new Error(
      `Expected ${EXPECT_TERMS} populated FAQ terms, got ${terms.length}. ` +
        `A category was added or emptied upstream; update src/sanity/schemaTypes/faqCategories.ts to match.`,
    );
  }
  return { pages, terms };
}

// ── Extraction ──────────────────────────────────────────────────────────────

const textOf = (html: string): string => {
  const el = scratch.createElement("div");
  el.innerHTML = html;
  return el.textContent ?? "";
};

/** Entity decoding through the DOM, rather than a hand-written entity table. */
const decodeTitle = (rendered: string) => textOf(rendered).replace(/\s+/g, " ").trim();

/**
 * The answer body, as HTML.
 *
 * PRIMARY: every `.common-content` widget in document order — there are usually
 * two (hazard 2) — taking the inner `.bialty-container` where the auto-linking
 * plugin left one.
 *
 * FALLBACK: the older template has no `.common-content` at all and puts the
 * answer as bare top-level siblings after the form and sidebar, so take
 * everything from the first `<h2>` onward.
 */
function extractAnswerHtml(rendered: string): { html: string; fallback: boolean } {
  const doc = new JSDOM(rendered).window.document;

  const widgets = [...doc.querySelectorAll(".common-content")].filter(
    (w) => !(w.textContent ?? "").trimStart().startsWith(AUTHOR_BIO),
  );

  if (widgets.length > 0) {
    const html = widgets
      .map((w) => (w.querySelector(".bialty-container") ?? w.querySelector(".elementor-widget-container") ?? w).innerHTML)
      .join("\n");
    if (textOf(html).trim().length > 0) return { html, fallback: false };
  }

  const children = [...doc.body.children];
  const first = children.findIndex((el) => el.tagName === "H2");
  if (first < 0) return { html: "", fallback: true };
  return { html: children.slice(first).map((el) => el.outerHTML).join("\n"), fallback: true };
}

interface LinkStats {
  tel: string[];
  external: string[];
  internal: string[];
  /** Files under /wp-content/ — kept absolute; see rewriteHref. */
  asset: string[];
  unresolved: string[];
}

/**
 * Strip the furniture, unwrap the noise, and rewrite the links.
 *
 * ⚠️ Every `<span>` is unwrapped unconditionally. 654 of the 1,456 carry
 * `font-weight: 400`, which is Word telling us the text is NOT bold — treating
 * it as a `strong` mark, which is the obvious-looking reading of a font-weight,
 * bolds half the library.
 */
function clean(html: string, links: LinkStats): { html: string; imagesDropped: string[] } {
  const doc = new JSDOM(`<div id="root">${html}</div>`).window.document;
  const root = doc.getElementById("root")!;

  root.querySelectorAll(STRIP_SELECTORS).forEach((el) => el.remove());

  // ⚠️ IMAGES ARE DROPPED, and that is a decision rather than a limitation.
  // `richText` has no image member — see its docblock. All 25 `<img>` in this
  // corpus are old-theme decoration ("info icon", "justice scales", a picture
  // of a download button), not figures the answers depend on. The list is
  // recorded so the call stays checkable.
  const imagesDropped: string[] = [];
  root.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") ?? "";
    try {
      imagesDropped.push(new URL(src, SITE).href);
    } catch {
      imagesDropped.push(src);
    }
    img.remove();
  });

  // Comment nodes carry Elementor bookkeeping and confuse the tag audit.
  const walker = doc.createTreeWalker(root, 128 /* SHOW_COMMENT */);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.parentNode?.removeChild(c));

  // Unwrap innermost-first, so nested wrappers collapse in one pass.
  for (const tag of UNWRAP_TAGS) {
    let el = root.querySelector(tag);
    while (el) {
      el.replaceWith(...el.childNodes);
      el = root.querySelector(tag);
    }
  }

  root.querySelectorAll("*").forEach((el) => {
    const keep = KEEP_ATTRS[el.tagName.toLowerCase()];
    for (const attr of [...el.attributes]) {
      if (!keep?.has(attr.name)) el.removeAttribute(attr.name);
    }
  });

  root.querySelectorAll("a[href]").forEach((a) => {
    const raw = a.getAttribute("href") ?? "";
    const rewritten = rewriteHref(raw, links);
    if (rewritten === null) {
      // A link we cannot make safe becomes plain text rather than a broken href.
      links.unresolved.push(raw);
      a.replaceWith(...a.childNodes);
      return;
    }
    a.setAttribute("href", rewritten);
  });

  return { html: root.innerHTML, imagesDropped };
}

/**
 * ⚠️ `richText`'s own `link.href` validation REJECTS an internal path without a
 * trailing slash, so a miss here does not fail here — it fails on ~115
 * documents at `sanity documents validate` time, long after the seed.
 *
 * ✅ Links from one FAQ to another need no special handling now that every FAQ
 * keeps its own page. Under the plan that collapsed them onto one page, all 30
 * of them would have had to be rewritten to fragments.
 */
function rewriteHref(raw: string, links: LinkStats): string | null {
  const href = raw.trim();
  if (!href) return null;
  if (/^(tel:|sms:)/i.test(href)) {
    links.tel.push(href);
    return href;
  }
  if (/^(mailto:|#)/i.test(href)) return href;

  let url: URL;
  try {
    url = new URL(href, SITE);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const isOwn = /(^|\.)cohenjaffe\.com$/i.test(url.hostname);
  if (!isOwn) {
    links.external.push(url.href);
    return url.href;
  }

  // ⚠️ AN UPLOADED FILE IS NOT A PAGE, AND MUST STAY ABSOLUTE. Two answers link
  // to PDFs under `/wp-content/uploads/`. Rewriting those to a site-relative
  // path points them at a route the new site does not have and never will —
  // they are files on the WordPress host. Left absolute they keep working, and
  // `richText`'s href rule accepts them because they are a full https:// URL.
  // They are recorded so the assets can be moved before that host goes away.
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) {
    links.asset.push(url.href);
    return url.href;
  }

  // Site-relative, slash-terminated. 10 live targets are missing the slash.
  const path = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  const internal = `${path}${url.search}${url.hash}`;
  links.internal.push(path);
  return internal;
}

/** Every tag name still present, so the audit can refuse the unexpected. */
function tagsIn(html: string): Set<string> {
  const doc = new JSDOM(`<div id="root">${html}</div>`).window.document;
  const tags = new Set<string>();
  doc.getElementById("root")!.querySelectorAll("*").forEach((el) => tags.add(el.tagName.toLowerCase()));
  return tags;
}

// ── Conversion ──────────────────────────────────────────────────────────────

const remapHeadings: DeserializerRule = {
  deserialize(el, next, createBlock) {
    const style = HEADING_REMAP[(el as Element).nodeName?.toLowerCase?.() ?? ""];
    if (!style) return undefined;
    return createBlock({ _type: "block", style, markDefs: [], children: next(el.childNodes) });
  },
};

/** HTML → Portable Text, against the compiled `richText`. */
function toBlocks(html: string): Block[] {
  let n = 0;
  return htmlToBlocks(html, richTextType, {
    parseHtml: (h) => new JSDOM(h).window.document,
    keyGenerator: () => `b${n++}`,
    rules: [remapHeadings],
  }) as Block[];
}

/** Portable Text back to plain text, for the round-trip check. */
const blocksToText = (blocks: Block[]): string =>
  blocks
    .map((b) => (b._type === "block" ? (b.children ?? []).map((c) => c.text ?? "").join("") : ""))
    .join(" ");

const normalise = (s: string) => s.replace(/\s+/g, " ").trim();

// ── Round-up splitting ──────────────────────────────────────────────────────

const headingText = (b: Block) => (b.children ?? []).map((c) => c.text ?? "").join("").trim();

/**
 * Cut a round-up into one FAQ per question.
 *
 * A heading at `splitOn` starts a new question. A heading at a DIFFERENT level
 * is structural — the motorcycle page's two H2s are a section title and a CTA
 * wrapped around its twelve H3 questions — so it closes the current question and
 * everything after it is recorded as outro rather than swallowed into the last
 * answer.
 */
function splitRoundUp(blocks: Block[], splitOn: "h2" | "h3") {
  const sections: { question: string; blocks: Block[] }[] = [];
  const intro: Block[] = [];
  const outro: Block[] = [];
  let current: { question: string; blocks: Block[] } | null = null;
  let started = false;

  for (const block of blocks) {
    const style = block.style;
    const isHeading = style === "h2" || style === "h3";

    if (style === splitOn) {
      if (current) sections.push(current);
      current = { question: headingText(block), blocks: [] };
      started = true;
      continue;
    }
    if (isHeading && started) {
      if (current) sections.push(current);
      current = null;
      outro.push(block);
      continue;
    }
    if (current) current.blocks.push(block);
    else if (started) outro.push(block);
    else intro.push(block);
  }
  if (current) sections.push(current);

  return { sections, intro, outro };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

// ── Near-duplicate detection ────────────────────────────────────────────────

/**
 * Two passes, because one is not enough on this corpus. An exact fingerprint
 * catches `medical-malpractice-faqs`'s child against its standalone twin, but
 * misses `birth-injury-faqs`'s internal pair, which differs only by "just
 * recently" against "have only recently". Jaccard overlap on the same token set
 * catches that without a hand-maintained list of known pairs.
 *
 * ⚠️ FLAGGING ONLY. Nothing is merged or dropped — deciding which of two pieces
 * of legal copy survives is not a script's call.
 */
const STOPWORDS = new Set([
  "what", "when", "does", "will", "your", "have", "with", "that", "this",
  "from", "after", "just", "only", "some", "been", "should", "could", "would",
]);

const tokens = (q: string): Set<string> =>
  new Set(
    q
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w)),
  );

const fingerprint = (q: string) => [...tokens(q)].sort().join(" ");

const jaccard = (a: Set<string>, b: Set<string>): number => {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / (a.size + b.size - shared);
};

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const { pages, terms } = await fetchSource();
  const termName = new Map(terms.map((t) => [t.id, t.slug]));

  const faqPages = pages.filter((p) => {
    try {
      return new URL(p.link).pathname.startsWith("/faqs/") && !NOT_FAQS.has(p.slug);
    } catch {
      return false;
    }
  });

  const faqs: Faq[] = [];
  const links: LinkStats = { tel: [], external: [], internal: [], asset: [], unresolved: [] };
  const review = {
    dropped: [] as { slug: string; why: string }[],
    fallbackExtraction: [] as string[],
    noCategory: [] as { slug: string; assigned: string }[],
    twoCategories: [] as { slug: string; terms: string[]; assigned: string }[],
    roundUps: [] as Record<string, unknown>[],
    notQuestions: [] as string[],
    imagesDropped: [] as { slug: string; images: string[] }[],
    nearDuplicates: [] as string[][],
    roundTrip: [] as { slug: string; lossPct: number }[],
  };

  for (const page of faqPages) {
    const question = decodeTitle(page.title.rendered);

    if (page.slug === DEAD_PAGE || page.content.rendered.trim().length === 0) {
      review.dropped.push({
        slug: page.slug,
        why: "content.rendered is empty on the live site — a dead page with a corrupted slug. A working duplicate exists at what-to-do-after-a-bus-accident-new-york, which gets the redirect.",
      });
      continue;
    }

    const { html: rawHtml, fallback } = extractAnswerHtml(page.content.rendered);
    if (fallback) review.fallbackExtraction.push(page.slug);

    const { html: cleaned, imagesDropped } = clean(rawHtml, links);
    const sourceText = normalise(textOf(cleaned));
    if (imagesDropped.length > 0) {
      review.imagesDropped.push({ slug: page.slug, images: imagesDropped });
    }

    if (sourceText.length < 400) {
      throw new Error(
        `${page.slug}: only ${sourceText.length} characters of answer text survived extraction. ` +
          `Every real FAQ has at least 3,500 — this is an extraction failure, not a short answer.`,
      );
    }

    const unknown = [...tagsIn(cleaned)].filter((t) => !ALLOWED_TAGS.has(t));
    if (unknown.length > 0) {
      throw new Error(
        `${page.slug}: unexpected tags after cleaning — ${unknown.join(", ")}. ` +
          `block-tools drops what it has no rule for, so add a rule or an unwrap before raising this.`,
      );
    }

    // Category, with the two documented fallbacks and a deterministic choice on
    // the one page carrying two terms.
    const termIds = page.faqs ?? [];
    let category: string;
    if (termIds.length === 0) {
      category = CATEGORY_FALLBACKS[page.slug] ?? "personal-injury";
      review.noCategory.push({ slug: page.slug, assigned: category });
    } else {
      const names = termIds.map((id) => termName.get(id)).filter(Boolean) as string[];
      category = names[0]!;
      if (names.length > 1) {
        review.twoCategories.push({ slug: page.slug, terms: names, assigned: category });
      }
    }

    const blocks = toBlocks(cleaned);

    // ⚠️ The round-trip check is the verification for this whole phase: if the
    // Portable Text does not say what the HTML said, nothing downstream can tell.
    const loss = 1 - normalise(blocksToText(blocks)).length / Math.max(sourceText.length, 1);
    if (loss > 0.02) {
      review.roundTrip.push({ slug: page.slug, lossPct: Math.round(loss * 1000) / 10 });
    }

    const roundUp = ROUND_UPS[page.slug];
    if (!roundUp) {
      faqs.push({
        slug: page.slug,
        question,
        category,
        answer: blocks,
        source: page.link,
        flags: fallback ? ["fallback-extraction"] : [],
      });
      continue;
    }

    // ── A round-up: one FAQ per question inside it ──────────────────────────
    const { sections, intro, outro } = splitRoundUp(blocks, roundUp.splitOn);
    let kept = sections;
    let droppedCta: string | null = null;

    if (roundUp.dropLast && kept.length > 1) {
      const last = kept[kept.length - 1]!;
      if (CTA_HEADING.test(last.question)) {
        droppedCta = last.question;
        kept = kept.slice(0, -1);
      } else {
        console.warn(
          `  ⚠️  ${page.slug}: expected the last section to be a CTA, but it reads ` +
            `"${last.question}". Kept it — check the review file.`,
        );
      }
    }

    review.roundUps.push({
      slug: page.slug,
      splitOn: roundUp.splitOn,
      questions: kept.map((s) => s.question),
      droppedCta,
      introBlocks: intro.length,
      introText: normalise(blocksToText(intro)).slice(0, 300),
      outroHeadings: outro.filter((b) => b.style?.startsWith("h")).map(headingText),
    });

    for (const section of kept) {
      if (section.blocks.length === 0) continue;
      let slug = slugify(section.question);
      if (!slug) continue;
      if (faqs.some((f) => f.slug === slug) || faqPages.some((p) => p.slug === slug)) {
        slug = `${slug}-${page.slug.replace(/-faqs?$/, "")}`.slice(0, 90);
      }
      faqs.push({
        slug,
        question: section.question,
        category,
        answer: section.blocks,
        source: `${page.link} (split on ${roundUp.splitOn})`,
        flags: ["round-up-child"],
      });
    }
  }

  // A title that does not ask anything. They work as pages; they read oddly in a
  // band headed "Frequently asked questions", so they are named here.
  for (const faq of faqs) {
    if (!/\?$/.test(faq.question) && !/^(how|what|when|where|why|who|can|do|does|is|are|should|will|if)\b/i.test(faq.question)) {
      faq.flags.push("not-a-question");
      review.notQuestions.push(faq.question);
    }
  }

  // Near-duplicates, flagged and never merged.
  const seen = new Set<string>();
  const pairs: string[][] = [];

  const byPrint = new Map<string, string[]>();
  for (const faq of faqs) {
    const key = fingerprint(faq.question);
    byPrint.set(key, [...(byPrint.get(key) ?? []), faq.slug]);
  }
  for (const group of byPrint.values()) {
    if (group.length > 1) {
      pairs.push(group);
      group.forEach((s) => seen.add(s));
    }
  }

  const printed = faqs.map((f) => ({ slug: f.slug, tokens: tokens(f.question) }));
  for (let i = 0; i < printed.length; i++) {
    for (let j = i + 1; j < printed.length; j++) {
      const a = printed[i]!;
      const b = printed[j]!;
      if (seen.has(a.slug) && seen.has(b.slug)) continue;
      if (jaccard(a.tokens, b.tokens) >= 0.8) {
        pairs.push([a.slug, b.slug]);
        seen.add(a.slug);
        seen.add(b.slug);
      }
    }
  }

  review.nearDuplicates = pairs;
  for (const slug of seen) faqs.find((f) => f.slug === slug)?.flags.push("near-duplicate");

  const payload = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: `${SITE}/faqs/`,
    sourceChildren: pages.length,
    faqPages: faqPages.length,
    faqs: faqs.length,
    categories: terms.map((t) => ({ value: t.slug, title: t.name, liveCount: t.count })),
    review: {
      ...review,
      telLinks: links.tel.length,
      telLinkTargets: [...new Set(links.tel)],
      externalLinks: links.external.length,
      externalHosts: [...new Set(links.external.map((h) => new URL(h).hostname))].sort(),
      internalLinkTargets: Object.fromEntries(
        [...links.internal.reduce((m, p) => m.set(p, (m.get(p) ?? 0) + 1), new Map<string, number>())].sort(
          (a, b) => b[1] - a[1],
        ),
      ),
      assetLinks: [...new Set(links.asset)],
      unresolvedLinks: links.unresolved,
    },
    items: faqs,
  };

  writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(`\n  ${faqPages.length} FAQ pages → ${faqs.length} documents\n`);
  console.log(`  dropped              ${review.dropped.length}  ${review.dropped.map((d) => d.slug).join(", ")}`);
  console.log(`  fallback extraction  ${review.fallbackExtraction.length}  ${review.fallbackExtraction.join(", ")}`);
  console.log(`  no category          ${review.noCategory.length}  ${review.noCategory.map((c) => `${c.slug} → ${c.assigned}`).join(", ")}`);
  console.log(`  two categories       ${review.twoCategories.length}  ${review.twoCategories.map((c) => `${c.slug} → ${c.assigned}`).join(", ")}`);
  console.log(`  round-ups split      ${review.roundUps.length} → ${faqs.filter((f) => f.flags.includes("round-up-child")).length} children`);
  console.log(`  images dropped       ${review.imagesDropped.reduce((n, i) => n + i.images.length, 0)} across ${review.imagesDropped.length} pages`);
  console.log(`  not a question       ${review.notQuestions.length}`);
  console.log(`  near-duplicates      ${review.nearDuplicates.length} groups`);
  console.log(`  round-trip losses    ${review.roundTrip.length} ${review.roundTrip.length ? "⚠️  " + review.roundTrip.map((r) => `${r.slug} ${r.lossPct}%`).join(", ") : "✅"}`);
  console.log(`  tel: links           ${links.tel.length}`);
  console.log(`  external links       ${links.external.length}`);
  console.log(`  wp-content assets    ${new Set(links.asset).size} (kept absolute — move before the WordPress host goes)`);
  console.log(`  unresolved links     ${links.unresolved.length}`);
  console.log(`\n  → scripts/faqs.json\n`);

  if (review.roundTrip.length > 0) {
    throw new Error(
      `${review.roundTrip.length} FAQ(s) lost more than 2% of their text in conversion. ` +
        `Read the roundTrip block in faqs.json before seeding.`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
