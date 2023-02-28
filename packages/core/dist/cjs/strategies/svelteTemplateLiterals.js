"use strict";
/**
 * Ok so this file exists for handling the template literals
 * syntax Svelte uses for component attributes in SSR.
 *
 * The rendered output from the Svelte SSR compiler looks something like this:
 * create_ssr_component(`<div class="${"my-class"}"></div>`)
 *
 * Except when the attribute uses an expression, in which case
 * the template becomes this:
 * create_ssr_component(`<div${add_attribute("class", <expression>, 0)} other-attr="${"example"}"></div$>`)
 *
 * So for each one of these tags, we want to find all "static" tailprops,
 * remove them and store their contents and modifiers.
 *
 * Then we do something similar for the "dynamic" tailprops.
 *
 * Then we look for a dynamic class attribute, if it doesn't exist
 * we look for a static one.
 *
 * Finally we create a new dynamic class attribute which concatenates
 * the current class contents (if any were found) and all the tailprops
 * with the modifiers applied.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpileUsingTemplateLiteralAttributeInjection = void 0;
const utils_1 = require("./utils");
function transpileUsingTemplateLiteralAttributeInjection(source, options = {
    classAttributeKeyword: "class",
    attributeFunctionId: "add_attribute",
}) {
    const htmlTags = getHtmlTagsInsideTemplateLiterals(source);
    for (const tag of htmlTags.reverse()) {
        source =
            source.slice(0, tag.start) +
                transformHtmlTag(tag.content, options) +
                source.slice(tag.end);
    }
    return source;
}
exports.transpileUsingTemplateLiteralAttributeInjection = transpileUsingTemplateLiteralAttributeInjection;
function transformHtmlTag(tag, options) {
    const tailprops = findTailpropsInTag(tag, options.attributeFunctionId);
    tag = removeSlicesInString(tag, tailprops);
    const existingClassAttribute = findExistingClassAttributeInTag(tag, options);
    if (existingClassAttribute)
        tag = removeSliceFromString(tag, existingClassAttribute);
    tag = addAttributeToTagUsingFunction(tag, {
        name: options.classAttributeKeyword,
        value: createClassAttributeFromRawTailprops(existingClassAttribute ? existingClassAttribute.content : null, tailprops),
    }, options.attributeFunctionId);
    return tag;
}
function findTailpropsInTag(tag, attributeFunctionIdentifier) {
    const staticTailprops = findStaticTailpropsInTag(tag);
    const dynamicTailprops = findDynamicTailpropsInTag(tag, attributeFunctionIdentifier);
    if (dynamicTailprops.length > 0)
        throw new Error("Expressions in Tailprops are not supported! Please use a flat string literal instead, or move the expression to the class attribute.");
    return staticTailprops;
}
function findStaticTailpropsInTag(tag) {
    const matches = [...tag.matchAll(/(tw(?:-\w*?)*?)="\${(.*?)\}"/g)];
    return matches.map((m) => ({
        start: m.index,
        end: m.index + m[0].length,
        modifiers: (0, utils_1.getTailwindModifiersInAttribute)(m[1]),
        content: m[2],
    }));
}
function findDynamicTailpropsInTag(tag, attributeFunctionId) {
    const re = new RegExp(`\\\${${attributeFunctionId}\\("(tw(?:-\\w*?)*?)",\\s?(.*?),.*?\\)}`, "g");
    const matches = [...tag.matchAll(re)];
    return matches.map((m) => ({
        start: m.index,
        end: m.index + m[0].length,
        modifiers: (0, utils_1.getTailwindModifiersInAttribute)(m[1]),
        content: m[2],
    }));
}
function removeSlicesInString(source, slices) {
    return [...slices].reverse().reduce((acc, s) => {
        return acc.slice(0, s.start) + acc.slice(s.end);
    }, source);
}
function findExistingClassAttributeInTag(tag, options) {
    const dynamicClassAttribute = findExistingDynamicClassAttributeInTag(tag, options);
    if (dynamicClassAttribute)
        return dynamicClassAttribute;
    const staticClassAttribute = findExistingStaticClassAttributeInTag(tag);
    if (staticClassAttribute)
        return staticClassAttribute;
    return null;
}
function findExistingDynamicClassAttributeInTag(tag, options) {
    const match = tag.match(new RegExp(`\\\${${options.attributeFunctionId}\\("${options.classAttributeKeyword}",(.*?),.*?\\)}`));
    if (match === null)
        return null;
    return {
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
    };
}
function findExistingStaticClassAttributeInTag(tag) {
    const match = tag.match(/class="\${(.*?)}"/);
    if (match === null)
        return null;
    return {
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
    };
}
function addAttributeToTagUsingFunction(tag, attribute, functionId) {
    const index = tag.indexOf(">");
    tag =
        tag.slice(0, index) +
            `\${${functionId}("${attribute.name}",${attribute.value}, 0)}` + // i have no idea what "0" does here tbh
            tag.slice(index);
    return tag;
}
function createClassAttributeFromRawTailprops(existingClassContents, tailprops) {
    const tailpropsContents = tailprops
        .map((t) => `${applyModifiersToAllInQuotes(t.content, t.modifiers)}`)
        .join(` + " " + `);
    return `${existingClassContents ? `(${existingClassContents})` + ` + " " + ` : ""}${tailpropsContents}`;
}
function removeSliceFromString(tag, attribute) {
    tag = tag.slice(0, attribute.start) + tag.slice(attribute.end);
    return tag;
}
function getHtmlTagsInsideTemplateLiterals(source) {
    const templates = [...source.matchAll(/(?<=`)<.*?tw.*?>/g)];
    return templates.map((t) => ({
        start: t.index,
        end: t.index + t[0].length,
        content: t[0],
    }));
}
function applyModifiersToAllInQuotes(source, modifiers) {
    const matches = [...source.matchAll(/"(.*?)"/g)];
    return matches.reverse().reduce((acc, m) => {
        const properties = (0, utils_1.getTailwindPropertiesInString)(m[1]);
        const modifiedProperties = (0, utils_1.joinPropertiesUsingModifiers)(properties, modifiers);
        return (acc.slice(0, m.index + 1) +
            modifiedProperties +
            acc.slice(m.index + m[0].length - 1));
    }, source);
}
//# sourceMappingURL=svelteTemplateLiterals.js.map