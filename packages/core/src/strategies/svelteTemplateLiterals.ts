import * as parser from "@babel/parser";
import generate from "@babel/generator";
import { getTailwindModifiersInAttribute } from "./utils/generic";
import {
  createClassAttributeFromRawTailprops,
  getHtmlTagsInsideTemplateLiterals,
  RawTailprop,
  removeSliceFromString,
  removeSlicesInString,
} from "./utils/templates";

export function transpileUsingSvelteTemplateLiterals(
  source: string,
  options: {
    classAttributeKeyword: string;
    attributeFunctionId: string;
    generateSourceMaps?: boolean;
  } = {
    classAttributeKeyword: "class",
    attributeFunctionId: "add_attribute",
  }
) {
  const htmlTags = getHtmlTagsInsideTemplateLiterals(source);

  for (const tag of htmlTags.reverse()) {
    source =
      source.slice(0, tag.start) +
      transformHtmlTag(tag.content, options) +
      source.slice(tag.end);
  }

  const ast = parser.parse(source, { sourceType: "unambiguous" });

  const newSource = generate(ast, { sourceMaps: options.generateSourceMaps });

  return {
    code: newSource.code,
    map: newSource.map,
    ast,
  };
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
