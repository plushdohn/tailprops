const { withTailprops } = require("tailprops");

/** @type {import('tailwindcss').Config} */
module.exports = withTailprops("svelte", {
  content: ["./src/**/*.svelte"],
  theme: {
    extend: {},
  },
  plugins: [],
});
