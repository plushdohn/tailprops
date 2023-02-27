"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTailprops = void 0;
const tailprops_webpack_plugin_1 = require("tailprops-webpack-plugin");
function withTailprops(nextConfig, options = { framework: "react" }) {
    const modifiedConfig = Object.assign(Object.assign({}, nextConfig), { webpack(config, context) {
            config.plugins.unshift(new tailprops_webpack_plugin_1.TailpropsWebpackPlugin(options));
            if (nextConfig.webpack && typeof nextConfig.webpack === "function") {
                return nextConfig.webpack(config, context);
            }
            return config;
        } });
    return modifiedConfig;
}
exports.withTailprops = withTailprops;
//# sourceMappingURL=index.js.map