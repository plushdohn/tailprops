import {
  transpileUsingAttributeAdditionFunction,
  transpileUsingSvelteTemplateLiterals,
} from "tailprops";

export function handleSvelteSsr(
  info: {
    code: string;
    id: string;
  },
  options: {
    ssr: boolean;
  }
): { code: string; map: any; ast: any } | null {
  if (info.id.endsWith(".svelte")) {
    const result = transpileUsingSvelteTemplateLiterals(info.code);

    return transpileUsingAttributeAdditionFunction(result.code, {
      attributeFunctionId: options.ssr ? "attr_dev" : "attr",
      classAttributeKeyword: "class",
      ast: result.ast,
    });
  }

  return null;
}
