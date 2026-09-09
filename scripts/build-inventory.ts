/**
 * Build the migration inventory — every URL the LIVE WordPress site publishes,
 * joined against what this repo currently builds — into `scripts/inventory.json`.
 *
 *   npm run inventory
 *
 * This is the data behind the migration tracker artifact. It answers the one
 * question nothing else in this repo can: **what would 404 the day we cut over?**
 * At the time of writing that is 1,527 of 1,658 URLs.
 *
 * ⚠️ THIS WRITES NOTHING TO SANITY and has no Sanity client, exactly like
 * `faq-extract.ts`. Extraction and consumption are separate, with a reviewable
 * JSON between them.
 *
 * ── THE ONE RULE THIS FILE EXISTS TO ENFORCE ────────────────────────────────
 *
 * ANYTHING DERIVABLE IS DERIVED, NEVER TYPED. A hand-maintained "is it built?"
 * column is wrong the moment someone ships a page. That is not hypothetical:
 * `HANDOFF.md` announced "hp_community, four commits, NOT PUSHED" in bold, three
 * times, and was contradicted by a merge commit **51 seconds later**. It failed
 * structurally, not carelessly — a document cannot record its own push.
 *
 * So the tracker has two halves with opposite failure modes:
 *
 *   DERIVED (this file)      path, title, words, section, status, design, flags
 *                            → nobody can edit it, so it cannot drift
 *   STORED (the artifact db) the SEO team's decision + note
 *                            → no code change can contradict a human judgment
 *
 * If you find yourself adding a field a human has to keep current, it belongs in
 * the other half.
 *
 * ── WHY THE LIVE SITEMAPS AND NOT THE MIRROR ────────────────────────────────
 *
 * `~/Downloads/Cohen & Jaffe/Sitesucker/` is a good mirror (1,646 content pages
 * against the sitemap's 1,658) but it is a snapshot of a crawl, not a statement
 * of what Google is asked to index. The Yoast sitemaps are that statement, and
 * they are what an SEO team reasons about. AGENTS.md's "~217 URL folders" counts
 * TOP-LEVEL directories (210 actual); it is not the page count and has misled
 * every estimate on this project.
 *
 * The REST API supplies titles, word counts and dates for the same URLs. It is
 * fully open — no auth, no key — and returns `link` as an absolute URL, which is
 * why every join in this file goes through `normalizePath`.
 *
 * ── NORMALIZATION IS THE FAILURE MODE THAT WOULD COST A WEEK ────────────────
 *
 * ⚠️ `normalizePath` IS THE ONLY DEFINITION OF A ROW KEY, and the artifact page
 * carries a copy that must stay identical. The tracker's stored decisions are
 * keyed on it. If two runs normalize differently — scheme, host, trailing slash,
 * case, a `?page=2` — every key misses and the SEO team's entire decision set
 * renders as empty. Silent, total, and it looks like "the database is broken".
 *
 * That is why `main()` prints the join counts on every run. `0 matched` against a
 * populated store is the tripwire, and it fires in one second instead of a week.
 *
 * ⚠️ 65 of the 1,658 sitemap entries omit their trailing slash (`/defective-cars`,
 * `/cancer-malpractice-lawyers`, …). Their canonicals are all slashed and the
 * unslashed form 301s, so this is a Yoast defect on their side — NOT a
 * counter-example to the site's trailing-slash rule. We normalize them to the
 * slashed form, which is what is actually indexed.
 *
 * ── WHAT THIS DELIBERATELY DOES NOT COMPUTE ─────────────────────────────────
 *
 * No "thin content" flag, no priority, no effort estimate, no near-duplicate
 * detection. The user is the developer; the SEO team owns purge decisions and has
 * the traffic data we do not (there is no Search Console access). A word count is
 * evidence they can sort by. A "thin" badge is a verdict with a threshold baked
 * into it, and that threshold is theirs to set, not ours.
 *
 * The two flags that ARE emitted are mechanically provable and carry no judgment:
 * a count of URLs sharing a title, and a path matching a staging pattern.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://www.cohenjaffe.com";
const OUT = new URL("./inventory.json", import.meta.url);
const TEMPLATE = new URL("./tracker-template.html", import.meta.url);
const TRACKER = new URL("./tracker.html", import.meta.url);
const PLACEHOLDER = "/*__INVENTORY__*/";
const REPO = new URL("../", import.meta.url).pathname;

