/**
 * Seed the Reviews collection and the homepage testimonials band.
 *
 *   npx sanity exec scripts/seed-home-reviews.ts --with-user-token
 *
 * Idempotent for the documents (`createOrReplace` on fixed hyphenated ids), and
 * guarded for the homepage band — it refuses to overwrite `homePage.reviews`
 * unless `SEED_OVERWRITE=1`, so a re-run cannot silently discard an editor's
 * running order.
 *
 * ⚠️ `createOrReplace` DISCARDS Studio edits to these documents. To change one
 * review, patch it — do not re-run this.
 *
 * ── ⚠️ PROVENANCE: MOST OF THIS IS PLACEHOLDER COPY ───────────────────────
 *
 * Content comes from `CJ - Testimonials.dc.html` on the client's instruction
 * (2026-09-08), to populate the collection while the real reviews are gathered.
 * Of the 21 written reviews, THREE are real and eighteen are the artboard's
 * illustrative copy. All four video reviews are illustrative.
 *
 * The three real ones — Howard, Menache R., Patty R. — are the reviews the live
 * WordPress homepage publishes, and their text here is VERBATIM FROM THE LIVE
 * SITE, not the artboard's version. The artboard keeps their real names but
 * lightly rewrites their words and adds towns ("New Hyde Park", "Great Neck",
 * "Mineola") that appear in no source. Those towns are dropped and `location` is
 * empty on all three; the real text is used instead of the rewrite. NY Rule
 * 7.1(e)(1) requires a testimonial to be factually verifiable, and putting
 * edited sentences in a named client's mouth fails that.
 *
 * ⚠️ EVERYTHING ELSE IS PLACEHOLDER COPY AND MUST BE REPLACED BEFORE LAUNCH.
 * Nothing in the dataset distinguishes it — the record is this file and
 * HANDOFF.md, the same as for the four invented featured case results.
 *
 * The four video reviews all point at `c6b0eghb5r` because it is the only thing
 * the firm has on Wistia, and it is an attorney explainer, not a client story.
 * Every video card therefore shows the same 2:47 running time.
 *
 * ── COVER IMAGES ──────────────────────────────────────────────────────────
 *
 * Read from the design folder rather than `src/assets`, deliberately: these are
 * four placeholder photographs totalling ~4.8 MB that get deleted with the
 * documents, and committing them to the repo to seed once would be worse. The
 * design files live outside the repo — see AGENTS.md → "Where designs and
 * content come from". Sanity dedupes uploads by content hash, so a re-run
 * reuses the existing asset rather than littering the media library.
 */
import { getCliClient } from "sanity/cli";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const client = getCliClient();
const here = dirname(fileURLToPath(import.meta.url));
const DESIGN_ASSETS = resolve(homedir(), "Downloads/Cohen & Jaffe/Claude Files/assets");

interface VideoSeed {
  id: string;
  file: string;
  clientName: string;
  location: string | null;
  caseType: string | null;
  headline: string;
  wistiaId: string;
}

interface ReviewSeed {
  id: string;
  author: string;
  location: string | null;
  caseType: string | null;
  quote: string;
}

const { videos, reviews } = JSON.parse(
  readFileSync(resolve(here, "reviews.json"), "utf8"),
) as { videos: VideoSeed[]; reviews: ReviewSeed[] };

/**
 * The band's own running order: three real reviews with one video between them,
 * which is the arrangement the design was approved against. Four fit the row
 * without scrolling, so the arrows stay hidden and the button stays centred.
 */
const ON_HOMEPAGE = [
  "review-howard-new-hyde-park",
  "video-review-maria-r-hempstead",
  "review-menache-r-great-neck",
  "review-patty-r-mineola",
];

const SECTION = {
  _type: "reviewsSection",
  eyebrow: "Client reviews",
  heading: "Bringing results to our clients",
  lead: "Hear it from Long Islanders who were where you are right now — in their own words, and in their own voices.",
  cta: { _type: "ctaLink", label: "Read all reviews", href: "/about/testimonials/" },
  reviews: ON_HOMEPAGE.map((id) => ({
    _type: "reference",
    _key: id,
    _ref: id,
  })),
};

/** Reuses the uploaded asset when the document already has one. */
async function posterFor(seed: VideoSeed): Promise<string> {
  const existing = await client.fetch<{ assetId?: string } | null>(
    `*[_id == $id][0]{ "assetId": poster.asset._ref }`,
    { id: seed.id },
  );
  if (existing?.assetId) {
    console.log(`  ${seed.id}: reusing asset ${existing.assetId}`);
    return existing.assetId;
  }
  const path = resolve(DESIGN_ASSETS, seed.file);
  if (!existsSync(path)) {
    throw new Error(
      `Cover not found: ${path}\n` +
        `The design folder is an additional working directory outside the repo. An EPERM\n` +
        `here is macOS blocking ~/Downloads — Full Disk Access fixes it after a restart.`,
    );
  }
  const asset = await client.assets.upload("image", createReadStream(path), {
    filename: seed.file,
  });
  console.log(`  ${seed.id}: uploaded ${asset._id}`);
  return asset._id;
}

async function main() {
  console.log(`Video reviews (${videos.length}):`);
  for (const seed of videos) {
    const assetId = await posterFor(seed);
    await client.createOrReplace({
      _id: seed.id,
      _type: "videoReview",
      clientName: seed.clientName,
      headline: seed.headline,
      wistiaId: seed.wistiaId,
      ...(seed.location ? { location: seed.location } : {}),
      ...(seed.caseType ? { caseType: seed.caseType } : {}),
      poster: { _type: "image", asset: { _type: "reference", _ref: assetId }, alt: "" },
    });
  }

  console.log(`Reviews (${reviews.length}):`);
  const tx = client.transaction();
  for (const seed of reviews) {
    tx.createOrReplace({
      _id: seed.id,
      _type: "review",
      author: seed.author,
      quote: seed.quote,
      ...(seed.location ? { location: seed.location } : {}),
      ...(seed.caseType ? { caseType: seed.caseType } : {}),
    });
  }
  await tx.commit();
  console.log(`  ${reviews.length} written reviews.`);

  // The band itself. `createIfNotExists` then `patch().set()` — NEVER
  // `createOrReplace` on the homepage singleton, which would drop every other
  // section on it.
  const existing = await client.fetch<boolean>(`defined(*[_id == "homePage"][0].reviews)`);
  if (existing && process.env.SEED_OVERWRITE !== "1") {
    console.log(
      "\nhomePage.reviews already exists — refusing to overwrite the running order.\n" +
        "Re-run with SEED_OVERWRITE=1 if replacing it is what you want.",
    );
    return;
  }
  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client.patch("homePage").set({ reviews: SECTION }).commit();
  console.log(`\nDone — homepage band set with ${SECTION.reviews.length} reviews.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
