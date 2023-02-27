import { TailpropsWebpackPlugin } from "tailprops-webpack-plugin";
import { withTailprops } from "../src";

describe("Next.js utility", () => {
  it("should add webpack plugin to the config", () => {
    const webpackConfig = {
      plugins: [],
    };

    const nextConfig = withTailprops({
      reactStrictMode: true,
    });

    nextConfig.webpack!(webpackConfig, {} as any);

    expect(webpackConfig.plugins[0]).toBeInstanceOf(TailpropsWebpackPlugin);
  });

  it("should not break existing config", () => {
    const webpackConfig = {
      plugins: ["baz"],
    };

    const nextConfig = withTailprops({
      webpack(config: any) {
        config.plugins.push("foo");

        return config;
      },
      reactStrictMode: true,
      pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
      experimental: {
        appDir: true,
        mdxRs: true,
      },
    });

    const modifiedConfig = nextConfig.webpack!(webpackConfig, {} as any);

    expect(modifiedConfig.plugins).toContain("foo");
    expect(modifiedConfig.plugins).toContain("baz");
    expect(nextConfig.reactStrictMode).toBe(true);
  });
});
