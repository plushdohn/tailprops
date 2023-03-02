import { transpileUsingAstroTemplateLiterals } from "../src/strategies/astroTemplateLiterals";

describe("template literals strategy", () => {
  it("concatenates basic strings correctly", () => {
    const source =
      'console.log("hello world");\nfunction() { return `<html><h1 tw="bg-red-500" tw-hover="bg-red-400">ciao</h1></html>`} ';

    const result = transpileUsingAstroTemplateLiterals(source);

    expect(result).toMatch(/"bg-red-500" \+ " " \+ "hover:bg-red-400"/gi);
  });

  it("concatenates to existing classes", () => {
    const source =
      'function() { return `<html><h1 class="test-class" tw-hover="bg-red-400">ciao</h1></html>`}';

    const result = transpileUsingAstroTemplateLiterals(source);

    expect(result).toMatch(/\("test-class"\) \+ " " \+ "hover:bg-red-400"/gi);
  });

  it("handles complicated class expressions with different order", () => {
    const source =
      'function() { return `<html><h1${$$addAttribute(someState ? "test-class" : "another-class", "class")} tw="flex" tw-2xl="flex-row">ciao</h1></html>`}';

    const result = transpileUsingAstroTemplateLiterals(source);

    expect(result).toMatch(
      /\$\$addAttribute\(\(someState \? "test-class" : "another-class"\) \+ " " \+ "flex" \+ " " \+ "2xl:flex-row",\s?"class"\)/gi
    );
  });

  it("should throw on expressions", () => {
    const source =
      'function() { return `<html><h1${$$addAttribute("test", "tw-hover")}>ciao</h1></html>`}';

    expect(() => transpileUsingAstroTemplateLiterals(source)).toThrow(
      /expressions/i
    );
  });
});