/**
 * The five Yoast sitemaps. The key becomes the row's `type`, which is a FACT
 * (which sitemap published this URL) rather than a bucket we invented — so it
 * can never disagree with its source.
 */
const SITEMAPS = ["post", "page", "attorney", "news", "location"] as const;
type SourceType = (typeof SITEMAPS)[number];

/** REST collections, keyed by the sitemap they correspond to. */
const REST_BASES: Partial<Record<SourceType, string>> = {
  post: "posts",
  page: "pages",
  attorney: "attorney",
  news: "news",
  location: "location",
};

/**
 * Design-board coverage. Maps a live URL to the artboard that designs it, in
 * `~/Downloads/Cohen & Jaffe/Claude Files/`.
 *
 * ⚠️ `CJ - Car Accidents.dc.html` DESIGNS ONE PAGE, NOT A TEMPLATE. It draws 23
 * bespoke sections for `/long-island-car-accident-lawyer/` — the 30-day clock,
 * the serious-injury threshold, insurer tactics, evidence, damages. The other 46
 * practice areas have NO DESIGN AT ALL; a lighter default practice-area layout
 * has to be drawn before they can be built, and it does not exist in any
 * artboard. Mapping this board across all 47 would report 46 pages as designed
 * when they are not, which is exactly the kind of quiet wrongness this file
 * exists to prevent.
 *
 * `design` therefore has THREE values, not two: "board" / "default" / "none".
 */
const DESIGN_BOARDS: Record<string, string> = {
  "/": "Cohen & Jaffe Homepage v1",
  "/about/": "CJ - About",
  "/about/attorneys/": "CJ - Attorneys",
  "/about/case-results/": "CJ - Case Results",
  "/about/our-community/": "CJ - Community",
  "/about/testimonials/": "CJ - Testimonials",
  "/areas-we-serve/": "CJ - Areas We Serve",
  "/blog/": "CJ - Blog",
  "/contact/": "CJ - Contact",
  "/faqs/": "CJ - FAQ",
  "/long-island-car-accident-lawyer/": "CJ - Car Accidents",
  "/practice-areas/": "CJ - Practice Areas",
  "/thank-you/": "CJ - Thank You",
  "/video-center/": "CJ - Video Center",
};

/** Path prefixes whose pages are drawn by a shared template board. */
const DESIGN_TEMPLATES: [prefix: string, board: string][] = [
  ["/about/attorneys/", "CJ - Attorney Bio"],
  ["/faqs/", "CJ - Blog Post"], // repurposed: no board draws the FAQ detail page
  ["/blog/", "CJ - Blog Post"],
];

/** Staging artefacts left public on the live site. A string match, not an opinion. */
const STAGING_RE = /(^\/lp-.*-preview\/$)|(-preview\/$)/;

// ── The row key ─────────────────────────────────────────────────────────────

/**
 * THE single definition of a row key. The artifact page carries an identical
 * copy — if you change one, change both, or every stored decision orphans.
 *
 * Absolute URL or bare path in; always `/lowercased/path/` out, with both
 * slashes, no host, no query, no hash.
 */
export function normalizePath(input: string): string {
  let p = input.trim();
  if (/^https?:\/\//i.test(p)) {
    try {
      p = new URL(p).pathname;
    } catch {
      /* fall through and treat it as a path */
    }
  }
  p = p.split("#")[0].split("?")[0].toLowerCase();
  if (!p.startsWith("/")) p = `/${p}`;
  if (!p.endsWith("/")) p = `${p}/`;
  return p.replace(/\/{2,}/g, "/");
}

/** First path segment, or "(home)" for `/`. */
function firstSegment(path: string): string {
  return path.split("/").filter(Boolean)[0] ?? "(home)";
}

/**
 * The section a row is filed under.
 *
 * ⚠️ A BARE FIRST SEGMENT IS NOT A SECTION. 249 of the 1,658 URLs sit at the
 * root (`/cancer-malpractice-lawyers/`, `/depo-provera-lawsuit/`, every city ×
 * practice-area combination), so keying on the first segment alone produced 259
 * "sections", 249 of which held exactly one URL. That is a filter nobody can use.
 *
 * So a first segment earns section status only when it is SHARED — which keeps
 * blog, news, areas-we-serve, faqs, es, about, resources and birth-injury, and
 * files the genuine one-offs under "root-level". Still mechanically derived, from
 * the URL set itself, so it cannot encode a judgment about what belongs together.
 */
