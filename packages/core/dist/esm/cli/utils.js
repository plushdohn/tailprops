import * as fs from "fs";
import * as path from "path";
export function readJsonSync(name) {
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
export function writeFileSync(name, contents) {
    fs.writeFileSync(path.join(process.cwd(), name), contents);
}
//# sourceMappingURL=utils.js.map