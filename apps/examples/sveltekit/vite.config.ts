import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { tailpropsPlugin } from "rollup-plugin-tailprops";

export default defineConfig({
  plugins: [sveltekit(), tailpropsPlugin({ framework: "svelte-ssr" })],
});
