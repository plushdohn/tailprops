import { Compiler } from "webpack";
import { TailpropsWebpackPlugin } from "../src";

describe("webpack plugin", () => {
  it("should inject the loader", () => {
    const plugin = new TailpropsWebpackPlugin({ framework: "react" });

    const compiler = {
      options: {
        module: {
          rules: [],
        },
      },
    };

    plugin.apply(compiler as unknown as Compiler);

    expect(compiler.options.module.rules).toEqual([
      {
        test: /\.(tsx|ts|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("../src/loader"),
            options: { framework: "react" },
          },
        ],
      },
    ]);
  });

  it("should inject the loader in the correct position", () => {
    const plugin = new TailpropsWebpackPlugin({ framework: "react" });

    const compiler = {
      options: {
        module: {
          rules: [
            {
              test: /\.css$/,
              use: ["css-loader"],
            },
          ],
        },
      },
    };

    plugin.apply(compiler as Compiler);

    expect(compiler.options.module.rules[0]).toEqual({
      test: /\.(tsx|ts|js|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve("../src/loader"),
          options: { framework: "react" },
        },
      ],
    });
  });
});
