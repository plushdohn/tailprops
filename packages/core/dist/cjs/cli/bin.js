#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
const frameworks_1 = require("./frameworks");
const utils_1 = require("./utils");
const config_1 = require("./config");
const command = process.argv[2];
if (!command || command !== "init") {
    (0, error_1.createGracefulError)(`Unknown command '${command}}'`);
}
const framework = process.argv[3];
if (!framework) {
    (0, error_1.createGracefulError)(`No framework specified. Please specify a framework to generate types for.\n\nExample: npx tailprops init react`);
}
if (!frameworks_1.default[framework]) {
    (0, error_1.createGracefulError)(`Unsupported framework '${framework}'. Supported frameworks: ${Object.keys(frameworks_1.default).join(", ")}`);
}
console.log("Applying transform to Tailwind config...");
(0, config_1.applyTransformToConfig)(frameworks_1.default[framework].extensions);
console.log(`Creating types for '${framework}'...`);
let types = frameworks_1.default[framework].typesCode;
try {
    (0, utils_1.writeFileSync)("tailprops.d.ts", types);
}
catch (_a) {
    (0, error_1.createGracefulError)(`Couldn't write types file. Make sure tailprops.d.ts isn't open somewhere and that you have write permissions on this folder.`);
}
let tsconfig;
try {
    tsconfig = (0, utils_1.readJsonSync)("tsconfig.json");
}
catch (_b) {
    (0, error_1.createGracefulError)(`Couldn't read tsconfig.json. If you aren't using TS you can ignore this error.`);
}
if (tsconfig) {
    console.log("Adding types to tsconfig.json...");
    if (!tsconfig.include) {
        tsconfig.include = [];
    }
    tsconfig.include.push("tailprops.d.ts");
    try {
        (0, utils_1.writeFileSync)("tsconfig.json", JSON.stringify(tsconfig, null, 2));
    }
    catch (_c) {
        (0, error_1.createGracefulError)(`Couldn't write to tsconfig.json. Make sure it isn't open somewhere and that you have write permissions on this folder.`);
    }
}
console.log("Done!");
//# sourceMappingURL=bin.js.map