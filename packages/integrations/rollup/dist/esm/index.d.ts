import type { TransformHook } from "rollup";
import { TailpropsPluginOptions } from "./types";
export declare function tailpropsPlugin(options: TailpropsPluginOptions): {
    name: string;
    transform: TransformHook;
};
