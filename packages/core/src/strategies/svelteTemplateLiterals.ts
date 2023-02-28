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

import {
  getTailwindModifiersInAttribute,
  getTailwindPropertiesInString,
  joinPropertiesUsingModifiers,
} from "./utils";

type StringSlice = {
  start: number;
  end: number;
  content: string;
};

type RawTailprop = StringSlice & {
  modifiers: string[];
};

export function transpileUsingTemplateLiteralAttributeInjection(
  source: string,
  options: {
    classAttributeKeyword: string;
    attributeFunctionId: string;
  } = {
    classAttributeKeyword: "class",
    attributeFunctionId: "add_attribute",
  }
): string {
  const htmlTags = getHtmlTagsInsideTemplateLiterals(source);

  for (const tag of htmlTags.reverse()) {
    source =
      source.slice(0, tag.start) +
      transformHtmlTag(tag.content, options) +
      source.slice(tag.end);
  }

  return source;
}

function transformHtmlTag(
  tag: string,
  options: {
    classAttributeKeyword: string;
    attributeFunctionId: string;
  }
) {
  const tailprops = findTailpropsInTag(tag, options.attributeFunctionId);

  tag = removeSlicesInString(tag, tailprops);

  const existingClassAttribute = findExistingClassAttributeInTag(tag, options);

  if (existingClassAttribute)
    tag = removeSliceFromString(tag, existingClassAttribute);

  tag = addAttributeToTagUsingFunction(
    tag,
    {
      name: options.classAttributeKeyword,
      value: createClassAttributeFromRawTailprops(
        existingClassAttribute ? existingClassAttribute.content : null,
        tailprops
      ),
    },
    options.attributeFunctionId
  );

  return tag;
}

function findTailpropsInTag(
  tag: string,
  attributeFunctionIdentifier: string
): RawTailprop[] {
  const staticTailprops = findStaticTailpropsInTag(tag);
  const dynamicTailprops = findDynamicTailpropsInTag(
    tag,
    attributeFunctionIdentifier
  );

  if (dynamicTailprops.length > 0)
    throw new Error(
      "Expressions in Tailprops are not supported! Please use a flat string literal instead, or move the expression to the class attribute."
    );

  return staticTailprops;
}

function findStaticTailpropsInTag(tag: string): RawTailprop[] {
  const matches = [...tag.matchAll(/(tw(?:-\w*?)*?)="\${(.*?)\}"/g)];

  return matches.map((m) => ({
    start: m.index!,
    end: m.index! + m[0].length,
    modifiers: getTailwindModifiersInAttribute(m[1]),
    content: m[2],
  }));
}

function findDynamicTailpropsInTag(
  tag: string,
  attributeFunctionId: string
): RawTailprop[] {
  const re = new RegExp(
    `\\\${${attributeFunctionId}\\("(tw(?:-\\w*?)*?)",\\s?(.*?),.*?\\)}`,
    "g"
  );

  const matches = [...tag.matchAll(re)];

  return matches.map((m) => ({
    start: m.index!,
    end: m.index! + m[0].length,
    modifiers: getTailwindModifiersInAttribute(m[1]),
    content: m[2],
  }));
}

function removeSlicesInString(
  source: string,
  slices: { start: number; end: number }[]
) {
  return [...slices].reverse().reduce((acc, s) => {
    return acc.slice(0, s.start) + acc.slice(s.end);
  }, source);
}

function findExistingClassAttributeInTag(
  tag: string,
  options: {
    attributeFunctionId: string;
    classAttributeKeyword: string;
  }
) {
  const dynamicClassAttribute = findExistingDynamicClassAttributeInTag(
    tag,
    options
  );

  if (dynamicClassAttribute) return dynamicClassAttribute;

  const staticClassAttribute = findExistingStaticClassAttributeInTag(tag);

  if (staticClassAttribute) return staticClassAttribute;

  return null;
}

function findExistingDynamicClassAttributeInTag(
  tag: string,
  options: {
    attributeFunctionId: string;
    classAttributeKeyword: string;
  }
) {
  const match = tag.match(
    new RegExp(
      `\\\${${options.attributeFunctionId}\\("${options.classAttributeKeyword}",(.*?),.*?\\)}`
    )
  );

  if (match === null) return null;

  return {
    start: match.index!,
    end: match.index! + match[0].length,
    content: match[1],
  };
}

function findExistingStaticClassAttributeInTag(tag: string) {
  const match = tag.match(/class="\${(.*?)}"/);

  if (match === null) return null;

  return {
    start: match.index!,
    end: match.index! + match[0].length,
    content: match[1],
  };
}

function addAttributeToTagUsingFunction(
  tag: string,
  attribute: { name: string; value: string },
  functionId: string
) {
  const index = tag.indexOf(">");

  tag =
    tag.slice(0, index) +
    `\${${functionId}("${attribute.name}",${attribute.value}, 0)}` + // i have no idea what "0" does here tbh
    tag.slice(index);

  return tag;
}

function createClassAttributeFromRawTailprops(
  existingClassContents: string | null,
  tailprops: RawTailprop[]
) {
  const tailpropsContents = tailprops
    .map((t) => `${applyModifiersToAllInQuotes(t.content, t.modifiers)}`)
    .join(` + " " + `);

  return `${
    existingClassContents ? `(${existingClassContents})` + ` + " " + ` : ""
  }${tailpropsContents}`;
}

function removeSliceFromString(
  tag: string,
  attribute: { start: number; end: number }
) {
  tag = tag.slice(0, attribute.start) + tag.slice(attribute.end);

  return tag;
}

function getHtmlTagsInsideTemplateLiterals(source: string): StringSlice[] {
  const templates = [...source.matchAll(/(?<=`)<.*?tw.*?>/g)];

  return templates.map((t) => ({
    start: t.index!,
    end: t.index! + t[0].length,
    content: t[0],
  }));
}

function applyModifiersToAllInQuotes(source: string, modifiers: string[]) {
  const matches = [...source.matchAll(/"(.*?)"/g)];

  return matches.reverse().reduce((acc, m) => {
    const properties = getTailwindPropertiesInString(m[1]);
    const modifiedProperties = joinPropertiesUsingModifiers(
      properties,
      modifiers
    );

    return (
      acc.slice(0, m.index! + 1) +
      modifiedProperties +
      acc.slice(m.index! + m[0].length - 1)
    );
  }, source);
}
