import { TailpropsWebpackPlugin, } from "tailprops-webpack-plugin";
export function withTailprops(nextConfig, options = { framework: "react" }) {
    const modifiedConfig = Object.assign(Object.assign({}, nextConfig), { webpack(config, context) {
            config.plugins.unshift(new TailpropsWebpackPlugin(options));
            if (nextConfig.webpack && typeof nextConfig.webpack === "function") {
                return nextConfig.webpack(config, context);
            }
            return config;
        } });
    return modifiedConfig;
}
//# sourceMappingURL=index.js.map