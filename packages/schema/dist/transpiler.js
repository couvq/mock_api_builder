"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transpile = void 0;
const generators_js_1 = require("./generators.js");
const transpile = (schema) => {
    const transpiledSchema = {};
    for (const [key, fakerType] of Object.entries(schema)) {
        transpiledSchema[key] = generators_js_1.fakerGenerators[fakerType]();
    }
    return transpiledSchema;
};
exports.transpile = transpile;
//# sourceMappingURL=transpiler.js.map