import { fakerGenerators } from "./generators.js";
import { MockSchema } from "./mock_schema.js";

export const transpile = (schema: MockSchema): Record<string, string> => {
  const parsed = MockSchema.safeParse(schema);

  if (!parsed.success) {
    console.error(parsed.error);
    return {};
  }

  const transpiledSchema: Record<string, string> = {};

  for (const [key, fakerType] of Object.entries(parsed.data)) {
    transpiledSchema[key] = fakerGenerators[fakerType]();
  }

  return transpiledSchema;
};
