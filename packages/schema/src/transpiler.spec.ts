import { describe, expect, it, vi } from "vitest";
import { transpile } from "./transpiler.js";
import { FakerType } from "./index.js";

type MockAirline = { name: string; iataCode: string };
type MockAirplane = { name: string; iataTypeCode: string };

const MOCK_FAKER_VALUES: Record<
  FakerType,
  string | MockAirline | MockAirplane | number[] | boolean
> = {
  "faker.string.uuid": "test-uuid",
  "faker.internet.email": "test@example.com",
  "faker.person.firstName": "John",
  "faker.person.lastName": "Doe",
  "faker.person.fullName": "John Doe",
  "faker.airline.aircraftType": "narrowbody",
  "faker.airline": { name: "American Airlines", iataCode: "AA" },
  "faker.airline.airplane": { name: "Airbus A321", iataTypeCode: "321" },
  "faker.airline.airport": {
    name: "Dallas Fort Worth International Airport",
    iataCode: "DFW",
  },
  "faker.airline.flightNumber": "1234",
  "faker.airline.recordLocator": "ABC123",
  "faker.airline.seat": "12A",
  "faker.animal.bear": "Asian black bear",
  "faker.animal.bird": "Buller's Shearwater",
  "faker.animal.cat": "Singapura",
  "faker.animal.cetacean": "Spinner Dolphin",
  "faker.animal.cow": "Brava",
  "faker.animal.crocodilia": "Philippine Crocodile",
  "faker.animal.dog": "Irish Water Spaniel",
  "faker.animal.fish": "Mandarin fish",
  "faker.animal.horse": "Swedish Warmblood",
  "faker.animal.insect": "Pyramid ant",
  "faker.animal.lion": "Northeast Congo Lion",
  "faker.animal.petName": "Coco",
  "faker.animal.rabbit": "Florida White",
  "faker.animal.rodent": "Cuscomys ashanika",
  "faker.animal.snake": "Eyelash viper",
  "faker.animal.type": "crocodile",
  "faker.book.author": "William Shakespeare",
  "faker.book.format": "Hardcover",
  "faker.book.genre": "Fantasy",
  "faker.book.publisher": "Addison-Wesley",
  "faker.book.series": "Harry Potter",
  "faker.book.title": "Romeo and Juliet",
  "faker.color.cmyk": [0.31, 0.52, 0.32, 0.43],
  "faker.color.colorByCSSColorSpace": [0.93, 1, 0.82],
  "faker.color.cssSupportedFunction": "rgb",
  "faker.color.cssSupportedSpace": "display-p3",
  "faker.color.hsl": [201, 0.23, 0.32],
  "faker.color.human": "red",
  "faker.color.hwb": [201, 0.21, 0.31],
  "faker.color.lab": [0.832133, -80.3245, 100.1234],
  "faker.color.lch": [0.522345, 72.2, 56.2],
  "faker.color.rgb": "#0d7f26",
  "faker.color.space": "sRGB",
  "faker.commerce.department": "Garden",
  "faker.commerce.isbn": "978-0-692-82459-7",
  "faker.commerce.price": "828.07",
  "faker.commerce.product": "Computer",
  "faker.commerce.productAdjective": "Handcrafted",
  "faker.commerce.productDescription":
    "Featuring Phosphorus-enhanced technology, our Fish offers unparalleled Modern performance",
  "faker.commerce.productMaterial": "Rubber",
  "faker.commerce.productName": "Incredible Soft Gloves",
  "faker.commerce.upc": "036000291452",
  "faker.company.buzzAdjective": "one-to-one",
  "faker.company.buzzNoun": "paradigms",
  "faker.company.buzzPhrase": "cultivate synergistic e-markets",
  "faker.company.buzzVerb": "empower",
  "faker.company.catchPhrase": "Upgradable systematic flexibility",
  "faker.company.catchPhraseAdjective": "Multi-tiered",
  "faker.company.catchPhraseDescriptor": "composite",
  "faker.company.catchPhraseNoun": "leverage",
  "faker.company.name": "Zieme, Hauck and McClure",
  "faker.database.collation": "utf8_unicode_ci",
  "faker.database.column": "createdAt",
  "faker.database.engine": "ARCHIVE",
  "faker.database.mongodbObjectId": "e175cac316a79afdd0ad3afb",
  "faker.database.type": "timestamp",
  "faker.datatype.boolean": true,
  "faker.date.anytime": "2022-07-31T01:33:29.567Z",
  "faker.date.birthdate": "1977-07-10T01:37:30.719Z",
  "faker.date.future": "2022-11-19T05:52:49.100Z",
  "faker.date.month": "October",
  "faker.date.past": "2021-12-03T05:40:44.408Z",
  "faker.date.recent": "2022-02-04T02:09:35.077Z",
  "faker.date.soon": "2022-02-05T09:55:39.216Z",
  "faker.date.timeZone": "Pacific/Guam",
  "faker.date.weekday": "Monday",
};

