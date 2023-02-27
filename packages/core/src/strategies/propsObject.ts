import generate from "@babel/generator";
import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  getTailwindModifiersInAttribute,
  getTailwindPropertiesInString,
  joinPropertiesUsingModifiers,
} from "./utils";

export function transpileJsUsingPropsObject(
  source: string,
  options: {
    classAttribute: string;
    generateSourceMaps?: boolean;
    ast?: parser.ParseResult<t.File>;
  }
) {
  let ast = options.ast;

  if (!ast) {
    ast = parser.parse(source, { sourceType: "unambiguous" });
  }

  traverse(ast, {
    ObjectExpression(path) {
      const tailwindClasses = extractTailpropsClassesFromObjectNode(path, "tw");

      if (tailwindClasses) {
        for (const expression of tailwindClasses) {
          appendExpressionToObjectProperty(
            path.node,
            options.classAttribute,
            expression
          );
        }
      }
    },
  });

  const newSource = generate(ast, { sourceMaps: options.generateSourceMaps });

  return {
    code: newSource.code,
    map: newSource.map,
  };
}

function extractTailpropsClassesFromObjectNode(
  path: NodePath<t.ObjectExpression>,
  prefix: string
) {
  let expressions: t.ObjectProperty["value"][] = [];

  for (const [i, p] of path.node.properties.entries()) {
    const property = getObjectPropertyAsTailprop(p, prefix);

    if (property !== null) {
      delete path.node.properties[i];

      const modifiers = getTailwindModifiersInAttribute(property.key);

      if (property.expression.type === "StringLiteral") {
        const properties = getTailwindPropertiesInString(
          property.expression.value
        );

        property.expression.value = joinPropertiesUsingModifiers(
          properties,
          modifiers
        );

        expressions.push(property.expression);

        continue;
      }

      traverse(
        property.expression,
        {
          StringLiteral({ node }) {
            const properties = getTailwindPropertiesInString(node.value);

            node.value = joinPropertiesUsingModifiers(properties, modifiers);
          },
        },
        path.scope,
        null,
        path.parentPath
      );

      expressions.push(property.expression);
    }
  }

  // Clear up dangling nodes
  path.node.properties = path.node.properties.filter((p) => p !== undefined);

  return expressions;
}

function getObjectPropertyAsTailprop(
  p: t.ObjectProperty | t.SpreadElement | t.ObjectMethod,
  prefix: string
) {
  if (p.type === "ObjectProperty") {
    if (p.key.type === "Identifier" && p.key.name.startsWith(prefix)) {
      return {
        key: p.key.name,
        expression: p.value,
      };
    }

    if (p.key.type === "StringLiteral" && p.key.value.startsWith(prefix)) {
      return {
        key: p.key.value,
        expression: p.value,
      };
    }
  }

  return null;
}

function appendExpressionToObjectProperty(
  node: t.ObjectExpression,
  key: string,
  value: t.ObjectProperty["value"]
) {
  // Find property with matching key
  const property = node.properties.find((p) => {
    if ("key" in p) {
      if (p.key.type === "Identifier" && p.key.name === key) {
        return true;
      }

      if (p.key.type === "StringLiteral" && p.key.value === key) {
        return true;
      }
    }
  }) as t.ObjectProperty | undefined;

  if (!property) {
    node.properties.push(t.objectProperty(t.identifier(key), value));
    return;
  }

  if (!isObjectPropertyConcatenable(property.value)) {
    throw new Error(
      `Value type for property ${key} can't be concatenated on: ${property.value.type}`
    );
  }

  if (!isObjectPropertyConcatenable(value)) {
    throw new Error(
      `Passed a value type for key ${key} that can't be used for concatenation: ${property.value.type}`
    );
  }

  property.value = t.binaryExpression(
    "+",
    property.value as t.Expression,
    t.binaryExpression("+", t.stringLiteral(" "), value as t.Expression)
  );
}

function isObjectPropertyConcatenable(expression: t.ObjectProperty["value"]) {
  return (
    expression.type !== "RestElement" &&
    expression.type !== "NullLiteral" &&
    expression.type !== "AssignmentPattern" &&
    expression.type !== "ArrayPattern" &&
    expression.type !== "ObjectPattern"
  );
}
