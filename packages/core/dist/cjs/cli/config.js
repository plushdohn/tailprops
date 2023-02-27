"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTransformToConfig = void 0;
const parser = require("@babel/parser");
const path = require("path");
const traverse_1 = require("@babel/traverse");
const t = require("@babel/types");
const fs_1 = require("fs");
const error_1 = require("./error");
const generator_1 = require("@babel/generator");
function applyTransformToConfig(extensions) {
    const config = readConfigFile();
    const ast = parser.parse(config.source, {
        sourceType: "module",
    });
    (0, traverse_1.default)(ast, {
        AssignmentExpression(path) {
            const { node } = path;
            const { left, right } = node;
            if (left.type !== "MemberExpression" ||
                left.property.type !== "Identifier" ||
                left.property.name !== "exports")
                return;
            try {
                t.assertExpression(right);
            }
            catch (_a) {
                (0, error_1.createGracefulError)("Couldn't find module.exports in tailwind.config.js, aborting.");
            }
            path.node.right = t.callExpression(t.identifier("withTailprops"), [
                t.arrayExpression(extensions.map((ext) => t.stringLiteral(ext))),
                right,
            ]);
        },
    });
    const { code } = (0, generator_1.default)(ast);
    (0, fs_1.writeFileSync)(path.join(process.cwd(), config.file), `const { withTailprops } = require("tailprops");\n${code}`);
}
exports.applyTransformToConfig = applyTransformToConfig;
function readConfigFile() {
    try {
        const source = (0, fs_1.readFileSync)(path.join(process.cwd(), "tailwind.config.js"), {
            encoding: "utf-8",
        });
        return { source, file: "tailwind.config.js" };
    }
    catch (_a) {
        try {
            const source = (0, fs_1.readFileSync)(path.join(process.cwd(), "tailwind.config.cjs"), {
                encoding: "utf-8",
            });
            return { source, file: "tailwind.config.cjs" };
        }
        catch (_b) {
            (0, error_1.createGracefulError)("Couldn't find tailwind.config.js or tailwind.config.cjs. Make sure you're running this command in the root of your project.");
        }
    }
}
//# sourceMappingURL=config.js.map