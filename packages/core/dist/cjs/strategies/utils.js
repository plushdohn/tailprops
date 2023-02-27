"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinPropertiesUsingModifiers = exports.getTailwindModifiersInAttribute = exports.getTailwindPropertiesInString = void 0;
/**
 *
 * @param source A list of tailwind properties separated by spaces (without quotes)
 * @returns An array of tailwind properties
 */
function getTailwindPropertiesInString(source) {
    return source.split(/\s(?![^\[]*\])/g);
}
exports.getTailwindPropertiesInString = getTailwindPropertiesInString;
/**
 *
 * @param source A tailprop with the prefix tw- included
 * @returns An array of modifiers
 */
function getTailwindModifiersInAttribute(source) {
    return source
        .split("-")
        .slice(1)
        .map((m) => m.replace("_", "-"));
}
exports.getTailwindModifiersInAttribute = getTailwindModifiersInAttribute;
function joinPropertiesUsingModifiers(properties, modifiers) {
    return `${properties
        .map((p) => `${[...modifiers, ""].join(":")}${p}`)
        .join(" ")}`;
}
exports.joinPropertiesUsingModifiers = joinPropertiesUsingModifiers;
//# sourceMappingURL=utils.js.map