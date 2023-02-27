"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tailpropsTailwindTransform = exports.withTailprops = exports.transpileUsingAttributeAdditionFunction = exports.transpileUsingTemplateLiteralAttributeInjection = exports.transpileJsUsingPropsObject = void 0;
var propsObject_1 = require("./strategies/propsObject");
Object.defineProperty(exports, "transpileJsUsingPropsObject", { enumerable: true, get: function () { return propsObject_1.transpileJsUsingPropsObject; } });
var svelteTemplateLiterals_1 = require("./strategies/svelteTemplateLiterals");
Object.defineProperty(exports, "transpileUsingTemplateLiteralAttributeInjection", { enumerable: true, get: function () { return svelteTemplateLiterals_1.transpileUsingTemplateLiteralAttributeInjection; } });
var attributeAdditionFunction_1 = require("./strategies/attributeAdditionFunction");
Object.defineProperty(exports, "transpileUsingAttributeAdditionFunction", { enumerable: true, get: function () { return attributeAdditionFunction_1.transpileUsingAttributeAdditionFunction; } });
var transform_1 = require("./transform");
Object.defineProperty(exports, "withTailprops", { enumerable: true, get: function () { return transform_1.withTailprops; } });
Object.defineProperty(exports, "tailpropsTailwindTransform", { enumerable: true, get: function () { return transform_1.tailpropsTailwindTransform; } });
//# sourceMappingURL=index.js.map