function sectionOf(path: string, shared: Set<string>): string {
  const seg = firstSegment(path);
  if (seg === "(home)") return seg;
  return shared.has(seg) ? seg : "root-level";
}

// ── Fetch ───────────────────────────────────────────────────────────────────

const UA = { "User-Agent": "Mozilla/5.0 (compatible; CohenJaffeMigration/1.0)" };

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.text();
}

/**
 * ⚠️ Page 1 of some WordPress REST responses carries stray Elementor markup
 * before the array, so `res.json()` throws. `faq-extract.ts` hit this on the FAQ
 * endpoint. Read as text and slice from the first bracket.
 */
async function fetchJson<T>(url: string): Promise<T> {
  const raw = await fetchText(url);
  const start = raw.search(/[[{]/);
  return JSON.parse(start > 0 ? raw.slice(start) : raw) as T;
}

async function fetchSitemap(name: SourceType): Promise<string[]> {
  const xml = await fetchText(`${SITE}/${name}-sitemap.xml`);
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => normalizePath(m[1]));
}

interface WpItem {
  link?: string;
  date?: string;
  modified?: string;
  title?: { rendered?: string };
  content?: { rendered?: string };
}

interface Meta {
  title: string;
  words: number;
  published: string;
  modified: string;
}

async function fetchMeta(rest: string): Promise<Map<string, Meta>> {
  const out = new Map<string, Meta>();
  for (let page = 1; ; page++) {
    const url =
      `${SITE}/wp-json/wp/v2/${rest}?per_page=100&page=${page}` +
      `&_fields=link,date,modified,title,content`;
    let batch: WpItem[];
    try {
      batch = await fetchJson<WpItem[]>(url);
    } catch {
      break; // past the last page WordPress 400s
    }
    if (!Array.isArray(batch) || batch.length === 0) break;
    for (const item of batch) {
      if (!item.link) continue;
      const html = item.content?.rendered ?? "";
      out.set(normalizePath(item.link), {
        title: decodeEntities(stripTags(item.title?.rendered ?? "")).trim(),
        words: stripTags(html).split(/\s+/).filter(Boolean).length,
        published: (item.date ?? "").slice(0, 10),
        modified: (item.modified ?? "").slice(0, 10),
      });
    }
    if (batch.length < 100) break;
  }
  return out;
}

const stripTags = (html: string) => html.replace(/<[^>]*>/g, " ");

function decodeEntities(s: string): string {
  const named: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
    ndash: "–", mdash: "—", hellip: "…", eacute: "é",
  };
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m);
}

// ── The repo half ───────────────────────────────────────────────────────────

/**
 * What this repo actually builds.
 *
 * `dist/` is authoritative because it is the only thing that knows which slugs a
 * dynamic route produced — `/faqs/[slug].astro` is 180 pages that exist nowhere
 * in `src/pages/`. Falling back to `src/pages/` alone would silently report all
 * 180 as unbuilt, so the fallback is recorded in the JSON and printed loudly.
 */
function readBuilt(): { paths: Set<string>; source: "dist" | "src" } {
  const dist = join(REPO, "dist");
  if (existsSync(dist)) {
    const found = new Set<string>();
    const walk = (dir: string, rel: string) => {
      for (const entry of readdirSync(dir)) {
        const abs = join(dir, entry);
        if (statSync(abs).isDirectory()) walk(abs, `${rel}${entry}/`);
        else if (entry === "index.html") found.add(normalizePath(rel || "/"));
      }
    };
    walk(dist, "");
    found.delete(normalizePath("/admin/")); // the Studio, not a migrated page
    return { paths: found, source: "dist" };
  }

  const pages = join(REPO, "src", "pages");
  const found = new Set<string>();
  const walk = (dir: string, rel: string) => {
    for (const entry of readdirSync(dir)) {
      const abs = join(dir, entry);
      if (statSync(abs).isDirectory()) walk(abs, `${rel}${entry}/`);
      else if (/\.(astro|md|mdx|html)$/.test(entry) && !entry.includes("[")) {
        const base = entry.replace(/\.(astro|md|mdx|html)$/, "");
        found.add(normalizePath(base === "index" ? rel || "/" : `${rel}${base}/`));
      }
    }
  };
  walk(pages, "");
  return { paths: found, source: "src" };
}

interface Redirect {
  source: string;
  destination: string;
}

