import { faker } from "@faker-js/faker";
import type { FakerType } from "./mock_schema.js";

export type Airline = ReturnType<typeof faker.airline.airline>;
export type Airplane = ReturnType<typeof faker.airline.airplane>;
export type Airport = ReturnType<typeof faker.airline.airport>;

export const fakerGenerators: Record<
  FakerType,
  () => string | Airline | Airplane | Airport | number[] | boolean | Date
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
  //book
  "faker.book.author": () => faker.book.author(),
  "faker.book.format": () => faker.book.format(),
  "faker.book.genre": () => faker.book.genre(),
  "faker.book.publisher": () => faker.book.publisher(),
  "faker.book.series": () => faker.book.series(),
  "faker.book.title": () => faker.book.title(),
  //color
  "faker.color.cmyk": () => faker.color.cmyk(),
  "faker.color.colorByCSSColorSpace": () => faker.color.colorByCSSColorSpace(),
  "faker.color.cssSupportedFunction": () => faker.color.cssSupportedFunction(),
  "faker.color.cssSupportedSpace": () => faker.color.cssSupportedSpace(),
  "faker.color.hsl": () => faker.color.hsl(),
  "faker.color.human": () => faker.color.human(),
  "faker.color.hwb": () => faker.color.hwb(),
  "faker.color.lab": () => faker.color.lab(),
  "faker.color.lch": () => faker.color.lch(),
  "faker.color.rgb": () => faker.color.rgb(),
  "faker.color.space": () => faker.color.space(),
  //commerce
  "faker.commerce.department": () => faker.commerce.department(),
  "faker.commerce.isbn": () => faker.commerce.isbn(),
  "faker.commerce.price": () => faker.commerce.price(),
  "faker.commerce.product": () => faker.commerce.product(),
  "faker.commerce.productAdjective": () => faker.commerce.productAdjective(),
  "faker.commerce.productDescription": () =>
    faker.commerce.productDescription(),
  "faker.commerce.productMaterial": () => faker.commerce.productMaterial(),
  "faker.commerce.productName": () => faker.commerce.productName(),
  "faker.commerce.upc": () => faker.commerce.upc(),
  //company
  "faker.company.buzzAdjective": () => faker.company.buzzAdjective(),
  "faker.company.buzzNoun": () => faker.company.buzzNoun(),
  "faker.company.buzzPhrase": () => faker.company.buzzPhrase(),
  "faker.company.buzzVerb": () => faker.company.buzzVerb(),
  "faker.company.catchPhrase": () => faker.company.catchPhrase(),
  "faker.company.catchPhraseAdjective": () =>
    faker.company.catchPhraseAdjective(),
  "faker.company.catchPhraseDescriptor": () =>
    faker.company.catchPhraseDescriptor(),
  "faker.company.catchPhraseNoun": () => faker.company.catchPhraseNoun(),
  "faker.company.name": () => faker.company.name(),
  //database
  "faker.database.collation": () => faker.database.collation(),
  "faker.database.column": () => faker.database.column(),
  "faker.database.engine": () => faker.database.engine(),
  "faker.database.mongodbObjectId": () => faker.database.mongodbObjectId(),
  "faker.database.type": () => faker.database.type(),
  //datatype
  "faker.datatype.boolean": () => faker.datatype.boolean(),
  //date (between/betweens omitted: they require from/to arguments)
  "faker.date.anytime": () => faker.date.anytime(),
  "faker.date.birthdate": () => faker.date.birthdate(),
  "faker.date.future": () => faker.date.future(),
  "faker.date.month": () => faker.date.month(),
  "faker.date.past": () => faker.date.past(),
  "faker.date.recent": () => faker.date.recent(),
  "faker.date.soon": () => faker.date.soon(),
  "faker.date.timeZone": () => faker.date.timeZone(),
  "faker.date.weekday": () => faker.date.weekday(),
};
