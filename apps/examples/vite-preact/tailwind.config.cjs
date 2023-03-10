const { withTailprops } = require("tailprops");
module.exports = withTailprops({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});
