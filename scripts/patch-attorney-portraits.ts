/**
 * Frames the two homepage portraits that were never framed, and attaches a DEMO
 * video to one attorney.
 *
 *   npx sanity exec scripts/patch-attorney-portraits.ts --with-user-token
 *
 * Idempotent — it writes fixed values — and deliberately a `patch` rather than a
 * re-run of `seed-attorneys.ts`: that seed is `createOrReplace` and would revert
 * the role titles the firm has since edited in the Studio.
 *
 * ── WHY THE PORTRAITS WERE CUT OFF ──────────────────────────────────────────
 *
 * All six portraits are the same studio shoot at 720x1280 — a 9:16 frame with
 * the subject's head in the upper third. The homepage card crops them SQUARE,
 * and `seed-attorneys.ts` uploads them with no hotspot and no crop, so Sanity
 * fell back to its default: the centre of the image. On a 9:16 source the centre
 * is roughly chest height, so a 720x720 square taken around it ran from y≈280 to
 * y≈1000, and every head — which starts around y≈200 — was cut by the top edge.
 *
 * Cohen and Parnell already had a crop and hotspot set by hand in the Studio,
 * which is exactly why Cohen's card looked right while Tiger's did not. Those
 * two are never touched here.
 *
 * ── WHY BOTH A CROP AND A HOTSPOT, AND NOT JUST A HOTSPOT ───────────────────
 *
 * A hotspot only POSITIONS the crop; it cannot zoom. Setting one alone fixed the
 * cut heads but left Jaffe and Tiger visibly further away than Cohen, because
 * his hand-set crop trims the frame to 675x1018 and every square taken from it
 * is therefore 675px rather than 720px — a ~7% tighter shot. Three portraits at
 * two different magnifications read as a mistake even when each is well framed
 * on its own.
 *
 * So these two get the SAME crop Cohen has, then a hotspot to place the square
 * inside it. The crop is deliberately loose — it leaves a 675x1018 region, which
 * still serves the 3:4 bio hero and the 4:5 listing card. **Do not tighten it to
 * the square**: `attorney.portrait` is one photograph feeding every crop on the
 * site, and baking this card's ratio into the document would break the others.
 *
 * The hotspot y is measured, not guessed. A square from the cropped region is
 * 675px tall; placing its top at the crop's own top edge (y=75 in original
 * coordinates) gives Jaffe 139px of headroom above the head and Tiger 121px,
 * against Cohen's 142px. The centre of that square is (75 + 750) / 2 = 412.5,
 * or 0.3223 of the source height — the same for both, because the clamp to the
 * crop's top edge is what decides it.
 *
 * ⚠️ McNAUGHTON AND SAWICKI STILL HAVE NEITHER. They are not on the homepage so
 * nothing renders them yet, and the same square crop will cut them the day
 * `/about/attorneys/` is built. Either extend this script or set them by eye in
 * the Studio, which is the better tool for it.
 *
 * ── ⚠️ THE VIDEO IS A PLACEHOLDER ───────────────────────────────────────────
 *
 * Richard Jaffe gets `c6b0eghb5r` so the play button and the lightbox can be
 * seen and clicked. **IT IS NOT HIS VIDEO.** It is the firm's one Wistia upload,
 * a general attorney explainer, and it is ALREADY standing in as a placeholder
 * on the first case-result card, the "Our goals" video card and all four video
 * reviews. Nothing in the dataset marks it as placeholder — this docblock and
 * HANDOFF.md are the whole record.
 *
 * **Unset it before launch, or replace it with his own film.** A play button on
 * a named attorney's portrait is a promise that the video is of that attorney.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

/**
 * Cohen's hand-set crop, reused verbatim. Trims the empty right edge and the
 * dead space above the head and below the hands, and nothing else.
 */
const CROP = {
  _type: "sanity.imageCrop",
  top: 0.05863035502011704,
  bottom: 0.14582685625457206,
  left: 0,
  right: 0.06256089602770616,
};

/** See the docblock: the square clamps to the crop's top edge for both. */
const HOTSPOT = {
  _type: "sanity.imageHotspot",
  x: 0.5,
  y: 0.3223,
  width: 0.6,
  height: 0.4,
};

/**
 * ⚠️ ONLY THESE TWO. Cohen and Parnell were framed by hand in the Studio and
 * must not be overwritten — that is the whole reason this is a patch.
 */
const FRAME = ["attorney-richard-jaffe", "attorney-stephen-tiger"];

const DEMO_VIDEO = { id: "attorney-richard-jaffe", wistiaId: "c6b0eghb5r" };

async function main() {
  for (const id of FRAME) {
    await client
      .patch(id)
      .set({ "portrait.crop": CROP, "portrait.hotspot": HOTSPOT })
      .commit();
    console.log(`  ${id}: framed — crop + hotspot y=${HOTSPOT.y}`);
  }

  await client.patch(DEMO_VIDEO.id).set({ wistiaId: DEMO_VIDEO.wistiaId }).commit();
  console.log(
    `  ${DEMO_VIDEO.id}: DEMO wistiaId ${DEMO_VIDEO.wistiaId} — placeholder, remove before launch`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
