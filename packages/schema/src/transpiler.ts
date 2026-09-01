import { fakerGenerators } from "./generators.js";
import {
  FakerSchema,
  MockSchema,
  type FakerType,
  type MockSchemaValueType,
  type MockSchemaType,
} from "./mock_schema.js";

export type TranspiledSchema =
  | string
  | TranspiledSchema[]
  | { [key: string]: TranspiledSchema };

const transpileValue = (value: MockSchemaValueType): TranspiledSchema => {
  if (FakerSchema.safeParse(value).success) {
    return fakerGenerators[value as FakerType]();
  }

  if(Array.isArray(value)) {
    return value.map((val) => transpileValue(val));
  }

  const nested: Record<string, TranspiledSchema> = {};
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

  const transpiledSchema: Record<string, TranspiledSchema> = {};

  for (const [key, value] of Object.entries(parsed.data)) {
    transpiledSchema[key] = transpileValue(value);
  }

  return transpiledSchema;
};
