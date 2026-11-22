import { describe, expect, it, vi } from "vitest";
import { transpile } from "./transpiler.js";
import { FakerType } from "./index.js";

type MockAirline = { name: string; iataCode: string };
type MockAirplane = { name: string; iataTypeCode: string };

const MOCK_FAKER_VALUES: Record<
  FakerType,
  string | MockAirline | MockAirplane
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
