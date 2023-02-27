/**
 *
 * @param source A list of tailwind properties separated by spaces (without quotes)
 * @returns An array of tailwind properties
 */
export declare function getTailwindPropertiesInString(source: string): string[];
/**
 *
 * @param source A tailprop with the prefix tw- included
 * @returns An array of modifiers
 */
export declare function getTailwindModifiersInAttribute(source: string): string[];
export declare function joinPropertiesUsingModifiers(properties: string[], modifiers: string[]): string;
