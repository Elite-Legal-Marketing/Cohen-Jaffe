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
