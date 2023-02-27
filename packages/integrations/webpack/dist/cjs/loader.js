"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tailprops_1 = require("tailprops");
function default_1(input, sourceMap) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        this.cacheable(true);
        const options = this.getOptions();
        const webpackCallback = this.async();
        if (options.framework === "react" || options.framework === "preact") {
            let out;
            try {
                out = (0, tailprops_1.transpileJsUsingPropsObject)(input, {
                    classAttribute: "className",
                    generateSourceMaps: sourceMap,
                });
            }
            catch (err) {
                return webpackCallback(new Error(`${err.message}`));
            }
            return webpackCallback(null, out.code, (_a = out.map) !== null && _a !== void 0 ? _a : undefined);
        }
        return webpackCallback(new Error(`Framework '${options.framework}' is not supported by Tailprops. If you think it's horribly bad that we don't support this framework, please open an issue on GitHub.`));
    });
}
exports.default = default_1;
//# sourceMappingURL=loader.js.map