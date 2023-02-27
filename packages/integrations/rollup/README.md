# rollup-plugin-tailprops

**rollup-plugin-tailprops** is the Rollup/Vite integration for the Tailprops library.

## Current framework support

| Framework | Supported |
| --------- | --------- |
| SvelteKit | ✅        |
| Svelte    | 🚧        |
| React     | 🚧        |

## Installation

Install Tailprops and the Rollup plugin as dev dependencies:

```bash
npm install -D tailprops rollup-plugin-tailprops
```

Then, add the plugin to your `vite.config.ts`:

```ts
// vite.config.ts

import { defineConfig } from "vite";
import { tailpropsPlugin } from "rollup-plugin-tailprops";

export default defineConfig({
  plugins: [
    // ...
    tailpropsPlugin({ framework: "svelte-ssr" }), // Add tailprops to your plugins
  ],
});
```

Lastly, add typings and the Tailwind transform by running:

```bash
npx tailprops init svelte
```
