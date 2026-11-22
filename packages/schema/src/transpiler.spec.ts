import { describe, expect, it, vi } from "vitest";
import { transpile } from "./transpiler.js";
import { FakerType } from "./index.js";

type MockAirline = { name: string; iataCode: string };
type MockAirplane = { name: string; iataTypeCode: string };

const MOCK_FAKER_VALUES: Record<
  FakerType,
  string | MockAirline | MockAirplane | number[] | boolean
> = {
  "fake.string.uuid": "test-uuid",
  "fake.internet.email": "test@example.com",
  "fake.person.firstName": "John",
  "fake.person.lastName": "Doe",
  "fake.person.fullName": "John Doe",
  "fake.airline.aircraftType": "narrowbody",
  "fake.airline": { name: "American Airlines", iataCode: "AA" },
  "fake.airline.airplane": { name: "Airbus A321", iataTypeCode: "321" },
  "fake.airline.airport": {
    name: "Dallas Fort Worth International Airport",
    iataCode: "DFW",
  },
  "fake.airline.flightNumber": "1234",
  "fake.airline.recordLocator": "ABC123",
  "fake.airline.seat": "12A",
  "fake.animal.bear": "Asian black bear",
  "fake.animal.bird": "Buller's Shearwater",
  "fake.animal.cat": "Singapura",
  "fake.animal.cetacean": "Spinner Dolphin",
  "fake.animal.cow": "Brava",
  "fake.animal.crocodilia": "Philippine Crocodile",
  "fake.animal.dog": "Irish Water Spaniel",
  "fake.animal.fish": "Mandarin fish",
  "fake.animal.horse": "Swedish Warmblood",
  "fake.animal.insect": "Pyramid ant",
  "fake.animal.lion": "Northeast Congo Lion",
  "fake.animal.petName": "Coco",
  "fake.animal.rabbit": "Florida White",
  "fake.animal.rodent": "Cuscomys ashanika",
  "fake.animal.snake": "Eyelash viper",
  "fake.animal.type": "crocodile",
  "fake.book.author": "William Shakespeare",
  "fake.book.format": "Hardcover",
  "fake.book.genre": "Fantasy",
  "fake.book.publisher": "Addison-Wesley",
  "fake.book.series": "Harry Potter",
  "fake.book.title": "Romeo and Juliet",
  "fake.color.cmyk": [0.31, 0.52, 0.32, 0.43],
  "fake.color.colorByCSSColorSpace": [0.93, 1, 0.82],
  "fake.color.cssSupportedFunction": "rgb",
  "fake.color.cssSupportedSpace": "display-p3",
  "fake.color.hsl": [201, 0.23, 0.32],
  "fake.color.human": "red",
  "fake.color.hwb": [201, 0.21, 0.31],
  "fake.color.lab": [0.832133, -80.3245, 100.1234],
  "fake.color.lch": [0.522345, 72.2, 56.2],
  "fake.color.rgb": "#0d7f26",
  "fake.color.space": "sRGB",
  "fake.commerce.department": "Garden",
  "fake.commerce.isbn": "978-0-692-82459-7",
  "fake.commerce.price": "828.07",
  "fake.commerce.product": "Computer",
  "fake.commerce.productAdjective": "Handcrafted",
  "fake.commerce.productDescription":
    "Featuring Phosphorus-enhanced technology, our Fish offers unparalleled Modern performance",
  "fake.commerce.productMaterial": "Rubber",
  "fake.commerce.productName": "Incredible Soft Gloves",
  "fake.commerce.upc": "036000291452",
  "fake.company.buzzAdjective": "one-to-one",
  "fake.company.buzzNoun": "paradigms",
  "fake.company.buzzPhrase": "cultivate synergistic e-markets",
  "fake.company.buzzVerb": "empower",
  "fake.company.catchPhrase": "Upgradable systematic flexibility",
  "fake.company.catchPhraseAdjective": "Multi-tiered",
  "fake.company.catchPhraseDescriptor": "composite",
  "fake.company.catchPhraseNoun": "leverage",
  "fake.company.name": "Zieme, Hauck and McClure",
  "fake.database.collation": "utf8_unicode_ci",
  "fake.database.column": "createdAt",
  "fake.database.engine": "ARCHIVE",
  "fake.database.mongodbObjectId": "e175cac316a79afdd0ad3afb",
  "fake.database.type": "timestamp",
  "fake.datatype.boolean": true,
  "fake.date.anytime": "2022-07-31T01:33:29.567Z",
  "fake.date.birthdate": "1977-07-10T01:37:30.719Z",
  "fake.date.future": "2022-11-19T05:52:49.100Z",
  "fake.date.month": "October",
  "fake.date.past": "2021-12-03T05:40:44.408Z",
  "fake.date.recent": "2022-02-04T02:09:35.077Z",
  "fake.date.soon": "2022-02-05T09:55:39.216Z",
  "fake.date.timeZone": "Pacific/Guam",
  "fake.date.weekday": "Monday",
  "fake.finance.accountName": "Personal Loan Account",
  "fake.finance.accountNumber": "92842238",
  "fake.finance.amount": "617.87",
  "fake.finance.bic": "WYAUPGX1",
  "fake.finance.bitcoinAddress": "1TeZEFLmGPLEQrSRdAcnZLoWwYeiHwmRog",
  "fake.finance.creditCardCVV": "506",
  "fake.finance.creditCardIssuer": "discover",
  "fake.finance.creditCardNumber": "4427163488662",
  "fake.finance.currencyCode": "USD",
  "fake.finance.currencyName": "US Dollar",
  "fake.finance.currencyNumericCode": "840",
  "fake.finance.currencySymbol": "$",
  "fake.finance.ethereumAddress": "0xf03dfeecbafc5147241cc4c4ca20b3c9dfd04c4a",
  "fake.finance.iban": "TR736918640040966092800056",
  "fake.finance.litecoinAddress": "MoQaSTGWBRXkWfyxKbNKuPrAWGELzcW",
  "fake.finance.pin": "5067",
  "fake.finance.routingNumber": "062197511",
  "fake.finance.transactionDescription":
    "payment transaction at Emard LLC using card ending with ****9187",
  "fake.finance.transactionType": "payment",
};

