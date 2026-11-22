import { faker } from "@faker-js/faker";
import type { FakerType } from "./mock_schema.js";

export type Airline = ReturnType<typeof faker.airline.airline>;
export type Airplane = ReturnType<typeof faker.airline.airplane>;
export type Airport = ReturnType<typeof faker.airline.airport>;

export const fakerGenerators: Record<
  FakerType,
  () => string | Airline | Airplane | Airport | number[] | boolean
> = {
  "fake.string.uuid": () => faker.string.uuid(),
  "fake.internet.email": () => faker.internet.email(),
  "fake.person.firstName": () => faker.person.firstName(),
  "fake.person.lastName": () => faker.person.lastName(),
  "fake.person.fullName": () => faker.person.fullName(),
  //airline
  "fake.airline.aircraftType": () => faker.airline.aircraftType(),
  "fake.airline": () => faker.airline.airline(),
  "fake.airline.airplane": () => faker.airline.airplane(),
  "fake.airline.airport": () => faker.airline.airport(),
  "fake.airline.flightNumber": () => faker.airline.flightNumber(),
  "fake.airline.recordLocator": () => faker.airline.recordLocator(),
  "fake.airline.seat": () => faker.airline.seat(),
  //animal
  "fake.animal.bear": () => faker.animal.bear(),
  "fake.animal.bird": () => faker.animal.bird(),
  "fake.animal.cat": () => faker.animal.cat(),
  "fake.animal.cetacean": () => faker.animal.cetacean(),
  "fake.animal.cow": () => faker.animal.cow(),
  "fake.animal.crocodilia": () => faker.animal.crocodilia(),
  "fake.animal.dog": () => faker.animal.dog(),
  "fake.animal.fish": () => faker.animal.fish(),
  "fake.animal.horse": () => faker.animal.horse(),
  "fake.animal.insect": () => faker.animal.insect(),
  "fake.animal.lion": () => faker.animal.lion(),
  "fake.animal.petName": () => faker.animal.petName(),
  "fake.animal.rabbit": () => faker.animal.rabbit(),
  "fake.animal.rodent": () => faker.animal.rodent(),
  "fake.animal.snake": () => faker.animal.snake(),
  "fake.animal.type": () => faker.animal.type(),
  //book
  "fake.book.author": () => faker.book.author(),
  "fake.book.format": () => faker.book.format(),
  "fake.book.genre": () => faker.book.genre(),
  "fake.book.publisher": () => faker.book.publisher(),
  "fake.book.series": () => faker.book.series(),
  "fake.book.title": () => faker.book.title(),
  //color
  "fake.color.cmyk": () => faker.color.cmyk(),
  "fake.color.colorByCSSColorSpace": () => faker.color.colorByCSSColorSpace(),
  "fake.color.cssSupportedFunction": () => faker.color.cssSupportedFunction(),
  "fake.color.cssSupportedSpace": () => faker.color.cssSupportedSpace(),
  "fake.color.hsl": () => faker.color.hsl(),
  "fake.color.human": () => faker.color.human(),
  "fake.color.hwb": () => faker.color.hwb(),
  "fake.color.lab": () => faker.color.lab(),
  "fake.color.lch": () => faker.color.lch(),
  "fake.color.rgb": () => faker.color.rgb(),
  "fake.color.space": () => faker.color.space(),
  //commerce
  "fake.commerce.department": () => faker.commerce.department(),
  "fake.commerce.isbn": () => faker.commerce.isbn(),
  "fake.commerce.price": () => faker.commerce.price(),
  "fake.commerce.product": () => faker.commerce.product(),
  "fake.commerce.productAdjective": () => faker.commerce.productAdjective(),
  "fake.commerce.productDescription": () => faker.commerce.productDescription(),
  "fake.commerce.productMaterial": () => faker.commerce.productMaterial(),
  "fake.commerce.productName": () => faker.commerce.productName(),
  "fake.commerce.upc": () => faker.commerce.upc(),
  //company
  "fake.company.buzzAdjective": () => faker.company.buzzAdjective(),
  "fake.company.buzzNoun": () => faker.company.buzzNoun(),
  "fake.company.buzzPhrase": () => faker.company.buzzPhrase(),
  "fake.company.buzzVerb": () => faker.company.buzzVerb(),
  "fake.company.catchPhrase": () => faker.company.catchPhrase(),
  "fake.company.catchPhraseAdjective": () =>
    faker.company.catchPhraseAdjective(),
  "fake.company.catchPhraseDescriptor": () =>
    faker.company.catchPhraseDescriptor(),
  "fake.company.catchPhraseNoun": () => faker.company.catchPhraseNoun(),
  "fake.company.name": () => faker.company.name(),
  //database
  "fake.database.collation": () => faker.database.collation(),
  "fake.database.column": () => faker.database.column(),
  "fake.database.engine": () => faker.database.engine(),
  "fake.database.mongodbObjectId": () => faker.database.mongodbObjectId(),
  "fake.database.type": () => faker.database.type(),
  //datatype
  "fake.datatype.boolean": () => faker.datatype.boolean(),
  //date (between/betweens omitted: they require from/to arguments)
  "fake.date.anytime": () => faker.date.anytime().toISOString(),
  "fake.date.birthdate": () => faker.date.birthdate().toISOString(),
  "fake.date.future": () => faker.date.future().toISOString(),
  "fake.date.month": () => faker.date.month(),
  "fake.date.past": () => faker.date.past().toISOString(),
  "fake.date.recent": () => faker.date.recent().toISOString(),
  "fake.date.soon": () => faker.date.soon().toISOString(),
  "fake.date.timeZone": () => faker.date.timeZone(),
  "fake.date.weekday": () => faker.date.weekday(),
  //finance (currency omitted: returns an object, composable from the string-returning currency* methods)
  "fake.finance.accountName": () => faker.finance.accountName(),
  "fake.finance.accountNumber": () => faker.finance.accountNumber(),
  "fake.finance.amount": () => faker.finance.amount(),
  "fake.finance.bic": () => faker.finance.bic(),
  "fake.finance.bitcoinAddress": () => faker.finance.bitcoinAddress(),
  "fake.finance.creditCardCVV": () => faker.finance.creditCardCVV(),
  "fake.finance.creditCardIssuer": () => faker.finance.creditCardIssuer(),
  "fake.finance.creditCardNumber": () => faker.finance.creditCardNumber(),
  "fake.finance.currencyCode": () => faker.finance.currencyCode(),
  "fake.finance.currencyName": () => faker.finance.currencyName(),
  "fake.finance.currencyNumericCode": () => faker.finance.currencyNumericCode(),
  "fake.finance.currencySymbol": () => faker.finance.currencySymbol(),
  "fake.finance.ethereumAddress": () => faker.finance.ethereumAddress(),
  "fake.finance.iban": () => faker.finance.iban(),
  "fake.finance.litecoinAddress": () => faker.finance.litecoinAddress(),
  "fake.finance.pin": () => faker.finance.pin(),
  "fake.finance.routingNumber": () => faker.finance.routingNumber(),
  "fake.finance.transactionDescription": () =>
    faker.finance.transactionDescription(),
  "fake.finance.transactionType": () => faker.finance.transactionType(),
};
