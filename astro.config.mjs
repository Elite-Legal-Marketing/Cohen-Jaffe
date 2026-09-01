// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";
import react from "@astrojs/react";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  ""
);

// https://astro.build/config
export default defineConfig({
  // The firm's existing WordPress URLs are all slash-terminated: every one of the 2262
  // unique og:url values in the site mirror ends in "/", and the live site 301s the
  // unslashed form to the slashed one. Match what is already indexed.
  //
  // This must agree with `trailingSlash: true` in vercel.json, and with the canonical
  // form used by the SEO layer later. Keep the *comparison* form used for nav
  // active-state separate from the canonical form, or normalising for display silently
  // changes what a link matches against — that removed `aria-current` from every nav
  // item on a sibling site with no error anywhere.
  trailingSlash: "always",
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
      studioBasePath: "/admin",
    }),
    react(),
  ],
  build: {
    // Inline all CSS into the HTML. Astro's default only inlines chunks under
    // 4 kB, which leaves a content-rich page shipping render-blocking
    // <link rel="stylesheet"> tags. On a fully static marketing site the CSS
    // is better off riding inside the already-compressed HTML.
    inlineStylesheets: "always",
  },
});
