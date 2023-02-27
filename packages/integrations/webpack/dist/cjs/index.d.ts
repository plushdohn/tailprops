import { CleanPlugin, Compiler } from "webpack";
import { TailpropsPluginOptions as PluginOptions } from "./types";
export declare class TailpropsWebpackPlugin extends CleanPlugin {
    pluginOptions: PluginOptions;
    constructor(options: PluginOptions);
    apply(compiler: Compiler): void;
}
export type TailpropsPluginOptions = PluginOptions;
