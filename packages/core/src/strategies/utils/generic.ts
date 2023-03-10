/**
 *
 * @param source A list of tailwind properties separated by spaces (without quotes)
 * @returns An array of tailwind properties
 */
export function getTailwindPropertiesInString(source: string) {
  return source.split(/\s(?![^\[]*\])/g);
}

/**
 *
 * @param source A tailprop with the prefix tw- included
 * @returns An array of modifiers
 */
export function getTailwindModifiersInAttribute(source: string) {
  return source
    .split("-")
    .slice(1)
    .map((m) => m.replace("_", "-"));
}

export function joinPropertiesUsingModifiers(
  properties: string[],
  modifiers: string[]
) {
  return `${properties
    .map((p) => `${[...modifiers, ""].join(":")}${p}`)
    .join(" ")}`;
}

export function escapeDollarsInString(source: string) {
  return source.replace(/\$/g, "\\$");
}
