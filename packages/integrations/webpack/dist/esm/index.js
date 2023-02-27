import { CleanPlugin } from "webpack";
export class TailpropsWebpackPlugin extends CleanPlugin {
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
//# sourceMappingURL=index.js.map