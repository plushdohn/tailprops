import { blue, bold, green, gray, red, yellow } from "chalk";
import { diffChars } from "diff";
import boxen from "boxen";

export function logStep(message: string, spaced = true) {
  if (spaced) console.log();
  console.log(blue(bold(`• ${message}`)));
}

export function logGood(message: string) {
  console.log(green(bold(`✔ ${message}`)));
}

export function logMeh(message: string) {
  console.log(yellow(bold(`• ${message}`)));
}

export function logBad(message: string) {
  console.log(red(bold(`𝘅 ${message}`)));
}

export function logDiff(initial: string, updated: string, title?: string) {
  const diff = diffChars(initial, updated);

  console.log(); // Spacing
  console.log(
    boxen(
      diff
        .map((part) => {
          if (part.added) return bold(green(part.value));
          if (part.removed) return bold(red(part.value));
          return gray(part.value);
        })
        .join(""),
      {
        title: title,
        padding: 1,
        borderColor: "gray",
        titleAlignment: "center",
      }
    )
  );
}
