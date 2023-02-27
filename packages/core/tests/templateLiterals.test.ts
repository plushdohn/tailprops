import { transpileUsingTemplateLiteralAttributeInjection } from "../src/strategies/svelteTemplateLiterals";

describe("template literals strategy", () => {
  it("concatenates basic strings correctly", () => {
    const source =
      'console.log("hello world");\ncreate_ssr_component(`<div tw="${"bg-red-500"}" tw-hover="${"bg-red-400"}">ok</div>`);';

    const result = transpileUsingTemplateLiteralAttributeInjection(source);

    expect(result).toMatch(
      /\("bg-red-500"\) \+ " " \+ \("hover:bg-red-400"\)/gi
    );
  });

  it("concatenates to existing classes", () => {
    const source =
      'create_ssr_component(`<div class="${"bg-red-500"}" tw-hover="${"bg-red-400"}">ok</div>`);';

    const result = transpileUsingTemplateLiteralAttributeInjection(source);

    expect(result).toMatch(
      /\("bg-red-500"\) \+ " " \+ \("hover:bg-red-400"\)/gi
    );
  });

  it("handles complicated expressions with different order", () => {
    const source =
      'create_ssr_component(`<div tw="${"bg-red-500"}" ${add_attribute("tw-hover", pinkTheme ? "bg-pink-500" : "bg-blue-500", 0)} ${add_attribute("class", stylesState ? "some-custom-class" : "another-custom-class", 0)}>ok</div>`);';

    const result = transpileUsingTemplateLiteralAttributeInjection(source);

    expect(result).toMatch(
      /add_attribute\("class",\s?\( stylesState \? "some-custom-class" : "another-custom-class"\) \+ " " \+ \("bg-red-500"\) \+ " " \+ \(pinkTheme \? "hover:bg-pink-500" : "hover:bg-blue-500"\)/
    );
  });

  it("ignores stuff in template literals", () => {
    const source =
      'create_ssr_component(`<div tw-hover="${"bg-red-400" + `test`}">ok</div>`);';

    const result = transpileUsingTemplateLiteralAttributeInjection(source);

    expect(result).toMatch(/hover:bg-red-400/gi);
    expect(result).toMatch(/test/);
    expect(result).not.toMatch(/hover:test/gi);
  });
});
