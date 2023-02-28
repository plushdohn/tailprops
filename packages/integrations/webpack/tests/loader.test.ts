import loader from "../src/loader";

let context: any;

const webpackCallback = jest.fn();

describe("webpack loader", () => {
  beforeEach(() => {
    context = {
      async: () => webpackCallback,
      getOptions: jest.fn(() => ({ framework: "react" })),
      cacheable: jest.fn(),
    };
  });

  it("should accept options", async () => {
    await loader.bind(context)("input", "sourceMap");

    expect(context.getOptions).toHaveBeenCalled();
  });

  it("should cache the loader", async () => {
    await loader.bind(context)("input", "sourceMap");

    expect(context.cacheable).toHaveBeenCalledWith(true);
  });

  it("should throw on unknown frameworks", async () => {
    await loader.bind({
      ...context,
      getOptions: jest.fn(() => ({
        framework: "somethingthatdoesntexist",
      })),
    })("input", "sourceMap");

    expect(webpackCallback.mock.lastCall[0]).toBeInstanceOf(Error);
  });

  it("should return the exact input if no tailprops are found", async () => {
    const input = "console.log('hello world');";

    await loader.bind(context)(input);

    expect(webpackCallback.mock.lastCall[0]).toBe(null);
    expect(webpackCallback.mock.lastCall[1]).toBe(input);
  });

  it("should throw on unparsable input", async () => {
    await loader.bind(context)("asodjojo oda123 dam", "sourceMap");

    expect(webpackCallback.mock.lastCall[0]).toBeInstanceOf(Error);
  });

  it("should return the correct output", async () => {
    const input = `const Button = () => createElement("div", { tw: "bg-red-500", "tw-hover": "bg-blue-500" });`;

    await loader.bind(context)(input);

    expect(webpackCallback.mock.lastCall[1]).toMatch(
      /{\s*className:\s*"bg-red-500" \+ " " \+ "hover:bg-blue-500"\s*}/
    );
  });

  it("should throw on expressions inside tailprops", async () => {
    const input = `const Button = () => createElement("div", { tw: "bg-red-500", "tw-hover": pinkTheme ? "bg-pink-500" : "bg-blue-500" });`;

    await loader.bind(context)(input);

    expect(webpackCallback.mock.lastCall[0]).toBeInstanceOf(Error);
    expect(webpackCallback.mock.lastCall[0].message).toMatch(/expressions/i);
  });
});
