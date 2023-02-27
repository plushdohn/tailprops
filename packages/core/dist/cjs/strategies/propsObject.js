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
            const tailwindClasses = extractTailpropsClassesFromObjectNode(path, "tw");
            if (tailwindClasses) {
                for (const expression of tailwindClasses) {
                    appendExpressionToObjectProperty(path.node, options.classAttribute, expression);
                }
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
    let expressions = [];
    for (const [i, p] of path.node.properties.entries()) {
        const property = getObjectPropertyAsTailprop(p, prefix);
        if (property !== null) {
            delete path.node.properties[i];
            const modifiers = (0, utils_1.getTailwindModifiersInAttribute)(property.key);
            if (property.expression.type === "StringLiteral") {
                const properties = (0, utils_1.getTailwindPropertiesInString)(property.expression.value);
                property.expression.value = (0, utils_1.joinPropertiesUsingModifiers)(properties, modifiers);
                expressions.push(property.expression);
                continue;
            }
            (0, traverse_1.default)(property.expression, {
                StringLiteral({ node }) {
                    const properties = (0, utils_1.getTailwindPropertiesInString)(node.value);
                    node.value = (0, utils_1.joinPropertiesUsingModifiers)(properties, modifiers);
                },
            }, path.scope, null, path.parentPath);
            expressions.push(property.expression);
        }
    }
    // Clear up dangling nodes
    path.node.properties = path.node.properties.filter((p) => p !== undefined);
    return expressions;
}
function getObjectPropertyAsTailprop(p, prefix) {
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
        node.properties.push(t.objectProperty(t.identifier(key), value));
        return;
    }
    if (!isObjectPropertyConcatenable(property.value)) {
        throw new Error(`Value type for property ${key} can't be concatenated on: ${property.value.type}`);
    }
    if (!isObjectPropertyConcatenable(value)) {
        throw new Error(`Passed a value type for key ${key} that can't be used for concatenation: ${property.value.type}`);
    }
    property.value = t.binaryExpression("+", property.value, t.binaryExpression("+", t.stringLiteral(" "), value));
}
function isObjectPropertyConcatenable(expression) {
    return (expression.type !== "RestElement" &&
        expression.type !== "NullLiteral" &&
        expression.type !== "AssignmentPattern" &&
        expression.type !== "ArrayPattern" &&
        expression.type !== "ObjectPattern");
}
//# sourceMappingURL=propsObject.js.map