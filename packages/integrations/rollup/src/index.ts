import type { SourceDescription, TransformHook } from "rollup";
import { handleAstro } from "./handlers/astro";
import { handlePreact } from "./handlers/preact";
import { handleReact } from "./handlers/react";
import { handleSvelteSsr } from "./handlers/svelteSsr";
import { TailpropsPluginOptions } from "./types";

export function tailpropsPlugin(options: TailpropsPluginOptions) {
  const transform: TransformHook = function (code, id) {
    const context = this.meta;

    let out: Partial<SourceDescription> | null | undefined;

    if (options.framework === "svelte-ssr") {
      out = handleSvelteSsr({ code, id }, { ssr: context.watchMode });
    } else if (options.framework === "astro") {
      out = handleAstro({ code, id }, { integrations: options.integrations });
    } else if (options.framework === "react") {
      out = handleReact({ code, id });
    } else if (options.framework === "preact") {
      out = handlePreact(
        { code, id },
        { classAttribute: options.classAttribute }
      );
    }

    if (out === undefined) {
      throw new Error(
        `Framework not supported by the Tailprops Rollup plugin. If you think it's horribly bad that we don't support this framework, please open an issue on GitHub.`
      );
    }

    if (out === null) return null;

    return {
      ...out,
      map: this.getCombinedSourcemap() ? out.map : null,
      ast: undefined, // Can't reuse babel ASTs
    };
  };

  return {
    name: "tailprops",
    transform,
  };
}
