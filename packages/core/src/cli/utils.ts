import * as fs from "fs";
import * as path from "path";

export function readJsonSync<T>(name: string) {
  let file: string;

  try {
    file = fs.readFileSync(path.join(process.cwd(), name), {
      encoding: "utf-8",
    });
  } catch {
    return null;
  }

  try {
    return JSON.parse(file) as T;
  } catch (err) {
    throw new Error(
      `A file seems to contain invalid JSON: ${(err as Error).message}`
    );
  }
}

export function writeFileSync(name: string, contents: string) {
  fs.writeFileSync(path.join(process.cwd(), name), contents);
}
