const typeFunctions: Record<string, (types: string) => string> = {
  react: (types) => `import "react";

declare module "react" {
  export interface Attributes {
    ${types}
  }
}`,
  preact: (types) => `import "preact";

declare module "preact" {
  namespace JSX {
    interface HTMLAttributes {
      ${types}
    }
  }
}`,
  svelte: (types) => `declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    ${types}
  }
}`,
  astro: (types) => `declare namespace astroHTML.JSX {
  export interface AstroBuiltinAttributes {
    ${types}
  }
}`,
};

export default typeFunctions;
