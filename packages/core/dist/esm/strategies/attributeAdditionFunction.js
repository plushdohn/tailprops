/**
 * This strategy exists mainly to address Svelte's hydration phase.
 *
 * Changing the attributes on the server-rendered component is not
 * enough for the changes to persist as they get rewritten by the
 * client-side hydration.
 *
 * As of now, Svelte creates some object with a function property
 * which is called during hydration. This function is responsible
 * for setting the attributes on the element.
 *
 * This strategy will transform the function block, removing all
 * calls to "tw" attributes and transform them into a single
 * "class" attribute with the modifiers applied.
 *
 * The original code looks something like this:
 *
 * m: function hydrate() {
 *  attr_dev(h1, "class", "existing-class");
 *  attr_dev(h1, "tw", "bg-red-500");
 *  attr_dev(h1, "tw-hover", "bg-red-400");
 * }
 *
 * And it will be transformed into:
 *
 * m: function hydrate() {
 *  attr_dev(h1, "class", "existing-class" + " " + "bg-red-500" + " " + "hover:bg-red-400");
 * }
 */
import generate from "@babel/generator";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { getTailwindModifiersInAttribute, getTailwindPropertiesInString, joinPropertiesUsingModifiers, } from "./utils";
export function transpileUsingAttributeAdditionFunction(source, options = {
    classAttributeKeyword: "class",
    attributeFunctionId: "attr_dev",
}) {
    let ast = options.ast;
    if (!ast) {
        ast = parser.parse(source, { sourceType: "unambiguous" });
    }
    transformFunctionBlock(ast, options);
    const newSource = generate(ast, { sourceMaps: options.generateSourceMaps });
    return {
        code: newSource.code,
        map: newSource.map,
    };
}
function transformFunctionBlock(ast, options) {
    const tailpropNodes = {};
    const classNodes = {};
    traverseOnFunctionExpression(ast, (functionPath) => {
        subTraverseOnCallExpression(functionPath, options.attributeFunctionId, (callPath) => {
            const tailprop = tryGetCallExpressionAsTailprop(callPath, options.attributeFunctionId);
            if (tailprop !== null) {
                subTraverseOnStringLiterals(callPath, tailprop.attribute, (path) => {
                    const properties = getTailwindPropertiesInString(path.node.value);
                    path.node.value = joinPropertiesUsingModifiers(properties, tailprop.modifiers);
                });
                const currentTailpropNodes = tailpropNodes[tailprop.elementName] || [];
                tailpropNodes[tailprop.elementName] = [
                    ...currentTailpropNodes,
                    callPath.node.arguments[2],
                ];
                return callPath.remove();
            }
            const classAttribute = tryGetCallExpressionAsClassAttribute(callPath, options.attributeFunctionId);
            if (classAttribute) {
                classNodes[classAttribute.elementName] = {
                    path: callPath,
                    expression: callPath.node.arguments[2],
                };
            }
        });
        /**
         * Re-traverse function body to eliminate all stored class
         * nodes, since we'll create a new one.
         * TODO: Find a way to avoid doing this. It's probably best
         * to not remove them altogether.
         */
        subTraverseOnCallExpression(functionPath, options.attributeFunctionId, (callPath) => {
            const classAttribute = tryGetCallExpressionAsClassAttribute(callPath, options.attributeFunctionId);
            if (classAttribute && tailpropNodes[classAttribute.elementName]) {
                classAttribute.path.remove();
            }
        });
        // Add new class node for each tailprop node
        for (const [element, tailprops] of Object.entries(tailpropNodes)) {
            addCallExpressionToFunctionBody(functionPath.node, t.callExpression(t.identifier(options.attributeFunctionId), [
                t.identifier(element),
                t.stringLiteral(options.classAttributeKeyword),
                mergeExpressionsWithSpaces([
                    ...(classNodes[element] ? [classNodes[element].expression] : []),
                    ...tailprops,
                ]),
            ]));
        }
    });
}
function subTraverseOnStringLiterals(path, except, callback) {
    traverse(path.node, {
        StringLiteral(path) {
            if (path.node.value !== except) {
                callback(path);
            }
        },
    }, path.scope, path.state, path.parentPath);
}
function tryGetCallExpressionAsTailprop(path, attributeFunctionId) {
    if (path.node.callee.type === "Identifier" &&
        path.node.callee.name === attributeFunctionId &&
        path.node.arguments[0].type === "Identifier" &&
        path.node.arguments[1].type === "StringLiteral" &&
        path.node.arguments[1].value.startsWith("tw")) {
        return {
            modifiers: getTailwindModifiersInAttribute(path.node.arguments[1].value),
            elementName: path.node.arguments[0].name,
            attribute: path.node.arguments[1].value,
        };
    }
    return null;
}
function tryGetCallExpressionAsClassAttribute(path, attributeFunctionId) {
    if (path.node.callee.type === "Identifier" &&
        path.node.callee.name === attributeFunctionId &&
        path.node.arguments[0].type === "Identifier" &&
        path.node.arguments[1].type === "StringLiteral" &&
        path.node.arguments[1].value === "class") {
        return {
            elementName: path.node.arguments[0].name,
            path,
            expression: path.node.arguments[2],
        };
    }
    return null;
}
function mergeExpressionsWithSpaces(expressions) {
    return expressions.slice(1).reduce((acc, expression) => {
        return t.binaryExpression("+", t.binaryExpression("+", acc, t.stringLiteral(" ")), expression);
    }, expressions[0]);
}
function subTraverseOnCallExpression(path, functionIdentifier, callback) {
    traverse(path.node, {
        CallExpression(path) {
            if (path.node.callee.type === "Identifier" &&
                path.node.callee.name === functionIdentifier) {
                callback(path);
            }
        },
    }, path.scope, path.state, path.parentPath);
}
function addCallExpressionToFunctionBody(node, callExpression) {
    node.body.body.push(t.expressionStatement(callExpression));
}
function traverseOnFunctionExpression(ast, callback) {
    traverse(ast, {
        FunctionExpression(path) {
            if (path.node.id)
                callback(path);
        },
        ObjectMethod(path) {
            if (path.node.key.type === "Identifier")
                callback(path);
        },
    });
}
//# sourceMappingURL=attributeAdditionFunction.js.map