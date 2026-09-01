import type { FakerType } from "./mock_schema.js";
import { faker } from "@faker-js/faker";

export const fakerGenerators: Record<FakerType, () => string> = {
  "faker.string.uuid": () => faker.string.uuid(),
  "faker.internet.email": () => faker.internet.email(),
  "faker.person.firstName": () => faker.person.firstName(),
  "faker.person.lastName": () => faker.person.lastName(),
  "faker.person.fullName": () => faker.person.fullName(),
};