vi.mock("@faker-js/faker", () => {
  return {
    faker: {
      string: {
        uuid: () => MOCK_FAKER_VALUES["fake.string.uuid"],
      },
      internet: {
        email: () => MOCK_FAKER_VALUES["fake.internet.email"],
      },
      person: {
        firstName: () => MOCK_FAKER_VALUES["fake.person.firstName"],
        lastName: () => MOCK_FAKER_VALUES["fake.person.lastName"],
        fullName: () => MOCK_FAKER_VALUES["fake.person.fullName"],
      },
      airline: {
        aircraftType: () => MOCK_FAKER_VALUES["fake.airline.aircraftType"],
        airline: () => MOCK_FAKER_VALUES["fake.airline"],
        airplane: () => MOCK_FAKER_VALUES["fake.airline.airplane"],
        airport: () => MOCK_FAKER_VALUES["fake.airline.airport"],
        flightNumber: () => MOCK_FAKER_VALUES["fake.airline.flightNumber"],
        recordLocator: () => MOCK_FAKER_VALUES["fake.airline.recordLocator"],
        seat: () => MOCK_FAKER_VALUES["fake.airline.seat"],
      },
      animal: {
        bear: () => MOCK_FAKER_VALUES["fake.animal.bear"],
        bird: () => MOCK_FAKER_VALUES["fake.animal.bird"],
        cat: () => MOCK_FAKER_VALUES["fake.animal.cat"],
        cetacean: () => MOCK_FAKER_VALUES["fake.animal.cetacean"],
        cow: () => MOCK_FAKER_VALUES["fake.animal.cow"],
        crocodilia: () => MOCK_FAKER_VALUES["fake.animal.crocodilia"],
        dog: () => MOCK_FAKER_VALUES["fake.animal.dog"],
        fish: () => MOCK_FAKER_VALUES["fake.animal.fish"],
        horse: () => MOCK_FAKER_VALUES["fake.animal.horse"],
        insect: () => MOCK_FAKER_VALUES["fake.animal.insect"],
        lion: () => MOCK_FAKER_VALUES["fake.animal.lion"],
        petName: () => MOCK_FAKER_VALUES["fake.animal.petName"],
        rabbit: () => MOCK_FAKER_VALUES["fake.animal.rabbit"],
        rodent: () => MOCK_FAKER_VALUES["fake.animal.rodent"],
        snake: () => MOCK_FAKER_VALUES["fake.animal.snake"],
        type: () => MOCK_FAKER_VALUES["fake.animal.type"],
      },
      book: {
        author: () => MOCK_FAKER_VALUES["fake.book.author"],
        format: () => MOCK_FAKER_VALUES["fake.book.format"],
        genre: () => MOCK_FAKER_VALUES["fake.book.genre"],
        publisher: () => MOCK_FAKER_VALUES["fake.book.publisher"],
        series: () => MOCK_FAKER_VALUES["fake.book.series"],
        title: () => MOCK_FAKER_VALUES["fake.book.title"],
      },
      color: {
        cmyk: () => MOCK_FAKER_VALUES["fake.color.cmyk"],
        colorByCSSColorSpace: () =>
          MOCK_FAKER_VALUES["fake.color.colorByCSSColorSpace"],
        cssSupportedFunction: () =>
          MOCK_FAKER_VALUES["fake.color.cssSupportedFunction"],
        cssSupportedSpace: () =>
          MOCK_FAKER_VALUES["fake.color.cssSupportedSpace"],
        hsl: () => MOCK_FAKER_VALUES["fake.color.hsl"],
        human: () => MOCK_FAKER_VALUES["fake.color.human"],
        hwb: () => MOCK_FAKER_VALUES["fake.color.hwb"],
        lab: () => MOCK_FAKER_VALUES["fake.color.lab"],
        lch: () => MOCK_FAKER_VALUES["fake.color.lch"],
        rgb: () => MOCK_FAKER_VALUES["fake.color.rgb"],
        space: () => MOCK_FAKER_VALUES["fake.color.space"],
      },
      commerce: {
        department: () => MOCK_FAKER_VALUES["fake.commerce.department"],
        isbn: () => MOCK_FAKER_VALUES["fake.commerce.isbn"],
        price: () => MOCK_FAKER_VALUES["fake.commerce.price"],
        product: () => MOCK_FAKER_VALUES["fake.commerce.product"],
        productAdjective: () =>
          MOCK_FAKER_VALUES["fake.commerce.productAdjective"],
        productDescription: () =>
          MOCK_FAKER_VALUES["fake.commerce.productDescription"],
        productMaterial: () =>
          MOCK_FAKER_VALUES["fake.commerce.productMaterial"],
        productName: () => MOCK_FAKER_VALUES["fake.commerce.productName"],
        upc: () => MOCK_FAKER_VALUES["fake.commerce.upc"],
      },
      company: {
        buzzAdjective: () => MOCK_FAKER_VALUES["fake.company.buzzAdjective"],
        buzzNoun: () => MOCK_FAKER_VALUES["fake.company.buzzNoun"],
        buzzPhrase: () => MOCK_FAKER_VALUES["fake.company.buzzPhrase"],
        buzzVerb: () => MOCK_FAKER_VALUES["fake.company.buzzVerb"],
        catchPhrase: () => MOCK_FAKER_VALUES["fake.company.catchPhrase"],
        catchPhraseAdjective: () =>
          MOCK_FAKER_VALUES["fake.company.catchPhraseAdjective"],
        catchPhraseDescriptor: () =>
          MOCK_FAKER_VALUES["fake.company.catchPhraseDescriptor"],
        catchPhraseNoun: () =>
          MOCK_FAKER_VALUES["fake.company.catchPhraseNoun"],
        name: () => MOCK_FAKER_VALUES["fake.company.name"],
      },
      database: {
        collation: () => MOCK_FAKER_VALUES["fake.database.collation"],
        column: () => MOCK_FAKER_VALUES["fake.database.column"],
        engine: () => MOCK_FAKER_VALUES["fake.database.engine"],
        mongodbObjectId: () =>
          MOCK_FAKER_VALUES["fake.database.mongodbObjectId"],
        type: () => MOCK_FAKER_VALUES["fake.database.type"],
      },
      datatype: {
        boolean: () => MOCK_FAKER_VALUES["fake.datatype.boolean"],
      },
      date: {
        anytime: () =>
          new Date(MOCK_FAKER_VALUES["fake.date.anytime"] as string),
        birthdate: () =>
          new Date(MOCK_FAKER_VALUES["fake.date.birthdate"] as string),
        future: () => new Date(MOCK_FAKER_VALUES["fake.date.future"] as string),
        month: () => MOCK_FAKER_VALUES["fake.date.month"],
        past: () => new Date(MOCK_FAKER_VALUES["fake.date.past"] as string),
        recent: () => new Date(MOCK_FAKER_VALUES["fake.date.recent"] as string),
        soon: () => new Date(MOCK_FAKER_VALUES["fake.date.soon"] as string),
        timeZone: () => MOCK_FAKER_VALUES["fake.date.timeZone"],
        weekday: () => MOCK_FAKER_VALUES["fake.date.weekday"],
      },
      finance: {
        accountName: () => MOCK_FAKER_VALUES["fake.finance.accountName"],
        accountNumber: () => MOCK_FAKER_VALUES["fake.finance.accountNumber"],
        amount: () => MOCK_FAKER_VALUES["fake.finance.amount"],
        bic: () => MOCK_FAKER_VALUES["fake.finance.bic"],
        bitcoinAddress: () => MOCK_FAKER_VALUES["fake.finance.bitcoinAddress"],
        creditCardCVV: () => MOCK_FAKER_VALUES["fake.finance.creditCardCVV"],
        creditCardIssuer: () =>
          MOCK_FAKER_VALUES["fake.finance.creditCardIssuer"],
        creditCardNumber: () =>
          MOCK_FAKER_VALUES["fake.finance.creditCardNumber"],
        currencyCode: () => MOCK_FAKER_VALUES["fake.finance.currencyCode"],
        currencyName: () => MOCK_FAKER_VALUES["fake.finance.currencyName"],
        currencyNumericCode: () =>
          MOCK_FAKER_VALUES["fake.finance.currencyNumericCode"],
        currencySymbol: () => MOCK_FAKER_VALUES["fake.finance.currencySymbol"],
        ethereumAddress: () =>
          MOCK_FAKER_VALUES["fake.finance.ethereumAddress"],
        iban: () => MOCK_FAKER_VALUES["fake.finance.iban"],
        litecoinAddress: () =>
          MOCK_FAKER_VALUES["fake.finance.litecoinAddress"],
        pin: () => MOCK_FAKER_VALUES["fake.finance.pin"],
        routingNumber: () => MOCK_FAKER_VALUES["fake.finance.routingNumber"],
        transactionDescription: () =>
          MOCK_FAKER_VALUES["fake.finance.transactionDescription"],
        transactionType: () =>
          MOCK_FAKER_VALUES["fake.finance.transactionType"],
      },
    },
  };
});

