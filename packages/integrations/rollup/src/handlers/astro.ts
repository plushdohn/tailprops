import { transpileUsingAstroTemplateLiterals } from "tailprops";
import { handlePreact } from "./preact";
import { handleReact } from "./react";

type GenericIntegration<T extends string, R extends any> =
  | T
  | ({
      name: T;
    } & R);

type AstroReactIntegration = GenericIntegration<"react", {}>;
type AstroPreactIntegration = GenericIntegration<
  "preact",
  { classAttribute?: string }
>;

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

  for (const integration of integrations.map((i) =>
    typeof i === "string" ? { name: i } : i
  )) {
    if (integration.name === "preact") {
      return handlePreact(
        { code, id },
        {
          classAttribute:
            "classAttribute" in integration
              ? integration.classAttribute
              : undefined,
        }
      );
    } else if (integration.name === "react") {
      return handleReact({ code, id });
    }
  }

  return null;
}
