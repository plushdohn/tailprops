"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpileJsUsingPropsObject = void 0;
const generator_1 = require("@babel/generator");
const parser = require("@babel/parser");
const traverse_1 = require("@babel/traverse");
const t = require("@babel/types");
const utils_1 = require("./utils");
function transpileJsUsingPropsObject(source, options) {
    let ast = options.ast;
    if (!ast) {
        ast = parser.parse(source, { sourceType: "unambiguous" });
    }
    (0, traverse_1.default)(ast, {
        ObjectExpression(path) {
            const tailwindProps = extractTailpropsClassesFromObjectNode(path, "tw");
            for (const prop of tailwindProps) {
                appendExpressionToObjectProperty(path.node, options.classAttribute, prop);
            }
        },
    });
    const newSource = (0, generator_1.default)(ast, { sourceMaps: options.generateSourceMaps });
    return {
        code: newSource.code,
        map: newSource.map,
    };
}
exports.transpileJsUsingPropsObject = transpileJsUsingPropsObject;
function extractTailpropsClassesFromObjectNode(path, prefix) {
    let props = [];
    for (const [i, p] of path.node.properties.entries()) {
        const property = getObjectPropertyAsTailprop(p, prefix);
        if (property !== null) {
            delete path.node.properties[i];
            const modifiers = (0, utils_1.getTailwindModifiersInAttribute)(property.key);
            const properties = (0, utils_1.getTailwindPropertiesInString)(property.value);
            props.push((0, utils_1.joinPropertiesUsingModifiers)(properties, modifiers));
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