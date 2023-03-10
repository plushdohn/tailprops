import * as parser from "@babel/parser";
import * as path from "path";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { readFileSync, writeFileSync } from "fs";
import generate from "@babel/generator";

export function applyTransformToConfig(source: string) {
  const ast = parser.parse(source, {
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
        throw new Error(
          "Couldn't find module.exports in tailwind.config.js, aborting."
        );
      }

      path.node.right = t.callExpression(t.identifier("withTailprops"), [
        right,
      ]);
    },
  });

  const updated = generate(ast).code;

  return `const { withTailprops } = require("tailprops");\n${updated}`;
}

export function overwriteConfigFile(source: string, fileName: string) {
  writeFileSync(path.join(process.cwd(), fileName), source);
}

export function readConfigFile() {
  try {
    const source = readFileSync(
      path.join(process.cwd(), "tailwind.config.js"),
      {
        encoding: "utf-8",
      }
    );

    return { source, fileName: "tailwind.config.js" };
  } catch {
    try {
      const source = readFileSync(
        path.join(process.cwd(), "tailwind.config.cjs"),
        {
          encoding: "utf-8",
        }
      );

      return { source, fileName: "tailwind.config.cjs" };
    } catch {
      throw new Error(
        "Couldn't find tailwind.config.js or tailwind.config.cjs. Make sure you're running this command in the root of your project."
      );
    }
  }
}

export function getActualConfigFromConfigSource(source: string) {
  const ast = parser.parse(source, {
    sourceType: "module",
  });

  let result;

  traverse(ast, {
    ObjectProperty(path) {
      const { node } = path;

      if (node.key.type === "Identifier" && node.key.name === "theme") {
        t.assertObjectExpression(path.parent);

        result = unsafeEvaluateObjectExpression(path.parent);
      }
    },
  });

  if (!result)
    throw new Error("Couldn't find a config in tailwind.config file");

  return result as Record<string, any>;
}

function unsafeEvaluateObjectExpression(expr: t.ObjectExpression) {
  const object: Record<string, any> = {};

  for (const property of expr.properties) {
    if (t.isObjectProperty(property)) {
      const { key, value } = property;

      if (t.isIdentifier(key)) {
        if (t.isObjectExpression(value)) {
          object[key.name] = unsafeEvaluateObjectExpression(value);
        } else if (t.isStringLiteral(value) || t.isNumericLiteral(value)) {
          object[key.name] = value.value;
        }
      }
    }
  }

  return object;
}
