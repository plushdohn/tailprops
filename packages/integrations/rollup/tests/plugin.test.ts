import { tailpropsPlugin } from "../src/index";

const mockedTransformContext = {
  meta: {
    watchMode: true,
  },
} as any;

describe("rollup plugin", () => {
  const plugin = tailpropsPlugin({ framework: "svelte-ssr" });

  it("should throw on unknown frameworks", () => {
    const instance = tailpropsPlugin({
      framework: "somethingthatdoesntexist" as any,
    });

    expect(() =>
      instance.transform.bind(mockedTransformContext)(
        "console.log('test')",
        "1283901.unknown"
      )
    ).toThrow();
  });

  describe("svelte integration", () => {
    it("should not touch non-svelte files", () => {
      const result = plugin.transform.bind(mockedTransformContext)(
        "console.log('test')",
        "1283901.unknown"
      );

      expect(result).toBeNull();
    });

    it("should parse but not alter files without tailprops", () => {
      const source = 'console.log("test");';

      const result = plugin.transform.bind(mockedTransformContext)(
        source,
        "1283901.svelte"
      );

      expect(result).toBe(source);
    });

    it("should apply template literals transform on SSR files", () => {
      const source =
        'create_ssr_component(`<p class="${"some-class"}" tw="${"bg-red-500"}" tw-2xl="${"bg-red-300"}">test</p>`);';

      const instance = tailpropsPlugin({ framework: "svelte-ssr" });

      const result = instance.transform.bind(mockedTransformContext)(
        source,
        "test.svelte"
      );

      expect(result).toMatch(
        new RegExp(
          'create_ssr_component\\(`<p\\s*\\${add_attribute\\("class", "some-class" \\+ " " \\+ "bg-red-500" \\+ " " \\+ "2xl:bg-red-300", 0\\)}>test</p>`\\)',
          "gi"
        )
      );
    });
  });
});
