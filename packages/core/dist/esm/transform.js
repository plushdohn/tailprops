import { getTailwindModifiersInAttribute, getTailwindPropertiesInString, joinPropertiesUsingModifiers, } from "./strategies/utils";
/**
 * A utility function to add our transform
 * to the given Tailwind config.
 *
 * @param config A tailwind config
 * @param extension The file extension we check for tailprops
 * @returns config with a content transform for the given extension
 */
export function withTailprops(extensions, config) {
    return Object.assign(Object.assign({}, config), { content: {
            files: config.content,
            transform: typeof extensions === "string"
                ? { [extensions]: tailpropsTailwindTransform }
                : extensions.reduce((acc, curr) => (Object.assign(Object.assign({}, acc), { [curr]: tailpropsTailwindTransform })), {}),
        } });
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
export function tailpropsTailwindTransform(content) {
    const rawTailprops = getTailpropsInSource(content);
    try {
        for (const tailprop of rawTailprops.reverse()) {
            content =
                content.slice(0, tailprop.index) +
                    transformRawTailwindProp(tailprop.contents) +
                    content.slice(tailprop.index + tailprop.contents.length);
        }
    }
    catch (err) {
        console.log("Tailprops tw transform error:", err);
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
function getTailpropsInSource(source) {
    const matches = [...source.matchAll(/tw(-\w*)*=(?:"(.*?)"|{(.*?)})/g)];
    return matches.map((match) => ({ contents: match[0], index: match.index }));
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
function transformRawTailwindProp(raw) {
    const [modifiersString] = raw.match(/tw(-\w*)*(?==)/g);
    const modifiers = getTailwindModifiersInAttribute(modifiersString);
    const rawPropertiesMatches = [...raw.matchAll(/"(.*?)"/g)];
    for (const match of rawPropertiesMatches.reverse()) {
        const properties = getTailwindPropertiesInString(match[1]);
        const joinedProperties = joinPropertiesUsingModifiers(properties, modifiers);
        raw =
            raw.slice(0, match.index) +
                `"${joinedProperties}"` +
                raw.slice(match.index + match[0].length);
    }
    return `tw${raw.slice(modifiersString.length)}`;
}
//# sourceMappingURL=transform.js.map