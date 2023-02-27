/**
 * This strategy exists mainly to address Svelte's hydration phase.
 *
 * Changing the attributes on the server-rendered component is not
 * enough for the changes to persist as they get rewritten by the
 * client-side hydration.
 *
 * As of now, Svelte creates some object with a function property
 * which is called during hydration. This function is responsible
 * for setting the attributes on the element.
 *
 * This strategy will transform the function block, removing all
 * calls to "tw" attributes and transform them into a single
 * "class" attribute with the modifiers applied.
 *
 * The original code looks something like this:
 *
 * m: function hydrate() {
 *  attr_dev(h1, "class", "existing-class");
 *  attr_dev(h1, "tw", "bg-red-500");
 *  attr_dev(h1, "tw-hover", "bg-red-400");
 * }
 *
 * And it will be transformed into:
 *
 * m: function hydrate() {
 *  attr_dev(h1, "class", "existing-class" + " " + "bg-red-500" + " " + "hover:bg-red-400");
 * }
 */
export declare function transpileUsingAttributeAdditionFunction(source: string, options?: {
    ast?: any;
    generateSourceMaps?: boolean;
    attributeFunctionId: string;
    classAttributeKeyword: string;
}): {
    code: string;
    map: {
        version: number;
        sources: string[];
        names: string[];
        sourceRoot?: string | undefined;
        sourcesContent?: string[] | undefined;
        mappings: string;
        file: string;
    } | null;
};
