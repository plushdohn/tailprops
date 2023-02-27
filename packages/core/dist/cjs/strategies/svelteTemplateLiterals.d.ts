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
export declare function transpileUsingTemplateLiteralAttributeInjection(source: string, options?: {
    classAttributeKeyword: string;
    attributeFunctionId: string;
}): string;
