import z from "zod";
export declare const CreateEndpointRequestSchema: z.ZodObject<{
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
export type CreateEndpointRequest = z.infer<typeof CreateEndpointRequestSchema>;
//# sourceMappingURL=index.d.ts.map