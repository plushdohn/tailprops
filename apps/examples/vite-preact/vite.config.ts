import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { tailpropsPlugin } from "rollup-plugin-tailprops";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), tailpropsPlugin({ framework: "preact" })],
});
