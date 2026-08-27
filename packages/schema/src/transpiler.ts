import { fakerGenerators } from "./generators";
import { MockSchema } from "./schema";

export const transpileSchema = (schema: MockSchema): Record<string, unknown> => {
    const transpiledSchema: Record<string, unknown> = {};

    for (const [key, fakerType] of Object.entries(schema)) {
        transpiledSchema[key] = fakerGenerators[fakerType]();
    }
    
    return transpiledSchema;
}
  