describe("transpiler", () => {
  describe("plain root values", () => {
    it("returns a plain string at the root unchanged", () => {
      expect(transpile("hello")).toBe("hello");
    });

    it("returns a plain number at the root unchanged", () => {
      expect(transpile(42)).toBe(42);
    });

    it("returns a plain boolean at the root unchanged", () => {
      expect(transpile(true)).toBe(true);
      expect(transpile(false)).toBe(false);
    });
  });

  describe("faker values", () => {
    it("transpiles a faker type at the root into its generated value", () => {
      expect(transpile("fake.string.uuid")).toBe(
        MOCK_FAKER_VALUES["fake.string.uuid"],
      );
      expect(transpile("fake.internet.email")).toBe(
        MOCK_FAKER_VALUES["fake.internet.email"],
      );
      expect(transpile("fake.person.firstName")).toBe(
        MOCK_FAKER_VALUES["fake.person.firstName"],
      );
      expect(transpile("fake.person.lastName")).toBe(
        MOCK_FAKER_VALUES["fake.person.lastName"],
      );
      expect(transpile("fake.person.fullName")).toBe(
        MOCK_FAKER_VALUES["fake.person.fullName"],
      );
      // airline
      expect(transpile("fake.airline.aircraftType")).toBe(
        MOCK_FAKER_VALUES["fake.airline.aircraftType"],
      );
      expect(transpile("fake.airline")).toEqual(
        MOCK_FAKER_VALUES["fake.airline"],
      );
      expect(transpile("fake.airline.airplane")).toEqual(
        MOCK_FAKER_VALUES["fake.airline.airplane"],
      );
      expect(transpile("fake.airline.airport")).toEqual(
        MOCK_FAKER_VALUES["fake.airline.airport"],
      );
      expect(transpile("fake.airline.flightNumber")).toBe(
        MOCK_FAKER_VALUES["fake.airline.flightNumber"],
      );
      expect(transpile("fake.airline.recordLocator")).toBe(
        MOCK_FAKER_VALUES["fake.airline.recordLocator"],
      );
      expect(transpile("fake.airline.seat")).toBe(
        MOCK_FAKER_VALUES["fake.airline.seat"],
      );
      // animal
      expect(transpile("fake.animal.bear")).toBe(
        MOCK_FAKER_VALUES["fake.animal.bear"],
      );
      expect(transpile("fake.animal.bird")).toBe(
        MOCK_FAKER_VALUES["fake.animal.bird"],
      );
      expect(transpile("fake.animal.cat")).toBe(
        MOCK_FAKER_VALUES["fake.animal.cat"],
      );
      expect(transpile("fake.animal.cetacean")).toBe(
        MOCK_FAKER_VALUES["fake.animal.cetacean"],
      );
      expect(transpile("fake.animal.cow")).toBe(
        MOCK_FAKER_VALUES["fake.animal.cow"],
      );
      expect(transpile("fake.animal.crocodilia")).toBe(
        MOCK_FAKER_VALUES["fake.animal.crocodilia"],
      );
      expect(transpile("fake.animal.dog")).toBe(
        MOCK_FAKER_VALUES["fake.animal.dog"],
      );
      expect(transpile("fake.animal.fish")).toBe(
        MOCK_FAKER_VALUES["fake.animal.fish"],
      );
      expect(transpile("fake.animal.horse")).toBe(
        MOCK_FAKER_VALUES["fake.animal.horse"],
      );
      expect(transpile("fake.animal.insect")).toBe(
        MOCK_FAKER_VALUES["fake.animal.insect"],
      );
      expect(transpile("fake.animal.lion")).toBe(
        MOCK_FAKER_VALUES["fake.animal.lion"],
      );
      expect(transpile("fake.animal.petName")).toBe(
        MOCK_FAKER_VALUES["fake.animal.petName"],
      );
      expect(transpile("fake.animal.rabbit")).toBe(
        MOCK_FAKER_VALUES["fake.animal.rabbit"],
      );
      expect(transpile("fake.animal.rodent")).toBe(
        MOCK_FAKER_VALUES["fake.animal.rodent"],
      );
      expect(transpile("fake.animal.snake")).toBe(
        MOCK_FAKER_VALUES["fake.animal.snake"],
      );
      expect(transpile("fake.animal.type")).toBe(
        MOCK_FAKER_VALUES["fake.animal.type"],
      );
      // book
      expect(transpile("fake.book.author")).toBe(
        MOCK_FAKER_VALUES["fake.book.author"],
      );
      expect(transpile("fake.book.format")).toBe(
        MOCK_FAKER_VALUES["fake.book.format"],
      );
      expect(transpile("fake.book.genre")).toBe(
        MOCK_FAKER_VALUES["fake.book.genre"],
      );
      expect(transpile("fake.book.publisher")).toBe(
        MOCK_FAKER_VALUES["fake.book.publisher"],
      );
      expect(transpile("fake.book.series")).toBe(
        MOCK_FAKER_VALUES["fake.book.series"],
      );
      expect(transpile("fake.book.title")).toBe(
        MOCK_FAKER_VALUES["fake.book.title"],
      );
      // color
      expect(transpile("fake.color.cmyk")).toEqual(
        MOCK_FAKER_VALUES["fake.color.cmyk"],
      );
      expect(transpile("fake.color.colorByCSSColorSpace")).toEqual(
        MOCK_FAKER_VALUES["fake.color.colorByCSSColorSpace"],
      );
      expect(transpile("fake.color.cssSupportedFunction")).toBe(
        MOCK_FAKER_VALUES["fake.color.cssSupportedFunction"],
      );
      expect(transpile("fake.color.cssSupportedSpace")).toBe(
        MOCK_FAKER_VALUES["fake.color.cssSupportedSpace"],
      );
      expect(transpile("fake.color.hsl")).toEqual(
        MOCK_FAKER_VALUES["fake.color.hsl"],
      );
      expect(transpile("fake.color.human")).toBe(
        MOCK_FAKER_VALUES["fake.color.human"],
      );
      expect(transpile("fake.color.hwb")).toEqual(
        MOCK_FAKER_VALUES["fake.color.hwb"],
      );
      expect(transpile("fake.color.lab")).toEqual(
        MOCK_FAKER_VALUES["fake.color.lab"],
      );
      expect(transpile("fake.color.lch")).toEqual(
        MOCK_FAKER_VALUES["fake.color.lch"],
      );
      expect(transpile("fake.color.rgb")).toBe(
        MOCK_FAKER_VALUES["fake.color.rgb"],
      );
      expect(transpile("fake.color.space")).toBe(
        MOCK_FAKER_VALUES["fake.color.space"],
      );
      // commerce
      expect(transpile("fake.commerce.department")).toBe(
        MOCK_FAKER_VALUES["fake.commerce.department"],
      );
      expect(transpile("fake.commerce.isbn")).toBe(
        MOCK_FAKER_VALUES["fake.commerce.isbn"],
      );
      expect(transpile("fake.commerce.price")).toBe(
        MOCK_FAKER_VALUES["fake.commerce.price"],
      );
      expect(transpile("fake.commerce.product")).toBe(
        MOCK_FAKER_VALUES["fake.commerce.product"],
      );
      expect(transpile("fake.commerce.productAdjective")).toBe(
        MOCK_FAKER_VALUES["fake.commerce.productAdjective"],
      );
      expect(transpile("fake.commerce.productDescription")).toBe(
        MOCK_FAKER_VALUES["fake.commerce.productDescription"],
      );
      expect(transpile("fake.commerce.productMaterial")).toBe(
        MOCK_FAKER_VALUES["fake.commerce.productMaterial"],
      );
      expect(transpile("fake.commerce.productName")).toBe(
        MOCK_FAKER_VALUES["fake.commerce.productName"],
      );
      expect(transpile("fake.commerce.upc")).toBe(
        MOCK_FAKER_VALUES["fake.commerce.upc"],
      );
      // company
      expect(transpile("fake.company.buzzAdjective")).toBe(
        MOCK_FAKER_VALUES["fake.company.buzzAdjective"],
      );
      expect(transpile("fake.company.buzzNoun")).toBe(
        MOCK_FAKER_VALUES["fake.company.buzzNoun"],
      );
      expect(transpile("fake.company.buzzPhrase")).toBe(
        MOCK_FAKER_VALUES["fake.company.buzzPhrase"],
      );
      expect(transpile("fake.company.buzzVerb")).toBe(
        MOCK_FAKER_VALUES["fake.company.buzzVerb"],
      );
      expect(transpile("fake.company.catchPhrase")).toBe(
        MOCK_FAKER_VALUES["fake.company.catchPhrase"],
      );
      expect(transpile("fake.company.catchPhraseAdjective")).toBe(
        MOCK_FAKER_VALUES["fake.company.catchPhraseAdjective"],
      );
      expect(transpile("fake.company.catchPhraseDescriptor")).toBe(
        MOCK_FAKER_VALUES["fake.company.catchPhraseDescriptor"],
      );
      expect(transpile("fake.company.catchPhraseNoun")).toBe(
        MOCK_FAKER_VALUES["fake.company.catchPhraseNoun"],
      );
      expect(transpile("fake.company.name")).toBe(
        MOCK_FAKER_VALUES["fake.company.name"],
      );
      // database
      expect(transpile("fake.database.collation")).toBe(
        MOCK_FAKER_VALUES["fake.database.collation"],
      );
      expect(transpile("fake.database.column")).toBe(
        MOCK_FAKER_VALUES["fake.database.column"],
      );
      expect(transpile("fake.database.engine")).toBe(
        MOCK_FAKER_VALUES["fake.database.engine"],
      );
      expect(transpile("fake.database.mongodbObjectId")).toBe(
        MOCK_FAKER_VALUES["fake.database.mongodbObjectId"],
      );
      expect(transpile("fake.database.type")).toBe(
        MOCK_FAKER_VALUES["fake.database.type"],
      );
      // datatype
      expect(transpile("fake.datatype.boolean")).toBe(
        MOCK_FAKER_VALUES["fake.datatype.boolean"],
      );
      // date
      expect(transpile("fake.date.anytime")).toBe(
        MOCK_FAKER_VALUES["fake.date.anytime"],
      );
      expect(transpile("fake.date.birthdate")).toBe(
        MOCK_FAKER_VALUES["fake.date.birthdate"],
      );
      expect(transpile("fake.date.future")).toBe(
        MOCK_FAKER_VALUES["fake.date.future"],
      );
      expect(transpile("fake.date.month")).toBe(
        MOCK_FAKER_VALUES["fake.date.month"],
      );
      expect(transpile("fake.date.past")).toBe(
        MOCK_FAKER_VALUES["fake.date.past"],
      );
      expect(transpile("fake.date.recent")).toBe(
        MOCK_FAKER_VALUES["fake.date.recent"],
      );
      expect(transpile("fake.date.soon")).toBe(
        MOCK_FAKER_VALUES["fake.date.soon"],
      );
      expect(transpile("fake.date.timeZone")).toBe(
        MOCK_FAKER_VALUES["fake.date.timeZone"],
      );
      expect(transpile("fake.date.weekday")).toBe(
        MOCK_FAKER_VALUES["fake.date.weekday"],
      );
      // finance
      expect(transpile("fake.finance.accountName")).toBe(
        MOCK_FAKER_VALUES["fake.finance.accountName"],
      );
      expect(transpile("fake.finance.accountNumber")).toBe(
        MOCK_FAKER_VALUES["fake.finance.accountNumber"],
      );
      expect(transpile("fake.finance.amount")).toBe(
        MOCK_FAKER_VALUES["fake.finance.amount"],
      );
      expect(transpile("fake.finance.bic")).toBe(
        MOCK_FAKER_VALUES["fake.finance.bic"],
      );
      expect(transpile("fake.finance.bitcoinAddress")).toBe(
        MOCK_FAKER_VALUES["fake.finance.bitcoinAddress"],
      );
      expect(transpile("fake.finance.creditCardCVV")).toBe(
        MOCK_FAKER_VALUES["fake.finance.creditCardCVV"],
      );
      expect(transpile("fake.finance.creditCardIssuer")).toBe(
        MOCK_FAKER_VALUES["fake.finance.creditCardIssuer"],
      );
      expect(transpile("fake.finance.creditCardNumber")).toBe(
        MOCK_FAKER_VALUES["fake.finance.creditCardNumber"],
      );
      expect(transpile("fake.finance.currencyCode")).toBe(
        MOCK_FAKER_VALUES["fake.finance.currencyCode"],
      );
      expect(transpile("fake.finance.currencyName")).toBe(
        MOCK_FAKER_VALUES["fake.finance.currencyName"],
      );
      expect(transpile("fake.finance.currencyNumericCode")).toBe(
        MOCK_FAKER_VALUES["fake.finance.currencyNumericCode"],
      );
      expect(transpile("fake.finance.currencySymbol")).toBe(
        MOCK_FAKER_VALUES["fake.finance.currencySymbol"],
      );
      expect(transpile("fake.finance.ethereumAddress")).toBe(
        MOCK_FAKER_VALUES["fake.finance.ethereumAddress"],
      );
      expect(transpile("fake.finance.iban")).toBe(
        MOCK_FAKER_VALUES["fake.finance.iban"],
      );
      expect(transpile("fake.finance.litecoinAddress")).toBe(
        MOCK_FAKER_VALUES["fake.finance.litecoinAddress"],
      );
      expect(transpile("fake.finance.pin")).toBe(
        MOCK_FAKER_VALUES["fake.finance.pin"],
      );
      expect(transpile("fake.finance.routingNumber")).toBe(
        MOCK_FAKER_VALUES["fake.finance.routingNumber"],
      );
      expect(transpile("fake.finance.transactionDescription")).toBe(
        MOCK_FAKER_VALUES["fake.finance.transactionDescription"],
      );
      expect(transpile("fake.finance.transactionType")).toBe(
        MOCK_FAKER_VALUES["fake.finance.transactionType"],
      );
    });

    it("transpiles a faker type nested in an object", () => {
      expect(transpile({ email: "fake.internet.email" })).toEqual({
        email: MOCK_FAKER_VALUES["fake.internet.email"],
      });
    });
  });

  describe("objects", () => {
    it("transpiles an object mixing plain primitives and faker types", () => {
      expect(
        transpile({
          id: "fake.string.uuid",
          name: "Alice",
          age: 30,
          isActive: true,
        }),
      ).toEqual({
        id: MOCK_FAKER_VALUES["fake.string.uuid"],
        name: "Alice",
        age: 30,
        isActive: true,
      });
    });

    it("transpiles nested objects", () => {
      expect(
        transpile({
          user: {
            name: "Bob",
            address: {
              city: "Seattle",
              zip: 98101,
            },
          },
        }),
      ).toEqual({
        user: {
          name: "Bob",
          address: {
            city: "Seattle",
            zip: 98101,
          },
        },
      });
    });
  });

  describe("arrays", () => {
    it("transpiles arrays of plain primitives", () => {
      expect(transpile(["a", 1, false])).toEqual(["a", 1, false]);
    });

    it("transpiles arrays containing faker types", () => {
      expect(transpile(["fake.person.firstName", "literal"])).toEqual([
        MOCK_FAKER_VALUES["fake.person.firstName"],
        "literal",
      ]);
    });
  });

  describe("invalid input", () => {
    it("returns an empty object when schema parsing fails", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});

      // null is not a supported mock schema value
      expect(transpile(null as never)).toEqual({});
    });
  });
});
