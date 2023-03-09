import { SourceDescription } from "rollup";
import { tailpropsPlugin } from "../src/index";

const mockedTransformContext = {
  meta: {
    watchMode: true,
  },
  getCombinedSourcemap: () => null,
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
      ) as Partial<SourceDescription>;

      expect(result.code).toBe(source);
    });

    it("should apply template literals transform on SSR files", () => {
      const source =
        'create_ssr_component(`<p class="${"some-class"}" tw="${"bg-red-500"}" tw-2xl="${"bg-red-300"}">test</p>`);';

      const instance = tailpropsPlugin({ framework: "svelte-ssr" });

      const result = instance.transform.bind(mockedTransformContext)(
        source,
        "test.svelte"
      ) as Partial<SourceDescription>;

      expect(result.code).toMatchSnapshot();
    });

    it("should change attribute function on build vs preview", () => {
      const source =
        'create_ssr_component(`<p class="${"some-class"}" tw="${"bg-red-500"}" tw-2xl="${"bg-red-300"}">test</p>`);';

      const instance = tailpropsPlugin({ framework: "svelte-ssr" });

      const result = instance.transform.bind({
        ...mockedTransformContext,
        meta: { watchMode: false },
      } as any)(source, "test.svelte") as Partial<SourceDescription>;

      expect(result.code).not.toContain("attr_dev");
      expect(result.code).toContain("attr");
    });
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

    it("should support an array of integrations", () => {
      const instance = tailpropsPlugin({
        framework: "astro",
        integrations: [{ name: "react" }],
      });

      const result = instance.transform.bind(mockedTransformContext)(
        "console.log('test')",
        "1283901.jsx"
      ) as Partial<SourceDescription>;

      expect(result.code).toMatch(/console\.log\('test'\);?/);
    });

    it("should parse but not alter files without tailprops", () => {
      const source = 'console.log("test");';

      const result = plugin.transform.bind(mockedTransformContext)(
        source,
        "1283901.astro"
      ) as Partial<SourceDescription>;

      expect(result.code).toBe(source);
    });

    it("should apply template literals transform on Astro files", () => {
      const source =
        'function Test() { return `<html><span${$$addAttribute("test-class", "class")} tw="bg-red-500" tw-hover="bg-red-400">ciao</span></html>`}';

      const instance = tailpropsPlugin({ framework: "astro" });

      const result = instance.transform.bind(mockedTransformContext)(
        source,
        "test.astro"
      ) as Partial<SourceDescription>;

      expect(result.code).toMatchSnapshot();
    });

    it("should support preact integration", () => {
      const instance = tailpropsPlugin({
        framework: "astro",
        integrations: [{ name: "preact" }],
      });

      const result = instance.transform.bind(mockedTransformContext)(
        'function SomeComponent() { return h("div", { className: "test-class", tw: "bg-red-500", "tw-hover": "bg-red-400" }, "ciao"); }',
        "test.jsx"
      ) as Partial<SourceDescription>;

      expect(result.code).toMatchSnapshot();
    });

    it("should support react integration", () => {
      const instance = tailpropsPlugin({
        framework: "astro",
        integrations: [{ name: "react" }],
      });

      const result = instance.transform.bind(mockedTransformContext)(
        'function SomeComponent() { return React.createElement("div", { className: "test-class", tw: "bg-red-500", "tw-hover": "bg-red-400" }, "ciao"); }',
        "test.jsx"
      ) as Partial<SourceDescription>;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("react integration", () => {
    beforeEach(() => {
      plugin = tailpropsPlugin({ framework: "react" });
    });

    it("should parse but not alter files without tailprops", () => {
      const source = 'console.log("test");';

      const result = plugin.transform.bind(mockedTransformContext)(
        source,
        "1283901.jsx"
      ) as Partial<SourceDescription>;

      expect(result.code).toBe(source);
    });

    it("should ignore non-react files", () => {
      const source = 'console.log("test");';

      const instance = tailpropsPlugin({ framework: "react" });

      const result = instance.transform.bind(mockedTransformContext)(
        source,
        "1283901.svelte"
      ) as Partial<SourceDescription>;

      expect(result).toBeNull();
    });

    it("should apply props object strategy on react files", () => {
      const source =
        'function SomeComponent() { return React.createElement("div", { className: "test-class", tw: "bg-red-500", "tw-hover": "bg-red-400" }, "ciao"); }';

      const instance = tailpropsPlugin({ framework: "react" });

      const result = instance.transform.bind(mockedTransformContext)(
        source,
        "test.jsx"
      ) as Partial<SourceDescription>;

      expect(result.code).toMatchSnapshot();
    });
  });

  describe("preact integration", () => {
    beforeEach(() => {
      plugin = tailpropsPlugin({ framework: "preact" });
    });

    it("should parse but not alter files without tailprops", () => {
      const source = 'console.log("test");';

      const result = plugin.transform.bind(mockedTransformContext)(
        source,
        "1283901.jsx"
      ) as Partial<SourceDescription>;

      expect(result.code).toBe(source);
    });

    it("should ignore non-preact files", () => {
      const source = 'console.log("test");';

      const instance = tailpropsPlugin({ framework: "preact" });

      const result = instance.transform.bind(mockedTransformContext)(
        source,
        "1283901.svelte"
      ) as Partial<SourceDescription>;

      expect(result).toBeNull();
    });

    it("should apply props object strategy on preact files", () => {
      const source =
        'function SomeComponent() { return h("div", { className: "test-class", tw: "bg-red-500", "tw-hover": "bg-red-400" }, "ciao"); }';

      const instance = tailpropsPlugin({ framework: "preact" });

      const result = instance.transform.bind(mockedTransformContext)(
        source,
        "test.jsx"
      ) as Partial<SourceDescription>;

      expect(result.code).toMatchSnapshot();
    });

    it("should account for passed class attribute", () => {
      const source =
        'function SomeComponent() { return h("div", { hoppity: "test-class", tw: "bg-red-500", "tw-hover": "bg-red-400" }, "ciao"); }';

      const instance = tailpropsPlugin({
        framework: "preact",
        classAttribute: "hoppity",
      });

      const result = instance.transform.bind(mockedTransformContext)(
        source,
        "test.jsx"
      ) as Partial<SourceDescription>;

      expect(result.code).toMatchSnapshot();
    });
  });
});
