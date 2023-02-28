import generate from "@babel/generator";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { getTailwindModifiersInAttribute, getTailwindPropertiesInString, joinPropertiesUsingModifiers, } from "./utils";
export function transpileJsUsingPropsObject(source, options) {
    let ast = options.ast;
    if (!ast) {
        ast = parser.parse(source, { sourceType: "unambiguous" });
    }
    traverse(ast, {
        ObjectExpression(path) {
            const tailwindProps = extractTailpropsClassesFromObjectNode(path, "tw");
            for (const prop of tailwindProps) {
                appendExpressionToObjectProperty(path.node, options.classAttribute, prop);
            }
        },
    });
    const newSource = generate(ast, { sourceMaps: options.generateSourceMaps });
    return {
        code: newSource.code,
        map: newSource.map,
    };
}
function extractTailpropsClassesFromObjectNode(path, prefix) {
    let props = [];
    for (const [i, p] of path.node.properties.entries()) {
        const property = getObjectPropertyAsTailprop(p, prefix);
        if (property !== null) {
            delete path.node.properties[i];
            const modifiers = getTailwindModifiersInAttribute(property.key);
            const properties = getTailwindPropertiesInString(property.value);
            props.push(joinPropertiesUsingModifiers(properties, modifiers));
        }
    }
    // Clear up dangling nodes
    path.node.properties = path.node.properties.filter((p) => p !== undefined);
    return props;
}
function getObjectPropertyAsTailprop(p, prefix) {
    if (p.type === "ObjectProperty") {
        if (p.key.type === "Identifier" && p.key.name.startsWith(prefix)) {
            if (p.value.type !== "StringLiteral")
                throw new Error("Expressions in Tailprops are not supported. Please use flat string literals and move your expression to the class attribute.");
            return {
                key: p.key.name,
                value: p.value.value,
            };
        }
        if (p.key.type === "StringLiteral" && p.key.value.startsWith(prefix)) {
            if (p.value.type !== "StringLiteral")
                throw new Error("Expressions in Tailprops are not supported. Please use flat string literals and move your expression to the class attribute.");
            return {
                key: p.key.value,
                value: p.value.value,
            };
        }
    }
    return null;
}
function appendExpressionToObjectProperty(node, key, value) {
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
    });
    if (!property) {
        node.properties.push(t.objectProperty(t.identifier(key), t.stringLiteral(value)));
        return;
    }
    if (!isObjectPropertyConcatenable(property.value)) {
        throw new Error(`Value type for property ${key} can't be concatenated on: ${property.value.type}`);
    }
    property.value = t.binaryExpression("+", t.binaryExpression("+", property.value, t.stringLiteral(" ")), t.stringLiteral(value));
}
function isObjectPropertyConcatenable(expression) {
    return (expression.type !== "RestElement" &&
        expression.type !== "NullLiteral" &&
        expression.type !== "AssignmentPattern" &&
        expression.type !== "ArrayPattern" &&
        expression.type !== "ObjectPattern");
}
//# sourceMappingURL=propsObject.js.map