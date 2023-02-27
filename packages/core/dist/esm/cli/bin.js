#! /usr/bin/env node
import { createGracefulError } from "./error";
import frameworks from "./frameworks";
import { readJsonSync, writeFileSync } from "./utils";
import { applyTransformToConfig } from "./config";
const command = process.argv[2];
if (!command || command !== "init") {
    createGracefulError(`Unknown command '${command}}'`);
}
const framework = process.argv[3];
if (!framework) {
    createGracefulError(`No framework specified. Please specify a framework to generate types for.\n\nExample: npx tailprops init react`);
}
if (!frameworks[framework]) {
    createGracefulError(`Unsupported framework '${framework}'. Supported frameworks: ${Object.keys(frameworks).join(", ")}`);
}
console.log("Applying transform to Tailwind config...");
applyTransformToConfig(frameworks[framework].extensions);
console.log(`Creating types for '${framework}'...`);
let types = frameworks[framework].typesCode;
try {
    writeFileSync("tailprops.d.ts", types);
}
catch (_a) {
    createGracefulError(`Couldn't write types file. Make sure tailprops.d.ts isn't open somewhere and that you have write permissions on this folder.`);
}
let tsconfig;
try {
    tsconfig = readJsonSync("tsconfig.json");
}
catch (_b) {
    createGracefulError(`Couldn't read tsconfig.json. If you aren't using TS you can ignore this error.`);
}
if (tsconfig) {
    console.log("Adding types to tsconfig.json...");
    if (!tsconfig.include) {
        tsconfig.include = [];
    }
    tsconfig.include.push("tailprops.d.ts");
    try {
        writeFileSync("tsconfig.json", JSON.stringify(tsconfig, null, 2));
    }
    catch (_c) {
        createGracefulError(`Couldn't write to tsconfig.json. Make sure it isn't open somewhere and that you have write permissions on this folder.`);
    }
}
console.log("Done!");
//# sourceMappingURL=bin.js.map