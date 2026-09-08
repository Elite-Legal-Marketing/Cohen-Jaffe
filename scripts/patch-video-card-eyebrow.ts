/**
 * Strip the typed duration out of the "Our goals" video card's eyebrow.
 *
 *   npx sanity exec scripts/patch-video-card-eyebrow.ts --with-user-token
 *
 * ── WHY ───────────────────────────────────────────────────────────────────
 *
 * `videoCard.eyebrow` was seeded as the whole string "Watch · 2 min". The video
 * it labels is `c6b0eghb5r`, which runs 166.875 seconds — 2:47. The typed figure
 * was simply wrong, and there was no way for whoever typed it to know: the
 * length is a property of the file, not of the copy.
 *
 * Durations are now read from Wistia's oEmbed endpoint at build time and
 * appended to this label — see `src/lib/wistia.ts` — so the field holds the
 * LABEL only. Left as it is, the card would render "Watch · 2 min · 2:47".
 *
 * ⚠️ THIS WRITES TO THE PRODUCTION DATASET, which fires the deploy hook.
 *
 * ── SAFETY ────────────────────────────────────────────────────────────────
 *
 * Conservative in the same way `patch-practice-area-link-labels.ts` is: it reads
 * the current value first and writes only when it is exactly the string this
 * script was written to replace. Anything else — already patched, or edited in
 * the Studio since — is reported and skipped rather than overwritten, because an
 * editor's wording is not this script's to discard.
 *
 * A dotted path is used with `set`, which is safe. `unset` is the one that
 * silently matches nothing on an array path.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const PATH = "about.video.eyebrow";
const EXPECTED = "Watch · 2 min";
const REPLACEMENT = "Watch";

async function main() {
  const current = await client.fetch<string | null>(`*[_id == "homePage"][0].${PATH}`);

  if (current === null || current === undefined) {
    console.log(`No ${PATH} on homePage — nothing to patch.`);
    return;
  }

  if (current === REPLACEMENT) {
    console.log(`Already "${REPLACEMENT}" — nothing to do.`);
    return;
  }

  if (current !== EXPECTED) {
    console.log(
      `Skipping: ${PATH} is "${current}", which is neither the expected\n` +
        `"${EXPECTED}" nor the replacement "${REPLACEMENT}". Someone has edited it.\n` +
        `If the length is still typed in there, remove it by hand — the build appends\n` +
        `the real one.`,
    );
    return;
  }

  await client.patch("homePage").set({ [PATH]: REPLACEMENT }).commit();
  console.log(`Patched ${PATH}: "${EXPECTED}" → "${REPLACEMENT}".`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
