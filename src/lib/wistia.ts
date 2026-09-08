/**
 * A video's real running time, read from the video itself at build time.
 *
 * Durations used to be TYPED IN — `videoCard.eyebrow` held the literal string
 * "Watch · 2 min" and the reviews band carried a `duration` field beside the
 * Wistia id. Both were wrong about the same video: `c6b0eghb5r` runs 2:47, and
 * neither the editor nor the artboard had any way to know that. A number that
 * describes a file, and that nobody can verify while typing it, should not be
 * typed at all — so there is no duration field anywhere any more, and the one
 * source of truth is the video.
 *
 * Wistia's oEmbed endpoint is public — no key, no account — and returns
 * `duration` in seconds, so this needs nothing in `.env` and nothing in Vercel.
 *
 * ⚠️ THIS RUNS AT BUILD TIME AND MUST NEVER THROW. A static build that dies
 * because a third party timed out is a far worse failure than a card missing
 * three characters, so every error path returns `null` and the component
 * renders nothing — the same "empty renders nothing" rule the schema follows.
 * The request carries its own timeout, because `fetch` has none by default and
 * a hung socket would otherwise hang the build indefinitely.
 *
 * The PROMISE is cached per id, not the result, so a page drawing the same
 * video twice — or two components asking at once — shares one request rather
 * than racing. Same reasoning as `getFirm()`, same build-length lifetime.
 */

const OEMBED = "https://fast.wistia.com/oembed";
const TIMEOUT_MS = 5000;

const cache = new Map<string, Promise<string | null>>();

/**
 * `166.875` → `"2:47"`.
 *
 * ROUNDED to the nearest second, not floored. Flooring is defensible in the
 * abstract — the video has not reached 2:47 yet — but it renders 2:46 for a file
 * that YouTube, and the firm's own video manifest, both call 2:47. A duration
 * that disagrees with every other display of the same video is the bug this
 * whole module exists to fix, so it matches the convention.
 */
function format(seconds: number): string | null {
  if (!Number.isFinite(seconds) || seconds < 1) return null;
  const whole = Math.round(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}

async function fetchDuration(wistiaId: string): Promise<string | null> {
  try {
    const url = `${OEMBED}?url=${encodeURIComponent(
      `https://home.wistia.com/medias/${wistiaId}`,
    )}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    // A wrong or unpublished id answers 404 here, which is the common case
    // while the firm's 81 videos are still being uploaded.
    if (!response.ok) return null;
    const data: unknown = await response.json();
    const duration = (data as { duration?: unknown })?.duration;
    return typeof duration === "number" ? format(duration) : null;
  } catch {
    // Network, DNS, timeout, malformed JSON. All of them mean the same thing
    // to the caller, and none of them may take the build down.
    return null;
  }
}

/**
 * `"c6b0eghb5r"` → `"2:47"`, or `null` if the video cannot be reached.
 *
 * Callers render nothing for `null` — never a placeholder and never a guess.
 */
export function videoDuration(wistiaId: string | null | undefined): Promise<string | null> {
  if (!wistiaId) return Promise.resolve(null);
  let pending = cache.get(wistiaId);
  if (!pending) {
    pending = fetchDuration(wistiaId);
    cache.set(wistiaId, pending);
  }
  return pending;
}
