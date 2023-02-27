import type { NextConfig } from "next";
import {
  TailpropsPluginOptions,
  TailpropsWebpackPlugin,
} from "tailprops-webpack-plugin";

export function withTailprops(
  nextConfig: NextConfig,
  options: TailpropsPluginOptions = { framework: "react" }
) {
  const modifiedConfig: NextConfig = {
    ...nextConfig,
    webpack(config: any, context: any) {
      config.plugins.unshift(new TailpropsWebpackPlugin(options));

      if (nextConfig.webpack && typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, context);
      }

      return config;
    },
  };

  return modifiedConfig;
}
