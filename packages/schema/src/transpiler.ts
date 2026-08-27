import { fakerGenerators } from "./generators";
import { MockSchema } from "./schema";

export const transpile = (schema: MockSchema): Record<string, string> => {
    const transpiledSchema: Record<string, string> = {};

    for (const [key, fakerType] of Object.entries(schema)) {
        transpiledSchema[key] = fakerGenerators[fakerType]();
    }
    
    return transpiledSchema;
}
  