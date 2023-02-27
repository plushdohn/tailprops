export default {
    react: {
        typesCode: `import "react";

declare module "react" {
  export interface Attributes {
    tw?: string;
    [key: \`tw-\${string}\`]: string;
  }
}`,
        extensions: ["tsx", "jsx"],
    },
    preact: {
        typesCode: `import "preact";

declare module "preact" {
  namespace JSX {
    interface HTMLAttributes {
      tw?: string;
      [key: \`tw-\${string}\`]: string;
    }
  }
}`,
        extensions: ["tsx", "jsx"],
    },
    svelte: {
        typesCode: `declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    tw?: string;
    [key: \`tw-\${string}\`]: string;
  }
}`,
        extensions: ["svelte"],
    },
};
//# sourceMappingURL=frameworks.js.map