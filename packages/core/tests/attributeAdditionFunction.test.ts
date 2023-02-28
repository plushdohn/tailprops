import { transpileUsingAttributeAdditionFunction } from "../src";

describe("Attribute addition function strategy", () => {
  it("handles basic tailprops", () => {
    const source = `const test = {
  m: function hydrate() {
    attr_dev(h1, "tw", "bg-red-500");
    attr_dev(h1, "tw-hover", "bg-red-400");
  }
}`;

    const result = transpileUsingAttributeAdditionFunction(source);

    expect(result.code).toBe(`const test = {
  m: function hydrate() {
    attr_dev(h1, "class", "bg-red-500" + " " + "hover:bg-red-400");
  }
};`);
  });

  it("concatenates to existing classes", () => {
    const source = `const test = {
  m: function hydrate() {
    attr_dev(h1, "class", "bg-red-500");
    attr_dev(h1, "tw-hover", "bg-red-400");
  }
};`;

    const result = transpileUsingAttributeAdditionFunction(source);

    expect(result.code).toBe(`const test = {
  m: function hydrate() {
    attr_dev(h1, "class", "bg-red-500" + " " + "hover:bg-red-400");
  }
};`);
  });

  it("handles complicated expressions with different order", () => {
    const source = `const test = {
  m: function hydrate() {
    attr_dev(h1, "tw", "bg-red-500");
    attr_dev(h1, "tw-dark-hover-2xl", "bg-red-300");
    attr_dev(h1, "class", stylesState ? "some-custom-class" : "another-custom-class");
  }
};`;

    const result = transpileUsingAttributeAdditionFunction(source);

    expect(result.code).toBe(`const test = {
  m: function hydrate() {
    attr_dev(h1, "class", (stylesState ? "some-custom-class" : "another-custom-class") + " " + "bg-red-500" + " " + "dark:hover:2xl:bg-red-300");
  }
};`);
  });

  it("ignores unknown call expressions", () => {
    const source = `const test = {
  m: function hydrate() {
    bla_bla("something");
  }
};`;

    const result = transpileUsingAttributeAdditionFunction(source);

    expect(result.code).toBe(source);
  });

  it("ignores unknown attributes", () => {
    const source = `const test = {
  m: function hydrate() {
    attr_dev(h1, "bla", "bla");
  }
};`;

    const result = transpileUsingAttributeAdditionFunction(source);

    expect(result.code).toBe(source);
  });

  it("throws on expressions", () => {
    const source = `const test = {
  m: function hydrate() {
    attr_dev(h1, "tw-hover", something ? "bg-blue-500" : "bg-red-500");
  }
};`;

    expect(() => transpileUsingAttributeAdditionFunction(source)).toThrow(
      /expressions/i
    );
  });
});
