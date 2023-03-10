import { transpileJsUsingPropsObject } from "tailprops";

export function handlePreact(
  { id, code }: { code: string; id: string },
  { classAttribute }: { classAttribute?: string }
): {
  code: string;
  map: any;
  ast: any;
} | null {
  if (id.endsWith(".jsx") || id.endsWith(".tsx")) {
    const out = transpileJsUsingPropsObject(code, {
      classAttribute: classAttribute || "className",
      generateSourceMaps: false,
    });

    return out;
  }

  return null;
}
