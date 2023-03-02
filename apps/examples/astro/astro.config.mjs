import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";
import { tailpropsPlugin } from "rollup-plugin-tailprops";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    plugins: [tailpropsPlugin({ framework: "astro" })],
  },
});
