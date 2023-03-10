import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { tailpropsPlugin } from "rollup-plugin-tailprops";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  vite: {
    plugins: [
      tailpropsPlugin({
        framework: "astro",
        integrations: ["react"],
      }),
    ],
  },
});
