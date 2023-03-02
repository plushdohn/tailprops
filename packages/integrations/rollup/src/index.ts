import type { TransformHook } from "rollup";
import {
  transpileUsingAstroTemplateLiterals,
  transpileUsingAttributeAdditionFunction,
  transpileUsingSvelteTemplateLiterals,
} from "tailprops";
import { TailpropsPluginOptions } from "./types";

export function tailpropsPlugin(options: TailpropsPluginOptions) {
  const frameworks = Array.isArray(options.framework)
    ? options.framework
    : [options.framework];

  const transform: TransformHook = function (code, id) {
    const context = this.meta;

    if (frameworks.includes("svelte-ssr")) {
      if (id.endsWith(".svelte")) {
        code = transpileUsingSvelteTemplateLiterals(code);

        return transpileUsingAttributeAdditionFunction(code, {
          attributeFunctionId: context.watchMode ? "attr_dev" : "attr",
          classAttributeKeyword: "class",
        }).code;
      }

      return null;
    } else if (frameworks.includes("astro")) {
      if (id.endsWith(".astro")) {
        return transpileUsingAstroTemplateLiterals(code, {
          attributeFunctionId: "$$addAttribute",
          classAttributeKeyword: "class",
        });
      }

      return null;
    }

    throw new Error(
      `Framework '${options.framework}' is not supported by the Tailprops Rollup plugin. If you think it's horribly bad that we don't support this framework, please open an issue on GitHub.`
    );
  };

  return {
    name: "tailprops",
    transform,
  };
}
