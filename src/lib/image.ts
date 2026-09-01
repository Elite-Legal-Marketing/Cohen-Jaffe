import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "sanity:client";

const builder = createImageUrlBuilder(sanityClient);

/**
 * Build a Sanity image URL.
 *
 * Always chain `.width()` (or `.height()`): without one Sanity serves the
 * original asset, which for the hero photography here means multi-megabyte
 * PNGs. `.auto("format")` lets the CDN negotiate WebP/AVIF per browser.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

/**
 * A `srcset` across the widths a full-bleed image actually gets rendered at,
 * so the browser can pick rather than always taking the largest.
 */
export function srcSet(source: SanityImageSource, widths: number[]): string {
  return widths.map((w) => `${urlFor(source).width(w).url()} ${w}w`).join(", ");
}
