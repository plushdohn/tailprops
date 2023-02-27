"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TailpropsWebpackPlugin = void 0;
const webpack_1 = require("webpack");
class TailpropsWebpackPlugin extends webpack_1.CleanPlugin {
    constructor(options) {
        super(options);
        this.pluginOptions = options;
    }
    apply(compiler) {
        compiler.options.module.rules.unshift({
            test: /\.(tsx|ts|js|jsx)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: require.resolve("./loader"),
                    options: this.pluginOptions,
                },
            ],
        });
    }
}
exports.TailpropsWebpackPlugin = TailpropsWebpackPlugin;
//# sourceMappingURL=index.js.map