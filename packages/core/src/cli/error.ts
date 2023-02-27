import { exit } from "process";

export function createGracefulError(message: string): never {
  console.log(`Error: ${message}`);
  exit(1);
}
