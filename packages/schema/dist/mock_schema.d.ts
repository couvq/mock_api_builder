import { z } from "zod";
export declare const FakerType: z.ZodEnum<{
    "faker.internet.email": "faker.internet.email";
    "faker.person.firstName": "faker.person.firstName";
    "faker.person.fullName": "faker.person.fullName";
    "faker.person.lastName": "faker.person.lastName";
    "faker.string.uuid": "faker.string.uuid";
}>;
export type FakerType = z.infer<typeof FakerType>;
export declare const MockSchema: z.ZodRecord<z.ZodString, z.ZodEnum<{
    "faker.internet.email": "faker.internet.email";
    "faker.person.firstName": "faker.person.firstName";
    "faker.person.fullName": "faker.person.fullName";
    "faker.person.lastName": "faker.person.lastName";
    "faker.string.uuid": "faker.string.uuid";
}>>;
export type MockSchema = z.infer<typeof MockSchema>;
//# sourceMappingURL=mock_schema.d.ts.map