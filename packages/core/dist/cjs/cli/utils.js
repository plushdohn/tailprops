"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileSync = exports.readJsonSync = void 0;
const fs = require("fs");
const path = require("path");
function readJsonSync(name) {
    let file;
    try {
        file = fs.readFileSync(path.join(process.cwd(), name), {
            encoding: "utf-8",
        });
    }
    catch (_a) {
        return null;
    }
    try {
        return JSON.parse(file);
    }
    catch (err) {
        throw new Error(`A file seems to contain invalid JSON: ${err.message}`);
    }
}
exports.readJsonSync = readJsonSync;
function writeFileSync(name, contents) {
    fs.writeFileSync(path.join(process.cwd(), name), contents);
}
exports.writeFileSync = writeFileSync;
//# sourceMappingURL=utils.js.map