import { z } from 'zod';
export declare const EndpointConfig: z.ZodObject<{
    id: z.ZodString;
    method: z.ZodEnum<{
        GET: "GET";
    }>;
    path: z.ZodString;
    responseSchema: z.ZodRecord<z.ZodString, z.ZodEnum<{
        "faker.internet.email": "faker.internet.email";
        "faker.person.firstName": "faker.person.firstName";
        "faker.person.fullName": "faker.person.fullName";
        "faker.person.lastName": "faker.person.lastName";
        "faker.string.uuid": "faker.string.uuid";
    }>>;
}, z.core.$strip>;
export type EndpointConfig = z.infer<typeof EndpointConfig>;
//# sourceMappingURL=config.d.ts.map