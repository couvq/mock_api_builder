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