vi.mock("@faker-js/faker", () => {
  return {
    faker: {
      string: {
        uuid: () => MOCK_FAKER_VALUES["faker.string.uuid"],
      },
      internet: {
        email: () => MOCK_FAKER_VALUES["faker.internet.email"],
      },
      person: {
        firstName: () => MOCK_FAKER_VALUES["faker.person.firstName"],
        lastName: () => MOCK_FAKER_VALUES["faker.person.lastName"],
        fullName: () => MOCK_FAKER_VALUES["faker.person.fullName"],
      },
      airline: {
        aircraftType: () => MOCK_FAKER_VALUES["faker.airline.aircraftType"],
        airline: () => MOCK_FAKER_VALUES["faker.airline"],
        airplane: () => MOCK_FAKER_VALUES["faker.airline.airplane"],
        airport: () => MOCK_FAKER_VALUES["faker.airline.airport"],
        flightNumber: () => MOCK_FAKER_VALUES["faker.airline.flightNumber"],
        recordLocator: () => MOCK_FAKER_VALUES["faker.airline.recordLocator"],
        seat: () => MOCK_FAKER_VALUES["faker.airline.seat"],
      },
      animal: {
        bear: () => MOCK_FAKER_VALUES["faker.animal.bear"],
        bird: () => MOCK_FAKER_VALUES["faker.animal.bird"],
        cat: () => MOCK_FAKER_VALUES["faker.animal.cat"],
        cetacean: () => MOCK_FAKER_VALUES["faker.animal.cetacean"],
        cow: () => MOCK_FAKER_VALUES["faker.animal.cow"],
        crocodilia: () => MOCK_FAKER_VALUES["faker.animal.crocodilia"],
        dog: () => MOCK_FAKER_VALUES["faker.animal.dog"],
        fish: () => MOCK_FAKER_VALUES["faker.animal.fish"],
        horse: () => MOCK_FAKER_VALUES["faker.animal.horse"],
        insect: () => MOCK_FAKER_VALUES["faker.animal.insect"],
        lion: () => MOCK_FAKER_VALUES["faker.animal.lion"],
        petName: () => MOCK_FAKER_VALUES["faker.animal.petName"],
        rabbit: () => MOCK_FAKER_VALUES["faker.animal.rabbit"],
        rodent: () => MOCK_FAKER_VALUES["faker.animal.rodent"],
        snake: () => MOCK_FAKER_VALUES["faker.animal.snake"],
        type: () => MOCK_FAKER_VALUES["faker.animal.type"],
      },
      book: {
        author: () => MOCK_FAKER_VALUES["faker.book.author"],
        format: () => MOCK_FAKER_VALUES["faker.book.format"],
        genre: () => MOCK_FAKER_VALUES["faker.book.genre"],
        publisher: () => MOCK_FAKER_VALUES["faker.book.publisher"],
        series: () => MOCK_FAKER_VALUES["faker.book.series"],
        title: () => MOCK_FAKER_VALUES["faker.book.title"],
      },
      color: {
        cmyk: () => MOCK_FAKER_VALUES["faker.color.cmyk"],
        colorByCSSColorSpace: () =>
          MOCK_FAKER_VALUES["faker.color.colorByCSSColorSpace"],
        cssSupportedFunction: () =>
          MOCK_FAKER_VALUES["faker.color.cssSupportedFunction"],
        cssSupportedSpace: () =>
          MOCK_FAKER_VALUES["faker.color.cssSupportedSpace"],
        hsl: () => MOCK_FAKER_VALUES["faker.color.hsl"],
        human: () => MOCK_FAKER_VALUES["faker.color.human"],
        hwb: () => MOCK_FAKER_VALUES["faker.color.hwb"],
        lab: () => MOCK_FAKER_VALUES["faker.color.lab"],
        lch: () => MOCK_FAKER_VALUES["faker.color.lch"],
        rgb: () => MOCK_FAKER_VALUES["faker.color.rgb"],
        space: () => MOCK_FAKER_VALUES["faker.color.space"],
      },
      commerce: {
        department: () => MOCK_FAKER_VALUES["faker.commerce.department"],
        isbn: () => MOCK_FAKER_VALUES["faker.commerce.isbn"],
        price: () => MOCK_FAKER_VALUES["faker.commerce.price"],
        product: () => MOCK_FAKER_VALUES["faker.commerce.product"],
        productAdjective: () =>
          MOCK_FAKER_VALUES["faker.commerce.productAdjective"],
        productDescription: () =>
          MOCK_FAKER_VALUES["faker.commerce.productDescription"],
        productMaterial: () =>
          MOCK_FAKER_VALUES["faker.commerce.productMaterial"],
        productName: () => MOCK_FAKER_VALUES["faker.commerce.productName"],
        upc: () => MOCK_FAKER_VALUES["faker.commerce.upc"],
      },
      company: {
        buzzAdjective: () => MOCK_FAKER_VALUES["faker.company.buzzAdjective"],
        buzzNoun: () => MOCK_FAKER_VALUES["faker.company.buzzNoun"],
        buzzPhrase: () => MOCK_FAKER_VALUES["faker.company.buzzPhrase"],
        buzzVerb: () => MOCK_FAKER_VALUES["faker.company.buzzVerb"],
        catchPhrase: () => MOCK_FAKER_VALUES["faker.company.catchPhrase"],
        catchPhraseAdjective: () =>
          MOCK_FAKER_VALUES["faker.company.catchPhraseAdjective"],
        catchPhraseDescriptor: () =>
          MOCK_FAKER_VALUES["faker.company.catchPhraseDescriptor"],
        catchPhraseNoun: () =>
          MOCK_FAKER_VALUES["faker.company.catchPhraseNoun"],
        name: () => MOCK_FAKER_VALUES["faker.company.name"],
      },
      database: {
        collation: () => MOCK_FAKER_VALUES["faker.database.collation"],
        column: () => MOCK_FAKER_VALUES["faker.database.column"],
        engine: () => MOCK_FAKER_VALUES["faker.database.engine"],
        mongodbObjectId: () =>
          MOCK_FAKER_VALUES["faker.database.mongodbObjectId"],
        type: () => MOCK_FAKER_VALUES["faker.database.type"],
      },
      datatype: {
        boolean: () => MOCK_FAKER_VALUES["faker.datatype.boolean"],
      },
      date: {
        anytime: () =>
          new Date(MOCK_FAKER_VALUES["faker.date.anytime"] as string),
        birthdate: () =>
          new Date(MOCK_FAKER_VALUES["faker.date.birthdate"] as string),
        future: () =>
          new Date(MOCK_FAKER_VALUES["faker.date.future"] as string),
        month: () => MOCK_FAKER_VALUES["faker.date.month"],
        past: () => new Date(MOCK_FAKER_VALUES["faker.date.past"] as string),
        recent: () =>
          new Date(MOCK_FAKER_VALUES["faker.date.recent"] as string),
        soon: () => new Date(MOCK_FAKER_VALUES["faker.date.soon"] as string),
        timeZone: () => MOCK_FAKER_VALUES["faker.date.timeZone"],
        weekday: () => MOCK_FAKER_VALUES["faker.date.weekday"],
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
      expect(transpile("faker.string.uuid")).toBe(
        MOCK_FAKER_VALUES["faker.string.uuid"],
      );
      expect(transpile("faker.internet.email")).toBe(
        MOCK_FAKER_VALUES["faker.internet.email"],
      );
      expect(transpile("faker.person.firstName")).toBe(
        MOCK_FAKER_VALUES["faker.person.firstName"],
      );
      expect(transpile("faker.person.lastName")).toBe(
        MOCK_FAKER_VALUES["faker.person.lastName"],
      );
      expect(transpile("faker.person.fullName")).toBe(
        MOCK_FAKER_VALUES["faker.person.fullName"],
      );
      // airline
      expect(transpile("faker.airline.aircraftType")).toBe(
        MOCK_FAKER_VALUES["faker.airline.aircraftType"],
      );
      expect(transpile("faker.airline")).toEqual(
        MOCK_FAKER_VALUES["faker.airline"],
      );
      expect(transpile("faker.airline.airplane")).toEqual(
        MOCK_FAKER_VALUES["faker.airline.airplane"],
      );
      expect(transpile("faker.airline.airport")).toEqual(
        MOCK_FAKER_VALUES["faker.airline.airport"],
      );
      expect(transpile("faker.airline.flightNumber")).toBe(
        MOCK_FAKER_VALUES["faker.airline.flightNumber"],
      );
      expect(transpile("faker.airline.recordLocator")).toBe(
        MOCK_FAKER_VALUES["faker.airline.recordLocator"],
      );
      expect(transpile("faker.airline.seat")).toBe(
        MOCK_FAKER_VALUES["faker.airline.seat"],
      );
      // animal
      expect(transpile("faker.animal.bear")).toBe(
        MOCK_FAKER_VALUES["faker.animal.bear"],
      );
      expect(transpile("faker.animal.bird")).toBe(
        MOCK_FAKER_VALUES["faker.animal.bird"],
      );
      expect(transpile("faker.animal.cat")).toBe(
        MOCK_FAKER_VALUES["faker.animal.cat"],
      );
      expect(transpile("faker.animal.cetacean")).toBe(
        MOCK_FAKER_VALUES["faker.animal.cetacean"],
      );
      expect(transpile("faker.animal.cow")).toBe(
        MOCK_FAKER_VALUES["faker.animal.cow"],
      );
      expect(transpile("faker.animal.crocodilia")).toBe(
        MOCK_FAKER_VALUES["faker.animal.crocodilia"],
      );
      expect(transpile("faker.animal.dog")).toBe(
        MOCK_FAKER_VALUES["faker.animal.dog"],
      );
      expect(transpile("faker.animal.fish")).toBe(
        MOCK_FAKER_VALUES["faker.animal.fish"],
      );
      expect(transpile("faker.animal.horse")).toBe(
        MOCK_FAKER_VALUES["faker.animal.horse"],
      );
      expect(transpile("faker.animal.insect")).toBe(
        MOCK_FAKER_VALUES["faker.animal.insect"],
      );
      expect(transpile("faker.animal.lion")).toBe(
        MOCK_FAKER_VALUES["faker.animal.lion"],
      );
      expect(transpile("faker.animal.petName")).toBe(
        MOCK_FAKER_VALUES["faker.animal.petName"],
      );
      expect(transpile("faker.animal.rabbit")).toBe(
        MOCK_FAKER_VALUES["faker.animal.rabbit"],
      );
      expect(transpile("faker.animal.rodent")).toBe(
        MOCK_FAKER_VALUES["faker.animal.rodent"],
      );
      expect(transpile("faker.animal.snake")).toBe(
        MOCK_FAKER_VALUES["faker.animal.snake"],
      );
      expect(transpile("faker.animal.type")).toBe(
        MOCK_FAKER_VALUES["faker.animal.type"],
      );
      // book
      expect(transpile("faker.book.author")).toBe(
        MOCK_FAKER_VALUES["faker.book.author"],
      );
      expect(transpile("faker.book.format")).toBe(
        MOCK_FAKER_VALUES["faker.book.format"],
      );
      expect(transpile("faker.book.genre")).toBe(
        MOCK_FAKER_VALUES["faker.book.genre"],
      );
      expect(transpile("faker.book.publisher")).toBe(
        MOCK_FAKER_VALUES["faker.book.publisher"],
      );
      expect(transpile("faker.book.series")).toBe(
        MOCK_FAKER_VALUES["faker.book.series"],
      );
      expect(transpile("faker.book.title")).toBe(
        MOCK_FAKER_VALUES["faker.book.title"],
      );
      // color
      expect(transpile("faker.color.cmyk")).toEqual(
        MOCK_FAKER_VALUES["faker.color.cmyk"],
      );
      expect(transpile("faker.color.colorByCSSColorSpace")).toEqual(
        MOCK_FAKER_VALUES["faker.color.colorByCSSColorSpace"],
      );
      expect(transpile("faker.color.cssSupportedFunction")).toBe(
        MOCK_FAKER_VALUES["faker.color.cssSupportedFunction"],
      );
      expect(transpile("faker.color.cssSupportedSpace")).toBe(
        MOCK_FAKER_VALUES["faker.color.cssSupportedSpace"],
      );
      expect(transpile("faker.color.hsl")).toEqual(
        MOCK_FAKER_VALUES["faker.color.hsl"],
      );
      expect(transpile("faker.color.human")).toBe(
        MOCK_FAKER_VALUES["faker.color.human"],
      );
      expect(transpile("faker.color.hwb")).toEqual(
        MOCK_FAKER_VALUES["faker.color.hwb"],
      );
      expect(transpile("faker.color.lab")).toEqual(
        MOCK_FAKER_VALUES["faker.color.lab"],
      );
      expect(transpile("faker.color.lch")).toEqual(
        MOCK_FAKER_VALUES["faker.color.lch"],
      );
      expect(transpile("faker.color.rgb")).toBe(
        MOCK_FAKER_VALUES["faker.color.rgb"],
      );
      expect(transpile("faker.color.space")).toBe(
        MOCK_FAKER_VALUES["faker.color.space"],
      );
      // commerce
      expect(transpile("faker.commerce.department")).toBe(
        MOCK_FAKER_VALUES["faker.commerce.department"],
      );
      expect(transpile("faker.commerce.isbn")).toBe(
        MOCK_FAKER_VALUES["faker.commerce.isbn"],
      );
      expect(transpile("faker.commerce.price")).toBe(
        MOCK_FAKER_VALUES["faker.commerce.price"],
      );
      expect(transpile("faker.commerce.product")).toBe(
        MOCK_FAKER_VALUES["faker.commerce.product"],
      );
      expect(transpile("faker.commerce.productAdjective")).toBe(
        MOCK_FAKER_VALUES["faker.commerce.productAdjective"],
      );
      expect(transpile("faker.commerce.productDescription")).toBe(
        MOCK_FAKER_VALUES["faker.commerce.productDescription"],
      );
      expect(transpile("faker.commerce.productMaterial")).toBe(
        MOCK_FAKER_VALUES["faker.commerce.productMaterial"],
      );
      expect(transpile("faker.commerce.productName")).toBe(
        MOCK_FAKER_VALUES["faker.commerce.productName"],
      );
      expect(transpile("faker.commerce.upc")).toBe(
        MOCK_FAKER_VALUES["faker.commerce.upc"],
      );
      // company
      expect(transpile("faker.company.buzzAdjective")).toBe(
        MOCK_FAKER_VALUES["faker.company.buzzAdjective"],
      );
      expect(transpile("faker.company.buzzNoun")).toBe(
        MOCK_FAKER_VALUES["faker.company.buzzNoun"],
      );
      expect(transpile("faker.company.buzzPhrase")).toBe(
        MOCK_FAKER_VALUES["faker.company.buzzPhrase"],
      );
      expect(transpile("faker.company.buzzVerb")).toBe(
        MOCK_FAKER_VALUES["faker.company.buzzVerb"],
      );
      expect(transpile("faker.company.catchPhrase")).toBe(
        MOCK_FAKER_VALUES["faker.company.catchPhrase"],
      );
      expect(transpile("faker.company.catchPhraseAdjective")).toBe(
        MOCK_FAKER_VALUES["faker.company.catchPhraseAdjective"],
      );
      expect(transpile("faker.company.catchPhraseDescriptor")).toBe(
        MOCK_FAKER_VALUES["faker.company.catchPhraseDescriptor"],
      );
      expect(transpile("faker.company.catchPhraseNoun")).toBe(
        MOCK_FAKER_VALUES["faker.company.catchPhraseNoun"],
      );
      expect(transpile("faker.company.name")).toBe(
        MOCK_FAKER_VALUES["faker.company.name"],
      );
      // database
      expect(transpile("faker.database.collation")).toBe(
        MOCK_FAKER_VALUES["faker.database.collation"],
      );
      expect(transpile("faker.database.column")).toBe(
        MOCK_FAKER_VALUES["faker.database.column"],
      );
      expect(transpile("faker.database.engine")).toBe(
        MOCK_FAKER_VALUES["faker.database.engine"],
      );
      expect(transpile("faker.database.mongodbObjectId")).toBe(
        MOCK_FAKER_VALUES["faker.database.mongodbObjectId"],
      );
      expect(transpile("faker.database.type")).toBe(
        MOCK_FAKER_VALUES["faker.database.type"],
      );
      // datatype
      expect(transpile("faker.datatype.boolean")).toBe(
        MOCK_FAKER_VALUES["faker.datatype.boolean"],
      );
      // date
      expect(transpile("faker.date.anytime")).toBe(
        MOCK_FAKER_VALUES["faker.date.anytime"],
      );
      expect(transpile("faker.date.birthdate")).toBe(
        MOCK_FAKER_VALUES["faker.date.birthdate"],
      );
      expect(transpile("faker.date.future")).toBe(
        MOCK_FAKER_VALUES["faker.date.future"],
      );
      expect(transpile("faker.date.month")).toBe(
        MOCK_FAKER_VALUES["faker.date.month"],
      );
      expect(transpile("faker.date.past")).toBe(
        MOCK_FAKER_VALUES["faker.date.past"],
      );
      expect(transpile("faker.date.recent")).toBe(
        MOCK_FAKER_VALUES["faker.date.recent"],
      );
      expect(transpile("faker.date.soon")).toBe(
        MOCK_FAKER_VALUES["faker.date.soon"],
      );
      expect(transpile("faker.date.timeZone")).toBe(
        MOCK_FAKER_VALUES["faker.date.timeZone"],
      );
      expect(transpile("faker.date.weekday")).toBe(
        MOCK_FAKER_VALUES["faker.date.weekday"],
      );
    });

    it("transpiles a faker type nested in an object", () => {
      expect(transpile({ email: "faker.internet.email" })).toEqual({
        email: MOCK_FAKER_VALUES["faker.internet.email"],
      });
    });
  });

  describe("objects", () => {
    it("transpiles an object mixing plain primitives and faker types", () => {
      expect(
        transpile({
          id: "faker.string.uuid",
          name: "Alice",
          age: 30,
          isActive: true,
        }),
      ).toEqual({
        id: MOCK_FAKER_VALUES["faker.string.uuid"],
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
      expect(transpile(["faker.person.firstName", "literal"])).toEqual([
        MOCK_FAKER_VALUES["faker.person.firstName"],
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
