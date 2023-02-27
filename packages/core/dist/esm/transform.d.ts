import type { Config } from "tailwindcss";
type Extension = "svelte" | "tsx" | "jsx";
/**
 * A utility function to add our transform
 * to the given Tailwind config.
 *
 * @param config A tailwind config
 * @param extension The file extension we check for tailprops
 * @returns config with a content transform for the given extension
 */
export declare function withTailprops(extensions: Extension | Extension[], config: Config): Config;
/**
 * A Tailwind transform that flattens `tw-<modifiers>="..."` attributes
 * into a single `tw="..."` attribute.
 *
 * This allows Tailwind to generate the correct modifier classes.
 *
 * @param content A source string provided by Tailwind
 * @returns The modified source with "flattened" tw attributes
 */
export declare function tailpropsTailwindTransform(content: string): string;
export {};
