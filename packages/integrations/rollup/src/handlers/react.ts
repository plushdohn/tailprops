import { transpileJsUsingPropsObject } from "tailprops";

export function handleReact({ id, code }: { code: string; id: string }): {
  code: string;
  map: any;
  ast: any;
} | null {
  if (id.endsWith(".jsx") || id.endsWith(".tsx")) {
    const out = transpileJsUsingPropsObject(code, {
      classAttribute: "className",
      generateSourceMaps: false,
    });

    return out;
  }

  return null;
}
