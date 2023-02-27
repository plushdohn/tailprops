import { transpileUsingAttributeAdditionFunction } from "../src";

describe("Attribute addition function strategy", () => {
  it("handles basic tailprops", () => {
    const source = `const test = {
  m: function hydrate() {
    attr_dev(h1, "tw", "bg-red-500");
    attr_dev(h1, "tw-hover", pinkTheme ? "bg-pink-600" : "bg-blue-400");
  }
}`;

    const result = transpileUsingAttributeAdditionFunction(source);

    expect(result.code).toBe(`const test = {
  m: function hydrate() {
    attr_dev(h1, "class", "bg-red-500" + " " + (pinkTheme ? "hover:bg-pink-600" : "hover:bg-blue-400"));
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
    attr_dev(h1, "class", stylesState ? "some-custom-class" : "another-custom-class");
    attr_dev(h1, "tw", "bg-red-500");
    attr_dev(h1, "tw-hover", pinkTheme ? "bg-pink-500" : "bg-blue-500");
  }
};`;

    const result = transpileUsingAttributeAdditionFunction(source);

    expect(result.code).toBe(`const test = {
  m: function hydrate() {
    attr_dev(h1, "class", (stylesState ? "some-custom-class" : "another-custom-class") + " " + "bg-red-500" + " " + (pinkTheme ? "hover:bg-pink-500" : "hover:bg-blue-500"));
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
});
