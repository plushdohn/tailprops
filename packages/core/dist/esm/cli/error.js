import { exit } from "process";
export function createGracefulError(message) {
    console.log(`Error: ${message}`);
    exit(1);
}
//# sourceMappingURL=error.js.map