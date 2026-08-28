import { fakerGenerators } from "./generators.js";
import { MockSchema } from "./mock_schema.js";

export const transpile = (schema: MockSchema): Record<string, string> => {
    const transpiledSchema: Record<string, string> = {};

    for (const [key, fakerType] of Object.entries(schema)) {
        transpiledSchema[key] = fakerGenerators[fakerType]();
    }
    
    return transpiledSchema;
}
  