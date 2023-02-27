import type { LoaderContext } from "webpack";
import { transpileJsUsingPropsObject } from "tailprops";
import { TailpropsPluginOptions } from "./types";

export default async function (
  this: LoaderContext<TailpropsPluginOptions>,
  input: string,
  sourceMap?: any
) {
  this.cacheable(true);

  const options = this.getOptions();

  const webpackCallback = this.async();

  if (options.framework === "react" || options.framework === "preact") {
    let out: ReturnType<typeof transpileJsUsingPropsObject>;
    try {
      out = transpileJsUsingPropsObject(input, {
        classAttribute: "className",
        generateSourceMaps: sourceMap,
      });
    } catch (err) {
      return webpackCallback(new Error(`${(err as Error).message}`));
    }

    return webpackCallback(null, out.code, out.map ?? undefined);
  }

  return webpackCallback(
    new Error(
      `Framework '${options.framework}' is not supported by Tailprops. If you think it's horribly bad that we don't support this framework, please open an issue on GitHub.`
    )
  );
}
