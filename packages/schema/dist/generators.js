"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakerGenerators = void 0;
const faker_1 = require("@faker-js/faker");
exports.fakerGenerators = {
    "faker.string.uuid": () => faker_1.faker.string.uuid(),
    "faker.internet.email": () => faker_1.faker.internet.email(),
    "faker.person.firstName": () => faker_1.faker.person.firstName(),
    "faker.person.lastName": () => faker_1.faker.person.lastName(),
    "faker.person.fullName": () => faker_1.faker.person.fullName(),
};
//# sourceMappingURL=generators.js.map