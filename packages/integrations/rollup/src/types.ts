import { AstroIntegration } from "./handlers/astro";

type FrameworkOptions =
  | {
      framework: "svelte-ssr" | "react";
    }
  | {
      framework: "astro";
      integrations?: AstroIntegration[];
    }
  | {
      framework: "preact";
      classAttribute?: string;
    };

export type TailpropsPluginOptions = FrameworkOptions & {
  debug?: boolean;
};
