import { z } from "zod";

export const FakerSchema = z.enum([
  "faker.string.uuid",
  "faker.internet.email",
  "faker.person.firstName",
  "faker.person.lastName",
  "faker.person.fullName",
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
