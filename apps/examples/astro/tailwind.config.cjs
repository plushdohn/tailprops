const { withTailprops } = require("tailprops");

/** @type {import('tailwindcss').Config} */
module.exports = withTailprops(["astro"], {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [],
});
