import { fakerGenerators } from "./generators.js";
import {
  FakerSchema,
  MockSchema,
  type FakerType,
  type MockSchemaValueType,
  type MockSchemaType,
} from "./mock_schema.js";

export type TranspiledSchema = { [key: string]: string | TranspiledSchema };

const transpileValue = (
  value: MockSchemaValueType,
): string | TranspiledSchema => {
  if (FakerSchema.safeParse(value).success) {
    return fakerGenerators[value as FakerType]();
  }

  const nested: TranspiledSchema = {};
  for (const [key, childValue] of Object.entries(
    value as Record<string, MockSchemaValueType>,
  )) {
    nested[key] = transpileValue(childValue);
  }
  return nested;
};

export const transpile = (schema: MockSchemaType): TranspiledSchema => {
  const parsed = MockSchema.safeParse(schema);

  if (!parsed.success) {
    console.error(parsed.error);
    return {};
  }

  const transpiledSchema: TranspiledSchema = {};

  for (const [key, value] of Object.entries(parsed.data)) {
    transpiledSchema[key] = transpileValue(value);
  }

  return transpiledSchema;
};
