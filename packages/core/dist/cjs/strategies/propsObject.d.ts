import * as parser from "@babel/parser";
import * as t from "@babel/types";
export declare function transpileJsUsingPropsObject(source: string, options: {
    classAttribute: string;
    generateSourceMaps?: boolean;
    ast?: parser.ParseResult<t.File>;
}): {
    code: string;
    map: {
        version: number;
        sources: string[];
        names: string[];
        sourceRoot?: string | undefined;
        sourcesContent?: string[] | undefined;
        mappings: string;
        file: string;
    } | null;
};
