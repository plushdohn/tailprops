import type { Config } from "tailwindcss";
import {
  getTailwindModifiersInAttribute,
  getTailwindPropertiesInString,
  joinPropertiesUsingModifiers,
} from "./strategies/utils/generic";

const EXTENSIONS = [
  "html",
  "svelte",
  "vue",
  "jsx",
  "tsx",
  "js",
  "ts",
  "astro",
  "md",
  "mdx",
];

/**
 * A utility function to add our transform
 * to the given Tailwind config.
 *
 * @param extension The file extension we check for tailprops
 * @returns config with the transform applied to each extensin
 */
export function withTailprops(
  config: Config,
  options: { extensions: string[] } = { extensions: EXTENSIONS }
): Config {
  if (!Array.isArray(config.content)) {
    throw new Error(
      "withTailprops can't be used with custom 'content' options in Tailwind. Import the tailpropsTailwindTransform function and add it manually to for your file extensions as a content transform. For more info see https://tailwindcss.com/docs/content-configuration#transforming-source-files"
    );
  }

  return {
    ...config,
    content: {
      files: config.content as string[],
      transform: options.extensions.reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: tailpropsTailwindTransform,
        }),
        {}
      ),
    },
  };
}

/**
 * A Tailwind transform that flattens `tw-<modifiers>="..."` attributes
 * into a single `tw="..."` attribute.
 *
 * This allows Tailwind to generate the correct modifier classes.
 *
 * @param content A source string provided by Tailwind
 * @returns The modified source with "flattened" tw attributes
 */
export function tailpropsTailwindTransform(content: string): string {
  const rawTailprops = getTailpropsInSource(content);

  try {
    for (const tailprop of rawTailprops.reverse()) {
      content =
        content.slice(0, tailprop.index) +
        transformRawTailwindProp(tailprop.contents) +
        content.slice(tailprop.index + tailprop.contents.length);
    }
  } catch (err) {
    throw new Error("Tailprops tw transform error:" + (err as Error).message);
  }

  return content;
}

/**
 * Finds all tw-*="..." strings in a file and returns their contents and index.
 * Suppots both flat HTML string attributes and JSX-style curly braces.
 * Returns the whole string, including the tw attribute.
 *
 * @param source A source string
 * @returns An array of objects containing the contents and index of each match
 */
function getTailpropsInSource(
  source: string
): { index: number; contents: string }[] {
  const matches = [...source.matchAll(/tw(-\w*)*=(?:"(.*?)"|{(.*?)})/g)];

  return matches.map((match) => ({ contents: match[0], index: match.index! }));
}

/**
 * Applies modifiers to all strings in a single tailprop
 * and returns the modified tailprop.
 *
 * @example
 * tw-foo="bar" -> tw="foo:bar"
 * tw-hover={foo + "bar"} -> tw={foo + "hover:bar"}
 *
 * @param raw A string containing a SINGLE tailprop
 * @returns The provided string but with the modifiers removed and
 * applied to the properties
 */
function transformRawTailwindProp(raw: string) {
  const [modifiersString] = raw.match(/tw(-\w*)*(?==)/g)!;

  const modifiers = getTailwindModifiersInAttribute(modifiersString);

  const rawPropertiesMatches = [...raw.matchAll(/"(.*?)"/g)];

  for (const match of rawPropertiesMatches.reverse()) {
    const properties = getTailwindPropertiesInString(match[1]);

    const joinedProperties = joinPropertiesUsingModifiers(
      properties,
      modifiers
    );

    raw =
      raw.slice(0, match.index) +
      `"${joinedProperties}"` +
      raw.slice(match.index! + match[0].length);
  }

  return `tw${raw.slice(modifiersString.length)}`;
}
