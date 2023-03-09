import { transpileUsingSvelteTemplateLiterals } from "../src/strategies/svelteTemplateLiterals";

describe("template literals strategy", () => {
  it("concatenates basic strings correctly", () => {
    const source =
      'console.log("hello world");\ncreate_ssr_component(`<div tw="${"bg-red-500"}" tw-hover="${"bg-red-400"}">ok</div>`);';

    const result = transpileUsingSvelteTemplateLiterals(source);

    expect(result.code).toMatchSnapshot();
  });

  it("concatenates to existing classes", () => {
    const source =
      'create_ssr_component(`<div class="${"test-class"}" tw-hover="${"bg-red-400"}">ok</div>`);';

    const result = transpileUsingSvelteTemplateLiterals(source);

    expect(result.code).toMatchSnapshot();
  });

  it("handles complicated class expressions with different order", () => {
    const source =
      'create_ssr_component(`<div tw="${"bg-red-500"}" tw-hover-dark="${"bg-blue-500"}" ${add_attribute("class", stylesState ? "some-custom-class" : "another-custom-class", 0)}>ok</div>`);';

    const result = transpileUsingSvelteTemplateLiterals(source);

    expect(result.code).toMatchSnapshot();
  });

  it("should throw on expressions", () => {
    const source =
      'create_ssr_component(`<div ${add_attribute("tw-hover", "bg-red-500", 0)}>ok</div>`);';

    expect(() => transpileUsingSvelteTemplateLiterals(source)).toThrow(
      /expressions/i
    );
  });
});
