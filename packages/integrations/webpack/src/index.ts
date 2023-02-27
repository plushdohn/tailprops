import { CleanPlugin, Compiler } from "webpack";
import { TailpropsPluginOptions as PluginOptions } from "./types";

export class TailpropsWebpackPlugin extends CleanPlugin {
  pluginOptions: PluginOptions;

  constructor(options: PluginOptions) {
    super(options);
    this.pluginOptions = options;
  }

  apply(compiler: Compiler): void {
    compiler.options.module.rules.unshift({
      test: /\.(tsx|ts|js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve("./loader"),
          options: this.pluginOptions,
        },
      ],
    });
  }
}

export type TailpropsPluginOptions = PluginOptions;
