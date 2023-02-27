import * as parser from "@babel/parser";
import * as path from "path";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { readFileSync, writeFileSync } from "fs";
import { createGracefulError } from "./error";
import generate from "@babel/generator";

export function applyTransformToConfig(extensions: string[]) {
  const config = readConfigFile();

  const ast = parser.parse(config.source, {
    sourceType: "module",
  });

  traverse(ast, {
    AssignmentExpression(path) {
      const { node } = path;

      const { left, right } = node;

      if (
        left.type !== "MemberExpression" ||
        left.property.type !== "Identifier" ||
        left.property.name !== "exports"
      )
        return;

      try {
        t.assertExpression(right);
      } catch {
        createGracefulError(
          "Couldn't find module.exports in tailwind.config.js, aborting."
        );
      }

      path.node.right = t.callExpression(t.identifier("withTailprops"), [
        t.arrayExpression(extensions.map((ext) => t.stringLiteral(ext))),
        right,
      ]);
    },
  });

  const { code } = generate(ast);

  writeFileSync(
    path.join(process.cwd(), config.file),
    `const { withTailprops } = require("tailprops");\n${code}`
  );
}

function readConfigFile() {
  try {
    const source = readFileSync(
      path.join(process.cwd(), "tailwind.config.js"),
      {
        encoding: "utf-8",
      }
    );

    return { source, file: "tailwind.config.js" };
  } catch {
    try {
      const source = readFileSync(
        path.join(process.cwd(), "tailwind.config.cjs"),
        {
          encoding: "utf-8",
        }
      );

      return { source, file: "tailwind.config.cjs" };
    } catch {
      createGracefulError(
        "Couldn't find tailwind.config.js or tailwind.config.cjs. Make sure you're running this command in the root of your project."
      );
    }
  }
}