function readRedirects(): Redirect[] {
  const vercel = JSON.parse(readFileSync(join(REPO, "vercel.json"), "utf8"));
  return (vercel.redirects ?? []) as Redirect[];
}

/** Match a path against vercel.json's `:param` syntax. Returns the destination, or null. */
function matchRedirect(path: string, redirects: Redirect[]): string | null {
  for (const r of redirects) {
    const src = normalizePath(r.source);
    if (!src.includes(":")) {
      if (src === path) return r.destination;
      continue;
    }
    const re = new RegExp(`^${src.replace(/:[a-z]+\*?/gi, "[^/]+")}$`, "i");
    if (re.test(path)) return r.destination;
  }
  return null;
}

// ── Main ────────────────────────────────────────────────────────────────────

interface Row {
  path: string;
  type: SourceType;
  section: string;
  title: string;
  words: number;
  published: string;
  modified: string;
  status: "built" | "redirected" | "not-built";
  redirectTo: string | null;
  design: "board" | "default" | "none";
  designBoard: string | null;
  flags: string[];
}

async function main() {
  // ── Source: the live sitemaps ────────────────────────────────────────────
  const byType = new Map<string, SourceType>();
  const counts: Record<string, number> = {};
  for (const name of SITEMAPS) {
    const paths = await fetchSitemap(name);
    counts[name] = paths.length;
    // First sitemap to claim a URL wins; overlap is rare and the order is stable.
    for (const p of paths) if (!byType.has(p)) byType.set(p, name);
    if (paths.length === 0) {
      throw new Error(`${name}-sitemap.xml returned 0 URLs — the source shape changed. Check it by hand before trusting this run.`);
    }
  }
  const total = byType.size;
  if (total < 1500) {
    throw new Error(`Only ${total} unique URLs across all sitemaps; expected ~1,658. Refusing to write a truncated inventory.`);
  }

  // ── Source: the REST API, for titles and word counts ──────────────────────
  const meta = new Map<string, Meta>();
  for (const [type, rest] of Object.entries(REST_BASES)) {
    const m = await fetchMeta(rest!);
    for (const [k, v] of m) if (!meta.has(k)) meta.set(k, v);
    counts[`rest:${type}`] = m.size;
  }

  // ── The repo half ─────────────────────────────────────────────────────────
  const built = readBuilt();
  const redirects = readRedirects();

  // ── Which first segments are shared, and therefore real sections ──────────
  const segCounts = new Map<string, number>();
  for (const p of byType.keys()) {
    const s = firstSegment(p);
    segCounts.set(s, (segCounts.get(s) ?? 0) + 1);
  }
  const sharedSegments = new Set([...segCounts].filter(([, n]) => n > 1).map(([s]) => s));

  // ── Titles shared across URLs — a count, never a verdict ──────────────────
  const titleCounts = new Map<string, number>();
  for (const p of byType.keys()) {
    const t = meta.get(p)?.title;
    if (t) titleCounts.set(t, (titleCounts.get(t) ?? 0) + 1);
  }

  const rows: Row[] = [...byType.keys()].sort().map((path) => {
    const m = meta.get(path);
    const redirectTo = matchRedirect(path, redirects);
    const status: Row["status"] = built.paths.has(path)
      ? "built"
      : redirectTo
        ? "redirected"
        : "not-built";

    let design: Row["design"] = "none";
    let designBoard: string | null = DESIGN_BOARDS[path] ?? null;
    if (designBoard) design = "board";
    else {
      const tpl = DESIGN_TEMPLATES.find(([pre]) => path.startsWith(pre) && path !== pre);
      if (tpl) {
        design = "default";
        designBoard = tpl[1];
      }
    }

    const flags: string[] = [];
    const shared = m?.title ? (titleCounts.get(m.title) ?? 0) : 0;
    if (shared > 1) flags.push(`shares-title-with-${shared - 1}`);
    if (STAGING_RE.test(path)) flags.push("staging-artifact");

    return {
      path,
      type: byType.get(path)!,
      section: sectionOf(path, sharedSegments),
      title: m?.title ?? "",
      words: m?.words ?? 0,
      published: m?.published ?? "",
      modified: m?.modified ?? "",
      status,
      redirectTo,
      design,
      designBoard,
      flags,
    };
  });

  // ── Coverage, by section ──────────────────────────────────────────────────
  const bySection = new Map<string, { live: number; built: number; redirected: number; notBuilt: number }>();
  for (const r of rows) {
    const s = bySection.get(r.section) ?? { live: 0, built: 0, redirected: 0, notBuilt: 0 };
    s.live++;
    if (r.status === "built") s.built++;
    else if (r.status === "redirected") s.redirected++;
    else s.notBuilt++;
    bySection.set(r.section, s);
  }

  const coverage = {
    live: rows.length,
    built: rows.filter((r) => r.status === "built").length,
    redirected: rows.filter((r) => r.status === "redirected").length,
    notBuilt: rows.filter((r) => r.status === "not-built").length,
  };

  const payload = {
    generated: new Date().toISOString(),
    site: SITE,
    builtFrom: built.source,
    sourceCounts: counts,
    coverage,
    bySection: Object.fromEntries([...bySection].sort((a, b) => b[1].live - a[1].live)),
    rows,
  };

  writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);

  /**
   * The publishable tracker page: the template with the inventory injected.
   *
   * The inventory is DERIVED data, so it ships inside the artifact version that
   * derived it — republishing IS the refresh. Nothing about the inventory lives
   * in the artifact's database, which holds only the SEO team's decisions.
   *
   * ⚠️ The row TUPLE ORDER below is destructured by name in the page's script.
   * Change one and change the other, or every column shifts by one silently.
   */
  const compact = {
    g: payload.generated,
    src: payload.builtFrom,
    c: payload.coverage,
    s: payload.bySection,
    r: rows.map((r) => [
      r.path, r.title, r.words, r.type, r.section,
      r.status, r.redirectTo, r.design, r.designBoard, r.published, r.flags,
    ]),
  };
  const template = readFileSync(TEMPLATE, "utf8");
  if (!template.includes(PLACEHOLDER)) {
    throw new Error(`${PLACEHOLDER} not found in tracker-template.html — nothing would be injected.`);
  }
  const html = template.replace(
    PLACEHOLDER,
    // `<` is escaped so a title containing "</script>" cannot close the block early.
    JSON.stringify(compact).replace(/</g, "\\u003c"),
  );
  writeFileSync(TRACKER, html);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n  ${rows.length} live URLs\n`);
  console.log(`  built        ${String(coverage.built).padStart(5)}`);
  console.log(`  redirected   ${String(coverage.redirected).padStart(5)}`);
  console.log(`  NOT BUILT    ${String(coverage.notBuilt).padStart(5)}  ← would 404 at launch\n`);
  console.log(`  ${"section".padEnd(18)} ${"live".padStart(5)} ${"built".padStart(6)} ${"redir".padStart(6)} ${"404".padStart(6)}`);
  for (const [name, s] of [...bySection].sort((a, b) => b[1].live - a[1].live)) {
    console.log(
      `  ${name.padEnd(18)} ${String(s.live).padStart(5)} ${String(s.built).padStart(6)} ` +
        `${String(s.redirected).padStart(6)} ${String(s.notBuilt).padStart(6)}`,
    );
  }
  /**
   * ⚠️ FIVE URLs LEGITIMATELY HAVE NO TITLE, and this is not a join failure —
   * it was checked. `/news/` is an archive with no post behind it, and the four
   * `location` documents (`/news/hempstead/` etc.) are a custom post type that
   * does not expose `title` through REST at all: request it and the field simply
   * is not in the response. No title is invented for them; the tracker renders
   * the path instead. If this count ever climbs, suspect `normalizePath` before
   * anything else.
   */
  const noMeta = rows.filter((r) => !r.title).length;
  console.log(`\n  design: board ${rows.filter((r) => r.design === "board").length} · default ${rows.filter((r) => r.design === "default").length} · none ${rows.filter((r) => r.design === "none").length}`);
  console.log(`  flags:  shared-title ${rows.filter((r) => r.flags.some((f) => f.startsWith("shares-title"))).length} · staging ${rows.filter((r) => r.flags.includes("staging-artifact")).length}`);
  if (noMeta !== 5) {
    console.log(`  ⚠️  ${noMeta} URLs have no title (expected 5: /news/ + 4 location hubs).`);
    console.log(`      A jump here usually means normalizePath drifted — check the join before trusting this run.`);
  }
  if (built.source === "src") {
    console.log(`\n  ⚠️  NO dist/ — built status came from src/pages/ and MISSES every dynamic route.`);
    console.log(`      Run 'npm run build' and re-run this for an accurate count.`);
  }
  console.log(`\n  → scripts/inventory.json`);
  console.log(`  → scripts/tracker.html  (publish this)\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
