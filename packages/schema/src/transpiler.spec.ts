import { describe, expect, it, vi } from "vitest";
import { transpile } from "./transpiler.js";
import { fakerGenerators } from "./generators.js";

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
      const spy = vi
        .spyOn(fakerGenerators, "faker.string.uuid")
        .mockReturnValue("generated-uuid");

      expect(transpile("faker.string.uuid")).toBe("generated-uuid");
      expect(spy).toHaveBeenCalledOnce();

      spy.mockRestore();
    });

    it("transpiles a faker type nested in an object", () => {
      const spy = vi
        .spyOn(fakerGenerators, "faker.internet.email")
        .mockReturnValue("test@example.com");

      expect(transpile({ email: "faker.internet.email" })).toEqual({
        email: "test@example.com",
      });

      spy.mockRestore();
    });
  });

  describe("objects", () => {
    it("transpiles an object mixing plain primitives and faker types", () => {
      const uuidSpy = vi
        .spyOn(fakerGenerators, "faker.string.uuid")
        .mockReturnValue("generated-uuid");

      expect(
        transpile({
          id: "faker.string.uuid",
          name: "Alice",
          age: 30,
          isActive: true,
        }),
      ).toEqual({
        id: "generated-uuid",
        name: "Alice",
        age: 30,
        isActive: true,
      });

      uuidSpy.mockRestore();
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
      const spy = vi
        .spyOn(fakerGenerators, "faker.person.firstName")
        .mockReturnValue("Charlie");

      expect(transpile(["faker.person.firstName", "literal"])).toEqual([
        "Charlie",
        "literal",
      ]);

      spy.mockRestore();
    });
  });

  describe("invalid input", () => {
    it("returns an empty object when schema parsing fails", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // null is not a supported mock schema value
      expect(transpile(null as never)).toEqual({});

      errorSpy.mockRestore();
    });
  });
});
