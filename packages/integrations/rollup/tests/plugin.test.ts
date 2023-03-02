import { tailpropsPlugin } from "../src/index";

const mockedTransformContext = {
  meta: {
    watchMode: true,
  },
} as any;

describe("rollup plugin", () => {
  let plugin = tailpropsPlugin({ framework: "svelte-ssr" });

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

  it("should support an array of frameworks", () => {
    const instance = tailpropsPlugin({
      framework: ["astro", "svelte-ssr"],
    });

    const result = instance.transform.bind(mockedTransformContext)(
      "console.log('test')",
      "1283901.svelte"
    );

    expect(result).toMatch(/console\.log\('test'\);?/);
  });

  describe("svelte integration", () => {
    beforeEach(() => {
      plugin = tailpropsPlugin({ framework: "svelte-ssr" });
    });

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

    // TODO: Add test for Svelte hydration
  });

  describe("astro integration", () => {
    beforeEach(() => {
      plugin = tailpropsPlugin({ framework: "astro" });
    });

    it("should not touch non-astro files", () => {
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
        "1283901.astro"
      );

      expect(result).toBe(source);
    });

    it("should apply template literals transform on Astro files", () => {
      const source =
        'function() { return `<html><span${$$addAttribute("test-class", "class")} tw="bg-red-500" tw-hover="bg-red-400">ciao</span></html>`}';

      const instance = tailpropsPlugin({ framework: "astro" });

      const result = instance.transform.bind(mockedTransformContext)(
        source,
        "test.astro"
      );

      expect(result).toMatch(
        /function\(\) { return `<html><span\s*\${\$\$addAttribute\(\("test-class"\) \+ " " \+ "bg-red-500" \+ " " \+ "hover:bg-red-400",\s?"class"\)}/gi
      );
    });
  });
});
