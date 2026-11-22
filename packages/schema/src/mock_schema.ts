import { z } from "zod";

export const FakerSchema = z.enum([
  "faker.string.uuid",
  "faker.internet.email",
  "faker.person.firstName",
  "faker.person.lastName",
  "faker.person.fullName",
  // airline
  "faker.airline.aircraftType",
  "faker.airline",
  "faker.airline.airplane",
  "faker.airline.airport",
  "faker.airline.flightNumber",
  "faker.airline.recordLocator",
  "faker.airline.seat",
  // animal
  "faker.animal.bear",
  "faker.animal.bird",
  "faker.animal.cat",
  "faker.animal.cetacean",
  "faker.animal.cow",
  "faker.animal.crocodilia",
  "faker.animal.dog",
  "faker.animal.fish",
  "faker.animal.horse",
  "faker.animal.insect",
  "faker.animal.lion",
  "faker.animal.petName",
  "faker.animal.rabbit",
  "faker.animal.rodent",
  "faker.animal.snake",
  "faker.animal.type",
  // book
  "faker.book.author",
  "faker.book.format",
  "faker.book.genre",
  "faker.book.publisher",
  "faker.book.series",
  "faker.book.title",
  // color
  "faker.color.cmyk",
  "faker.color.colorByCSSColorSpace",
  "faker.color.cssSupportedFunction",
  "faker.color.cssSupportedSpace",
  "faker.color.hsl",
  "faker.color.human",
  "faker.color.hwb",
  "faker.color.lab",
  "faker.color.lch",
  "faker.color.rgb",
  "faker.color.space",
]);

export type FakerType = z.infer<typeof FakerSchema>;

export type MockSchemaValueType =
  | FakerType
  | string
  | number
  | boolean
  | Array<MockSchemaValueType>
  | { [key: string]: MockSchemaValueType };

export const MockSchemaValue: z.ZodType<MockSchemaValueType> = z.lazy(() =>
  z.union([
    FakerSchema,
    z.string(),
    z.number(),
    z.boolean(),
    z.array(MockSchemaValue),
    z.record(z.string(), MockSchemaValue),
  ]),
);

export const MockSchema = MockSchemaValue;

export type MockSchemaType = z.infer<typeof MockSchema>;
