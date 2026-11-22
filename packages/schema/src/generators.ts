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
  //animal
  "faker.animal.bear": () => faker.animal.bear(),
  "faker.animal.bird": () => faker.animal.bird(),
  "faker.animal.cat": () => faker.animal.cat(),
  "faker.animal.cetacean": () => faker.animal.cetacean(),
  "faker.animal.cow": () => faker.animal.cow(),
  "faker.animal.crocodilia": () => faker.animal.crocodilia(),
  "faker.animal.dog": () => faker.animal.dog(),
  "faker.animal.fish": () => faker.animal.fish(),
  "faker.animal.horse": () => faker.animal.horse(),
  "faker.animal.insect": () => faker.animal.insect(),
  "faker.animal.lion": () => faker.animal.lion(),
  "faker.animal.petName": () => faker.animal.petName(),
  "faker.animal.rabbit": () => faker.animal.rabbit(),
  "faker.animal.rodent": () => faker.animal.rodent(),
  "faker.animal.snake": () => faker.animal.snake(),
  "faker.animal.type": () => faker.animal.type(),
};
