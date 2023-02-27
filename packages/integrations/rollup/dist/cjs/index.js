"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tailpropsPlugin = void 0;
const tailprops_1 = require("tailprops");
function tailpropsPlugin(options) {
    const transform = function (code, id) {
        const context = this.meta;
        if (options.framework === "svelte-ssr") {
            if (id.endsWith(".svelte")) {
                code = (0, tailprops_1.transpileUsingTemplateLiteralAttributeInjection)(code);
                return (0, tailprops_1.transpileUsingAttributeAdditionFunction)(code, {
                    attributeFunctionId: context.watchMode ? "attr_dev" : "attr",
                    classAttributeKeyword: "class",
                }).code;
            }
            return null;
        }
        throw new Error(`Framework '${options.framework}' is not supported by the Tailprops Rollup plugin. If you think it's horribly bad that we don't support this framework, please open an issue on GitHub.`);
    };
    return {
        name: "tailprops",
        transform,
    };
}
exports.tailpropsPlugin = tailpropsPlugin;
//# sourceMappingURL=index.js.map