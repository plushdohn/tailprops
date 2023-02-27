import { transpileJsUsingPropsObject } from "../src";

describe("props object strategy", () => {
  it("should transform tw object entries into classes", () => {
    const source = `const someObject = {tw: "text-red-500"};`;

    const result = transpileJsUsingPropsObject(source, {
      classAttribute: "class",
    });

    expect(result.code).toContain(`class: "text-red-500"`);
  });

  it("should account for passed class keyword", () => {
    const source = `const someObject = {foo: "text-red-500", tw: "bg-red-500"};`;

    const result = transpileJsUsingPropsObject(source, {
      classAttribute: "foo",
    });

    expect(result.code).toMatch(/foo:.*?text-red-500.*?bg-red-500/gi);
  });

  it("should support class keyword as string literal (don't know why you'd do this but whatever)", () => {
    const source = `const someObject = {"class": "text-red-500", tw: "bg-red-500"};`;

    const result = transpileJsUsingPropsObject(source, {
      classAttribute: "class",
    });

    expect(result.code).toMatch(
      /"class".*?"text-red-500".*?\s.*?"bg-red-500"/g
    );
  });

  it("should seamlessly append classes where possible", () => {
    const source = `const someObject = {class: "text-red-500", tw: "bg-red-500"};`;

    const result = transpileJsUsingPropsObject(source, {
      classAttribute: "class",
    });

    expect(result.code).toMatch(/class:.*?text-red-500.*?"\s".*?bg-red-500/);
  });

  it("should support conditional tailprops", () => {
    const source = `const someObject = {className: someState ? "ok" : "test", tw: anotherState ? "text-red-500" : "text-blue-500"};`;

    const result = transpileJsUsingPropsObject(source, {
      classAttribute: "className",
    });

    expect(result.code).toMatch(
      /className:.*someState \? "ok" \: "test".*"\s".*anotherState \? "text-red-500" : "text-blue-500"/gi
    );
  });

  it("should throw on unchainable class", () => {
    const source = `const someObject = {className: null, tw: ["flex"]};`;

    expect(() =>
      console.log(
        transpileJsUsingPropsObject(source, { classAttribute: "className" })
      )
    ).toThrow();
  });

  describe("modifiers", () => {
    it("should support modifiers", () => {
      const source = `const someObject = { "tw-hover": "text-red-500" };`;

      const result = transpileJsUsingPropsObject(source, {
        classAttribute: "class",
      });

      expect(result.code).toContain(`class: "hover:text-red-500"`);
    });

    it("should support multiple modifiers and preserve order", () => {
      const source = `const someObject = { "tw-hover-focus": "text-red-500" };`;

      const result = transpileJsUsingPropsObject(source, {
        classAttribute: "class",
      });

      expect(result.code).toContain(`class: "hover:focus:text-red-500"`);
    });

    it("should support modifiers with underscores", () => {
      const source = `const someObject = { "tw-prose_code": "text-red-500" };`;

      const result = transpileJsUsingPropsObject(source, {
        classAttribute: "class",
      });

      expect(result.code).toContain(`class: "prose-code:text-red-500"`);
    });
  });
});
