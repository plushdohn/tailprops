import type { LoaderContext } from "webpack";
import { TailpropsPluginOptions } from "./types";
export default function (this: LoaderContext<TailpropsPluginOptions>, input: string, sourceMap?: any): Promise<void>;
