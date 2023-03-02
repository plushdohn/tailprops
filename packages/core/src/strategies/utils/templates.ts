import {
  getTailwindModifiersInAttribute,
  getTailwindPropertiesInString,
  joinPropertiesUsingModifiers,
} from "./generic";

export type StringSlice = {
  start: number;
  end: number;
  content: string;
};

export type RawTailprop = StringSlice & {
  modifiers: string[];
};

export function removeSlicesInString(
  source: string,
  slices: { start: number; end: number }[]
) {
  return [...slices].reverse().reduce((acc, s) => {
    return acc.slice(0, s.start) + acc.slice(s.end);
  }, source);
}

export function findExistingStaticClassAttributeInTag(tag: string) {
  const match = tag.match(/class="\${(.*?)}"/);

  if (match === null) return null;

  return {
    start: match.index!,
    end: match.index! + match[0].length,
    content: match[1],
  };
}

export function createClassAttributeFromRawTailprops(
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

export function removeSliceFromString(
  tag: string,
  attribute: { start: number; end: number }
) {
  tag = tag.slice(0, attribute.start) + tag.slice(attribute.end);

  return tag;
}

export function getHtmlTagsInsideTemplateLiterals(
  source: string
): StringSlice[] {
  const templates = [...source.matchAll(/(?<=`[\S\s]*)<.*?tw.*?>/g)];

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
