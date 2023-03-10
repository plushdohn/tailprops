import { tailpropsTailwindTransform, withTailprops } from "../src";

describe("custom tailwind transform", () => {
  it("should transform tw-<modifier> attributes to just tw", () => {
    const content = `
      <div tw-foo="bar" tw-baz="qux" />
    `;

    const result = tailpropsTailwindTransform(content);

    expect(result).toEqual(`
      <div tw="foo:bar" tw="baz:qux" />
    `);
  });

  it("shouldn't remove existing tw attributes", () => {
    const content = `
      <div tw="foo:bar" tw-baz="qux" />
    `;

    const result = tailpropsTailwindTransform(content);

    expect(result).toEqual(`
      <div tw="foo:bar" tw="baz:qux" />
    `);
  });

  it("should handle attributes in curly braces (for JSX frameworks)", () => {
    const content = `
      <div tw-hover={someState ? "bg-red-500" : "bg-blue-500"} />
    `;

    const result = tailpropsTailwindTransform(content);

    expect(result).toEqual(`
      <div tw={someState ? "hover:bg-red-500" : "hover:bg-blue-500"} />
    `);
  });

  it("should handle double curly braces (for idk, Vue or something)", () => {
    const content = `
      <div tw-hover={{someState ? "bg-red-500" : "bg-blue-500"}} tw-foo="bar" />
    `;

    const result = tailpropsTailwindTransform(content);

    expect(result).toEqual(`
      <div tw={{someState ? "hover:bg-red-500" : "hover:bg-blue-500"}} tw="foo:bar" />
    `);
  });

  it("should handle alphanumeric modifiers", () => {
    const content = `
      <div tw-2xl="baz" />
    `;

    const result = tailpropsTailwindTransform(content);

    expect(result).toEqual(`
      <div tw="2xl:baz" />
    `);
  });

  it("should handle non-alphanumeric properties", () => {
    const content = `
      <div tw-2xl="p-0.5 bg-[#FF8A08] text-[2rem]" />
    `;

    const result = tailpropsTailwindTransform(content);

    expect(result).toEqual(`
      <div tw="2xl:p-0.5 2xl:bg-[#FF8A08] 2xl:text-[2rem]" />
    `);
  });

  describe("utility wrapper", () => {
    it("should wrap the tailwind config and change the content correctly", () => {
      const config = {
        content: ["./src/**/*.svelte"],
        theme: {
          someTheme: "ok",
        },
      };

      const result = withTailprops(config);

      expect(result).toHaveProperty("theme.someTheme", "ok");
      expect(result).toHaveProperty("content.files", ["./src/**/*.svelte"]);
      expect(result).toHaveProperty(
        "content.transform.svelte",
        tailpropsTailwindTransform
      );
    });

    it("should throw if content is not a flat array", () => {
      const config = {
        content: {
          files: ["something"],
        },
      };

      expect(() => withTailprops(config)).toThrow(/content/i);
    });
  });
});
