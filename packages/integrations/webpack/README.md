# tailprops-webpack-plugin

**tailprops-webpack-plugin** is the Webpack integration for the Tailprops library.

---

## Current framework support

| Framework | Supported |
| --------- | --------- |
| React     | ✅        |
| Preact    | ✅        |
| Svelte    | 🚧        |

## Installation

Install Tailprops and the Webpack plugin as dev dependencies:

```bash
npm install -D tailprops tailprops-webpack-plugin
```

Then, add the plugin to your `webpack.config.js`:

```js
// webpack.config.js
const { TailpropsWebpackPlugin } = require("tailprops-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    // ...
    new TailpropsWebpackPlugin(), // Add tailprops to your plugins
  ],
};
```

Lastly, add typings and the Tailwind transform by running:

```bash
npx tailprops init react # or preact
```
