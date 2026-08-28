"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSchema = exports.FakerType = void 0;
const zod_1 = require("zod");
exports.FakerType = zod_1.z.enum([
    "faker.string.uuid",
    "faker.internet.email",
    "faker.person.firstName",
    "faker.person.lastName",
    "faker.person.fullName",
]);
exports.MockSchema = zod_1.z.record(zod_1.z.string(), exports.FakerType);
//# sourceMappingURL=mock_schema.js.map