import { transpileUsingAstroTemplateLiterals } from "tailprops";
import { handlePreact } from "./preact";
import { handleReact } from "./react";

type AstroReactIntegration = {
  name: "react";
};

type AstroPreactIntegration = {
  name: "preact";
  classAttribute?: string;
};

export type AstroIntegration = AstroReactIntegration | AstroPreactIntegration;

export function handleAstro(
  { code, id }: { code: string; id: string },
  { integrations = [] }: { integrations?: AstroIntegration[] }
) {
  if (id.endsWith(".astro")) {
    return transpileUsingAstroTemplateLiterals(code, {
      attributeFunctionId: "$$addAttribute",
      classAttributeKeyword: "class",
    });
  }

  for (const integration of integrations) {
    if (integration.name === "preact") {
      return handlePreact(
        { code, id },
        { classAttribute: integration.classAttribute }
      );
    } else if (integration.name === "react") {
      return handleReact({ code, id });
    }
  }

  return null;
}
