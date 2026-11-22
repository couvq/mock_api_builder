import { faker } from "@faker-js/faker";
import type { FakerType } from "./mock_schema.js";

export type Airline = ReturnType<typeof faker.airline.airline>;
export type Airplane = ReturnType<typeof faker.airline.airplane>;
export type Airport = ReturnType<typeof faker.airline.airport>;

export const fakerGenerators: Record<
  FakerType,
  () => string | Airline | Airplane | Airport
> = {
  "faker.string.uuid": () => faker.string.uuid(),
  "faker.internet.email": () => faker.internet.email(),
  "faker.person.firstName": () => faker.person.firstName(),
  "faker.person.lastName": () => faker.person.lastName(),
  "faker.person.fullName": () => faker.person.fullName(),
  //airline
  "faker.airline.aircraftType": () => faker.airline.aircraftType(),
  "faker.airline": () => faker.airline.airline(),
  "faker.airline.airplane": () => faker.airline.airplane(),
  "faker.airline.airport": () => faker.airline.airport(),
  "faker.airline.flightNumber": () => faker.airline.flightNumber(),
  "faker.airline.recordLocator": () => faker.airline.recordLocator(),
  "faker.airline.seat": () => faker.airline.seat(),
};
