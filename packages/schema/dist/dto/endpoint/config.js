"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointConfig = void 0;
const zod_1 = require("zod");
const mock_schema_1 = require("../../mock_schema");
exports.EndpointConfig = zod_1.z.object({
    id: zod_1.z.string(),
    method: zod_1.z.enum(['GET']),
    path: zod_1.z.string(),
    responseSchema: mock_schema_1.MockSchema
});
//# sourceMappingURL=config.js.map