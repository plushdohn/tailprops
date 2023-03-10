const { withTailprops } = require("tailprops");

/** @type {import('tailwindcss').Config} */
module.exports = withTailprops({
  content: ["./src/**/*.svelte"],
  theme: {
    extend: {},
  },
  plugins: [],
});
