"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGracefulError = void 0;
const process_1 = require("process");
function createGracefulError(message) {
    console.log(`Error: ${message}`);
    (0, process_1.exit)(1);
}
exports.createGracefulError = createGracefulError;
//# sourceMappingURL=error.js.map